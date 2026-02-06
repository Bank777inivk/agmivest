export default function DashboardLoading() {
    return (
        <div className="w-full space-y-8 animate-pulse">
            <header className="flex flex-col gap-1">
                <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-48 bg-gray-100 rounded-lg mt-2"></div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-64 bg-gray-50 rounded-[3rem]"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-50 rounded-[2rem]"></div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-96 bg-gray-50 rounded-[2.5rem]"></div>
                <div className="h-96 bg-gray-50 rounded-[2.5rem]"></div>
            </div>
        </div>
    );
}
