import { motion } from 'motion/react';
import { ExternalLink, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from 'react-i18next';

export function DannieQuoteWidget() {
    const { t } = useTranslation();

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto rounded-[2.5rem] p-8 md:p-12 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Zap className="h-64 w-64 text-blue-400 rotate-12" />
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        {/* Content Side */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                                {t('dannie_widget.badge')}
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                {t('dannie_widget.title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                    {t('dannie_widget.title_highlight')}
                                </span>
                            </h2>
                            
                            <p className="text-lg text-slate-400 font-light leading-relaxed max-w-xl">
                                {t('dannie_widget.subtitle')}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                {[
                                    t('dannie_widget.feature_1'),
                                    t('dannie_widget.feature_2'),
                                    t('dannie_widget.feature_3'),
                                    t('dannie_widget.feature_4')
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5 text-slate-300">
                                        <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                                        <span className="text-sm font-medium tracking-wide">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Side */}
                        <div className="lg:col-span-2">
                            <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex flex-col gap-6 text-center">
                                <div className="space-y-1">
                                    <p className="text-sm text-blue-400 font-bold tracking-widest uppercase">{t('dannie_widget.cta_badge')}</p>
                                    <h3 className="text-2xl font-bold text-white">{t('dannie_widget.cta_title')}</h3>
                                </div>
                                
                                <a 
                                    href="https://dannie.cc" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button 
                                        size="lg" 
                                        className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 text-lg font-bold group"
                                    >
                                        {t('dannie_widget.cta_button')}
                                        <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Button>
                                </a>

                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium pb-2">
                                    <ArrowRight className="h-3 w-3" />
                                    {t('dannie_widget.footer')}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
