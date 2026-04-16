import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, Sparkles, Loader2, Save, Check, Layers, HelpCircle, ShieldAlert, BookOpen } from 'lucide-react';
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
    const [showHelp, setShowHelp] = useState(false);

    const { t } = useTranslation();
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
        if (text.length < 5) return t('dashboard.vibe.agent.labels.validation_too_short', 'Prompt is too short. Please provide a descriptive sentence.');
        if (!text.includes(' ')) return t('dashboard.vibe.agent.labels.validation_no_spaces', 'Please use a complete sentence, not just single words.');

        // Basic entropy check for repeated characters
        const charCounts: Record<string, number> = {};
        for (const char of text.toLowerCase()) {
            charCounts[char] = (charCounts[char] || 0) + 1;
            if (charCounts[char] > text.length * 0.7 && text.length > 5) {
                return t('dashboard.vibe.agent.labels.validation_repetitive', 'Please provide meaningful text, not repetitive characters.');
            }
        }

        return null;
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || isCoolingDown) return;

        const validationError = validatePrompt(prompt);
        if (validationError) {
            setError(validationError);
            toast.error(t('dashboard.vibe.agent.labels.fail_title', 'Validation Failed'), { description: validationError });
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
            const message = err.message || t('dashboard.vibe.agent.labels.fail_desc', 'Architecting failed. Please check your configuration.');

            // Handle Blocking
            if (message.includes('Restricted') || message.includes('failed attempts')) {
                setIsBlocked(true);
            }

            setError(message);

            // Special toast for coolDown
            if (err?.response?.data?.retryAfter) {
                toast.warning(t('dashboard.vibe.agent.labels.resource_limit', 'Resource Limit'), {
                    description: t('dashboard.vibe.agent.labels.cooldown_hint', 'Protocol limit reached (Free Tier). The agent is recalibrating sensors. Please wait.'),
                    duration: 5000,
                });
            } else {
                toast.error(t('dashboard.vibe.agent.labels.fail_title', 'Architectural Breach'), {
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
                id="vibe-agent-toggle-btn"
                title={t('dashboard.vibe.agent.title', 'Vibe Agent')}
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
                                        <CardTitle className="text-sm font-bold text-white uppercase tracking-tight">{t('dashboard.vibe.agent.title', 'Vibe Agent')}</CardTitle>
                                        <div className="flex items-center gap-1">
                                            <div
                                                className={cn(
                                                    'h-1.5 w-1.5 rounded-full',
                                                    isBlocked ? 'bg-red-500' : isCoolingDown ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse',
                                                )}
                                            />
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                                {isBlocked
                                                    ? t('dashboard.vibe.agent.status.locked', 'System Locked')
                                                    : isCoolingDown
                                                      ? t('dashboard.vibe.agent.status.cooldown', 'CoolDown Active')
                                                      : t('dashboard.vibe.agent.status.active', 'Protocol Active')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        id="vibe-agent-help-btn"
                                        title={t('dashboard.vibe.agent.guide.title', 'Protocol Guide')}
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowHelp(!showHelp)}
                                        className={cn('h-8 w-8 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10', showHelp && 'text-cyan-400 bg-cyan-500/10')}>
                                        <HelpCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        id="vibe-agent-close-btn"
                                        title={t('common.actions.close', 'Close')}
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="text-slate-500 hover:text-white hover:bg-slate-800/50">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 relative z-10" ref={scrollRef}>
                                <AnimatePresence mode="wait">
                                    {showHelp ? (
                                        <motion.div
                                            key="help"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6 pt-2">
                                            <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-3">
                                                <BookOpen className="h-4 w-4" />
                                                <h3 className="text-xs font-bold uppercase tracking-widest">{t('dashboard.vibe.agent.guide.title', 'Protocol Guide')}</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <section className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                                        <ShieldAlert className="h-3 w-3 text-red-500" />
                                                        {t('dashboard.vibe.agent.guide.policy_title', 'Security Policy (No-Code)')}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                                        {t(
                                                            'dashboard.vibe.agent.guide.policy_desc',
                                                            'The agent is an **Architect**, not a coder. It generates layout configurations, not raw software logic.',
                                                        )}
                                                    </p>
                                                    <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-4">
                                                        <li>{t('dashboard.vibe.agent.guide.policy_list_1', 'Avoid technical terms: `script`, `function`, `eval`.')}</li>
                                                        <li>{t('dashboard.vibe.agent.guide.policy_list_2', 'Do not request raw `.env`, `.sh`, or `.js` file contents.')}</li>
                                                        <li>{t('dashboard.vibe.agent.guide.policy_list_3', 'The agent will refuse to generate executable logic for safety.')}</li>
                                                    </ul>
                                                </section>

                                                <section className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                                        <Sparkles className="h-3 w-3 text-cyan-500" />
                                                        {t('dashboard.vibe.agent.guide.prompting_title', 'Refined Prompting')}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                                        {t('dashboard.vibe.agent.guide.prompting_desc', 'Focus on **intent** and **visuals**. Use descriptive sentences like:')}
                                                    </p>
                                                    <div className="bg-slate-900 p-2 rounded-lg text-[9px] font-mono text-cyan-400/80 border border-slate-800 italic">
                                                        {t(
                                                            'dashboard.vibe.agent.guide.prompting_example',
                                                            '"Create a production monitor with a bar chart for yields and a table for active work orders."',
                                                        )}
                                                    </div>
                                                </section>

                                                <section className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                                        <Layers className="h-3 w-3 text-emerald-500" />
                                                        {t('dashboard.vibe.agent.guide.manifest_title', 'Manifest Limitation')}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                                        {t(
                                                            'dashboard.vibe.agent.guide.manifest_desc',
                                                            'The agent can only use components predefined in the system manifest. It cannot invent new React components on the fly.',
                                                        )}
                                                    </p>
                                                </section>
                                            </div>

                                            <Button
                                                id="vibe-agent-return-chat-btn"
                                                title={t('dashboard.vibe.agent.actions.return_to_chat', 'Return to Protocol Chat')}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowHelp(false)}
                                                className="w-full h-8 text-[10px] uppercase font-bold border-slate-800 hover:bg-slate-900 text-slate-500 hover:text-white">
                                                {t('dashboard.vibe.agent.actions.return_to_chat', 'Return to Protocol Chat')}
                                            </Button>
                                        </motion.div>
                                    ) : isBlocked ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-10">
                                            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                                <X className="h-8 w-8 text-red-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-white font-bold uppercase tracking-wider">{t('dashboard.vibe.agent.labels.fail_title', 'Architectural Breach')}</h3>
                                                <p className="text-xs text-slate-400 leading-relaxed max-w-[250px]">
                                                    {error || t('dashboard.vibe.agent.labels.fail_desc', 'Architecting failed. Please check your configuration.')}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 w-full text-[10px] text-slate-500 italic">
                                                Security Incident ID: AI-G-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                            </div>
                                        </div>
                                    ) : step === 'chat' ? (
                                        <div className="space-y-4">
                                            <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl text-xs text-slate-300 antialiased leading-relaxed">
                                                {t('dashboard.vibe.agent.description', 'Greetings! I am the **MES Vibe Agent**. Describe the dashboard or monitoring page you\'d like to create, and I will architect it using our premium component library.')}
                                            </div>

                                            {isCoolingDown && (
                                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-3 transition-all duration-500 animate-in fade-in zoom-in-95">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-wider">
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                            {t('dashboard.vibe.agent.status.cooldown', 'CoolDown Active')}
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
                                                        {t('dashboard.vibe.agent.labels.cooldown_hint', 'Protocol limit reached (Free Tier). The agent is recalibrating sensors. Please wait.')}
                                                    </p>
                                                </div>
                                            )}

                                            {isGenerating && (
                                                <div className="flex items-center gap-2 text-cyan-400">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="text-xs font-medium italic">{t('dashboard.vibe.agent.labels.architecting', 'Architecting layout...')}</span>
                                                </div>
                                            )}

                                            {error && (
                                                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl text-xs text-red-400 antialiased leading-relaxed transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        <p className="font-bold uppercase tracking-tighter">
                                                            {error.includes('quota') || error.includes('limit')
                                                                ? t('dashboard.vibe.agent.labels.resource_limit', 'Resource Limit')
                                                                : error.includes('demand') || error.includes('unavailable')
                                                                  ? t('dashboard.vibe.agent.labels.system_overload', 'System Overload')
                                                                  : t('dashboard.vibe.agent.labels.fail_title', 'Architectural Breach')}
                                                        </p>
                                                    </div>
                                                    <p className="opacity-90">{error}</p>
                                                    <p className="mt-2 text-[10px] text-red-400/60 italic uppercase tracking-widest font-bold">
                                                        {error.includes('quota') 
                                                            ? t('dashboard.vibe.agent.labels.cooldown_hint', 'Action: System coolDown required') 
                                                            : t('dashboard.vibe.agent.labels.retry_hint', 'Action: Wait 30s and re-submit protocol')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
                                                <Check className="h-4 w-4" />
                                                {t('dashboard.vibe.agent.labels.success', 'Layout generated successfully!')}
                                            </div>

                                            <div className="space-y-3">
                                                <label id="vibe-page-name-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{t('dashboard.vibe.agent.labels.page_name', 'Page Name')}</label>
                                                <Input
                                                    id="vibe-page-name-input"
                                                    title={t('dashboard.vibe.agent.placeholders.page_name', 'e.g. Production Overview')}
                                                    value={pageName}
                                                    onChange={(e) => setPageName(e.target.value)}
                                                    placeholder={t('dashboard.vibe.agent.placeholders.page_name', 'e.g. Production Overview')}
                                                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-cyan-500/20"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label id="vibe-sidebar-category-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{t('dashboard.vibe.agent.labels.sidebar_category', 'SideBar Category')}</label>
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
                                </AnimatePresence>
                            </CardContent>

                            <CardFooter className="p-4 border-t border-slate-800/50 relative z-10 flex flex-col gap-3">
                                {isBlocked ? (
                                    <Button id="vibe-agent-restricted-btn" className="w-full bg-slate-800 text-slate-400 cursor-not-allowed" disabled>
                                        {t('dashboard.vibe.agent.actions.contact_support', 'Contact Support to Resume')}
                                    </Button>
                                ) : step === 'chat' ? (
                                    <div className="w-full flex gap-2">
                                        <Input
                                            id="vibe-agent-prompt-input"
                                            title={t('dashboard.vibe.agent.placeholders.prompt', 'A page with production charts...')}
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                            placeholder={t('dashboard.vibe.agent.placeholders.prompt', 'A page with production charts...')}
                                            className="bg-slate-900/50 border-slate-800 text-white focus:ring-cyan-500/20"
                                            disabled={isGenerating}
                                        />
                                        <Button
                                            id="vibe-agent-send-btn"
                                            title={t('common.actions.search', 'Search')}
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !prompt.trim()}
                                            className="bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/10">
                                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                 ) : (
                                     <div className="w-full flex gap-2">
                                         <Button id="vibe-agent-back-btn" variant="ghost" onClick={() => setStep('chat')} className="flex-1 text-slate-400 hover:text-white">
                                             {t('dashboard.vibe.agent.actions.back', 'Back')}
                                         </Button>
                                         <Button
                                             id="vibe-agent-save-btn"
                                             title={t('dashboard.vibe.agent.actions.save_page', 'Save Page')}
                                             onClick={handleSave}
                                             disabled={!pageName.trim()}
                                             className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white gap-2 shadow-lg shadow-emerald-500/10">
                                             <Save className="h-4 w-4" /> {t('dashboard.vibe.agent.actions.save_page', 'Save Page')}
                                         </Button>
                                     </div>
                                 )}
                                <div className="text-[8px] text-slate-700 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                                    <Layers className="h-2 w-2" /> {t('dashboard.vibe.agent.labels.powered_by', 'Powered by Gemini')}
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
