export function AboutPage() {
    return (
        <main className="pt-32 pb-20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">About GRVT MES</h1>
            <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                Revolutionizing agile manufacturing for SMEs with lightweight, ISA-95 compliant solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4 mt-20">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                    <p className="text-slate-400">To democratize industrial automation technology.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                    <p className="text-slate-400">A future where every factory is connected and efficient.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-2">Our Values</h3>
                    <p className="text-slate-400">Integrity, Innovation, and Interoperability.</p>
                </div>
            </div>
        </main>
    );
}
