import {SKILL_GROUPS} from '@/lib/data';
export const BRAND=Object.fromEntries(SKILL_GROUPS.flatMap(g=>g.skills).filter(s=>s.logo).map(s=>[s.name,s.logo]));
export const CONCEPT = {'SEO':'Search Engine Optimization','REST APIs':'REST APIs','Testing':'Testing','Debugging':'Debugging','Responsive design':'Responsive design'};
export const isBrand=(name:string)=>Boolean(BRAND[name]);
export default function TechLogo({name,size=24}:{name:string;size?:number}){return isBrand(name)?<img src={`/logos/${BRAND[name]}.svg`} alt={`${name} logo`} width={size} height={size}/>:<svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" role="img" aria-label={name}><rect x="8" y="8" width="32" height="32" rx="8"/><path d="m20 17-7 7 7 7m8-14 7 7-7 7M26 15l-4 18"/></svg>;}
