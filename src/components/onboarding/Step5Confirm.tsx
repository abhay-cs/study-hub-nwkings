"use client";
import React from "react";

export default function Step5Confirm({ value }: { value: any }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Confirm your details</h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(value, null, 2)}
            </pre>
            <p className="text-sm text-gray-600">
                You can edit using the back button. When finished, we’ll save this to your profile and personalize your experience.
            </p>
        </div>
    );
}