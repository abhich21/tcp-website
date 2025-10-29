// "use client"

// import React, { useState, useEffect, useMemo, useCallback } from 'react';

// // --- MOCK DATA STRUCTURE (Simulates Database/API response) ---

// /**
//  * Defines the structure for a single media item.
//  * NOTE: The problem states "only one of them youtube or vimeo or image" will be present.
//  */
// interface MediaItem {
//     type: 'youtube' | 'vimeo' | 'image' | 'pdf'; // Keeping pdf for completeness, though primary focus is video/image
//     url: string; // The ID for video, or the direct URL for image/pdf
//     caption?: string;
// }

// interface PortfolioItem {
//     id: number;
//     title: string;
//     category: string;
//     categoryId: number;
//     description: string;
//     mainMedia: MediaItem[]; // Array of media items, following the PHP structure
// }

// // --- Mock Data Set (Mimicking the structure found in portfolio-project-details.php) ---
// const MOCK_PROJECTS: Record<number, PortfolioItem> = {
//     1: {
//         id: 1,
//         title: 'The CloudPlay Showreel',
//         category: 'Animation',
//         categoryId: 4, // Matches category for back link
//         description: 'A dynamic showcase of our best animation work from the past year, featuring high-fidelity CGI and motion graphics for leading global brands.',
//         mainMedia: [
//             { type: 'youtube', url: 'M7lc1UVf-VE', caption: 'Official CloudPlay Showreel 2024' },
//         ],
//     },
//     2: {
//         id: 2,
//         title: 'HSBC Mastercard Campaign',
//         category: 'Event Content',
//         categoryId: 5,
//         description: 'High-impact product launch visuals created for the HSBC Mastercard event, emphasizing security and global reach.',
//         mainMedia: [
//             { type: 'vimeo', url: '76979871', caption: 'Vimeo Exclusive Launch Content' },
//         ],
//     },
//     3: {
//         id: 3,
//         title: 'AstraZeneca Global Launch',
//         category: 'Event Design',
//         categoryId: 1,
//         description: 'A series of high-resolution images showcasing the physical and digital event spaces designed for AstraZeneca\'s new product.',
//         mainMedia: [
//             { type: 'image', url: 'https://placehold.co/800x600/1e1e1e/00A859?text=Gallery+Image+1', caption: 'Main stage design' },
//             { type: 'image', url: 'https://placehold.co/800x450/1e1e1e/00A859?text=Gallery+Image+2', caption: 'Interactive Kiosks' },
//             { type: 'image', url: 'https://placehold.co/800x800/1e1e1e/00A859?text=Gallery+Image+3', caption: 'Entrance setup' },
//             { type: 'image', url: 'https://placehold.co/800x1200/1e1e1e/00A859?text=Gallery+Image+4', caption: 'Breakout Session' },
//         ],
//     },
//     4: {
//         id: 4,
//         title: 'Project Delta Dash (PDF)',
//         category: 'Brochure',
//         categoryId: 10,
//         description: 'The final PDF brochure for Project Delta Dash, detailing the scope and impact of the campaign.',
//         mainMedia: [
//             { type: 'pdf', url: 'https://example.com/mock-brochure.pdf', caption: 'Brochure PDF' },
//         ],
//     },
// };

// /**
//  * Mock API call to simulate fetching portfolio data by ID.
//  * @param {number} id - The portfolio item ID.
//  * @returns {Promise<PortfolioItem | null>}
//  */
// const fetchPortfolioItem = (id: number): Promise<PortfolioItem | null> => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(MOCK_PROJECTS[id] || null);
//         }, 500); // Simulate network delay
//     });
// };

// // --- COMPONENTS FOR MEDIA TYPES ---

// /**
//  * Component to display the video player (YouTube or Vimeo).
//  */
// const VideoPlayer: React.FC<{ media: MediaItem }> = ({ media }) => {
//     const isYouTube = media.type === 'youtube';
//     const embedUrl = isYouTube
//         ? `https://www.youtube.com/embed/${media.url}?rel=0`
//         : `https://player.vimeo.com/video/${media.url}?autoplay=0&loop=0&byline=0&portrait=0`;

