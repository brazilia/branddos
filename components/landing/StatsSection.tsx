"use client";

import { Users, Star, Eye, Zap } from 'lucide-react';
import CountUp from 'react-countup';
import { AnimatedSection } from '../ui/AnimatedSection';

const stats = [
    { value: 500, suffix: '+', label: "Happy Clients", icon: <Users className="w-7 h-7" /> },
    { value: 95, suffix: '%', label: "Client Satisfaction", icon: <Star className="w-7 h-7" /> },
    { value: 2, suffix: 'M+', label: "Content Created", icon: <Eye className="w-7 h-7" /> },
    { value: 24, suffix: '/7', label: "Support", icon: <Zap className="w-7 h-7" /> }
];

const StatsSection = () => {
    return (
        // 1. Matched Background Color
        <section className="py-24 sm:py-32 px-6 bg-[#FCFBF7]">
            <AnimatedSection className="max-w-7xl mx-auto">
                <div className="text-center mb-16 sm:mb-20">
                    {/* 3. Correct Typography */}
                    <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                        Numbers That <span className="text-yellow-500">Speak</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                        We believe in transparency and results. Our success is measured by the success of our partners.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <AnimatedSection 
                            key={stat.label} 
                            delay={i * 100}
                            className="group"
                        >
                            {/* 4. Soft "Lift" on Hover */}
                            <div className="text-center p-8 transition-all duration-300 rounded-3xl group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-gray-200/50 group-hover:-translate-y-2">
                                
                                {/* 2. Subtle "Pressed" Icon Effect */}
                                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-[#f7f5ef] shadow-[inset_4px_4px_8px_#e8e6e1,inset_-4px_-4px_8px_#ffffff]">
                                    <div className="text-gray-500 group-hover:text-yellow-500 transition-colors duration-300">
                                      {stat.icon}
                                    </div>
                                </div>
                                
                                {/* 5. Readable Stats Typography */}
                                <div className="text-5xl lg:text-6xl font-bold text-gray-700">
                                    <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyDelay={200} />
                                    <span className="text-4xl align-super -ml-1 text-gray-500">{stat.suffix}</span>
                                </div>
                                <p className="mt-2 text-lg text-gray-500">{stat.label}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </AnimatedSection>
        </section>
    );
};

export default StatsSection;