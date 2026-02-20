import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@/shared/components/ui/button';
import heroMockupImage from '@/assets/hero-mockup.jpeg';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-white">
                                Ditch the Bloat.
                                <br />
                                <span className="text-cyan-400">Get Manufacturing Control.</span>
                            </h1>
                            <p className="text-xl text-slate-300 max-w-2xl">
                                GRVT MES is a lightweight, cloud-based Manufacturing Execution System built for SMEs that want real production control — without ERP complexity.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-slate-200">Start running real production in days, not months.</p>
                            <p className="text-sm text-slate-400">Fully ISA-95 compliant. 100% ERP-agnostic.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="text-lg bg-cyan-500 hover:bg-cyan-600 text-white border-0">
                                Launch Your Free MES Core
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg border-slate-600 hover:bg-slate-800 hover:text-white font-medium">
                                See the API & Architecture
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
                        <img src={heroMockupImage} alt="Manufacturing Automation" className="rounded-2xl shadow-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/30 to-transparent rounded-2xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
