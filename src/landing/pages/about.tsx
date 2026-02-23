import { FeatureCard } from '@/landing/components/feature-card';
import { Package, Zap, Database, Layers } from 'lucide-react';
import { motion } from 'motion/react';

import heroAbout from '@/assets/about.png';
import why1 from '@/assets/why/1_tooManySystems.png';
import why2 from '@/assets/why/2_nobodyTrustNumbers.png';
import why3 from '@/assets/why/3_oneClickAwayFromDisaster.png';
import why4 from '@/assets/why/4_humanTypingFail.png';

const whySection = [
    {
        img: why1,
        title: 'Too many disconnected systems',
        text: 'Multiple spreadsheets and point tools create friction and hidden costs. GRVT consolidates data and automates material flows so teams stop hunting for reels and start producing.',
    },
    {
        img: why2,
        title: 'Nobody trusts the numbers',
        text: 'Phantom inventory and manual counts erode planning accuracy. UID scanning, automated counters and real-time stock updates restore confidence in your numbers.',
    },
    {
        img: why3,
        title: 'One click away from disaster',
        text: 'Without traceability, recalls and audits are expensive and slow. As-built genealogy and quick exports put you in control during incidents.',
    },
    {
        img: why4,
        title: 'Human typing failures',
        text: 'Manual data entry causes avoidable errors. Feeder verification, interlocks and simple scan workflows reduce mistakes at the source.',
    },
];

export function AboutPage() {
    return (
        <main className="pt-28 pb-20">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">About GRVT MES</h1>
                    <p className="mt-2 text-lg text-slate-300">
                        The Digital Foundry: architecting a <strong>"Light MES"</strong> that brings enterprise-grade electronics manufacturing controls to Small and Medium
                        Enterprises. We combine domain-first data models (MSL, reels, UIDs), open standards (IPC-CFX, Hermes), and a modular SaaS delivery model so high-mix,
                        low-volume shops can digitize fast — without the enterprise price tag.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <a href="/contact" className="inline-block px-5 py-3 rounded-lg bg-cyan-500 text-white font-medium shadow">
                            Schedule a demo
                        </a>
                        <a href="/docs/whitepaper.pdf" className="inline-block px-5 py-3 rounded-lg border border-slate-700 text-slate-200">
                            Download whitepaper
                        </a>
                    </div>
                </div>

                <div className="relative">
                    <motion.div className="w-full rounded-xl shadow-xl border border-slate-700 overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-800/40">
                        <img src={heroAbout} alt="about illustration" className="w-full h-auto block" />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                        <p className="text-slate-400 text-left">
                            We empower SME electronics manufacturers to operate with the controls, traceability and agility historically available only to large OEMs. Our mission
                            is to replace fragile spreadsheet workflows with a lightweight, purpose-built MES that enforces process safety, protects product quality, and returns
                            time to engineering and operations.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                        <p className="text-slate-400 text-left">
                            A future where every electronics line — from garage-starters to regional EMS — runs confidently on connected, standards-based tools. We envision
                            factories that scale incrementally: start with inventory visibility, add MSL and feeder verification, then safely integrate machines via IPC-CFX for
                            real-time analytics.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-2">Our Values</h3>
                        <p className="text-slate-400 text-left">
                            Practicality: deliver measurable shop-floor value fast. Openness: build on open standards and interoperable APIs. Empathy: design for operators and
                            engineers who need simplicity under pressure. Reliability: treat traceability and safety as first-class features.
                        </p>
                    </div>
                </div>

                <section className="max-w-6xl mx-auto mt-12 text-left px-4 space-y-8">
                    <h2 className="text-2xl font-semibold text-white">Why a "Light MES" for Electronics?</h2>
                    <p className="text-slate-300">
                        SME electronics manufacturers are not served well by monolithic MES or by spreadsheets. The Light MES approach targets the "Excel Gap": delivering rapid
                        deployment, role-specific micro-apps (Receiving, Feeder Setup, Quality), and modular add-ons so shops can start small and scale without rip-and-replace
                        projects.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FeatureCard
                            icon={Package}
                            title="Material Intelligence"
                            description="UID-based reels, MSL and paste lifecycle tracking with label printing and smart storage integration."
                            highlights={['UID/label printing', 'MSL timers & bake guidance', 'Reel genealogy']}
                            delay={0.05}
                        />

                        <FeatureCard
                            icon={Zap}
                            title="Process Safety & Interlocks"
                            description="Feeder setup verification, splice capture, and process interlocks to stop errors at the tool."
                            highlights={['Feeder verification', 'Splice continuity', 'Thaw/bake interlocks']}
                            delay={0.1}
                        />

                        <FeatureCard
                            icon={Database}
                            title="Trace & As-Built"
                            description="As-built genealogy, digital work instructions and audit-ready traceability for regulated sectors."
                            highlights={['As-built trees', 'DWI step capture', 'ISO-ready exports']}
                            delay={0.15}
                        />

                        <FeatureCard
                            icon={Layers}
                            title="Open Connectivity"
                            description="IPC-CFX & Hermes-ready architecture to connect machines, counters and analytics without costly drivers."
                            highlights={['CFX / Hermes', 'Edge-first design', 'Plug-and-play integration']}
                            delay={0.2}
                        />
                    </div>

                    <div className="mt-10 space-y-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Real problems we solve</h3>

                        {whySection.map((item, i) => (
                            <div key={i} className={`flex flex-col md:flex-row items-center gap-6 w-full ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="flex-shrink-0">
                                    <div className="w-full md:w-[500px] h-[312px] rounded-lg overflow-hidden border border-slate-700 shadow-sm bg-black/5">
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                                    <p className="text-slate-300 mt-2">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-700/20 to-slate-800/20 border border-cyan-600/10">
                            <p className="text-3xl font-bold text-white">95%</p>
                            <p className="text-slate-300 text-sm">Reduction in setup errors (typical)</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-700/10 to-slate-800/20 border border-emerald-600/10">
                            <p className="text-3xl font-bold text-white">30%</p>
                            <p className="text-slate-300 text-sm">Faster changeovers</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-700/10 to-slate-800/20 border border-amber-600/10">
                            <p className="text-3xl font-bold text-white">Weeks</p>
                            <p className="text-slate-300 text-sm">Typical phased deployment time</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-white mt-8">Implementation & ROI</h2>
                    <p className="text-slate-300">
                        We recommend a phased rollout: start with the Digital Warehouse (UIDs and smart storage) to eliminate search time and phantom stock, then add Process
                        Interlocks (MSL, feeders) to cut rework, and finally integrate machines for analytics. Compared to traditional MES, Light MES transforms large upfront
                        capital into predictable OpEx and delivers tangible operational savings quickly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <a href="/contact" className="inline-block px-6 py-3 rounded-lg bg-cyan-500 text-white font-medium">
                            Schedule a demo
                        </a>
                        <a href="/docs/whitepaper.pdf" className="inline-block px-6 py-3 rounded-lg border border-slate-700 text-slate-200">
                            Download the whitepaper
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}
