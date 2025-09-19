"use client";
import React from "react";

export default function Step4Prefs({
    value,
    onChange,
}: {
    value: { learning_mode?: string; study_hours?: string };
    onChange: (v: any) => void;
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Learning preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Live Instructor-led", "Self-paced", "Weekend Classes"].map((m) => (
                    <button
                        key={m}
                        onClick={() => onChange({ ...value, learning_mode: m })}
                        type="button"
                        className={`p-3 rounded-lg border ${value.learning_mode === m ? "border-primary bg-primary/10" : "border-gray-200"
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div>
                <label className="text-sm mb-1 block">Preferred study hours</label>
                <select
                    value={value.study_hours || ""}
                    onChange={(e) => onChange({ ...value, study_hours: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200"
                >
                    <option value="">Select</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Weekend</option>
                </select>
            </div>
        </div>
    );
}