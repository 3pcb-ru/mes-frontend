import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'motion/react';

export function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 relative overflow-hidden">
            {/* Additional gradient overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-8 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">Ready to Control Your Factory Floor?</h2>
                    <p className="text-xl text-cyan-100">
                        Launch GRVT MES Core in minutes.
                        <br />
                        No contracts. No ERP required.
                    </p>
                    <div>
                        <Button size="lg" variant="secondary" className="text-lg bg-white text-blue-700 hover:bg-slate-50 shadow-xl shadow-blue-900/50">
                            Get Started Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
