"use client";
import React from "react";

type Props = { step: number; total: number };

export default function ProgressBar({ step, total }: Props) {
    const pct = Math.round((step / total) * 100);

    return (
        <div className="w-full">
            <div className="text-sm text-gray-600 mb-2">Step {step} of {total}</div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg,#F67E4A,#F6874C)" }}
                />
            </div>
        </div>
    );
}