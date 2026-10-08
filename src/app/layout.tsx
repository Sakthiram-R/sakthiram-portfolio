import type {Metadata,Viewport} from 'next';
import localFont from 'next/font/local';
import {asset} from '@/lib/asset';
import {PROFILE} from '@/lib/data';
import './globals.css';
const inter=localFont({src:'../fonts/inter-tight.woff2',variable:'--font-inter',display:'swap',weight:'100 900'});
const serif=localFont({src:[{path:'../fonts/instrument-serif-normal.woff2',style:'normal'},{path:'../fonts/instrument-serif-italic.woff2',style:'italic'}],variable:'--font-serif',display:'swap'});
const mono=localFont({src:'../fonts/jetbrains-mono.woff2',variable:'--font-mono',display:'swap',weight:'100 800'});
export const metadata:Metadata={title:`${PROFILE.name} — ${PROFILE.role}`,description:PROFILE.resumeSummary,icons:{icon:asset('/favicon.svg')},openGraph:{title:`${PROFILE.name} — ${PROFILE.role}`,description:PROFILE.resumeSummary,...(process.env.NEXT_PUBLIC_SITE_URL?{images:[{url:new URL(asset('/og.jpg'),process.env.NEXT_PUBLIC_SITE_URL).href,width:1200,height:630}]}:{})}};
export const viewport:Viewport={themeColor:'#f4f2ee'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preload" href={asset('/portrait-bust.webp')} as="image" fetchPriority="high"/></head><body className={`${inter.variable} ${serif.variable} ${mono.variable}`}>{children}</body></html>;}
