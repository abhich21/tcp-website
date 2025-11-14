"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  use
} from "react";

// --- TYPE DEFINITIONS ---

interface PageParams {
  id: string;
}

// Define the props for the main component
interface PortfolioDetailsPageProps {
  params: Promise<PageParams> | PageParams;
}

interface MediaItem {
  type: "youtube" | "vimeo" | "image" | "pdf";
  url: string;
  caption?: string;
}

// Backend API shape
interface ApiPortfolioItem {
  id: number;
  title: string;
  category_id: number;
  category_name?: string | null;
  details: any;
  description?: string | null;
  image: string;
  created_at: string;
  updated_at: string;
}

// View model used by UI (keeps existing features)
interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  categoryId: number; // Critical for the back button filter
  description: string;
  mainMedia: MediaItem[];
}

// --- COMPONENTS FOR MEDIA TYPES ---

const VideoPlayer: React.FC<{ media: MediaItem }> = React.memo(({ media }) => {
  const isYouTube = media.type === "youtube";
  const embedUrl = isYouTube
    ? `https://www.youtube.com/embed/${media.url}?rel=0`
    : `https://player.vimeo.com/video/${media.url}?autoplay=0&loop=0&byline=0&portrait=0`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-10">
      <div className="relative overflow-hidden pt-[56.25%] rounded-xl shadow-2xl border-4 border-gray-700">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={`${media.type} video player`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        ></iframe>
      </div>
      {media.caption && (
        <p className="mt-4 text-center text-gray-400 italic text-sm">
          {media.caption}
        </p>
      )}
    </div>
  );
});
VideoPlayer.displayName = "VideoPlayer";

const PdfViewer: React.FC<{ media: MediaItem }> = React.memo(({ media }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-10">
      <div className="rounded-xl shadow-2xl border-4 border-gray-700 overflow-hidden">
        <iframe
          className="w-full sm:h-[80vh] h-[30vh]"
          src={media.url}
          loading="lazy"
          allowFullScreen
          title="PDF Document Viewer"
        ></iframe>
      </div>
      {media.caption && (
        <p className="mt-4 text-center text-gray-400 italic text-sm">
          {media.caption}
        </p>
      )}
    </div>
  );
});
PdfViewer.displayName = "PdfViewer";

// --- 3D CIRCULAR IMAGE GALLERY COMPONENT ---

