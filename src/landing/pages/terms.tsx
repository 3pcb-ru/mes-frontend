export function TermsPage() {
    return (
        <main className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">Terms of Service</h1>

            <div className="space-y-8 text-slate-300">
                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing or using GRVT MES, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under
                        your account.
                    </p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
                    <p>The service and its original content, features, and functionality are and will remain the exclusive property of GRVT MES and its licensors.</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                    <p>
                        In no event shall GRVT MES, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special,
                        consequential or punitive damages.
                    </p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">5. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our
                        sole discretion.
                    </p>
                </section>

                <p className="text-sm text-slate-500 text-center pt-8">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </main>
    );
}
