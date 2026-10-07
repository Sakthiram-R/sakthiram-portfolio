'use client';
import {useEffect} from 'react';
export default function RevealObserver(){useEffect(()=>{document.documentElement.classList.add('motion-ready');const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');o.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.rv,.rv-mask').forEach(e=>o.observe(e));return()=>{o.disconnect();document.documentElement.classList.remove('motion-ready');};},[]);return null;}
