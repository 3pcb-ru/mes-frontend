import { Link } from 'react-router-dom';
import { Logo } from '@/shared/components/logo';

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-2 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Logo className="h-7 w-7" />
                            <span className="text-xl text-white">GRVT MES</span>
                        </div>
                        <p className="text-sm">Lightweight manufacturing execution system built for SMEs.</p>
                    </div>

                    <div>
                        <h3 className="text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/#why" className="hover:text-cyan-400 transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="/#solution" className="hover:text-cyan-400 transition-colors">
                                    Solution
                                </Link>
                            </li>
                            <li>
                                <Link to="/#reliability" className="hover:text-cyan-400 transition-colors">
                                    Reliability
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Documentation
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-2 border-t border-slate-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} GRVT MES. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
