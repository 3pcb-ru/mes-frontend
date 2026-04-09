import { useTranslation } from 'react-i18next';
import { SEO } from '@/shared/components/seo';

export function TermsPage() {
    const { t, i18n } = useTranslation();

    return (
        <main className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
            <SEO 
                title={t('seo.terms_title')} 
                description={t('seo.terms_description')} 
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">{t('legal.terms.title')}</h1>

            <div className="space-y-8 text-slate-300">
                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.terms.s1_title')}</h2>
                    <p>{t('legal.terms.s1_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.terms.s2_title')}</h2>
                    <p>{t('legal.terms.s2_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.terms.s3_title')}</h2>
                    <p>{t('legal.terms.s3_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.terms.s4_title')}</h2>
                    <p>{t('legal.terms.s4_content')}</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('legal.terms.s5_title')}</h2>
                    <p>{t('legal.terms.s5_content')}</p>
                </section>

                <p className="text-sm text-slate-500 text-center pt-8">
                    {t('legal.terms.last_updated')}: {new Date().toLocaleDateString(i18n.language, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </main>
    );
}
