/**
 * OrganizationSchema Component
 * 
 * Generates JSON-LD structured data for CloudPlay XP organization
 * Enables Google Knowledge Graph features:
 * - Organization logo
 * - Social media profiles
 * - Contact information
 * - Business location
 * 
 * @see https://schema.org/Organization
 * @see https://developers.google.com/search/docs/appearance/structured-data/logo
 */

export default function OrganizationSchema() {
  // Get site URL from environment with fallback
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cloudplay.xp';
  
  // Organization schema object
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`, // ID for linking from other schemas
    "name": "CloudPlay XP",
    "url": siteUrl,
    "logo": `${siteUrl}/Cloudplay_xp_black_logo[1].png`,
    
    // Social media profiles for Knowledge Graph
    "sameAs": [
      "https://www.linkedin.com/company/cloudplay-xp",
      "https://www.instagram.com/cloudplay.xp"
    ],
    
    // Contact information
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "customer service",
      "areaServed": "Global",
      "availableLanguage": ["English"]
    },
    
    // Business address
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressCountry": "IN"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema)
      }}
    />
  );
}
