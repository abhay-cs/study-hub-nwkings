"use client";
import React from "react";

const PATHS = [
    "CCNA / Cisco Certifications",
    "Cloud Networking",
    "Network Security",
    "Data Center Networking",
    "IT Infrastructure",
];

export default function Step3Goals({
    value,
    onChange,
}: {
    value: { career_path?: string[]; certifications?: string };
    onChange: (v: any) => void;
}) {
    function toggleItem(item: string) {
        const current = value.career_path || [];
        const next = current.includes(item) ? current.filter((c) => c !== item) : [...current, item];
        onChange({ ...value, career_path: next });
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose your career goals</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PATHS.map((p) => (
                    <button
                        key={p}
                        onClick={() => toggleItem(p)}
                        type="button"
                        className={`text-left p-3 rounded-lg border ${(value.career_path || []).includes(p) ? "border-primary bg-primary/10" : "border-gray-200"
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <div>
                <label className="text-sm mb-1 block">Target certification(s)</label>
                <input
                    className="w-full h-10 px-3 rounded-lg border border-gray-200"
                    placeholder="e.g. CCNA, CCNP"
                    value={value.certifications || ""}
                    onChange={(e) => onChange({ ...value, certifications: e.target.value })}
                />
            </div>
        </div>
    );
}