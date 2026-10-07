import Navigation from './Navigation';
import Hero from './hero/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Work from './sections/Work';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Scroll from '@/lib/scroll';
import RevealObserver from './ui/RevealObserver';
export default function App(){return <><a className="skip-link" href="#about">Skip to content</a><Scroll/><RevealObserver/><Navigation/><main><Hero/><About/><Skills/><Work/><Experience/><Contact/></main></>;}
