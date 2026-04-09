import { useTranslation } from 'react-i18next';
import { SEO } from '@/shared/components/seo';

export function PrivacyPage() {
    const { t, i18n } = useTranslation();

    return (
        <main className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
            <SEO 
                title={t('seo.privacy_title')} 
                description={t('seo.privacy_description')} 
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">{t('legal.privacy.title')}</h1>

            <div className="space-y-8 text-slate-300">
                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.privacy.s1_title')}</h2>
                    <p>{t('legal.privacy.s1_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.privacy.s2_title')}</h2>
                    <p>{t('legal.privacy.s2_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.privacy.s3_title')}</h2>
                    <p>{t('legal.privacy.s3_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.privacy.s4_title')}</h2>
                    <p>{t('legal.privacy.s4_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.privacy.s5_title')}</h2>
                    <p>{t('legal.privacy.s5_content')}</p>
                </section>

                <p className="text-sm text-slate-500 text-center pt-8">
                    {t('legal.privacy.last_updated')}: {new Date().toLocaleDateString(i18n.language, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </main>
    );
}
