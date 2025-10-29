"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
// 1. FIX: Temporarily replace the external import with a local mock component
// import AnimatedText from "@/components/AnimatedText/AnimatedText"; 


// --- 0. LOCAL COMPONENT DEFINITION (Replacement for missing AnimatedText) ------------------

/**
 * Simplified AnimatedText component to replace the external dependency.
 * Retains the requested styling for the title.
 */
const AnimatedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  // Using a simple h1 tag with the passed class names for display
  return (
    <h1 className={`font-inter ${className || 'text-7xl md:text-8xl text-white font-bold tracking-widest'}`}>
      {text}
    </h1>
  );
};
AnimatedText.displayName = "AnimatedText";


// --- 1. MOCK DATA & TYPES ---------------------------------------------------

// Define the type for a single portfolio item
interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  date: string; // Used for "Latest" sorting
}

// Define available categories
const CATEGORIES = [
  'All', 
  'Event Design', 
  '3D, Anamorphic, CGI & VFX', 
  'Animation', 
  'Event Content', 
  'Games', 
  'Home Look', 
  'Presentation Design', 
  'About Us', 
  'Brochure', 
  'Team Building & Simulations'
];

// Mock data based on the screenshot (using placeholder images and dates)
const MOCK_PORTFOLIO_DATA: PortfolioItem[] = [
  // Row 1
  { id: 1, title: 'The CloudPlay Showreel', category: 'Animation', imageUrl: 'hero-carousel/slide1.jpg', date: '2023-10-25' },
  { id: 2, title: 'HSBC Mastercard', category: 'Event Content', imageUrl: 'hero-carousel/slide4.jpg', date: '2023-10-20' },
  { id: 3, title: 'HSBC Emerge', category: 'Event Design', imageUrl: 'hero-carousel/slide3.png', date: '2023-10-15' },
  // Row 2
  { id: 4, title: 'AMD', category: 'Event Design', imageUrl: 'https://placehold.co/600x400/1e293b/cbd5e1?text=AMD', date: '2023-10-10' },
  { id: 5, title: 'Volvo Product launch musical AV', category: '3D, Anamorphic, CGI & VFX', imageUrl: 'https://placehold.co/600x400/1e293b/cbd5e1?text=Volvo+AV', date: '2023-10-05' },
  { id: 6, title: 'AstraZeneca product AV', category: 'Animation', imageUrl: 'https://placehold.co/600x400/1e293b/cbd5e1?text=AstraZeneca+AV', date: '2023-09-30' },
  // Row 3
  { id: 7, title: 'AstraZeneca launch', category: 'Event Content', imageUrl: 'https://placehold.co/600x400/1e293b/cbd5e1?text=AstraZeneca+Launch', date: '2023-09-25' },
  { id: 8, title: 'Nestle SS Conclave 2025 Post event AV', category: 'Event Design', imageUrl: 'https://placehold.co/600x400/1e293b/cbd5e1?text=Nestle+AV', date: '2023-09-20' },
  { id: 9, title: 'Sabha Post event AV', category: '3D, Anamorphic, CGI & VFX', imageUrl: 'https://placehold.co/600x400/1e293b/cbd5e1?text=Sabha+AV', date: '2023-09-15' },
  
  // Additional mock items for "Load More"
  { id: 10, title: 'Project Echo Alpha', category: 'Games', imageUrl: 'https://placehold.co/600x400/0f172a/94a3b8?text=Echo+Alpha', date: '2023-09-10' },
  { id: 11, title: 'Project Beta Bridge', category: 'Home Look', imageUrl: 'https://placehold.co/600x400/0f172a/94a3b8?text=Beta+Bridge', date: '2023-09-05' },
  { id: 12, title: 'Project Gamma Tower', category: 'Presentation Design', imageUrl: 'https://placehold.co/600x400/0f172a/94a3b8?text=Gamma+Tower', date: '2023-09-01' },
  { id: 13, title: 'Project Delta Dash', category: 'Event Design', imageUrl: 'https://placehold.co/600x400/0f172a/94a3b8?text=Delta+Dash', date: '2023-08-28' },
];

