import { motion } from 'motion/react';
import { Package, Zap, Database, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { FeatureCard } from '../feature-card';

// Asset imports from old about page
import why1 from '@/assets/why/1_tooManySystems.png';
import why2 from '@/assets/why/2_nobodyTrustNumbers.png';
import why3 from '@/assets/why/3_oneClickAwayFromDisaster.png';
import why4 from '@/assets/why/4_humanTypingFail.png';

const solutions = [
    {
        icon: Package,
        title: "Material Intelligence",
        solutionDesc: "UID-based reels, MSL, and paste lifecycle tracking with label printing and smart storage integration.",
        solves: "Nobody trusts the numbers",
        problemDesc: "Phantom inventory and manual counts erode planning. We restore confidence with real-time stock updates.",
        problemImg: why2,
        highlights: ['UID/label printing', 'MSL timers & bake guidance', 'Reel genealogy']
    },
    {
        icon: Zap,
        title: "Process Safety & Interlocks",
        solutionDesc: "Feeder setup verification, splice capture, and process interlocks to stop errors at the tool.",
        solves: "Human typing failures",
        problemDesc: "Manual data entry causes avoidable errors. We reduce mistakes at the source.",
        problemImg: why4,
        highlights: ['Feeder verification', 'Splice continuity', 'Thaw/bake interlocks']
    },
    {
        icon: Layers,
        title: "Open Connectivity",
        solutionDesc: "IPC-CFX & Hermes-ready architecture to connect machines, counters, and analytics without costly drivers.",
        solves: "Too many disconnected systems",
        problemDesc: "Multiple spreadsheets and point tools create friction. We consolidate data and automate material flows.",
        problemImg: why1,
        highlights: ['CFX / Hermes', 'Edge-first design', 'Plug-and-play integration']
    },
    {
        icon: Database,
        title: "Trace & As-Built",
        solutionDesc: "As-built genealogy, digital work instructions, and audit-ready traceability for regulated sectors.",
        solves: "One click away from disaster",
        problemDesc: "Without traceability, recalls and audits are expensive. As-built genealogy puts you in control.",
        problemImg: why3,
        highlights: ['As-built trees', 'DWI step capture', 'ISO-ready exports']
    }
];

export function SolutionsSection() {
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
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4"
                    >
                        <span>The "Light MES" Approach</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                        Built to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Solve</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                        SME electronics manufacturers are not served well by monolithic MES or by spreadsheets. We target the "Excel Gap" by delivering rapid, role-specific solutions that directly eliminate your biggest chaotic problems.
                    </p>
                </div>

                <div className="space-y-32">
                    {solutions.map((item, index) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>
                            {/* Solution Module (The Feature) */}
                            <motion.div 
                                initial={{ opacity: 0, x: index % 2 === 1 ? 40 : -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="w-full lg:w-1/2 space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-6">
                                        <item.icon className="h-7 w-7 text-cyan-400" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white">{item.title}</h3>
                                    <p className="text-lg text-slate-300 leading-relaxed">
                                        {item.solutionDesc}
                                    </p>
                                </div>

                                <ul className="space-y-3">
                                    {item.highlights.map((highlight, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-400">
                                            <CheckCircle2 className="h-5 w-5 text-cyan-500 shrink-0" />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Problem Module (What it solves) */}
                            <motion.div 
                                initial={{ opacity: 0, x: index % 2 === 1 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="w-full lg:w-1/2"
                            >
                                <div className="relative rounded-2xl p-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl overflow-hidden group">
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="bg-slate-950 rounded-xl overflow-hidden">
                                        <div className="relative aspect-video">
                                            <div className="absolute top-4 left-4 z-10 bg-rose-500/10 border border-rose-500/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                                                <XCircle className="h-4 w-4 text-rose-400" />
                                                <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Problem Solved</span>
                                            </div>
                                            <img src={item.problemImg} alt={item.solves} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 mix-blend-screen" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                                        </div>
                                        
                                        <div className="p-8 relative -mt-16">
                                            <h4 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">{item.solves}</h4>
                                            <p className="text-slate-400 leading-relaxed">
                                                {item.problemDesc}
                                            </p>
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
