import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Portal Artifacts — Motion Study', description: 'An interactive portal motion study for RaidGuild.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>;}
