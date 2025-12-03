import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for CloudPlay XP website
 * This file controls how search engine crawlers interact with the website
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  // Use environment variable or fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',      // Disallow admin panel
          '/admin/*',     // Disallow all admin routes
          '/api/',        // Disallow API routes (optional, but recommended)
        ],
      },
      {
        // Specific rules for Googlebot
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
        ],
      },
      {
        // Specific rules for Bingbot
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
