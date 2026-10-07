'use client';
import {useEffect,useRef,useState} from 'react';
export function prefersReducedMotion(){return typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
export function useInView<T extends HTMLElement>(){const ref=useRef<T>(null); const [seen,setSeen]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setSeen(true);o.disconnect();}},{threshold:.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);return {ref,seen};}
export function useScrollProgress(){const [progress,setProgress]=useState(0);useEffect(()=>{let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>setProgress(window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));};update();window.addEventListener('scroll',update,{passive:true});return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);};},[]);return progress;}
