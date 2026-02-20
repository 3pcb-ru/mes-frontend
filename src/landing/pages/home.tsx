import { HeroSection } from '../components/sections/hero-section';
import { WhySection } from '../components/sections/why-section';
import { ArchitectureSection } from '../components/sections/architecture-section';
import { PhasesSection } from '../components/sections/phases-section';
import { CTASection } from '../components/sections/cta-section';

export function HomePage() {
    return (
        <main className="pt-16">
            <HeroSection />
            <div id="why">
                <WhySection />
            </div>
            <div id="solution">
                <ArchitectureSection />
            </div>
            <div id="reliability">
                <PhasesSection />
            </div>
            <CTASection />
        </main>
    );
}
