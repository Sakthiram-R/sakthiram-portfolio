'use client';
import {useEffect} from 'react';
import Lenis from 'lenis';
import {prefersReducedMotion} from './hooks';
let smooth:Lenis|undefined;
export function scrollToTarget(id:string){const el=document.getElementById(id);if(!el)return;if(smooth)smooth.scrollTo(el,{offset:-90});else el.scrollIntoView({behavior:prefersReducedMotion()?'instant':'smooth'});}
export default function Scroll(){useEffect(()=>{if(prefersReducedMotion())return;smooth=new Lenis({duration:1.1,autoRaf:true,anchors:false});const follow=(event:MouseEvent)=>{if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!(event.target instanceof Element))return;const anchor=event.target.closest<HTMLAnchorElement>('a[href^="#"]');if(!anchor||anchor.classList.contains('skip-link'))return;const id=anchor.hash.slice(1);if(document.getElementById(id)){event.preventDefault();scrollToTarget(id);}};document.addEventListener('click',follow);return()=>{document.removeEventListener('click',follow);smooth?.destroy();smooth=undefined;};},[]);return null;}
