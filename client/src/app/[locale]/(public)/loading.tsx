export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-ely-blue/20 border-t-ely-blue rounded-full animate-spin mb-4"></div>
            <p className="text-ely-blue font-medium animate-pulse">Chargement en cours...</p>
        </div>
    );
}
