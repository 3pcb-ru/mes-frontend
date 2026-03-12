import { ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@/shared/components/ui/button';
import heroMockupImage from '@/assets/hero-mockup.jpeg';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-[#030213]">
            {/* Background glowing orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.8 }} 
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-2">
                            <Activity className="h-4 w-4" />
                            <span>The Next Generation of Manufacturing</span>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                                Ditch the Bloat.
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Take Control.</span>
                            </h1>
                            <p className="text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
                                GRVT MES is a lightweight, cloud-based Manufacturing Execution System built for SMEs that want real production control — without ERP complexity.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-cyan-500" />
                                <span className="text-sm font-medium text-slate-300">Fully ISA-95 Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-purple-500" />
                                <span className="text-sm font-medium text-slate-300">100% ERP-Agnostic</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-0 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all">
                                Launch Your Free MES
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-slate-700 hover:bg-slate-800 hover:text-white rounded-xl backdrop-blur-sm bg-white/5">
                                See the Architecture
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }} 
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }} 
                        transition={{ duration: 0.8, delay: 0.2 }} 
                        style={{ perspective: '1000px' }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/10 rounded-2xl blur-2xl transform scale-105" />
                        <div className="relative p-1 rounded-2xl bg-gradient-to-b from-slate-700/50 to-slate-900/50 backdrop-blur-md border border-white/10 shadow-2xl">
                            <img src={heroMockupImage} alt="Manufacturing Automation" className="rounded-xl w-full h-auto object-cover opacity-90" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#030213] to-transparent rounded-b-xl" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
