"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"; // adjust path to your Command component
import { LucideSearch } from "lucide-react";

type Hit = {
    id: string;
    type: "course" | "content";
    title: string;
    subtitle?: string;
    course_id?: string;
};

export default function SearchBar() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Hit[]>([]);

    // focus on "/" key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "/") {
                e.preventDefault();
                inputRef.current?.focus();
                setOpen(true);
            }
            if (e.key === "Escape") {
                setOpen(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const ac = new AbortController();
        setLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: ac.signal })
            .then((r) => r.json())
            .then((data) => setResults(data || []))
            .catch((err) => {
                if (err.name !== "AbortError") console.error(err);
            })
            .finally(() => setLoading(false));

        return () => ac.abort();
    }, [query]);

    function onSelect(hit: Hit) {
        // Navigate depending on type
        if (hit.type === "course") {
            router.push(`/courses/${hit.id}`);
        } else if (hit.type === "content") {
            // content likely has course_id + id
            router.push(`/courses/${hit.course_id}?content=${hit.id}`);
        }
        setOpen(false);
        setQuery("");
    }

    return (
        <div className="w-full max-w-xl">
            <Command className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex items-center px-3">
                    <LucideSearch className="w-4 h-4 text-gray-400" />
                    <CommandInput
                        ref={inputRef}
                        placeholder="Search courses, /module, /week, or type to find..."
                        value={query}
                        onValueChange={(v: string) => {
                            // support slash commands like "/week " to prefilter
                            setQuery(v);
                            setOpen(true);
                        }}
                        className="px-2 py-3 text-sm"
                    />
                </div>

                <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>

                    {/* Shortcut hints group */}
                    <CommandGroup heading="Shortcuts">
                        <CommandItem
                            onSelect={() => {
                                setQuery("/module ");
                                inputRef.current?.focus();
                            }}
                        >
                            /module — jump to module by name
                        </CommandItem>
                        <CommandItem
                            onSelect={() => {
                                setQuery("/week ");
                                inputRef.current?.focus();
                            }}
                        >
                            /week — jump to week by name
                        </CommandItem>
                        <CommandItem
                            onSelect={() => {
                                setQuery("/session ");
                                inputRef.current?.focus();
                            }}
                        >
                            /session — jump to specific session
                        </CommandItem>
                    </CommandGroup>

                    {/* Dynamic results */}
                    <CommandGroup heading="Results">
                        {loading && <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>}
                        {!loading &&
                            results.map((r) => (
                                <CommandItem key={`${r.type}-${r.id}`} onSelect={() => onSelect(r)}>
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{r.title}</div>
                                            {r.subtitle && <div className="text-xs text-gray-500">{r.subtitle}</div>}
                                        </div>
                                        <div className="text-xs text-gray-400">{r.type}</div>
                                    </div>
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}