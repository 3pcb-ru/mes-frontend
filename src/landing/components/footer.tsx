import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/components/logo';

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-slate-950 text-slate-400 py-2 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Logo className="h-7 w-7" />
                            <span className="text-xl text-white">GRVT MES</span>
                        </div>
                        <p className="text-sm">{t('footer.tagline')}</p>
                    </div>

                    <div>
                        <h3 className="text-white mb-4">{t('footer.product')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/#why" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.features')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/#solution" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.solution')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/#reliability" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.reliability')}
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.docs')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white mb-4">{t('footer.company')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.about')}
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.blog')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.careers')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.contact')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white mb-4">{t('footer.legal')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.terms')}
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    {t('footer.security')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-2 border-t border-slate-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} GRVT MES. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
}