//     return (
//         <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-10">
//             <div className="relative overflow-hidden pt-[56.25%] rounded-xl shadow-2xl border-4 border-gray-700">
//                 <iframe
//                     className="absolute top-0 left-0 w-full h-full"
//                     src={embedUrl}
//                     title={`${media.type} video player`}
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
//                     allowFullScreen
//                 ></iframe>
//             </div>
//             {media.caption && (
//                 <p className="mt-4 text-center text-gray-400 italic text-sm">{media.caption}</p>
//             )}
//         </div>
//     );
// };
// VideoPlayer.displayName = "VideoPlayer";

// /**
//  * Component to display a PDF viewer.
//  */
// const PdfViewer: React.FC<{ media: MediaItem }> = ({ media }) => {
//     return (
//         <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-10">
//             <div className="rounded-xl shadow-2xl border-4 border-gray-700 overflow-hidden">
//                 <iframe
//                     className="w-full h-[80vh]"
//                     src={media.url}
//                     allowFullScreen
//                     title="PDF Document Viewer"
//                 ></iframe>
//             </div>
//             {media.caption && (
//                 <p className="mt-4 text-center text-gray-400 italic text-sm">{media.caption}</p>
//             )}
//         </div>
//     );
// };
// PdfViewer.displayName = "PdfViewer";


// // --- 3D CIRCULAR IMAGE GALLERY COMPONENT (Adaptation of PHP JS logic) ---

// const CircularImageGallery: React.FC<{ images: MediaItem[], title: string, description: string }> = ({ images, title, description }) => {
//     const carouselRef = useRef<HTMLDivElement>(null);
//     const sceneRef = useRef<HTMLDivElement>(null);
//     const [selectedIndex, setSelectedIndex] = useState(0);

//     const cellCount = images.length;
//     const initialCaption = useMemo(() => images[0]?.caption || description, [images, description]);

//     // Calculate carousel geometry
//     const { radius, theta } = useMemo(() => {
//         if (cellCount === 0 || !carouselRef.current) return { radius: 0, theta: 0 };
//         const cellWidth = carouselRef.current.offsetWidth;
//         const gapMultiplier = 1.1;
//         const r = Math.round(((cellWidth / 2) / Math.tan(Math.PI / cellCount)) * gapMultiplier);
//         const t = 360 / cellCount;
//         return { radius: r, theta: t };
//     }, [cellCount]);


//     // Function to apply 3D transformation
//     const rotateCarousel = useCallback(() => {
//         if (!carouselRef.current || radius === 0) return;
//         const angle = theta * selectedIndex * -1;
//         carouselRef.current.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
//     }, [selectedIndex, radius, theta]);

//     // Position cells and initial rotation
//     useEffect(() => {
//         if (cellCount === 0 || radius === 0 || !carouselRef.current) return;

//         const cells = Array.from(carouselRef.current.children) as HTMLElement[];
//         cells.forEach((cell, i) => {
//             const cellAngle = theta * i;
//             cell.style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px)`;
//         });

//         rotateCarousel();
//     }, [radius, theta, rotateCarousel, cellCount]);


//     // Update visual state (opacity, glow, counter)
//     const currentSlide = useMemo(() => (selectedIndex % cellCount + cellCount) % cellCount, [selectedIndex, cellCount]);

//     useEffect(() => {
//         rotateCarousel();

//         if (!carouselRef.current) return;
//         const cells = Array.from(carouselRef.current.children) as HTMLElement[];

//         // Update opacity and glow
//         cells.forEach((cell, cellIndex) => {
//             let distance = Math.abs(currentSlide - cellIndex);
//             if (distance > cellCount / 2) { distance = cellCount - distance; }
//             const opacity = Math.max(1 - (distance * 0.5), 0.1); // Keep min opacity visible
//             cell.style.opacity = opacity.toString();
//             cell.classList.toggle('has-glow', cellIndex === currentSlide);
//         });

