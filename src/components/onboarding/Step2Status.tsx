"use client";
import React from "react";

export default function Step2Status({
    value,
    onChange,
}: {
    value: { status?: string };
    onChange: (v: any) => void;
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">What best describes you?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Student", "Working Professional", "Job Seeker"].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => onChange({ ...value, status: s })}
                        className={`p-3 rounded-lg border ${value.status === s ? "border-primary bg-primary/10" : "border-gray-200"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}