import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Save, Check, Layers } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { toast } from 'sonner';
import { useVibeStore, VibePage } from '../store/vibe.store';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const AiChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [pageName, setPageName] = useState('');
    const [category, setCategory] = useState<VibePage['category']>('Custom');
    const [step, setStep] = useState<'chat' | 'preview'>('chat');
    const [error, setError] = useState<string | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);

    const { isGenerating, currentLayout, generateLayout, savePage, coolDownUntil } = useVibeStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [secondsLeft, setSecondsLeft] = useState(0);

    // Cool-down Ticker
    useEffect(() => {
        if (!coolDownUntil) return;

        const tick = () => {
            const left = Math.ceil((coolDownUntil - Date.now()) / 1000);
            setSecondsLeft(Math.max(0, left));
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [coolDownUntil]);

    const isCoolingDown = secondsLeft > 0;

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [isGenerating, currentLayout, error]);

    const validatePrompt = (text: string): string | null => {
        if (text.length < 5) return 'Prompt is too short. Please provide a descriptive sentence.';
        if (!text.includes(' ')) return 'Please use a complete sentence, not just single words.';

        // Basic entropy check for repeated characters
        const charCounts: Record<string, number> = {};
        for (const char of text.toLowerCase()) {
            charCounts[char] = (charCounts[char] || 0) + 1;
            if (charCounts[char] > text.length * 0.7 && text.length > 5) {
                return 'Please provide meaningful text, not repetitive characters.';
            }
        }

        return null;
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || isCoolingDown) return;

        const validationError = validatePrompt(prompt);
        if (validationError) {
            setError(validationError);
            toast.error('Validation Failed', { description: validationError });
            return;
        }

        // In a real scenario, we'd fetch actual manifests
        const apiManifest = await (await fetch('/src/API_MANIFEST.json')).json();
        const componentsManifest = await (await fetch('/src/COMPONENTS_MANIFEST.json')).json();

        try {
            setError(null);
            await generateLayout(prompt, apiManifest, componentsManifest);
            setStep('preview');
        } catch (err: any) {
            const message = err.message || 'Architecting failed. Please check your configuration.';

            // Handle Blocking
            if (message.includes('Restricted') || message.includes('failed attempts')) {
                setIsBlocked(true);
            }

            setError(message);

            // Special toast for coolDown
            if (err?.response?.data?.retryAfter) {
                toast.warning('Quota Limit Reached', {
                    description: `AI is resting for ${err.response.data.retryAfter}s. Please wait.`,
                    duration: 5000,
                });
            } else {
                toast.error('Vibe Agent Error', {
                    description: message,
                });
            }
            console.error('Generation failed:', err);
        }
    };

    const handleSave = async () => {
        if (!pageName.trim()) return;
        try {
            await savePage(pageName, category);
            setIsOpen(false);
            setStep('chat');
            setPrompt('');
            setPageName('');
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-brand-primary-end shadow-lg shadow-cyan-500/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 group',
                    isOpen && 'scale-0 opacity-0 pointer-events-none',
                )}>
                <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-20 group-hover:opacity-40 animate-pulse" />
                <Sparkles className="h-6 w-6 relative z-10" />
            </button>

            {/* Chat Dialog */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] flex flex-col">
                        <Card className="flex-1 bg-slate-950 border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />

                            <CardHeader className="border-b border-slate-800/50 flex flex-row items-center justify-between py-4 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-brand-primary-end/20 flex items-center justify-center border border-cyan-500/20">
                                        <Sparkles className="h-4 w-4 text-cyan-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold text-white uppercase tracking-tight">Vibe Agent</CardTitle>
                                        <div className="flex items-center gap-1">
                                            <div
                                                className={cn(
                                                    'h-1.5 w-1.5 rounded-full',
                                                    isBlocked ? 'bg-red-500' : isCoolingDown ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse',
                                                )}
                                            />
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                                {isBlocked ? 'System Locked' : isCoolingDown ? 'CoolDown Active' : 'Protocol Active'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white hover:bg-slate-800/50">
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>

                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 relative z-10" ref={scrollRef}>
                                {isBlocked ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-10">
                                        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                            <X className="h-8 w-8 text-red-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-white font-bold uppercase tracking-wider">Access Restricted</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed max-w-[250px]">
                                                {error || 'Your account access to the AI Agent has been restricted due to multiple invalid requests.'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 w-full text-[10px] text-slate-500 italic">
                                            Security Incident ID: AI-G-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                        </div>
                                    </div>
                                ) : step === 'chat' ? (
                                    <div className="space-y-4">
                                        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl text-xs text-slate-300 antialiased leading-relaxed">
                                            Greetings! I am the **MES Vibe Agent**. Describe the dashboard or monitoring page you'd like to create, and I will architect it using
                                            our premium component library.
                                        </div>

                                        {isCoolingDown && (
                                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-3 transition-all duration-500 animate-in fade-in zoom-in-95">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-wider">
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                        AI CoolDown Active
                                                    </div>
                                                    <span className="text-xs font-mono text-amber-400">{secondsLeft}s</span>
                                                </div>
                                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-amber-500"
                                                        initial={{ width: '100%' }}
                                                        animate={{ width: '0%' }}
                                                        transition={{ duration: secondsLeft, ease: 'linear' }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-tight">
                                                    Protocol limit reached (Free Tier). The agent is recalibrating sensors. Please wait.
                                                </p>
                                            </div>
                                        )}

                                        {isGenerating && (
                                            <div className="flex items-center gap-2 text-cyan-400">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-xs font-medium italic">Architecting layout...</span>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl text-xs text-red-400 antialiased leading-relaxed transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    <p className="font-bold uppercase tracking-tighter">
                                                        {error.includes('quota') || error.includes('limit')
                                                            ? 'Resource Limit'
                                                            : error.includes('demand') || error.includes('unavailable')
                                                              ? 'System Overload'
                                                              : 'Architectural Breach'}
                                                    </p>
                                                </div>
                                                <p className="opacity-90">{error}</p>
                                                {(error.includes('demand') || error.includes('unavailable') || error.includes('quota')) && (
                                                    <p className="mt-2 text-[10px] text-red-400/60 italic uppercase tracking-widest font-bold">
                                                        {error.includes('quota') ? 'Action: System coolDown required' : 'Action: Wait 30s and re-submit protocol'}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
                                            <Check className="h-4 w-4" />
                                            Layout generated successfully!
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Page Name</label>
                                            <Input
                                                value={pageName}
                                                onChange={(e) => setPageName(e.target.value)}
                                                placeholder="e.g. Production Overview"
                                                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-cyan-500/20"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">SideBar Category</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Main', 'Operations', 'Analytics', 'Configuration', 'Custom'].map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setCategory(cat as any)}
                                                        className={cn(
                                                            'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all duration-200 border',
                                                            category === cat
                                                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                                                                : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-300',
                                                        )}>
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="p-4 border-t border-slate-800/50 relative z-10 flex flex-col gap-3">
                                {isBlocked ? (
                                    <Button className="w-full bg-slate-800 text-slate-400 cursor-not-allowed" disabled>
                                        Contact Support to Resume
                                    </Button>
                                ) : step === 'chat' ? (
                                    <div className="w-full flex gap-2">
                                        <Input
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                            placeholder="A page with production charts..."
                                            className="bg-slate-900/50 border-slate-800 text-white focus:ring-cyan-500/20"
                                            disabled={isGenerating}
                                        />
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !prompt.trim()}
                                            className="bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/10">
                                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full flex gap-2">
                                        <Button variant="ghost" onClick={() => setStep('chat')} className="flex-1 text-slate-400 hover:text-white">
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={!pageName.trim()}
                                            className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white gap-2 shadow-lg shadow-emerald-500/10">
                                            <Save className="h-4 w-4" /> Save Page
                                        </Button>
                                    </div>
                                )}
                                <div className="text-[8px] text-slate-700 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                                    <Layers className="h-2 w-2" /> Powered by Gemini
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
