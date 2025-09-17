"use client"

import { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Settings } from "lucide-react"
import Image from 'next/image'
import { AppHeader } from "./ui/AppHeader"

type SidebarProps = {
    course: any;
};
export default function Sidebar({ course }: SidebarProps) {
    const [openWeek, setOpenWeek] = useState("week1")

    return (
        <aside className="w-[260px] bg-[#F5F7FA] flex flex-col justify-between border-r border-gray-200 font-satoshi">
            <div>
                {/* <div className="flex items-center gap-1 mb-2">
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
                </div> */}
                <AppHeader

                />

                <h2 className="p-4 font-bold">
                    {course ? course.name : "Loading..."}
                </h2>
                <Accordion className="p-4" type="single" collapsible value={openWeek} onValueChange={setOpenWeek}>
                    <AccordionItem value="week1">
                        <AccordionTrigger className="p-3 border rounded-lg bg-white">Week 1: HTML Basics</AccordionTrigger>
                        <AccordionContent>
                            <ul className="pl-4">
                                <li className="p-2 rounded hover:bg-gray-200 cursor-pointer">Session 1.1</li>
                                <li className="p-2 rounded bg-[#FEE9E2] text-[#F67E4A] font-semibold cursor-pointer">Session 1.2</li>
                                <li className="p-2 rounded hover:bg-gray-200 cursor-pointer">Session 1.3</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="week2">
                        <AccordionTrigger className="p-3 border rounded-lg bg-white">Week 2: CSS Styling</AccordionTrigger>
                        <AccordionContent>
                            <ul className="pl-4">
                                <li className="p-2 rounded hover:bg-gray-200 cursor-pointer">Session 2.1</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="mt-6 p-4">
                <button className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
                    <Settings className="w-5 h-5" /> Settings
                </button>
            </div>
        </aside>
    )
}