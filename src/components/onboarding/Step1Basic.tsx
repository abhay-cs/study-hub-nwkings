"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function Step1Basic({
    value,
    onChange,
}: {
    value: { fullName?: string; country?: string; timezone?: string };
    onChange: (v: any) => void;
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tell us about yourself</h3>
            <div>
                <label className="text-sm mb-1 block">Full name</label>
                <Input
                    value={value.fullName || ""}
                    onChange={(e) => onChange({ ...value, fullName: e.target.value })}
                    placeholder="Your full name"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-sm mb-1 block">Country</label>
                    <Input
                        value={value.country || ""}
                        onChange={(e) => onChange({ ...value, country: e.target.value })}
                        placeholder="Country"
                    />
                </div>
                <div>
                    <label className="text-sm mb-1 block">Timezone</label>
                    <Input
                        value={value.timezone || ""}
                        onChange={(e) => onChange({ ...value, timezone: e.target.value })}
                        placeholder="Timezone (e.g. Asia/Kolkata)"
                    />
                </div>
            </div>
        </div>
    );
}