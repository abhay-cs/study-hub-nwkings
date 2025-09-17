"use client";
import Image from "next/image";

type AppHeaderProps = {
    title?: string;
    subtitle?: string;
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
    return (
        <header className="flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-gray-200 bg-white/40 backdrop-blur-lg 
    							border-gray-200 shadow-sm">
            {/* Logo + App name */}
            <div className="flex items-center gap-3">
                <Image
                    src="https://framerusercontent.com/images/DyMTtU5BAOvUdUe5yOWyac8EU.png?width=2134&height=2134"
                    alt="Logo"
                    width={56}
                    height={56}
                    className="" // optional, keeps it neat
                />
                <span className="text-2xl font-bold text-[#F67E4A] tracking-tight">
                    StudyHub
                </span>
            </div>

            {/* Dynamic page text */}
            <div className="text-right">
                {title && (
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                )}
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
        </header>
    );
}