const MIN_CHARS = 3; // Minimum characters required for search to activate
const DEBOUNCE_DELAY_MS = 1000; // 1 second delay

// --- 2. COMPONENTS -----------------------------------------------------------

/**
 * Component for a single portfolio item card.
 * UPDATED: Uses separate fixed-height divs for image and text to ensure layout consistency.
 */
const PortfolioItemCard: React.FC<{ item: PortfolioItem }> = React.memo(({ item }) => {
  return (
    <a 
      href={`/portfolio/${item.id}`} 
      // Main container now handles the scale and shadow effects
      className="group block w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,168,89,0.8)]"
    >
      
      {/* 1. Image Area: Fixed height to prevent layout collapse from short images (like 20% height) */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-900">
        <img
          src={item.imageUrl}
          alt={item.title}
          // The image fills the area and crops itself (object-cover)
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/600x224/1e293b/cbd5e1?text=Project+Image'; // Using 600x224 for 56h
          }}
        />
      </div>

      {/* 2. Text Area: Consistent height and styling below the image */}
      <div className="bg-gray-800 p-4 min-h-[90px] flex flex-col justify-center">
        <p className="text-xs text-gray-300 mb-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {item.category}
        </p>
        <h3 className="text-white text-lg font-semibold transition-colors duration-300 group-hover:text-[#00A859]">
          {item.title}
        </h3>
      </div>
    </a>
  );
});
PortfolioItemCard.displayName = "PortfolioItemCard";


/**
 * Component for the search bar, category filters, and sorting dropdown.
 */
