export const PROFILE = {
 name: 'SAKTHIRAM R', firstName: 'Sakthiram', initials: 'SR', role: 'Web Developer', location: 'Coimbatore', email: 'sakthiramraju@gmail.com', linkedin: 'https://www.linkedin.com/in/sakthiram-r/', resume: '/Resume.pdf',
 resumeSummary: 'Aspiring Full-Stack Web Developer skilled in React.js, Node.js, Django, and MongoDB. Experienced in building responsive and scalable web applications with a focus on performance and user experience. Eager to contribute to innovative development teams.',
 quote: 'Responsive and scalable web applications, with a focus on performance and user experience.',
};
export const NAV = ['About','Skills','Work','Experience','Contact'].map(label => ({label, id:label.toLowerCase()}));
export type Skill = {name:string; symbol:string; logo?:string};
export const SKILL_GROUPS: {family:string; skills:Skill[]}[] = [
 {family:'Frontend',skills:[{name:'HTML5',symbol:'Ht',logo:'html5'},{name:'CSS3',symbol:'Cs',logo:'css3'},{name:'JavaScript',symbol:'Js',logo:'javascript'},{name:'React.js',symbol:'Re',logo:'react'},{name:'Bootstrap',symbol:'Bs',logo:'bootstrap'}]},
 {family:'Backend',skills:[{name:'Node.js',symbol:'No',logo:'nodejs'},{name:'Express.js',symbol:'Ex',logo:'express'},{name:'Django',symbol:'Dj',logo:'django'}]},
 {family:'Databases',skills:[{name:'MongoDB',symbol:'Mo',logo:'mongodb'},{name:'MySQL',symbol:'My',logo:'mysql'}]},
 {family:'Languages',skills:[{name:'Python',symbol:'Py',logo:'python'},{name:'Java',symbol:'Ja',logo:'java'}]},
 {family:'Tools & concepts',skills:[{name:'SEO',symbol:'Se'},{name:'REST APIs',symbol:'Ap'},{name:'Git',symbol:'Gi',logo:'git'},{name:'Testing',symbol:'Te'},{name:'Debugging',symbol:'De'},{name:'Responsive design',symbol:'Rd'}]},
];
export type Project = {id:string;index:string;title:string;kicker:string;date:string;description:string;features:string[];tech:string[];kind:'gaming'|'study'};
export const PROJECTS: Project[] = [
 {id:'gaming',index:'01',title:'Gaming Website',kicker:'Client Project · Full-Stack Web Developer',date:'02/2026',description:'Developed a dynamic gaming website using HTML, CSS, JavaScript, MySQL, and Node.js.',features:['Designed a responsive and interactive user interface for better user engagement.','Built backend functionality to handle user interactions and game-related data.'],tech:['HTML5','CSS3','JavaScript','MySQL','Node.js'],kind:'gaming'},
 {id:'study',index:'02',title:'Web-Based Study Material Sharing Platform',kicker:'Study Material Sharing Platform',date:'08/2025',description:'Built full-stack application using HTML, CSS, JS, Node.js, MongoDB',features:['Implemented user authentication and admin approval system','Developed search and categorized content features','Designed responsive UI for better user experience'],tech:['HTML5','CSS3','JavaScript','Node.js','MongoDB'],kind:'study'},
];
export const EXPERIENCE = [
 {year:'09/2024 – 10/2024',title:'Web Development Intern',place:'CODTECH IT SOLUTION PVT.LTD',start:'2024-09',detail:['Utilized HTML and CSS for a user-friendly and responsive interface.','Created the frontend from scratch using HTML, CSS, Bootstrap.']},
 {year:'10/2024 – 11/2024',title:'Web Development Intern',place:'CodSoft',start:'2024-10',detail:['Developed responsive Web pages with HTML, CSS and Bootstrap.','Delivered a landing page, calculator, and portfolio. Gained skills in responsive design, Git, testing and debugging.']},
 {year:'01/2026 – 03/2026',title:'Web Development Intern',place:'Genz Educatewing',start:'2026-01',detail:['Developed responsive web applications using React.js, HTML, CSS, and Bootstrap','Built backend services using Django and implemented REST APIs','Managed and integrated MySQL database for storing and retrieving data']},
];
export const EDUCATION = [
 {year:'2022 – 2025',title:'Diploma in Computer Engineering',place:'Sri Krishna Polytechnic college',start:'2022',detail:[] as string[]},
 {year:'2025 – 2028',title:'Bachelor of Technology in Information Technology',place:'Nehru Institute of Technology – Engineering College Coimbatore',start:'2025',detail:[] as string[]},
];
export const CERTIFICATIONS: never[] = [];
export const ACHIEVEMENTS: never[] = [];
export const TIMELINE = [...EDUCATION,...EXPERIENCE].sort((a,b)=>a.start.localeCompare(b.start));
export const QUICK_FACTS = [{label:'Based in',value:PROFILE.location},{label:'Education',value:EDUCATION[1].title},{label:'Latest internship',value:EXPERIENCE[2].place},{label:'Email',value:PROFILE.email}];
