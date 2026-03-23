import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Check, Shield, Server, Key, RefreshCw } from 'lucide-react';

interface SurvivabilityCardProps {
    icon: React.ElementType;
    title: string;
    standard: string;
    benefit: string;
    delay: number;
}

function SurvivabilityCard({ icon: Icon, title, standard, benefit, delay }: SurvivabilityCardProps) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-lg flex-shrink-0 border border-cyan-500/20">
                    <Icon className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-xl text-white mb-2">{title}</h3>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-sm text-cyan-400 mb-2">{t('phases.what_we_do', "What We Do")}</h4>
                    <p className="text-slate-300 text-sm">{standard}</p>
                </div>

                <div>
                    <h4 className="text-sm text-cyan-400 mb-2">{t('phases.awesome_because', "It's Awesome Because")}</h4>
                    <p className="text-slate-300 text-sm">{benefit}</p>
                </div>
            </div>
        </motion.div>
    );
}

export function PhasesSection() {
    const { t } = useTranslation();
    const controlPoints = [
        {
            icon: Shield,
            title: t('phases.c1.title'),
            standard: t('phases.c1.std'),
            benefit: t('phases.c1.ben'),
        },
        {
            icon: Server,
            title: t('phases.c2.title'),
            standard: t('phases.c2.std'),
            benefit: t('phases.c2.ben'),
        },
        {
            icon: Key,
            title: t('phases.c3.title'),
            standard: t('phases.c3.std'),
            benefit: t('phases.c3.ben'),
        },
        {
            icon: RefreshCw,
            title: t('phases.c4.title'),
            standard: t('phases.c4.std'),
            benefit: t('phases.c4.ben'),
        },
    ];

    return (
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">{t('phases.title')}</h2>
                    <p className="text-xl text-cyan-400 max-w-3xl mx-auto">{t('phases.subtitle')}</p>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                        <strong className="text-white">{t('phases.big_idea')}</strong> {t('phases.big_idea_desc')}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 max-w-7xl mx-auto">
                    {controlPoints.map((point, index) => (
                        <SurvivabilityCard key={point.title} icon={point.icon} title={point.title} standard={point.standard} benefit={point.benefit} delay={index * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
