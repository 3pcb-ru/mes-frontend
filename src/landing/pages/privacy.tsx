export function PrivacyPage() {
    return (
        <main className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">Privacy Policy</h1>

            <div className="space-y-8 text-slate-300">
                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include your name,
                        email address, and company information.
                    </p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect GRVT MES and our users.</p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure
                        the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                    </p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">4. Sharing of Information</h2>
                    <p>
                        We do not share your personal information with companies, organizations, or individuals outside of GRVT MES except in the cases described in this policy,
                        such as with your consent or for legal reasons.
                    </p>
                </section>

                <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4">5. Your Right to Access</h2>
                    <p>
                        You have the right to request a copy of the information that we hold about you. If you would like a copy of some or all of your personal information, please
                        email us.
                    </p>
                </section>

                <p className="text-sm text-slate-500 text-center pt-8">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </main>
    );
}
