import { Rocket, Sparkles, ArrowUpRight } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';

const FinalCtaSection = () => {
    return (
        <AnimatedSection as="section" className="py-32 px-6 relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 opacity-50 z-0"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold text-sm mb-8 shadow-lg">
                    <Rocket className="w-4 h-4" />
                    <span>Ready to Launch?</span>
                </div>
                
                <h2 className="text-6xl lg:text-7xl font-black leading-tight mb-8 text-gray-900">
                    <span className="block">Ready to</span>
                    <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Get Started?
                    </span>
                </h2>
                
                <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-gray-600">
                    Let's have a conversation about your goals and see how we can help your business grow beautifully online. No obligations, just possibilities.
                </p>
                
                <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                    <button className="group text-white px-16 py-5 rounded-3xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-600">
                        <span className="relative z-10 flex items-center space-x-3">
                            <Sparkles className="w-5 h-5" />
                            <span>Start Your Project</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                    </button>
                    
                    <button className="group border-2 border-stone-300 hover:border-emerald-500 px-16 py-5 rounded-3xl font-bold text-lg transition-all duration-300 hover:shadow-lg text-stone-700 hover:text-emerald-600 bg-white">
                        <span className="flex items-center space-x-3">
                            <span>Schedule a Chat</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </span>
                    </button>
                </div>
                
                <div className="mt-16 text-gray-500">
                    <p className="text-lg">
                        Join <span className="font-bold text-emerald-600">500+ businesses</span> growing beautifully with Brand Dos.
                    </p>
                </div>
            </div>
        </AnimatedSection>
    );
};

export default FinalCtaSection;