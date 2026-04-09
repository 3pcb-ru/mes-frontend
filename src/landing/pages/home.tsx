import { HeroSection } from '../components/sections/hero-section';
import { WhySection } from '../components/sections/why-section';
import { SolutionsSection } from '../components/sections/architecture-section';
import { PhasesSection } from '../components/sections/phases-section';
import { CTASection } from '../components/sections/cta-section';
import { DannieQuoteWidget } from '../components/dannie-quote-widget';
import { SEO } from '@/shared/components/seo';
import { useTranslation } from 'react-i18next';

export function HomePage() {
    const { t } = useTranslation();
    return (
        <main className="bg-[#030213]">
            <SEO 
                title={t('seo.home_title')} 
                description={t('seo.home_description')} 
            />
            <HeroSection />
            <div id="why">
                <WhySection />
            </div>
            <div id="solution">
                <SolutionsSection />
                <DannieQuoteWidget />
            </div>
            <div id="reliability">
                <PhasesSection />
            </div>
            <CTASection />
        </main>
    );
}