interface FilterBarProps {
  searchTermInput: string; // The raw, immediate value from the input
  onSearchInputChange: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTermInput,
  onSearchInputChange,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
}) => {
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchInputChange(e.target.value);
  }, [onSearchInputChange]);


  return (
    <div className="w-full max-w-7xl px-4 lg:px-0 mx-auto mb-12">
      
      {/* Search Bar and Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-around gap-4 mb-6">
        
        {/* Search Input */}
        <div className="flex w-full sm:w-2/3 lg:w-1/3 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
          <input
            type="text"
            // Placeholder text
            placeholder="Search by name" 
            value={searchTermInput}
            onChange={handleInputChange}
            className="flex-grow p-3 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A859] transition duration-150"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-1/3 lg:w-40 group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`
              block appearance-none w-full bg-gray-900 border border-gray-700 text-gray-200 py-3 px-4 pr-8 rounded-lg shadow-xl 
              leading-tight focus:outline-none focus:bg-gray-800 transition duration-150 cursor-pointer
              hover:border-[#00A859] focus:border-[#00A859] 
            `}
          >
            <option value="latest">Latest</option>
            <option value="az">A to Z</option>
            <option value="za">Z to A</option>
          </select>
          {/* SVG container now uses group-hover/focus-within to change arrow color to green */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 
                        group-hover:text-[#00A859] group-focus-within:text-[#00A859] transition duration-150">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons (Glass effect container) */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
              }}
              className={`
                px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap
                ${activeCategory === category
                  ? 'bg-[#00A859] text-white shadow-lg shadow-[#00A859]/50 transform scale-105' // Active color
                  : 'bg-gray-800 text-gray-300 hover:bg-[#00A859] hover:text-white hover:shadow-md hover:scale-105 border border-gray-700' 
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
FilterBar.displayName = "FilterBar";


// --- 3. MAIN PAGE COMPONENT --------------------------------------------------

export default function PortfolioPage() {
  const ITEMS_PER_LOAD = 9; // Number of cards to load at a time

  // State Management
  const [searchTermInput, setSearchTermInput] = useState(''); // Raw input from the user
  const [searchQuery, setSearchQuery] = useState(''); // Debounced and validated query used for filtering
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'az', 'za'
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false); // For simulating loading

  // --- Debouncing Logic ---
  useEffect(() => {
    // Set up a timer to update the actual search query after a delay
    const handler = setTimeout(() => {
      const trimmedInput = searchTermInput.trim();
      
      if (trimmedInput.length >= MIN_CHARS || trimmedInput.length === 0) {
        // Update the actual query if it meets the minimum char count or is empty (to clear search)
        setSearchQuery(trimmedInput);
      } else {
        // If the query is too short but not empty, ensure the actual filter query is empty 
        setSearchQuery(''); 
      }
    }, DEBOUNCE_DELAY_MS);

    // Cleanup function: This is essential for debouncing. It cancels the previous timer.
    return () => {
      clearTimeout(handler);
    };
  }, [searchTermInput]); 

  // Effect to reset the visible count and clear search on category change
  React.useEffect(() => {
    // Reset visible count on any filter/sort change
    setVisibleCount(ITEMS_PER_LOAD);

    // Clear search states when category is changed, as per common UI expectation
    if (activeCategory !== 'All' && searchTermInput) {
      setSearchTermInput('');
      setSearchQuery('');
    }
  }, [activeCategory, sortBy]); 

  // Memoized function to filter and sort the data (now depends on searchQuery)
  const filteredAndSortedItems = useMemo(() => {
    let items = [...MOCK_PORTFOLIO_DATA];
    
    // 1. Filtering by Category
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }

    // 2. Filtering by Search Query (Case Insensitive Title Search)
    if (searchQuery) { // Only run search if searchQuery is non-empty (which means it passed the debouncing/min-char check)
      const query = searchQuery.toLowerCase();
      items = items.filter(item => item.title.toLowerCase().includes(query));
    }
    
    // 3. Sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          // Sort by date descending (Newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'az':
          // Sort by title ascending
          return a.title.localeCompare(b.title);
        case 'za':
          // Sort by title descending
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return items;
  }, [activeCategory, searchQuery, sortBy]);


  // Handle "Load More" button click
  const handleLoadMore = useCallback(() => {
    if (visibleCount < filteredAndSortedItems.length) {
      setIsLoading(true);
      // Simulate an API call or loading delay
      setTimeout(() => {
        setVisibleCount(prevCount => prevCount + ITEMS_PER_LOAD);
        setIsLoading(false);
      }, 500);
    }
  }, [visibleCount, filteredAndSortedItems.length]);


  // Get the subset of items to display
  const itemsToDisplay = filteredAndSortedItems.slice(0, visibleCount);
  const hasMoreToLoad = visibleCount < filteredAndSortedItems.length;

  return (
    <main className="pt-20 min-h-screen flex flex-col items-center px-4 relative text-white font-inter">
      
      {/* Animated "Portfolio" text */}
      <section className="mb-8 p-4 pt-12">
        <AnimatedText 
          text="PORTFOLIO" 
          className="!text-5xl sm:!text-7xl md:!text-8xl !text-center !font-bold !text-white tracking-widest"
        />
      </section>
      
      {/* Filter and Search Bar */}
      <FilterBar
        searchTermInput={searchTermInput} // Pass the raw input value
        onSearchInputChange={setSearchTermInput} // Handler to update the raw input value
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      <section className="w-full max-w-7xl px-4 lg:px-0 mx-auto">
        {itemsToDisplay.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No projects found matching your criteria.
          </div>
        )}

        {/* Portfolio Item Grid: grid-cols-1 (Mobile), sm:grid-cols-2 (Tablet), lg:grid-cols-3 (Web) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {itemsToDisplay.map(item => (
            <PortfolioItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreToLoad && (
          <div className="flex justify-center mb-20">
            {/* Use Green/Teal accent color for Load More button */}
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`
                px-8 py-3 text-lg font-semibold rounded-lg border-2 border-[#00A859] 
                bg-transparent text-[#00A859] transition-all duration-300 
                hover:bg-[#00A859] hover:text-white hover:shadow-[0_0_20px_rgba(0,168,89,0.6)]
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
