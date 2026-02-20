import { cn } from './ui/utils';

export function Logo({ className }: { className?: string }) {
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-8 w-8', className)}>
            <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22d3ee" /> {/* cyan-400 */}
                    <stop offset="1" stopColor="#0891b2" /> {/* cyan-600 */}
                </linearGradient>
            </defs>

            {/* Hexagon Shape (Technical/Industrial) */}
            <path d="M32 4L58 18V46L32 60L6 46V18L32 4Z" fill="url(#logoGrad)" />

            {/* Stylized G / Flow Line */}
            <path
                d="M44 24C44 20 40 16 32 16C24 16 20 20 20 28V36C20 44 24 48 32 48C40 48 44 44 44 38V32H32"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Top Node (Agile/Cloud connection) */}
            <circle cx="32" cy="16" r="4" fill="white" />
        </svg>
    );
}
