"use client";

import React, { useState, useRef } from 'react';
import { ArrowUpRight, Zap, Eye, Users, Star, Play, Volume2, VolumeX, Sparkles, X } from 'lucide-react';

// Data specific to this section is co-located for easy management.
const stats = [
    { number: "500+", label: "Happy Clients", icon: <Users className="w-6 h-6" />, color: "text-emerald-600" },
    { number: "95%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" />, color: "text-blue-600" },
    { number: "2M+", label: "Content Created", icon: <Eye className="w-6 h-6" />, color: "text-purple-600" },
];

const HeroSection = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleVideo = () => {
        setIsVideoPlaying(!isVideoPlaying);
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <>
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', animationDelay: '2s' }}></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden z-0">
                    <div className="absolute top-20 left-20 w-4 h-4 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-40 right-32 w-3 h-3 bg-blue-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-32 left-40 w-5 h-5 bg-purple-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-20 right-20 w-3 h-3 bg-pink-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="space-y-8 max-w-5xl mx-auto">
                        
                        <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full shadow-lg border backdrop-blur-sm hover:scale-105 transition-all duration-300" style={{ backgroundColor: 'rgba(254, 252, 232, 0.9)', borderColor: '#d6d3d1' }}>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-sm tracking-wide text-gray-700">
                                Trusted by 500+ businesses worldwide
                            </span>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black leading-tight tracking-tight">
                            <span className="block text-gray-900">Social Media</span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-gradient" style={{ backgroundSize: '400% 400%' }}>
                                Made Beautiful
                            </span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto text-gray-600">
                            We help businesses grow their online presence with <span className="font-bold text-emerald-600">authentic content</span> and genuine community building. No stress, just beautiful results.
                        </p>
                        
                        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center pt-8">
                            <button className="group relative text-white px-12 py-5 rounded-3xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-500">
                                <span className="relative z-10 flex items-center space-x-3">
                                    <Sparkles className="w-5 h-5" />
                                    <span>Start Your Journey</span>
                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                            </button>
                            
                            <button onClick={toggleVideo} aria-label="Play video" className="group flex items-center space-x-4 transition-colors duration-300 hover:text-emerald-600 text-gray-600">
                                <div className="w-16 h-16 border-2 border-gray-300 group-hover:border-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-lg">
                                    <Play className="w-6 h-6 ml-1" />
                                </div>
                                <span className="font-semibold text-lg">See Our Magic</span>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-stone-50/80 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-500 border border-stone-200/50 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                                            <div className={stat.color}>{stat.icon}</div>
                                        </div>
                                        <div className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.number}</div>
                                        <div className="text-gray-600 font-semibold">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-8 h-12 border-2 border-emerald-400 rounded-full flex justify-center bg-stone-100/30 backdrop-blur-sm">
                        <div className="w-1.5 h-4 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {isVideoPlaying && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    <div className="relative max-w-4xl w-full">
                        <video ref={videoRef} className="w-full rounded-3xl shadow-2xl" controls autoPlay muted={isMuted} onEnded={() => setIsVideoPlaying(false)}>
                            <source src="/api/placeholder/1280/720" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button onClick={toggleVideo} aria-label="Close video player" className="absolute -top-3 -right-3 sm:top-4 sm:right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <button onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"} className="absolute bottom-4 right-4 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeroSection;
