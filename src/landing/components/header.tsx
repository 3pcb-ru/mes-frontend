import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/logo';

export function Header() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo className="h-8 w-8" />
                        <span className="text-xl text-white">GRVT MES</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/#why" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                            Why GRVT
                        </Link>
                        <Link to="/#solution" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                            Solution
                        </Link>
                        <Link to="/#reliability" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                            Reliability
                        </Link>
                        <Link to="/about" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                            About
                        </Link>
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
                </div>
            </div>
        </header>
    );
}
