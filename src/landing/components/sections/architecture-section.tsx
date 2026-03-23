import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Package, Zap, Database, Layers, CheckCircle2 } from 'lucide-react';

// Asset imports from old about page
import open_connectivity from '@/assets/why/open_connectivity.png';
import material_intelligence from '@/assets/why/material_intelligence.png';
import trace_and_as_built from '@/assets/why/trace_and_as_built.png';
import process_safety_and_interlocks from '@/assets/why/process_safety_and_interlocks.png';

export function SolutionsSection() {
    const { t } = useTranslation();

    const solutions = [
        {
            icon: Package,
            title: t('solutions.mats.title'),
            solutionDesc: t('solutions.mats.desc'),
            solves: t('solutions.mats.solves'),
            problemDesc: t('solutions.mats.prob_desc'),
            problemImg: material_intelligence,
            highlights: [t('solutions.mats.h1'), t('solutions.mats.h2'), t('solutions.mats.h3')],
        },
        {
            icon: Zap,
            title: t('solutions.safety.title'),
            solutionDesc: t('solutions.safety.desc'),
            solves: t('solutions.safety.solves'),
            problemDesc: t('solutions.safety.prob_desc'),
            problemImg: process_safety_and_interlocks,
            highlights: [t('solutions.safety.h1'), t('solutions.safety.h2'), t('solutions.safety.h3')],
        },
        {
            icon: Layers,
            title: t('solutions.connectivity.title'),
            solutionDesc: t('solutions.connectivity.desc'),
            solves: t('solutions.connectivity.solves'),
            problemDesc: t('solutions.connectivity.prob_desc'),
            problemImg: open_connectivity,
            highlights: [t('solutions.connectivity.h1'), t('solutions.connectivity.h2'), t('solutions.connectivity.h3')],
        },
        {
            icon: Database,
            title: t('solutions.trace.title'),
            solutionDesc: t('solutions.trace.desc'),
            solves: t('solutions.trace.solves'),
            problemDesc: t('solutions.trace.prob_desc'),
            problemImg: trace_and_as_built,
            highlights: [t('solutions.trace.h1'), t('solutions.trace.h2'), t('solutions.trace.h3')],
        },
    ];
    return (
        <section className="py-24 relative overflow-hidden bg-[#030213]">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[800px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                        <span>{t('solutions.badge')}</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                        {t('solutions.title_prefix', 'Built to')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            {t('solutions.title_highlight', 'Solve')}
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                        {t('solutions.subtitle')}
                    </p>
                </div>

                <div className="space-y-32">
                    {solutions.map((item, index) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>
                            {/* Solution Module (The Feature) */}
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] shrink-0">
                                            <item.icon className="h-7 w-7 text-cyan-400" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white">{item.title}</h3>
                                    </div>
                                    <p className="text-lg text-slate-300 leading-relaxed">{item.solutionDesc}</p>
                                </div>

                                <ul className="space-y-3">
                                    {item.highlights.map((highlight, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-400">
                                            <CheckCircle2 className="h-6 w-6 text-cyan-500 shrink-0" />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Problem Module (What it solves) */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 1 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="w-full lg:w-1/2">
                                <div className="relative rounded-2xl p-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl overflow-hidden group">
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="bg-slate-950 rounded-xl overflow-hidden">
                                        <div className="relative aspect-video">
                                            <div className="absolute top-4 left-4 z-10 bg-green-500/10 border border-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                                <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">{t('solutions.problem_solved')}</span>
                                            </div>
                                            <img
                                                src={item.problemImg}
                                                alt={item.solves}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 mix-blend-screen"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                                        </div>

                                        <div className="p-4 relative -mt-16">
                                            <h4 className="text-xl text-slate-300 mb-1 drop-shadow-lg">{item.problemDesc}</h4>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