//     }, [currentSlide, rotateCarousel, cellCount]);


//     // Navigation Handlers
//     const goToPrev = useCallback(() => setSelectedIndex(prev => prev - 1), []);
//     const goToNext = useCallback(() => setSelectedIndex(prev => prev + 1), []);

//     // Touch/Key Handlers
//     useEffect(() => {
//         const sceneElement = sceneRef.current;
//         if (!sceneElement) return;

//         let touchstartX = 0;
        
//         const handleTouchStart = (e: TouchEvent) => { touchstartX = e.changedTouches[0].screenX; };
//         const handleTouchEnd = (e: TouchEvent) => {
//             const touchendX = e.changedTouches[0].screenX;
//             if (touchendX < touchstartX - 50) goToNext();
//             if (touchendX > touchstartX + 50) goToPrev();
//         };
//         const handleKeyDown = (event: KeyboardEvent) => {
//             if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
//             if (event.key === 'ArrowLeft') { goToPrev(); } 
//             else if (event.key === 'ArrowRight') { goToNext(); }
//         };

//         sceneElement.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
//         sceneElement.addEventListener('touchend', handleTouchEnd as EventListener);
//         window.addEventListener('keydown', handleKeyDown);

//         return () => {
//             sceneElement.removeEventListener('touchstart', handleTouchStart as EventListener);
//             sceneElement.removeEventListener('touchend', handleTouchEnd as EventListener);
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [goToPrev, goToNext]);


//     if (cellCount === 0) return null;

//     return (
//         <>
//             <style jsx global>{`
//                 /* General Dark Theme Vars (Copied from PHP file) */
//                 :root {
//                     --dark-surface: #1e1e1e;
//                     --dark-text-primary: #e0e0e0;
//                     --dark-text-secondary: #b3b3b3;
//                     --dark-border: #333333;
//                     --dark-hover: #333333;
//                 }
                
//                 /* === 3D CAROUSEL STYLES (Adapted from PHP CSS) === */
//                 .scene-wrapper { display: flex; justify-content: center; width: 100%; }
//                 .scene { 
//                     width: 800px; 
//                     height: 400px; 
//                     perspective: 1000px; /* Increased perspective for a clearer 3D effect */
//                 }
//                 .carousel { 
//                     width: 100%; 
//                     height: 100%; 
//                     position: relative; 
//                     transform-style: preserve-3d; 
//                     transition: transform 0.8s linear; 
//                 }
//                 .carousel__cell { 
//                     position: absolute; 
//                     width: 100%; 
//                     height: 100%; 
//                     cursor: pointer; 
//                     backface-visibility: hidden; 
//                     transition: transform 0.8s, opacity 0.8s; 
//                     overflow: hidden; 
//                     border-radius: 12px;
//                     background-color: var(--dark-surface); 
//                     border: 2px solid rgba(255, 255, 255, 0.1);
//                 }
//                 .carousel__cell img { 
//                     width: 100%; 
//                     height: 100%; 
//                     object-fit: cover; 
//                     /* Custom reflection effect */
//                     -webkit-box-reflect: below 1px linear-gradient(transparent, transparent, rgba(0,0,0,0.5)); 
//                 }
//                 /* Glow effect for the active slide */
//                 .carousel__cell.has-glow::before { 
//                     content: ''; 
//                     position: absolute; 
//                     inset: -10px; /* Expands the pseudo-element slightly */
//                     background: radial-gradient(circle at center, rgba(0, 168, 89, 0.6) 0%, rgba(0, 168, 89, 0) 60%); 
//                     z-index: -1; 
//                     opacity: 0.5;
//                     transition: opacity 0.8s ease; 
//                     border-radius: 18px; /* Slightly larger border radius for the glow */
//                 }
//                 .carousel-nav-button:disabled { opacity: 0.5; cursor: not-allowed; }
                
