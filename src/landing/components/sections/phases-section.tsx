import { motion } from 'motion/react';
import { Check, Shield, Server, Key, RefreshCw } from 'lucide-react';

interface SurvivabilityCardProps {
    icon: React.ElementType;
    title: string;
    standard: string;
    benefit: string;
    delay: number;
}

function SurvivabilityCard({ icon: Icon, title, standard, benefit, delay }: SurvivabilityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-lg flex-shrink-0 border border-cyan-500/20">
                    <Icon className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-xl text-white mb-2">{title}</h3>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-sm text-cyan-400 mb-2">What We Do</h4>
                    <p className="text-slate-300 text-sm">{standard}</p>
                </div>

                <div>
                    <h4 className="text-sm text-cyan-400 mb-2">Why It's Awesome for You</h4>
                    <p className="text-slate-300 text-sm">{benefit}</p>
                </div>
            </div>
        </motion.div>
    );
}

export function PhasesSection() {
    const controlPoints = [
        {
            icon: Shield,
            title: 'Keep Office and Factory Apart',
            standard: 'Office computers and factory machines should not live on the same network. We keep them safely separated.',
            benefit: 'If someone clicks a bad email, production keeps running. Machines stay safe.',
        },
        {
            icon: Server,
            title: 'A Safe Middle Stop',
            standard: 'Information doesn’t go straight from the office to the factory. It passes through a safe checkpoint first.',
            benefit: 'Only clean, approved data reaches your machines. Bad stuff gets blocked.',
        },
        {
            icon: Key,
            title: 'Vendor Access Only When Needed',
            standard: 'Vendors get temporary access, only during scheduled work. It turns off automatically.',
            benefit: 'No forgotten logins. No hidden back doors. Just controlled access.',
        },
        {
            icon: RefreshCw,
            title: 'Daily System Checkups',
            standard: 'Every day we compare office numbers with factory results and save backups.',
            benefit: 'Problems show up early. Fix them before they become expensive.',
        },
    ];

    return (
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">Your Factory Keeps Running</h2>
                    <p className="text-xl text-cyan-400 max-w-3xl mx-auto">Even When Office Systems Go Down</p>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                        <strong className="text-white">The Big Idea:</strong> If your ERP system goes offline (server crash, network outage, ransomware attack), your factory floor
                        should keep producing for at least 24 hours. Here\'s how we make that happen:
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 max-w-7xl mx-auto">
                    {controlPoints.map((point, index) => (
                        <SurvivabilityCard key={point.title} icon={point.icon} title={point.title} standard={point.standard} benefit={point.benefit} delay={index * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
