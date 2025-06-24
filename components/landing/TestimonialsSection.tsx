"use client";

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { AnimatedSection } from '../ui/AnimatedSection';

const testimonials = [
  { name: "Alex Rivera", business: "Neon Nights Club", text: "Brand Dos helped us grow our social media presence naturally. We saw steady growth and genuine engagement from our community.", avatar: "/avatars/alex.png", rating: 5 },
  { name: "Maya Chen", business: "Street Food Empire", text: "Working with Brand Dos feels like having a partner who truly gets our brand. They've made social media enjoyable and effective for us.", avatar: "/avatars/maya.png", rating: 5 },
  { name: "Jordan Brooks", business: "Fitness Revolution", text: "They took the stress out of content creation. Now we focus on what we love while they handle the social media magic.", avatar: "/avatars/jordan.png", rating: 5 }
];

const TestimonialsSection = () => {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent(c => (c === testimonials.length - 1 ? 0 : c + 1));
    const prev = () => setCurrent(c => (c === 0 ? testimonials.length - 1 : c - 1));

    // Optional: Add auto-play back
    useEffect(() => {
        const timer = setTimeout(next, 7000);
        return () => clearTimeout(timer);
    }, [current]);

    return (
        <AnimatedSection as="section" className="py-32 px-6 bg-slate-50">
            <div className="max-w-4xl mx-auto text-center">
                 <h2 className="text-5xl lg:text-6xl font-black mb-16 text-gray-900">
                    Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Ambitious Brands</span>
                </h2>

                <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl shadow-slate-500/10 border border-gray-100">
                    <div className="p-8 sm:p-12 transition-transform ease-out duration-500">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className={`transition-all duration-500 ease-in-out ${i === current ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                                 <div className="flex justify-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-2xl font-medium text-gray-800 leading-snug">
                                    "{testimonial.text}"
                                </blockquote>
                                <div className="mt-8 flex items-center justify-center space-x-4">
                                    <Image 
                                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${testimonial.name}`} // Using Dicebear for placeholder avatars
                                        alt={testimonial.name}
                                        width={56}
                                        height={56}
                                        className="rounded-full bg-slate-200 border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{testimonial.name}</p>
                                        <p className="text-emerald-600 font-medium">{testimonial.business}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md">
                        <ChevronLeft />
                    </button>
                    <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md">
                        <ChevronRight />
                    </button>
                    
                    {/* Bottom dots */}
                    <div className="absolute bottom-6 left-0 right-0">
                        <div className="flex items-center justify-center gap-2">
                            {testimonials.map((_, i) => (
                                <div key={i} className={`transition-all w-2 h-2 bg-slate-300 rounded-full ${current === i ? "p-1.5 bg-slate-600" : "bg-opacity-50"}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};

export default TestimonialsSection;