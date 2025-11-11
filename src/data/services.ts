export interface Service {
  slug: string;
  title: string;
  shortDesc: string;
  image?: string;
  seoDescription: string;
  content: string; // Using string for multiline content
}

/**
 * This data is derived directly from src/components/Services/Services.tsx
 * to ensure consistency across the application.
 */
export const services: Service[] = [
  {
    slug: 'event-content',
    title: 'Event Content',
    shortDesc: 'We craft compelling narratives and create immersive content for live, virtual, and hybrid events. From keynote presentations to interactive breakout sessions, we ensure your message captivates the audience.',
    image: '/projects/project-1.png', // Example image
    seoDescription: 'Expert event content creation for keynotes, breakouts, and sessions designed to captivate live, virtual, and hybrid audiences.',
    content: `Our event content services form the narrative core of your event. We work with your teams to develop powerful messaging that resonates long after the event concludes. We script, design, and produce all visual media to ensure a cohesive and high-impact experience.

Key Offerings:
- Keynote & Plenary Session Design
- Motion Graphics & Video Packages
- Interactive Breakout Content
- Speaker Support & Presentation Design`
  },
  {
    slug: '3d-motion-design',
    title: '3D & Motion Design',
    shortDesc: 'Transform your concepts into breathtaking reality with our cutting-edge 3D and motion design. We create dynamic animations, product visualizations, and brand stories that are not just seen, but felt.',
    image: '/projects/project-2.png', // Example image
    seoDescription: 'Cutting-edge 3D & motion design, including anamorphic content, CGI, VFX, and product visualizations to bring your brand to life.',
    content: `We push the boundaries of visual storytelling. Our team of 3D artists and animators uses industry-leading software to create everything from stunning product renders to mind-bending anamorphic illusions for digital billboards.
    
Our capabilities:
- Photorealistic 3D Rendering
- Advanced CGI & VFX
- Anamorphic (3D illusion) Content
- 2D & 3D Motion Graphics`
  },
  {
    slug: 'team-building',
    title: 'Team Building',
    shortDesc: 'Foster collaboration and boost morale with bespoke team-building experiences. We design engaging activities, both digital and physical, that strengthen bonds and align your team towards a common goal.',
    image: '/team-photos/member-1.jpg', // Example image
    seoDescription: 'Bespoke digital and physical team-building experiences designed to foster collaboration, boost morale, and align teams.',
    content: `Move beyond trust falls. We design and develop bespoke team-building experiences, from interactive digital games to complex, real-world simulations, that are both fun and deeply aligned with your corporate objectives.
    
Experiences:
- Digital Escape Rooms & Gamification
- Collaborative Problem-Solving Simulations
- Gamified Learning & Development
- Hybrid & In-Person Challenges`
  },
  {
    slug: 'conceptualization',
    title: 'Conceptualization',
    shortDesc: 'Every great project starts with a powerful idea. We take your initial spark and develop it into a fully-realized strategy, complete with creative direction, feasibility analysis, and a roadmap for execution.',
    image: '/hero-carousel/slide2.jpg', // Example image
    seoDescription: 'Strategic conceptualization services to develop your initial idea into a fully-realized creative and technical strategy.',
    content: `This is where the magic begins. Our conceptualization service is a collaborative workshop where we take your initial spark—that 'what if?' idea—and develop it into a fully-realized strategy. We map out the user journey, define the creative direction, and ensure technical feasibility.
    
Our Process:
- Creative Brainstorming & Moodboarding
- Feasibility & Technical Analysis
- Strategic Roadmap Development
- Creative Direction & Pitch Decks`
  },
  {
    slug: 'brand-strategy',
    title: 'Brand Strategy',
    shortDesc: 'Gain your edge with a robust brand strategy. We help define your unique voice, identify your target audience, and carve out a distinct market position that resonates and builds lasting brand equity.',
    image: '/hero-carousel/slide3.png', // Example image
    seoDescription: 'Develop a robust brand strategy to define your unique voice, identify target audiences, and secure a distinct market position.',
    content: `A strong brand is more than a logo. We help you define your unique voice, identify your target audience, and carve out a distinct market position that resonates and builds lasting brand equity. Our strategies ensure that every touchpoint, from event to digital, is cohesive.
    
Services Include:
- Market & Audience Research
- Brand Voice & Messaging Workshops
- Visual Identity Consultation
- Go-to-Market Strategy`
  },
  {
    slug: 'interactive-installations',
    title: 'Interactive Installations',
    shortDesc: 'Bridge the gap between the physical and digital worlds with unforgettable interactive installations. We design and build immersive experiences for events and retail that drive engagement and create shareable moments.',
    image: '/hero-carousel/slide4.jpg', // Example image
    seoDescription: 'Design and development of unforgettable interactive installations for events and retail, bridging the physical and digital divide.',
    content: `Create a "wow" moment. We design and build immersive, multi-sensory experiences that stop people in their tracks. Using sensors, projections, and custom software, we turn passive viewers into active participants.
    
Technologies:
- Projection Mapping & LED Walls
- Motion & Touch Reactivity
- Augmented Reality (AR) Experiences
- Data Visualization Walls`
  },
  {
    slug: 'digital-experiences',
    title: 'Digital Experiences',
    shortDesc: 'In the digital realm, experience is everything. We design and develop seamless platforms, from interactive websites to engaging online campaigns, ensuring every click is intuitive, memorable, and meaningful.',
    image: '/hero-carousel/slide5.jpg', // Example image
    seoDescription: 'Full-service design and development of seamless digital experiences, including interactive websites, microsites, and online campaigns.',
    content: `Your website is your digital flagship. We design and develop seamless platforms, from interactive websites and microsites to engaging online campaigns, ensuring every click is intuitive, memorable, and meaningful.
    
We build:
- Corporate Websites & Landing Pages
- Interactive Microsites for Campaigns
- Virtual Event Platforms
- Digital Marketing Assets`
  },
];