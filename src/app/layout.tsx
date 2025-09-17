import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
import localFont from "next/font/local"

import "./globals.css";
const satoshi = localFont({
	src: [
		{
			path: "../../public/fonts/WEB/fonts/Satoshi-Medium.woff2", // relative path
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/WEB/fonts/Satoshi-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/WEB/fonts/Satoshi-Regular.woff2",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-satoshi",
	display: "swap",
})
// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

export const metadata: Metadata = {
	title: "StudyHub-NWkings",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${satoshi.variable}`}>
			<body>{children}</body>
		</html>
	);
}
