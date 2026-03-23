import { useTranslation } from 'react-i18next';
import { FeatureCard } from '../feature-card';
import { AlertTriangle, Network, ShieldAlert, Database } from 'lucide-react';

export function WhySection() {
    const { t } = useTranslation();
    return (
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">{t('why.title')}</h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">{t('why.subtitle')}</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={Network}
                        title={t('why.card_1.title')}
                        description={t('why.card_1.desc')}
                        highlights={[t('why.card_1.h1'), t('why.card_1.h2'), t('why.card_1.h3')]}
                    />

                    <FeatureCard
                        icon={AlertTriangle}
                        title={t('why.card_2.title')}
                        description={t('why.card_2.desc')}
                        highlights={[t('why.card_2.h1'), t('why.card_2.h2'), t('why.card_2.h3')]}
                        delay={0.1}
                    />

                    <FeatureCard
                        icon={ShieldAlert}
                        title={t('why.card_3.title')}
                        description={t('why.card_3.desc')}
                        highlights={[t('why.card_3.h1'), t('why.card_3.h2'), t('why.card_3.h3')]}
                        delay={0.2}
                    />

                    <FeatureCard
                        icon={Database}
                        title={t('why.card_4.title')}
                        description={t('why.card_4.desc')}
                        highlights={[t('why.card_4.h1'), t('why.card_4.h2'), t('why.card_4.h3')]}
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}
