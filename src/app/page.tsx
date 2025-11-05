// 1. Import Node.js modules for reading files
import fs from 'fs';
import path from 'path';
// 1. Import Components
import Hero from "@/components/Hero/Hero"; 
import Services from "@/components/Services/Services";
import ShowReel from "@/components/ShowReel/ShowReels";
import PortfolioSection from "@/components/portfolio-section/PortfolioSection";
import ServicesMarquee from "@/components/Services/ServicesMarquee";
import PartnersSection from "@/components/partners-section/PartnersSection";
import { LogoItem } from '@/components/ui/LogoLoop';
import { TestimonialCarousel } from '@/components/Testimonial-Carousel/Testimonial-Carousel'; // NEW IMPORT
import { testimonials } from '@/data/testimonials';
import GlassCard from '@/components/ui/GlassCard/GlassCard';
import MeetTheTeam from '@/components/Meet-The-Team/Meet-The-Team'; // 1. Import
import FaqSection from '@/components/FAQ/FaqSection';
import Footer from '@/components/Footer/Footer';
import ContactForm from '@/components/Contact-us/ContactStepper';

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
      <ShowReel />
      <Hero /> {/* 2. Add the Hero component here */}
      <PortfolioSection /> {/* 2. Add the new section */}
      <PartnersSection logos={partnerLogos} />
      <section id="services">
        <Services/>
      </section>
      
      <ServicesMarquee /> 

      <section className="w-full h-auto py-10 px-4">
        <h2 className="text-center text-2xl md:text-4xl font-semibold font-[montserrat]  tracking-widest text-gray-300 mb-16">
          Client <span className="text-lime-400">Testimonials</span>
        </h2>
        
        <GlassCard className="w-11/12 md:w-4/5 mx-auto rounded-3xl">
          <div className="">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </GlassCard>
      </section>
      
      <section id="about">
        <MeetTheTeam/>
      </section>

      <section id="contact">
        <ContactForm />
      </section>
    <Footer/>
    </main>
  );
}