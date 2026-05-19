import Navbar from '@/components/Navbar';
import MarqueeTicker from '@/components/MarqueeTicker';
import HeroSection from '@/components/HeroSection';
import FeatureBadges from '@/components/FeatureBadges';
import ProductGrid from '@/components/ProductGrid';
import ReviewSlider from '@/components/ReviewSlider';
import JournalSection from '@/components/JournalSection';
import NewsletterContact from '@/components/NewsletterContact';
import Footer from '@/components/Footer';

/**
 * CSS-only sticky stacking — each section is `position: sticky; top: 0`
 * with ascending z-index. As you scroll, every section pins to the top
 * and the next one slides over it from below, exactly like the GSAP
 * ScrollTrigger "pin + scrub" effect used on studioingmoretti.it,
 * but with zero JS overhead.
 *
 * Each section must have a solid (non-transparent) background so it
 * fully hides the section below when stacked.
 */
const sticky = (z: number): React.CSSProperties => ({
  position: 'sticky',
  top: 0,
  zIndex: z,
});

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MarqueeTicker />
      <main style={{ isolation: 'isolate' }}>
        <div style={sticky(10)}><HeroSection /></div>
        <div style={sticky(20)}><FeatureBadges /></div>
        <div style={sticky(30)}><ProductGrid /></div>
        <div style={sticky(40)}><ReviewSlider /></div>
        <div style={sticky(50)}><JournalSection /></div>
        <div style={sticky(60)}><NewsletterContact /></div>
      </main>
      <div style={sticky(70)}><Footer /></div>
    </>
  );
}
