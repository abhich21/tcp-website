import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/data/services'; // 1. Import the new service data
import GlassCard from '@/components/ui/GlassCard/GlassCard'; // 2. Import GlassCard
import ShineButton from '@/components/ui/ShineButton'; // 3. Import ShineButton for CTA
// 4. Import icons for navigation
import { ChevronLeft, ArrowRight } from 'lucide-react'; 
import React from 'react'; // Import React for createElement

// Define the props interface
interface ServicePageProps {
  params: {
    slug: string;
  };
}

// 5. Generate static paths for all services
export async function generateStaticParams() {
  // Get all slugs from the services data
  const paths = services.map((service) => ({
    slug: service.slug,
  }));
  
  return paths;
}

// 6. Generate dynamic SEO metadata for each page
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  // --- FIX: Await params before accessing .slug ---
  const slug = (await params).slug;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }

  return {
    title: `${service.title} | CloudPlay XP Services`,
    description: service.seoDescription, // Use the dedicated SEO description
    openGraph: {
      title: `${service.title} | CloudPlay XP Services`,
      description: service.seoDescription,
      images: service.image ? [
        {
          url: service.image,
          width: 1200, // Assuming a standard OG image width
          height: 630, // Assuming a standard OG image height
          alt: service.title,
        }
      ] : [],
    },
  };
}

// 7. The main page component (Server Component)
export default async function ServicePage({ params }: ServicePageProps) {
  // --- FIX: Await params before accessing .slug ---
  const slug = (await params).slug;
  const service = services.find((s) => s.slug === slug);

  // 8. Handle "Not Found" case with custom UI
  if (!service) {
    return (
      <main className="min-h-screen pt-40 px-4 text-center">
        <GlassCard className="max-w-xl mx-auto p-8 md:p-12 rounded-3xl">
          <h1 className="text-3xl font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-gray-300 mb-8">
            The service you&apos;re looking for (&apos;{slug}&apos;) doesn&apos;t exist or may have been moved.
          </p>
          <Link 
            href="/#services"
            className="inline-block px-6 py-3 rounded-lg bg-lime-400 text-black font-semibold transition-transform hover:scale-105"
          >
            Back to All Services
          </Link>
        </GlassCard>
      </main>
    );
  }

  // 9. Get related services (filter out current, take 3)
  const relatedServices = services
    .filter(s => s.slug !== slug)
    .slice(0, 3);

  // 10. Render the service detail page
  return (
    <main className="min-h-screen pt-24 md:pt-40 pb-20 px-4">
      {/* Centering and max-width wrapper */}
      <div className="max-w-4xl mx-auto">
        
        {/* Go Back Link */}
        <Link 
          href="/#services" // Links to the services section on the homepage
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors mb-8 group
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-lime-400 rounded-lg p-1"
        >
          <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Services</span>
        </Link>
        
        {/* Main Service Content Card */}
        <GlassCard className="rounded-3xl overflow-hidden">
          {/* Optional Header Image */}
          {service.image && (
            <div className="relative w-full h-48 md:h-72 bg-black/20">
              <Image
                src={service.image}
                alt={`${service.title} header image`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="p-6 md:p-10 lg:p-12">
            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-[montserrat]">
              {service.title}
            </h1>
            
            {/* Short Description */}
            <p className="text-lg md:text-xl text-lime-400 font-semibold mb-8">
              {service.shortDesc}
            </p>
            
            {/* Main Content Body */}
            <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-4">
              {/* Split content by newline and map to <p> tags for proper formatting */}
              {service.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <ShineButton 
                  href="/#contact"
                  className="px-8 py-3 text-lg font-semibold"
                >
                  Get in Touch
              </ShineButton>
            </div>
          </div>
        </GlassCard>

        {/* === START: ADDED RELATED SERVICES SECTION === */}
        <section className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-[montserrat] text-center">
            You Might Also Be Interested In
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((relatedService) => (
              <GlassCard 
                key={relatedService.slug} 
                className="p-6 flex flex-col rounded-2xl" // Use smaller rounding
              >
                {/* Card Title */}
                <h3 className="text-xl font-semibold text-white mb-3 font-[montserrat]">
                  {relatedService.title}
                </h3>
                {/* Card Description (uses flex-grow to push link to bottom) */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                  {relatedService.shortDesc}
                </p>
                {/* Card Link */}
                <Link 
                  href={`/services/${relatedService.slug}`}
                  className="inline-flex items-center gap-2 text-lime-400 font-semibold transition-all group hover:text-lime-300 hover:gap-3"
                >
                  Know More
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </GlassCard>
            ))}
          </div>
        </section>
        {/* === END: ADDED RELATED SERVICES SECTION === */}

      </div>
    </main>
  );
}