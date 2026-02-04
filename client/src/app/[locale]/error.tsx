'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('App Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-gray-50 rounded-3xl m-4 border border-gray-200">
            <h2 className="text-2xl font-bold text-ely-blue mb-4">Oups ! Quelque chose s'est mal passé.</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                Une erreur inattendue est survenue. Nous nous excusons pour la gêne occasionnée.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-ely-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-ely-blue/90 transition-colors"
                >
                    Réessayer
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                    Rafraîchir la page
                </button>
            </div>
        </div>
    );
}
