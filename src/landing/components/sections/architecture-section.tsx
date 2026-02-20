import { motion } from 'motion/react';
import { FeatureCard } from '../feature-card';
import { Shield, GitBranch, FolderTree, Clock } from 'lucide-react';

export function ArchitectureSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">How GRVT MES Fixes This</h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                        We've built smart guardrails into the system so you can't accidentally make these mistakes. Think of it as manufacturing with training wheels — except the
                        wheels never come off because they're actually brilliant architecture.
                    </p>
                </div>

                {/* Core Principles */}
                <div className="mb-16">
                    <h3 className="text-2xl text-white text-center mb-8">The Four Rules That Keep Everything Working</h3>
                    <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
                        <FeatureCard
                            icon={Shield}
                            title="Office Software Shouldn't Touch Machines"
                            description="Your finance and HR software should never control factory equipment. That's how accidents happen. We keep them safely apart."
                            highlights={['Office tools stay in the office', 'Machines stay under factory control', 'Less risk, fewer shutdowns']}
                            delay={0}
                        />

                        <FeatureCard
                            icon={GitBranch}
                            title="One Middleman, Not a Mess of Wires"
                            description="Instead of every system talking to every other system, everything talks to one place. Like customer support—one number to call."
                            highlights={['All systems connect in one clean way', 'New software plugs in easily', 'No hidden connections']}
                            delay={0.1}
                        />

                        <FeatureCard
                            icon={FolderTree}
                            title="One Version of the Truth"
                            description="Each piece of information has one owner. One place to check. One correct answer."
                            highlights={['Product designs come from engineering', 'Orders and costs come from finance', 'Production results come from the factory']}
                            delay={0.2}
                        />

                        <FeatureCard
                            icon={Clock}
                            title="Everything Happens at a Known Time"
                            description="Every action is recorded with a clear timestamp. No guessing. No arguments."
                            highlights={['See what happened first and what happened next', 'Clear history for audits and reports', 'No confusion across shifts or locations']}
                            delay={0.3}
                        />
                    </div>
                </div>

                {/* Resilient Transaction Engine */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-cyan-500/30">
                        <h3 className="text-2xl text-white mb-2">How We Keep Office Numbers and Factory Reality Aligned</h3>
                        <p className="text-lg text-slate-300 mb-8">GRVT MES makes sure what you see in the system matches what actually happened on the floor.</p>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-3">
                                <div className="h-12 w-12 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <span className="text-2xl">🔑</span>
                                </div>
                                <h4 className="text-lg text-white">No Counting Things Twice</h4>
                                <p className="text-slate-300 text-sm">Every movement is recorded once and only once. Even if the network glitches, your numbers stay correct.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="h-12 w-12 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <h4 className="text-lg text-white">Smooth Updates, No System Slowdowns</h4>
                                <p className="text-slate-300 text-sm">
                                    We send updates in calm, organized chunks instead of flooding your ERP. Everything stays fast and responsive.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="h-12 w-12 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <span className="text-2xl">🔄</span>
                                </div>
                                <h4 className="text-lg text-white">Nothing Gets Lost</h4>
                                <p className="text-slate-300 text-sm">
                                    If something can not sync right away, we safely hold onto it and send it later. No lost data. No surprises.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