const CircularImageGallery: React.FC<{
  images: MediaItem[];
  title: string;
  description: string;
}> = React.memo(({ images, title, description }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const cellCount = images.length;

  // Calculate carousel geometry
  const { radius, theta } = useMemo(() => {
    if (cellCount === 0) return { radius: 0, theta: 0 };
    const cellWidth = 800; // Fixed width for consistent radius calculation
    const gapMultiplier = 1.1;
    const safeCellWidth = Math.max(1, cellWidth);
    const r = Math.round(
      ((safeCellWidth / 2) / Math.tan(Math.PI / cellCount)) * gapMultiplier
    );
    const t = 360 / cellCount;
    return { radius: r, theta: t };
  }, [cellCount]);

  // Function to apply 3D transformation
  const rotateCarousel = useCallback(
    (index: number) => {
      if (!carouselRef.current || radius === 0) return;
      const angle = theta * index * -1;
      carouselRef.current.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
    },
    [radius, theta]
  );

  // Current slide index (normalized)
  const currentSlide = useMemo(
    () => (selectedIndex % cellCount + cellCount) % cellCount,
    [selectedIndex, cellCount]
  );

  useEffect(() => {
    rotateCarousel(selectedIndex);

    if (!carouselRef.current) return;
    const cells = Array.from(carouselRef.current.children) as HTMLElement[];

    // Update opacity and glow
    cells.forEach((cell, cellIndex) => {
      let distance = Math.abs(currentSlide - cellIndex);
      if (distance > cellCount / 2) {
        distance = cellCount - distance;
      }
      const opacity = Math.max(1 - distance * 0.5, 0.1);
      cell.style.opacity = opacity.toString();
      cell.classList.toggle("has-glow", cellIndex === currentSlide);
    });
  }, [currentSlide, selectedIndex, rotateCarousel, cellCount]);

  // Position cells on mount/re-render
  useEffect(() => {
    if (cellCount === 0 || radius === 0 || !carouselRef.current) return;

    const cells = Array.from(carouselRef.current.children) as HTMLElement[];
    cells.forEach((cell, i) => {
      const cellAngle = theta * i;
      cell.style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px)`;
    });
    rotateCarousel(selectedIndex); // Apply initial rotation
  }, [radius, theta, cellCount, rotateCarousel, selectedIndex]);

  // Navigation Handlers
  const goToPrev = useCallback(() => setSelectedIndex((prev) => prev - 1), []);
  const goToNext = useCallback(() => setSelectedIndex((prev) => prev + 1), []);

  // Touch/Key Handlers
  useEffect(() => {
    const sceneElement = sceneRef.current;
    if (!sceneElement) return;

    let touchstartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchstartX = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchendX = e.changedTouches[0].screenX;
      if (touchendX < touchstartX - 50) goToNext();
      if (touchendX > touchstartX + 50) goToPrev();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement;
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA"
      )
        return;
      if (event.key === "ArrowLeft") {
        goToPrev();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    sceneElement.addEventListener(
      "touchstart",
      handleTouchStart as EventListener,
      { passive: true }
    );
    sceneElement.addEventListener("touchend", handleTouchEnd as EventListener);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      sceneElement.removeEventListener(
        "touchstart",
        handleTouchStart as EventListener
      );
      sceneElement.removeEventListener(
        "touchend",
        handleTouchEnd as EventListener
      );
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToPrev, goToNext]);

  if (cellCount === 0) return null;

  return (
    <>
      <style jsx global>{`
        /* General Dark Theme Vars  */
        :root {
          --dark-surface: #1e1e1e;
          --dark-text-primary: #e0e0e0;
          --dark-text-secondary: #b3b3b3;
          --dark-border: #333333;
          --dark-hover: #333333;
        }

        /* === 3D CAROUSEL STYLES (Adapted from PHP CSS) === */
        .scene-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .scene {
          width: 800px;
          height: 400px;
          perspective: 1500px; /* Increased perspective for a deeper 3D effect */
          margin: 0 auto; /* Ensure centering */
        }
        .carousel {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.5, 0, 0.5, 1); /* Smoother transition */
        }
        .carousel__cell {
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
          backface-visibility: hidden;
          transition: transform 0.8s, opacity 0.8s;
          overflow: hidden;
          border-radius: 12px;
          background-color: var(--dark-surface);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .carousel__cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* Glow effect for the active slide */
        .carousel__cell.has-glow::before {
          content: "";
          position: absolute;
          inset: -10px;
          background: radial-gradient(
            circle at center,
            rgba(0, 168, 89, 0.6) 0%,
            rgba(0, 168, 89, 0) 60%
          );
          z-index: -1;
          opacity: 0.5;
          transition: opacity 0.8s ease;
          border-radius: 18px;
        }
        .carousel-nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .scene {
            width: 90vw;
            height: 50vw;
            /* Adjust perspective for smaller screens */
            perspective: 1000px;
          }
        }
        /* Hide navigation for single item */
        ${cellCount <= 1
          ? ".carousel-nav-container, #slide-counter { display: none !important; }"
          : ""}
      `}</style>

      <div id="project-media" className="flex flex-col items-center py-8">
        <div className="scene-wrapper">
          <div className="scene" ref={sceneRef}>
            <div className="carousel" ref={carouselRef}>
              {images.map((item, index) => (
                <div
                  key={index}
                  className={`carousel__cell ${
                    index === currentSlide ? "has-glow" : ""
                  }`}
                  data-index={index}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={item.url}
                    alt={`${title} - Image ${index + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src =
                        "https://placehold.co/800x600/1e1e1e/d3d3d3?text=Image+Load+Error";
                      target.style.objectFit = "contain";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-6 mt-12 relative z-10 carousel-nav-container">
          <button
            id="prev-button"
            onClick={goToPrev}
            className="carousel-nav-button p-4 rounded-full bg-gray-800 hover:bg-[#00A859] transition duration-300"
            title="Previous Slide"
            disabled={cellCount <= 1}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>
          <p
            id="slide-counter"
            className="text-xl font-semibold text-[#00A859] min-w-[50px] text-center"
          >
            {currentSlide + 1} / {cellCount}
          </p>
          <button
            id="next-button"
            onClick={goToNext}
            className="carousel-nav-button p-4 rounded-full bg-gray-800 hover:bg-[#00A859] transition duration-300"
            title="Next Slide"
            disabled={cellCount <= 1}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>

        {/* Caption Area */}
        {/* <div
          id="caption-container"
          className="mt-8 text-center max-w-2xl w-full px-4 min-h-[50px]"
        >
          <h2
            id="caption-title"
            className="text-xl font-bold text-white mb-1"
          >
            {images[currentSlide]?.caption || title}
          </h2>
          {!images[currentSlide]?.caption && (
            <p id="caption-text" className="text-sm text-gray-400">
              {description}
            </p>
          )}
        </div> */}
      </div>
    </>
  );
});
CircularImageGallery.displayName = "CircularImageGallery";

// --- MAIN PAGE COMPONENT ---

export default function PortfolioDetailsPage({
  params,
}: PortfolioDetailsPageProps) {
    const { id } = use(params as any);
    // Parse ID from route params
    const itemId = useMemo(() => {
    const n = parseInt(id, 10);
    return isNaN(n) ? 1 : n;
  }, [id]);

  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // --- Data Fetching from API ---
  useEffect(() => {
    if (!itemId) {
      setError("Invalid project ID.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${itemId}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`Failed to load project (status: ${res.status})`);
        }

        const apiData: ApiPortfolioItem = await res.json();
        if (!isMounted) return;

        // Parse details (stringified JSON) safely
        let detailsArray: any[] = [];
        try {
          const raw =
            typeof apiData.details === "string"
              ? JSON.parse(apiData.details)
              : apiData.details;
          if (Array.isArray(raw)) {
            detailsArray = raw;
          }
        } catch {
          detailsArray = [];
        }

        // Map details → MediaItem[]
        let mainMedia: MediaItem[] = detailsArray
          .map((d) => {
            if (!d || typeof d !== "object") return null;
            const type = d.type as MediaItem["type"];
            const url = d.url as string;
            if (!type || !url) return null;
            if (!["youtube", "vimeo", "image", "pdf"].includes(type)) return null;
            return { type, url };
          })
          .filter(Boolean) as MediaItem[];

        // Fallback: if no details, use main image as a single image media
        if (mainMedia.length === 0 && apiData.image) {
          mainMedia = [{ type: "image", url: apiData.image }];
        }

        const mapped: PortfolioItem = {
          id: apiData.id,
          title: apiData.title,
          category: apiData.category_name || "Uncategorized",
          categoryId: apiData.category_id,
          description: apiData.description || "",
          mainMedia,
        };

        setProject(mapped);
      } catch (err: any) {
        if (!isMounted) return;
        if (err.name === "AbortError") return;
        console.error("Failed to fetch project data:", err);
        setError(err.message || "Failed to fetch project data.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [itemId]);

  // --- Media Type Logic ---
  const mediaToRender = useMemo(() => {
    if (!project || !project.mainMedia || project.mainMedia.length === 0)
      return null;

    const firstMedia = project.mainMedia[0];

    switch (firstMedia.type) {
      case "youtube":
      case "vimeo":
        return <VideoPlayer media={firstMedia} />;
      case "image":
        // Pass all image media items to the CircularImageGallery
        return (
          <CircularImageGallery
            images={project.mainMedia.filter((m) => m.type === "image")}
            title={project.title}
            description={project.description}
          />
        );
      case "pdf":
        return <PdfViewer media={firstMedia} />;
      default:
        return null;
    }
  }, [project]);

  // --- Handlers: Using localStorage for back navigation ---
  const handleGoBack = useCallback(() => {
    if (project) {
      try {
        // 1. Save the category ID to localStorage for the portfolio page to read
        localStorage.setItem(
          "portfolio_last_category_id",
          project.categoryId.toString()
        );
        console.log(
          `Saved Category ID ${project.categoryId} to localStorage for back navigation.`
        );
      } catch (e) {
        console.error("Failed to access localStorage:", e);
        // Continue navigation even if localStorage fails
      }

      // 2. Navigate back to the portfolio page
      window.location.href = "/portfolio";
    } else {
      // Fallback navigation
      window.location.href = "/portfolio";
    }
  }, [project]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-40 flex items-center justify-center bg-[#0D0D0D] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A859]"></div>
        <p className="ml-4 text-lg">Loading Project...</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen pt-40 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-xl text-red-500">{error || "Project not found."}</p>
        <button
          onClick={() => {
            window.location.href = "/portfolio";
          }}
          className="mt-8 px-6 py-3 rounded-lg bg-gray-800 text-[#00A859] border border-[#00A859] hover:bg-[#00A859] hover:text-white transition duration-300"
        >
          Go to Portfolio
        </button>
      </main>
    );
  }

  // --- Render Main Content ---
  return (
    <main className="pt-20 min-h-screen flex flex-col items-center relative z-10 font-inter text-white overflow-x-hidden">
      {/* Project Header */}
      <section className="w-full max-w-7xl px-4 py-12 text-center">
        {/* Back Button */}
        <div className="mb-8 flex justify-center w-full max-w-2xl mx-auto">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 
                                   hover:bg-[#00A859] hover:border-[#00A859] hover:text-white transition duration-300 shadow-xl"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <span>Back to {project.category}</span>
          </button>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          {/* Project Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-white tracking-tight">
            {project.title}
          </h1>
          {/* Category */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#00A859] mb-8">
            Category: {project.category}
          </h2>
        </div>
      </section>

      {/* Media Content (Dynamic Rendering based on media type) */}
      <section className="w-full">{mediaToRender}</section>

      {/* Description Section */}
      {project.description && (
        <section className="w-full max-w-2xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-300">
            Project Overview
          </h3>
          <p className="text-lg text-gray-400 leading-relaxed text-center">
            {project.description}
          </p>
        </section>
      )}

      <div className="pb-20"></div>
    </main>
  );
}