//                 @media(max-width: 768px){ 
//                     .scene { 
//                         width: 90vw; 
//                         height: 50vw; /* Adjust height for mobile aspect ratio */
//                     } 
//                 }
//                 /* Hide navigation for single item */
//                 ${cellCount <= 1 ? '.carousel-nav-container, #slide-counter { display: none !important; }' : ''}
//             `}</style>

//             <div id="project-media" className="flex flex-col items-center py-8">
//                 <div className="scene-wrapper">
//                     <div className="scene" ref={sceneRef}>
//                         <div className="carousel" ref={carouselRef}>
//                             {images.map((item, index) => (
//                                 <div 
//                                     key={index} 
//                                     className={`carousel__cell ${index === currentSlide ? 'has-glow' : ''}`}
//                                     data-index={index}
//                                     onClick={() => setSelectedIndex(index)}
//                                 >
//                                     <img src={item.url} alt={`${title} - Image ${index + 1}`} />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Navigation Controls */}
//                 <div className="flex items-center gap-6 mt-12 relative z-10">
//                     <button 
//                         id="prev-button" 
//                         onClick={goToPrev} 
//                         className="carousel-nav-button p-4 rounded-full bg-gray-800 hover:bg-[#00A859] transition duration-300"
//                         title="Previous Slide"
//                         disabled={cellCount <= 1}
//                     >
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
//                     </button>
//                     <p id="slide-counter" className="text-xl font-semibold text-[#00A859] min-w-[50px] text-center">
//                         {currentSlide + 1} / {cellCount}
//                     </p>
//                     <button 
//                         id="next-button" 
//                         onClick={goToNext} 
//                         className="carousel-nav-button p-4 rounded-full bg-gray-800 hover:bg-[#00A859] transition duration-300"
//                         title="Next Slide"
//                         disabled={cellCount <= 1}
//                     >
//                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
//                     </button>
//                 </div>

//                 {/* Caption Area */}
//                 <div id="caption-container" className="mt-8 text-center max-w-2xl w-full px-4 min-h-[50px]">
//                     <h2 id="caption-title" className="text-xl font-bold text-white mb-1">
//                         {images[currentSlide]?.caption || title}
//                     </h2>
//                     {/* Only show project description if no specific image caption is available */}
//                     {!images[currentSlide]?.caption && (
//                         <p id="caption-text" className="text-sm text-gray-400">
//                             {description}
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };
// CircularImageGallery.displayName = "CircularImageGallery";


// // --- MAIN PAGE COMPONENT ---

// /**
//  * Renders the Portfolio Item Details Page.
//  * @param {object} props - Currently using a hardcoded ID for demonstration.
//  */
// export default function PortfolioDetailsPage() {
//     // NOTE: In a real Next.js/React app, the ID would be retrieved via router params:
//     // const router = useRouter();
//     // const itemId = parseInt(router.query.id as string);
//     const [itemId, setItemId] = useState(3); // Hardcode ID for testing gallery
//     // setItemId(1) for YouTube, setItemId(2) for Vimeo, setItemId(4) for PDF

//     const [project, setProject] = useState<PortfolioItem | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // --- Data Fetching ---
//     useEffect(() => {
//         setIsLoading(true);
//         setError(null);

//         fetchPortfolioItem(itemId)
//             .then(data => {
//                 if (data) {
//                     setProject(data);
//                 } else {
//                     setError("Project not found.");
//                 }
//             })
//             .catch(() => {
//                 setError("Failed to fetch project data.");
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     }, [itemId]);


//     // --- Media Type Logic (Guaranteed only one type exists per item) ---
//     const mediaToRender = useMemo(() => {
//         if (!project || !project.mainMedia || project.mainMedia.length === 0) return null;
        
//         const firstMedia = project.mainMedia[0];
        
