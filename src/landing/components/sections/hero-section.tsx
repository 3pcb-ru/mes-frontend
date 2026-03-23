import { ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';
import heroMockupImage from '@/assets/hero-mockup.png';

export function HeroSection() {
    const { t } = useTranslation();
    return (
        <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-[#030213]">
            {/* Background: blurred hero image fills the full section */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroMockupImage}
                    alt="Manufacturing Automation Background"
                    className="w-full h-full object-cover opacity-40 scale-105"
                />
                {/* Dark overlay gradient on top of image */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#030213]/40 via-[#030213]/25 to-[#030213]" />
            </div>

            {/* Cyan ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-900/25 blur-[160px] rounded-full pointer-events-none z-0" />

            {/* Content: centered */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-32 md:py-40">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="space-y-10 max-w-5xl mx-auto"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-sm font-medium tracking-wide">
                        <Activity className="h-4 w-4" />
                        <span>{t('hero.badge')}</span>
                    </div>

                    {/* Main headline */}
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
                            {t('hero.title_1')}
                        </h1>
                        <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                            {t('hero.title_2')}
                        </h2>
                    </div>

                    {/* Sub-headline */}
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                        {t('hero.subtitle')}
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 text-slate-400">
                            <ShieldCheck className="h-5 w-5 text-cyan-500" />
                            <span className="text-sm font-medium">{t('hero.trust_1')}</span>
                        </div>
                        <div className="w-px h-5 bg-slate-700 self-center hidden sm:block" />
                        <div className="flex items-center gap-2 text-slate-400">
                            <ShieldCheck className="h-5 w-5 text-purple-500" />
                            <span className="text-sm font-medium">{t('hero.trust_2')}</span>
                        </div>
                        <div className="w-px h-5 bg-slate-700 self-center hidden sm:block" />
                        <div className="flex items-center gap-2 text-slate-400">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            <span className="text-sm font-medium">{t('hero.trust_3')}</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className="h-16 px-10 text-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-0 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300"
                        >
                            {t('hero.cta_primary')}
                            <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-16 px-10 text-xl font-medium border-slate-600 hover:bg-white/5 hover:border-slate-400 text-white rounded-2xl backdrop-blur-sm bg-white/5 transition-all duration-300"
                        >
                            {t('hero.cta_secondary')}
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom fade to black */}
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#030213] to-transparent z-10 pointer-events-none" />
        </section>
    );
}
