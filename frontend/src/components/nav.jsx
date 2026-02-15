export default function Nav(){
    return (
        <header className="w-full backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-2 md:px-12">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-2xl font-bold text-indigo-600">SignFlow</h1>
                    <div className="space-x-4 font-semibold">   
                        <a href="#" className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300">Login</a>
                        <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700  transition-colors duration-300">Register</a>
                    </div>
                </div>
            </div>
        </header>
    );
}