import heroImage from '../images/heroImage.png';
export default function Home(){
    return (

        // Hero Section
        <main className="h-screen flex flex-1 items-center">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

                {/* Left Content */}
                <div className="m-auto space-y-2 flex flex-col items-center">    
                    <div className="space-y-6 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight md:whitespace-nowrap">Secure & Simple Document Signing</h1>
                        <p className="text-lg font-semibold text-gray-600 max-w-lg">Upload, sign, and manage documents digitally with full audit trails 
                        and enterprise-level security.</p>
                    
                        <ul className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                            <li className="px-6 py-3 text-lg text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"><a href="#">Get Started</a></li>
                            <li className="px-6 py-3 text-lg text-indigo-600 rounded-lg border-indigo-600 border-2 hover:cursor-pointer"><a href="#">Learn More</a></li>
                        </ul>
                    </div>
                </div>
    
                {/* Right Content */}
                <div className="flex justify-center md:justify-end">
                    <img src={heroImage} alt="Document Signing Image" className='w-full max-w-md' />
                </div>
            </div>
        </main>
    );
}