import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    highlights?: string[];
    delay?: number;
    backgroundImage?: string;
}

export function FeatureCard({ icon: Icon, title, description, highlights, delay = 0, backgroundImage }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group relative bg-slate-800/40 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
            {backgroundImage && (
                <div
                    className="absolute inset-0 rounded-xl bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(3px)',
                        zIndex: -1,
                    }}
                />
            )}

            {/* Content Overlay */}
            <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg flex-shrink-0 border border-cyan-500/20">
                    <Icon className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="space-y-3 flex-1">
                    <h3 className="text-xl text-white">{title}</h3>
                    <p className="text-slate-300">{description}</p>
                    {highlights && highlights.length > 0 && (
                        <ul className="space-y-2">
                            {highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
