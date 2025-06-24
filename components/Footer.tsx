"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Heart, Coffee, MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Logo } from './ui/Logo';

// Data is co-located but could be moved to a constants file.
const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/branddos', color: 'from-pink-500 to-purple-600', handle: '@branddos' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/branddos', color: 'from-blue-400 to-blue-600', handle: '@branddos' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/branddos', color: 'from-blue-600 to-blue-800', handle: '/company/branddos' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/branddos', color: 'from-red-500 to-red-600', handle: '/branddos' }
];

const footerLinks = {
    Services: [
        { name: 'Content Strategy', href: '/services/content-strategy' },
        { name: 'Social Media Management', href: '/services/management' },
        { name: 'Brand Development', href: '/services/branding' },
        { name: 'Analytics & Reporting', href: '/services/analytics' }
    ],
    Company: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' }
    ],
    Support: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
    ]
};

const Footer: React.FC = () => {
    const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
    
    return (
        <footer className="relative bg-stone-50 text-gray-800 overflow-hidden border-t border-stone-200">
            <div className="absolute inset-0 opacity-5 -z-10">
                <div className="absolute top-10 left-10 w-32 h-32 border-2 border-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 border-2 border-blue-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-purple-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6 md:col-span-2 lg:col-span-1">
                        <Logo />
                        <p className="text-gray-600 leading-relaxed">
                            We help businesses grow their online presence with <span className="text-emerald-600 font-semibold">authentic content</span> and genuine community building.
                        </p>
                        <div className="flex items-center space-x-2 text-gray-500">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                            <span>and</span>
                            <Coffee className="w-4 h-4 text-amber-600" />
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 tracking-wide">{title}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 flex items-center group">
                                            <span>{link.name}</span>
                                            <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl border border-emerald-100">
                    <div className="group flex items-start space-x-4 hover:transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><MapPin className="w-6 h-6 text-white" /></div>
                        <div>
                            <div className="font-bold text-gray-800">Visit Our Studio</div>
                            <div className="text-gray-600">123 Creative District<br/>Innovation City, IC 12345</div>
                        </div>
                    </div>
                    <div className="group flex items-start space-x-4 hover:transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><Phone className="w-6 h-6 text-white" /></div>
                        <div>
                            <div className="font-bold text-gray-800">Call Us</div>
                            <div className="text-gray-600">+1 (555) 123-BRAND</div>
                        </div>
                    </div>
                    <div className="group flex items-start space-x-4 hover:transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><Mail className="w-6 h-6 text-white" /></div>
                        <div>
                            <div className="font-bold text-gray-800">Email Us</div>
                            <div className="text-gray-600">hello@branddos.com</div>
                        </div>
                    </div>
                </div>
        
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">Follow Our <span className="text-emerald-600">Journey</span></h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="relative group" onMouseEnter={() => setHoveredSocial(social.name)} onMouseLeave={() => setHoveredSocial(null)}>
                                    <div className={`w-full p-6 bg-gradient-to-r ${social.color} rounded-2xl transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shadow-lg`}>
                                        <div className="flex items-center justify-between">
                                            <IconComponent className="w-6 h-6 text-white" />
                                            <ArrowUpRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                        </div>
                                        <div className="mt-3">
                                            <div className="text-white font-bold">{social.name}</div>
                                            <div className="text-white/80 text-sm">{social.handle}</div>
                                        </div>
                                    </div>
                                    {hoveredSocial === social.name && (<div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-10 animate-fade-in-up" style={{animationDuration: '0.2s'}}>Follow us on {social.name}</div>)}
                                </a>);
                            })}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">Stay <span className="text-emerald-600">Updated</span></h3>
                        <p className="text-gray-600">Get weekly tips, industry insights, and exclusive content straight to your inbox.</p>
                        <form className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 w-full" required />
                            <button type="submit" className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">Subscribe</button>
                        </form>
                        <p className="text-xs text-gray-500">No spam, unsubscribe anytime. We respect your privacy.</p>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        <div className="text-gray-500 text-sm text-center lg:text-left">
                            © {new Date().getFullYear()} Brand Dos. All rights reserved. 
                            <span className="text-emerald-600 ml-2 font-semibold">Built to inspire.</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                            <Link href="/privacy" className="text-gray-500 hover:text-emerald-600 transition-colors duration-300">Privacy</Link>
                            <Link href="/terms" className="text-gray-500 hover:text-emerald-600 transition-colors duration-300">Terms</Link>
                            <div className="flex items-center space-x-2 text-gray-500">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>All systems operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-500 via-purple-500 to-pink-500"></div>
        </footer>
    );
};

export default Footer;