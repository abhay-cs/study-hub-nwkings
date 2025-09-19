"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/components/onboarding/ProgressBar";
import Step1Basic from "@/components/onboarding/Step1Basic";
import Step2Status from "@/components/onboarding/Step2Status";
import Step3Goals from "@/components/onboarding/Step3Goals";
import Step4Prefs from "@/components/onboarding/Step4Prefs";
import Step5Confirm from "@/components/onboarding/Step5Confirm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TOTAL = 5;

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [state, setState] = useState<any>({}); // profile_data accumulates here
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    function updatePartial(next: any) {
        setState((s: any) => ({ ...s, ...next }));
    }

    async function handleFinish() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(state),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to save");
            // success -> redirect
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function renderStep() {
        switch (step) {
            case 1:
                return <Step1Basic value={state} onChange={(v: any) => updatePartial(v)} />;
            case 2:
                return <Step2Status value={state} onChange={(v: any) => updatePartial(v)} />;
            case 3:
                return <Step3Goals value={state} onChange={(v: any) => updatePartial(v)} />;
            case 4:
                return <Step4Prefs value={state} onChange={(v: any) => updatePartial(v)} />;
            case 5:
                return <Step5Confirm value={state} />;
            default:
                return null;
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#FAF9F7] p-6 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute -top-56 -left-56 w-[600px] h-[600px] bg-gradient-to-r from-orange-400 via-orange-200 to-pink-200 rounded-full blur-3xl opacity-70 rotate-12"></div>
            <div className="absolute top-1/3 -right-64 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-200 rounded-full blur-3xl opacity-60 -rotate-12"></div>
            <div className="absolute bottom-[-120px] left-1/3 w-[450px] h-[450px] bg-gradient-to-t from-orange-200 via-pink-100 to-transparent rounded-full blur-2xl opacity-60"></div>
            <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-yellow-200 via-orange-100 to-transparent rounded-full blur-2xl opacity-50"></div>

            {/* Onboarding card */}
            <div className="relative w-full max-w-3xl">
                <div className="glass-card p-6 rounded-xl shadow-md relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Welcome to StudyHub</h2>
                        <div className="text-sm text-gray-600">Personalize your learning</div>
                    </div>

                    <ProgressBar step={step} total={TOTAL} />

                    <div className="mt-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            {step > 1 && (
                                <Button variant="ghost" onClick={() => setStep(s => Math.max(1, s - 1))}>
                                    Back
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {error && <div className="text-red-500 text-sm mr-2">{error}</div>}
                            {step < TOTAL ? (
                                <Button onClick={() => setStep(s => Math.min(TOTAL, s + 1))}>
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={handleFinish} disabled={loading}>
                                    {loading ? "Saving..." : "Finish & Go to Dashboard"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}