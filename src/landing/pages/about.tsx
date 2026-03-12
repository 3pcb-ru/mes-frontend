import { motion } from 'motion/react';
import { Database, Server, Cpu, Globe, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

import heroAbout from '@/assets/about.png';

export function AboutPage() {
    return (
        <main className="min-h-screen bg-[#030213] text-slate-300 selection:bg-cyan-500/30">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background ambient light */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                <span>Beyond Assembly</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                                Where Hardware Meets Its <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Digital Twin</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                                Most manufacturing happens in a "black box"—you send a design, and weeks later, a box arrives. At Dannie, we've broken that box open. We are a global <strong className="text-white font-medium">Electronic Manufacturing Services (EMS)</strong> provider powered by a proprietary MES that treats every atom like a data point.
                            </p>
                            
                            <p className="text-lg text-slate-400 italic">
                                From our hubs in Lithuania, Turkey, and China, we don't just build boards; we generate the digital genealogy of your product.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Futuristic image container */}
                            <div className="relative p-1 rounded-2xl bg-gradient-to-b from-cyan-500/30 to-purple-500/10 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                                <div className="absolute inset-0 bg-slate-950/80 rounded-2xl backdrop-blur-sm -z-10" />
                                <img src={heroAbout} alt="Digital Twin Hardware" className="rounded-xl w-full h-auto object-cover opacity-90 mix-blend-lighten" />
                                
                                {/* Overlay tech elements */}
                                <div className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-lg border border-slate-700/50 flex items-center gap-3">
                                    <Activity className="text-cyan-400 h-5 w-5" />
                                    <span className="text-xs font-mono text-slate-200">REAL-TIME SYNC</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Atom to Cloud Philosophy */}
            <section className="py-24 relative border-t border-slate-800/50 bg-slate-950/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Our North Star: The <span className="text-cyan-400">"Atom to Cloud"</span> Philosophy
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
                            We believe a physical product is only as reliable as the data behind it. Our process is built on a single, unbreakable chain.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-purple-500/0 z-0" />

                        {[
                            {
                                icon: Cpu,
                                step: "01",
                                title: "The Atom",
                                desc: "We track raw materials—solder, components, and substrates—down to the specific lot and timestamp.",
                                color: "from-blue-500/20 to-cyan-500/10",
                                border: "border-cyan-500/30"
                            },
                            {
                                icon: Server,
                                step: "02",
                                title: "The MES (The Brain)",
                                desc: "Our custom-built MES application orchestrates the entire floor. It prevents errors before they happen by enforcing digital 'gates' at every station.",
                                color: "from-purple-500/20 to-indigo-500/10",
                                border: "border-purple-500/30"
                            },
                            {
                                icon: Database,
                                step: "03",
                                title: "The Cloud",
                                desc: "Your product's history is uploaded in real-time. We provide a digital twin for every unit, ensuring 100% traceability for the entire lifecycle.",
                                color: "from-cyan-500/20 to-emerald-500/10",
                                border: "border-emerald-500/30"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className={`relative z-10 p-8 rounded-2xl bg-gradient-to-b ${item.color} backdrop-blur-md border ${item.border} hover:bg-white/5 transition-all duration-300 group`}
                            >
                                <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                    <item.icon className="h-8 w-8 text-slate-200 group-hover:text-white transition-colors" />
                                </div>
                                <div className="absolute top-6 right-6 text-4xl font-black text-white/5 font-mono pointer-events-none">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The MES Advantage */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-12 mb-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:w-1/3"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                                The MES Advantage: <br/><span className="text-slate-500">Why It Matters</span>
                            </h2>
                            <p className="text-lg text-slate-400 font-light pr-4">
                                In an industry where "gut feeling" often replaces "hard data," our MES application acts as the ultimate quality gatekeeper. Here is how it changes the game for your project.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:w-2/3"
                        >
                            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                                <div className="grid grid-cols-3 bg-slate-800/80 p-4 border-b border-slate-700 text-sm font-semibold tracking-wider text-slate-300 uppercase">
                                    <div className="px-4">Feature</div>
                                    <div className="px-4 text-slate-400">The Old Way</div>
                                    <div className="px-4 text-cyan-400">The Dannie Way</div>
                                </div>
                                {[
                                    { f: "Traceability", o: 'Paper logs and "best guesses."', d: "Individual component-level digital genealogy." },
                                    { f: "Error Prevention", o: "Caught during final testing (too late).", d: "Real-time interlocking; the line stops if a step is skipped." },
                                    { f: "Transparency", o: "You wait for a status email.", d: "Real-time data visibility into production yields." },
                                    { f: "Scalability", o: "Human-dependent and prone to fatigue.", d: "System-enforced precision that never sleeps." }
                                ].map((row, i) => (
                                    <div key={i} className="grid grid-cols-3 border-b border-slate-800 last:border-0 p-4 hover:bg-white/5 transition-colors items-center">
                                        <div className="px-4 font-medium text-white">{row.f}</div>
                                        <div className="px-4 text-sm text-slate-500">{row.o}</div>
                                        <div className="px-4 text-sm text-cyan-100 font-medium flex items-start gap-2">
                                            <ShieldCheck className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                                            <span>{row.d}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Quote block */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto mt-12 p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-900/20 to-slate-900/40 border border-cyan-500/20 relative"
                    >
                        <Zap className="absolute -top-4 -left-4 h-8 w-8 text-cyan-400 fill-cyan-400/20" />
                        <blockquote className="text-xl md:text-2xl font-light text-center text-white italic mb-4">
                            "If it isn't in the MES, it didn't happen."
                        </blockquote>
                        <p className="text-center text-slate-400">
                            At Dannie, we've removed human error from the equation by making our MES the final authority on the factory floor.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Global Footprint */}
            <section className="py-24 relative border-t border-slate-800/50 bg-slate-950/30 overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Our Global Footprint</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                            We combine European engineering standards with global logistics to move your project from prototype to mass production.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                country: "Lithuania",
                                city: "Vilnius",
                                desc: "Our high-tech heart. Focused on complex system integration, box builds, and the evolution of our digital infrastructure.",
                                gradient: "from-blue-500/20"
                            },
                            {
                                country: "Turkey",
                                city: "Antalya",
                                desc: "A strategic engineering powerhouse, bridging the gap between design and high-velocity production.",
                                gradient: "from-cyan-500/20"
                            },
                            {
                                country: "China",
                                city: "Shenzhen",
                                desc: "Our boots-on-the-ground for hyper-efficient sourcing and component lifecycle management.",
                                gradient: "from-purple-500/20"
                            }
                        ].map((loc, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`p-8 rounded-2xl bg-gradient-to-br ${loc.gradient} to-transparent border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden`}
                            >
                                <Globe className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 group-hover:text-white/10 transition-colors" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white">{loc.country}</h3>
                                    <p className="text-cyan-400 font-mono text-sm mb-4 tracking-wider uppercase">{loc.city}</p>
                                    <p className="text-slate-400 leading-relaxed font-light">{loc.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision & CTA */}
            <section className="py-32 relative text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            Our Vision
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                            To be the world's most transparent manufacturing partner. We aren't just your factory; we are the <strong className="text-white font-medium">operating system</strong> for your hardware. By leveraging our MES application, we provide our partners with something rarer than components: 
                            <span className="block mt-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Certainty.</span>
                        </p>
                        
                        <div className="pt-12 border-t border-slate-800/50">
                            <h3 className="text-xl font-medium text-white mb-8">Ready for a transparent manufacturing experience?</h3>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 h-14 text-lg">
                                    Explore Our Digital Workflow
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white px-8 h-14 text-lg">
                                    Request a Tech Deep-Dive
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
