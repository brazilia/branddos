"use client";

import React, { useState, useRef } from 'react';
import { ArrowUpRight, Play, Sparkles, Users, Star, Eye } from 'lucide-react';
import CountUp from 'react-countup';
import { AnimatedSection } from './ui/AnimatedSection';

export default function HeroSection() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    // ... any other state for your video player

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Ultra-Performant CSS Background using classes now defined in globals.css */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute top-1/4 left-[15%] w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl animate-float"
                    style={{ animationDelay: '0s' }}
                ></div>
                <div 
                    className="absolute top-1/2 right-[15%] w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-float"
                    style={{ animationDelay: '1s' }}
                ></div>
                <div 
                    className="absolute bottom-[20%] left-[30%] w-56 h-56 bg-purple-300/10 rounded-full blur-3xl animate-float"
                    style={{ animationDelay: '2s' }}
                ></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                {/* 
                    AnimatedSection handles its own reveal, then the headline animates in.
                    This uses the .animate-fade-in-up class we defined in globals.css 
                */}
                <AnimatedSection className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
                        <span className="block animate-fade-in-up" style={{ animationDelay: '100ms' }}>Social Media</span>
                        <span 
                            className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-[length:200%_auto] animate-gradient animate-fade-in-up" 
                            style={{ animationDelay: '200ms' }}
                        >
                            Made Beautiful
                        </span>
                    </h1>

                    <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        We help ambitious brands grow their online presence with <span className="font-bold text-emerald-600">authentic content</span> and genuine community building. No stress, just results.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <button className="group relative text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-500">
                            <span className="relative z-10 flex items-center">Start Your Journey <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                        </button>
                        <button onClick={() => setIsVideoPlaying(true)} className="group flex items-center justify-center space-x-3 text-gray-700 hover:text-emerald-600 font-semibold text-lg transition-colors">
                            <div className="w-14 h-14 border-2 border-gray-300 group-hover:border-emerald-400 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:scale-110">
                                <Play className="w-5 h-5 ml-0.5" />
                            </div>
                            <span>Watch Intro</span>
                        </button>
                    </div>
                </AnimatedSection>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24 mt-12 max-w-5xl mx-auto">
                    {[
                        { icon: <Users className="w-6 h-6" />, label: "Happy Clients", value: 500, suffix: '+' },
                        { icon: <Star className="w-6 h-6" />, label: "Satisfaction", value: 95, suffix: '%' },
                        { icon: <Eye className="w-6 h-6" />, label: "Posts Created", value: 2, suffix: 'M+' }
                    ].map((stat, i) => (
                        <AnimatedSection key={stat.label} delay={i * 150} className="bg-white/40 backdrop-blur-md p-6 rounded-2xl text-center border border-white/50 shadow-sm">
                            <div className="text-4xl font-bold text-emerald-600 mb-2 flex items-center justify-center space-x-2">
                                <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} enableScrollSpy scrollSpyDelay={200} />
                            </div>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
            {/* Add your Video Modal JSX here, controlled by isVideoPlaying state */}
        </section>
    );
}