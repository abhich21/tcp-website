/**
 * ServiceSchema Component
 * 
 * Generates JSON-LD structured data for individual service pages
 * Enables Google rich snippets for better search visibility
 * 
 * Features:
 * - Links to Organization schema via @id
 * - Security: XSS-safe JSON generation
 * - Server-side rendering compatible
 * - Type-safe with TypeScript
 * 
 * @see https://schema.org/Service
 * @see https://developers.google.com/search/docs/appearance/structured-data/service
 */

import { Service } from '@/data/services';

interface ServiceSchemaProps {
  service: Service;
  slug: string;
}

/**
 * Sanitize text for safe inclusion in JSON-LD
 * Prevents XSS attacks by escaping HTML entities
 */
function sanitizeForSchema(text: string | undefined): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Generate safe service URL
 */
function getSafeServiceUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}/services/${encodeURIComponent(slug)}`;
}

/**
 * Safely stringify JSON-LD with script injection prevention
 */
function safeJsonLdStringify(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export default function ServiceSchema({ service, slug }: ServiceSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const serviceUrl = getSafeServiceUrl(slug);
  
  // Build the Service schema object
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    
    // Basic service information
    "name": sanitizeForSchema(service.title),
    "description": sanitizeForSchema(service.seoDescription),
    
    // Link to organization
    "provider": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`
    },
    
    // Service URL
    "url": serviceUrl,
    
    // Service type (using title as category)
    "serviceType": sanitizeForSchema(service.title),
    
    // Service availability
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    },
    
    // Available languages
    "availableLanguage": {
      "@type": "Language",
      "name": "English"
    },
    
    // Include image if available
    ...(service.image && {
      "image": {
        "@type": "ImageObject",
        "url": `${baseUrl}${service.image}`,
        "caption": sanitizeForSchema(service.title)
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLdStringify(serviceSchema)
      }}
    />
  );
}
