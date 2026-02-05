import { Link } from "@/i18n/routing";
import { ComponentType } from "react";

interface PrefetchLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    prefetch?: boolean;
}

/**
 * Optimized Link component with aggressive prefetching
 */
export default function PrefetchLink({
    href,
    children,
    className = "",
    prefetch = true
}: PrefetchLinkProps) {
    return (
        <Link
            href={href}
            className={className}
            prefetch={prefetch}
            onMouseEnter={() => {
                // Additional prefetch trigger on hover for instant navigation
                if (prefetch && typeof window !== 'undefined') {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                }
            }}
        >
            {children}
        </Link>
    );
}
