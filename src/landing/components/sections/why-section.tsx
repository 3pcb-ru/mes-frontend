import { FeatureCard } from '../feature-card';
import { AlertTriangle, Network, ShieldAlert, Database } from 'lucide-react';

export function WhySection() {
    return (
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">Why MES Systems Get Messy</h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">If this sounds familiar, you are not alone.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={Network}
                        title="Too Many Systems, Nothing Talks"
                        description="Every new tool creates more chaos. One change breaks three others."
                        highlights={['Integrations grow out of control', 'Simple changes cause unexpected failures', 'No clear system ownership']}
                    />

                    <FeatureCard
                        icon={AlertTriangle}
                        title="Nobody Trusts the Numbers"
                        description="Every system shows different data. Meetings turn into arguments."
                        highlights={['Inventory never matches reality', 'Reports contradict each other', 'Decisions are based on guesses']}
                        delay={0.1}
                    />

                    <FeatureCard
                        icon={ShieldAlert}
                        title="Your Factory Is One Click Away From Disaster"
                        description="Office IT and production machines share the same network."
                        highlights={['One virus can stop production', 'No isolation between systems', 'Security is an afterthought']}
                        delay={0.2}
                    />

                    <FeatureCard
                        icon={Database}
                        title="Humans Typing Data Always Fails"
                        description="Manual input means errors, delays, and lost money."
                        highlights={['Wrong units, wrong values', 'Typos reach production', 'Audits expose data gaps']}
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}
