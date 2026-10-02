import { Loader2 } from 'lucide-react';
import React from 'react';

/**
 * Full-page loading indicator rendered during auth bootstrap and any route
 * transition that depends on the {@code user.initialized} flag.
 */
const LoadingScreen: React.FC = () => {
    return (
        <div
            role="status"
            aria-live="polite"
            className="min-h-screen flex items-center justify-center bg-slate-50"
        >
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingScreen;