//         switch (firstMedia.type) {
//             case 'youtube':
//             case 'vimeo':
//                 return <VideoPlayer media={firstMedia} />;
//             case 'image':
//                 // For image type, pass the whole media array
//                 return (
//                     <CircularImageGallery 
//                         images={project.mainMedia.filter(m => m.type === 'image')} 
//                         title={project.title}
//                         description={project.description}
//                     />
//                 );
//             case 'pdf':
//                 return <PdfViewer media={firstMedia} />;
//             default:
//                 return null;
//         }
//     }, [project]);


//     // --- Handlers ---
    
//     // 1. Back Button Logic
//     // Mocks routing back to the portfolio page, filtered by category ID
//     const handleGoBack = useCallback(() => {
//         if (project) {
//             const categoryId = project.categoryId;
//             // NOTE: In a real Next.js app, you would use router.push(`/portfolio?category=${categoryId}`)
//             console.log(`Navigating back to /portfolio?category=${categoryId}`);
//             // For a browser environment, we'll just log and simulate a navigation
//             // window.location.href = `/portfolio?category=${categoryId}`; 
//         } else {
//             // Fallback to main portfolio page
//             console.log('Navigating back to /portfolio (Category ID unknown)');
//             // window.location.href = '/portfolio';
//         }
//     }, [project]);

    
//     if (isLoading) {
//         return (
//             <main className="min-h-screen pt-40 flex items-center justify-center bg-[#0D0D0D] text-white">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A859]"></div>
//                 <p className="ml-4 text-lg">Loading Project...</p>
//             </main>
//         );
//     }

//     if (error || !project) {
//         return (
//             <main className="min-h-screen pt-40 flex flex-col items-center justify-center bg-[#0D0D0D] text-white">
//                 <h1 className="text-3xl font-bold mb-4">Error</h1>
//                 <p className="text-xl text-red-500">{error || "Project not found."}</p>
//                 <button 
//                     onClick={() => { console.log('Simulating back to portfolio'); }}
//                     className="mt-8 px-6 py-3 rounded-lg bg-gray-800 text-[#00A859] border border-[#00A859] hover:bg-[#00A859] hover:text-white transition duration-300"
//                 >
//                     Go to Portfolio
//                 </button>
//             </main>
//         );
//     }
    
//     // --- Render Main Content ---
//     return (
//         <main className="pt-20 min-h-screen flex flex-col items-center relative z-10 font-inter text-white">
            
//             {/* Project Header */}
//             <section className="w-full max-w-7xl px-4 py-12 text-center">
                
//                 {/* Back Button (Requirement 1) */}
//                 <div className="mb-8 flex justify-center sm:justify-start w-full max-w-2xl mx-auto">
//                     <button 
//                         onClick={handleGoBack}
//                         className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 
//                                    hover:bg-[#00A859] hover:border-[#00A859] hover:text-white transition duration-300 shadow-xl"
//                     >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
//                         <span>Back to {project.category}</span>
//                     </button>
//                 </div>

//                 <div className="w-full max-w-2xl mx-auto">
//                     <h1 className="text-5xl sm:text-7xl font-extrabold mb-2 text-white tracking-tight">
//                         {project.title}
//                     </h1>
//                     <h2 className="text-xl font-medium text-[#00A859] mb-8">
//                         Category: {project.category}
//                     </h2>
//                 </div>
//             </section>

//             {/* Media Content (Requirement 2 & 3 & 5) */}
//             <section className="w-full">
//                 {mediaToRender}
//             </section>

//             {/* Description Section */}
//             {project.description && (
//                 <section className="w-full max-w-2xl mx-auto px-4 py-12">
//                     <h3 className="text-2xl font-bold mb-4 text-center text-gray-300">Project Overview</h3>
//                     <p className="text-lg text-gray-400 leading-relaxed text-center">
//                         {project.description}
//                     </p>
//                 </section>
//             )}
            
//             <div className="pb-20"></div> {/* Footer spacing */}
//         </main>
//     );
// }
