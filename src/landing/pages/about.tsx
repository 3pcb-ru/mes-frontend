import { motion } from 'motion/react';
import { Globe, Target, Eye, Users, ArrowRight, MapPin, Lightbulb, Heart, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const teamMembers = [
    {
        name: 'Dannie CEO',
        role: 'Chief Executive Officer',
        description: 'Visionary leader driving Dannie\'s mission to bring transparency and precision to global electronics manufacturing.',
        initials: 'DC',
        color: 'from-cyan-500/30 to-blue-600/20',
    },
    {
        name: 'Operations Lead',
        role: 'Head of Operations',
        description: 'Orchestrates our three-hub global manufacturing network, ensuring seamless production from prototype to mass delivery.',
        initials: 'OL',
        color: 'from-purple-500/30 to-indigo-600/20',
    },
    {
        name: 'Engineering Director',
        role: 'Director of Engineering',
        description: 'Leads our cross-functional engineering squads across Lithuania, Turkey, and China with a relentless focus on quality.',
        initials: 'ED',
        color: 'from-emerald-500/30 to-teal-600/20',
    },
    {
        name: 'Innovation Lead',
        role: 'Head of Digital Innovation',
        description: 'Drives the digital transformation and technology partnerships that keep Dannie at the forefront of smart manufacturing.',
        initials: 'IL',
        color: 'from-amber-500/30 to-orange-600/20',
    },
];

const values = [
    { icon: Lightbulb, title: 'Transparency', desc: 'We believe every stakeholder deserves full visibility into what happens on our floor.' },
    { icon: Zap, title: 'Precision', desc: 'We hold ourselves to zero-defect standards—not as a goal, but as a baseline expectation.' },
    { icon: Heart, title: 'Partnership', desc: 'We treat our customers as co-builders. Your product roadmap is our roadmap.' },
    { icon: Globe, title: 'Globalness', desc: 'Rooted in Europe, scaled globally. We bring the best of every region to every build.' },
];

export function AboutPage() {
    return (
        <main className="min-h-screen bg-[#030213] text-slate-300 selection:bg-cyan-500/30">

            {/* ─── HERO: Who We Are ─── */}
            <section className="relative pt-36 pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-cyan-900/20 blur-[130px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            Who We Are
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
                            We Are{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                                Dannie
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                            A global <strong className="text-white font-medium">Electronic Manufacturing Services (EMS)</strong> company with roots in Europe and a presence across three continents.
                            We don't just build electronics — we build the confidence behind every unit we ship.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 pt-4">
                            {[
                                { icon: MapPin, label: 'Lithuania' },
                                { icon: MapPin, label: 'Turkey' },
                                { icon: MapPin, label: 'China' },
                            ].map((loc, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm">
                                    <loc.icon className="h-4 w-4 text-cyan-400" />
                                    {loc.label}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── WHAT WE DO ─── */}
            <section className="py-24 border-t border-slate-800/40 bg-slate-950/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                                What We Do
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                From Design File to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Finished Product.</span>
                            </h2>
                            <p className="text-lg text-slate-400 font-light leading-relaxed">
                                Dannie provides end-to-end electronics manufacturing services — from PCB assembly and component sourcing to full system integration and box builds.
                                We operate high-precision production lines in Vilnius, Antalya, and China, each specialised for different phases of your product journey.
                            </p>
                            <p className="text-lg text-slate-400 font-light leading-relaxed">
                                Whether you're launching a first prototype or scaling to tens of thousands of units, we deliver with the same standard: <strong className="text-white">full traceability, zero surprises.</strong>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { label: 'PCB Assembly', detail: 'SMT & through-hole, high-mix production' },
                                { label: 'System Integration', detail: 'Box builds, cabling, firmware flashing' },
                                { label: 'Component Sourcing', detail: 'Global supply chain, lifecycle managed' },
                                { label: 'Quality Control', detail: 'AOI, X-ray, ICT, and functional testing' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/8 hover:border-cyan-500/30 hover:bg-white/8 transition-all group"
                                >
                                    <h4 className="font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">{item.label}</h4>
                                    <p className="text-sm text-slate-500 font-light">{item.detail}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── OUR GOAL & VISION ─── */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/10 blur-[130px] rounded-full pointer-events-none" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 blur-[130px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                            Our Goal &amp; Vision
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            What Drives Us Forward
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 space-y-4"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-6">
                                <Target className="h-6 w-6 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Our Goal</h3>
                            <p className="text-slate-400 font-light leading-relaxed text-lg">
                                To become the world's most <strong className="text-white font-medium">reliable and transparent</strong> manufacturing partner for hardware companies — removing uncertainty from the supply chain, one build at a time.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className="p-10 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20 space-y-4"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-6">
                                <Eye className="h-6 w-6 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                            <p className="text-slate-400 font-light leading-relaxed text-lg">
                                A future where every hardware company — from a two-person startup to a global OEM — can build with <strong className="text-white font-medium">Certainty.</strong> We're building the operating system for your hardware's life.
                            </p>
                        </motion.div>
                    </div>

                    {/* Values */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-white/4 border border-white/8 hover:border-white/15 hover:bg-white/6 transition-all text-center group"
                            >
                                <v.icon className="h-8 w-8 text-slate-400 group-hover:text-cyan-400 transition-colors mx-auto mb-4" />
                                <h4 className="font-semibold text-white mb-2">{v.title}</h4>
                                <p className="text-sm text-slate-500 font-light leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── OUR TEAM ─── */}
            <section className="py-24 border-t border-slate-800/40 bg-slate-950/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
                            <Users className="h-4 w-4" />
                            Our Team
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            The People Behind Every Build
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                            A cross-continental team of engineers, operators, and innovators — united by a single obsession: quality.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className={`p-8 rounded-3xl bg-gradient-to-br ${member.color} to-transparent border border-white/8 hover:border-white/15 transition-all group`}
                            >
                                <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 text-white font-bold text-lg tracking-wider group-hover:scale-105 transition-transform">
                                    {member.initials}
                                </div>
                                <h4 className="font-bold text-white text-lg mb-1">{member.name}</h4>
                                <p className="text-cyan-400 text-sm font-medium mb-4 tracking-wide">{member.role}</p>
                                <p className="text-slate-500 text-sm font-light leading-relaxed">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-32 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-900/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-4 max-w-3xl relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            Ready to Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">with Certainty?</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-light">
                            Let's talk about your project. Our team is ready to take it from schematic to shipment.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-10 h-14 text-lg rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all">
                                Start Your Project
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-slate-600 bg-transparent hover:bg-slate-800 text-white hover:text-white px-10 h-14 text-lg rounded-2xl">
                                Talk to Our Team
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
