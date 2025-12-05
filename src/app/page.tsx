// 1. Import Node.js modules for reading files
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';

// 2. Import above-fold components (synchronous)
import Hero from "@/components/Hero/Hero";
import Hero2 from "@/components/Hero/Hero2";
import ShowReel from "@/components/ShowReel/ShowReels";
import PartnersSection from "@/components/partners-section/PartnersSection";
import { LogoItem } from '@/components/ui/LogoLoop';
import { TestimonialCarousel } from '@/components/Testimonial-Carousel/Testimonial-Carousel';
import { testimonials } from '@/data/testimonials';
import GlassCard from '@/components/ui/GlassCard/GlassCard';

// 3. Dynamic imports for below-fold components (lazy loaded)
const PortfolioSection = dynamic(() => import('@/components/3D-Model/3d-model-section'), {
  loading: () => <div className="min-h-[600px] flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>,
  ssr: true
});

const Services = dynamic(() => import('@/components/Services/Services'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>,
  ssr: true
});

const ServicesMarquee = dynamic(() => import('@/components/Services/ServicesMarquee'), {
  loading: () => <div className="min-h-[200px]"></div>,
  ssr: true
});

const FaqSection = dynamic(() => import('@/components/FAQ/FaqSection'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>,
  ssr: true
});

const ContactForm = dynamic(() => import('@/components/Contact-us/ContactStepper'), {
  loading: () => <div className="min-h-[500px] flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>,
  ssr: true
});

const Footer = dynamic(() => import('@/components/Footer/Footer'), {
  loading: () => <div className="min-h-[300px]"></div>,
  ssr: true
});

export default function Home() {
  // 3. Read the logo files and generate the array
  const logosDirectory = path.join(process.cwd(), 'public/partner-logos');
  const logoFilenames = fs.readdirSync(logosDirectory);

  const partnerLogos: LogoItem[] = logoFilenames.map((filename, index) => {
    // Create a simple alt tag from the filename (e.g., "logo1.svg" -> "Partner 1")
    const altText = `Partner ${index + 1}`;

    return {
      src: `/partner-logos/${filename}`,
      alt: altText,
    };
  });

  return (
    <main>
      <Hero2 />
      <ShowReel />
      <Hero />
      <PortfolioSection />
      <PartnersSection logos={partnerLogos} />
      <section className="w-full h-auto py-10 px-4">
        <h2 className="text-center text-2xl md:text-4xl font-semibold font-[montserrat]  tracking-widest text-gray-300 mb-10">
          Client <span className="text-lime-400">Testimonials</span>
        </h2>

        <GlassCard className="w-11/12 md:w-4/5 mx-auto rounded-3xl">
          <div className="">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </GlassCard>
      </section>
      <section id="services">
        <Services />
      </section>

      <ServicesMarquee />


      {/* <section id="about">
        <MeetTheTeam/>
      </section> */}

      <section id="faq">
        <FaqSection />
      </section>

      <section id="contact">
        <ContactForm />
      </section>
      <Footer />
    </main>
  );
}