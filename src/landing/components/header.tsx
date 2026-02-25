import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/logo';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { to: '/#why', label: 'Why GRVT' },
        { to: '/#solution', label: 'Solution' },
        { to: '/#reliability', label: 'Reliability' },
        { to: '/about', label: 'About' },
    ];

    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo className="h-8 w-8" />
                        <span className="text-xl text-white">GRVT MES</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/login">
                            <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-800 hover:text-white font-medium">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                                Get Started
                            </Button>
                        </Link>
                    </nav>

                    {/* Mobile menu toggle */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-300 hover:text-white transition-colors" aria-label="Toggle menu">
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile nav panel */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-base text-slate-300 hover:text-cyan-400 transition-colors py-2 border-b border-slate-800">
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-3 pt-3">
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full border-slate-600 hover:bg-slate-800 hover:text-white font-medium">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">Get Started</Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
