"use client"

import { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Settings } from "lucide-react"
import Image from 'next/image'

export default function Sidebar() {
    const [openWeek, setOpenWeek] = useState("week1")

    return (
        <aside className="w-[260px] bg-[#F5F7FA] p-4 flex flex-col justify-between border-r border-gray-200">
            <div>
                <div className="flex items-center gap-1 mb-2">
                    <Image
                        src="https://framerusercontent.com/images/DyMTtU5BAOvUdUe5yOWyac8EU.png?width=2134&height=2134"
                        alt="Logo"
                        width={56}
                        height={56}
                        className="rounded-full shadow-sm" // optional, keeps it neat
                    />
                    <span className="text-xl font-bold text-[#514540] bold">Study Hub</span>
                </div>
                <Accordion type="single" collapsible value={openWeek} onValueChange={setOpenWeek}>
                    <AccordionItem value="week1">
                        <AccordionTrigger>Week 1: HTML Basics</AccordionTrigger>
                        <AccordionContent>
                            <ul className="pl-4">
                                <li className="p-2 rounded hover:bg-gray-200 cursor-pointer">Session 1.1</li>
                                <li className="p-2 rounded bg-[#FEE9E2] text-[#F67E4A] font-semibold cursor-pointer">Session 1.2</li>
                                <li className="p-2 rounded hover:bg-gray-200 cursor-pointer">Session 1.3</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="week2">
                        <AccordionTrigger>Week 2: CSS Styling</AccordionTrigger>
                        <AccordionContent>
                            <ul className="pl-4">
                                <li className="p-2 rounded hover:bg-gray-200 cursor-pointer">Session 2.1</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="mt-6">
                <button className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
                    <Settings className="w-5 h-5" /> Settings
                </button>
            </div>
        </aside>
    )
}