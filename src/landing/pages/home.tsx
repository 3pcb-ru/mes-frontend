import { HeroSection } from '../components/sections/hero-section';
import { SolutionsSection } from '../components/sections/architecture-section';
import { PhasesSection } from '../components/sections/phases-section';
import { CTASection } from '../components/sections/cta-section';

export function HomePage() {
    return (
        <main className="bg-[#030213]">
            <HeroSection />
            <div id="solution">
                <SolutionsSection />
            </div>
            <div id="reliability">
                <PhasesSection />
            </div>
            <CTASection />
        </main>
    );
}
