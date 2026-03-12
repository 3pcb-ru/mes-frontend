import { cn } from './ui/utils';

export function Logo({ className }: { className?: string }) {
    return (
        <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-8 w-8', className)}>
            <rect x="75" y="30" width="22" height="84" rx="11" fill="#30B4C4" />
            <rect x="117" y="14" width="22" height="84" rx="11" fill="#30B4C4" />
            <rect x="159" y="30" width="22" height="84" rx="11" fill="#30B4C4" />

            <g fill="#30B4C4">
                <clipPath id="outer-circle">
                    <circle cx="128" cy="182" r="64" />
                </clipPath>
                <mask id="g-mask">
                    <rect x="0" y="0" width="256" height="256" fill="white" />
                    <circle cx="128" cy="182" r="42" fill="black" />
                    <rect x="144" y="0" width="112" height="171" fill="black" />
                </mask>

                <circle cx="128" cy="182" r="64" mask="url(#g-mask)" />
                <rect x="128" y="171" width="66" height="22" clipPath="url(#outer-circle)" />
            </g>
        </svg>
    );
}
