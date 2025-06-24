import { Users, Target, Sparkles, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { AnimatedSection } from '../ui/AnimatedSection';

const processSteps = [
  { step: "01", title: "Discovery & Vision", description: "We dive deep into your brand, audience, and goals. It all starts with a great conversation.", icon: <Users /> },
  { step: "02", title: "Strategy & Planning", description: "A tailored roadmap is crafted, detailing content pillars, platforms, and key metrics for success.", icon: <Target /> },
  { step: "03", title: "Creative Production", description: "Our team gets to work, creating stunning and engaging content that tells your brand's story.", icon: <Sparkles /> },
  { step: "04", title: "Growth & Iteration", description: "We launch, monitor, and optimize your campaigns, providing transparent reports along the way.", icon: <TrendingUp /> }
];

const ProcessSection = () => {
    return (
        <AnimatedSection as="section" className="py-32 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-5xl lg:text-6xl font-black mb-6 text-gray-900">
                        Our Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Success</span>
                    </h2>
                    <p className="text-xl max-w-3xl mx-auto text-gray-600">
                        A transparent and collaborative four-step process designed for clarity and outstanding results.
                    </p>
                </div>

                <div className="relative">
                    {/* The animated SVG connector line */}
                    <div className="hidden lg:block absolute top-12 left-1/2 -translate-x-1/2 w-px h-[calc(100%-6rem)]">
                        <svg width="2" height="100%" className="animate-draw-line" style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }}>
                            <line x1="1" y1="0" x2="1" y2="100%" stroke="url(#line-gradient)" strokeWidth="2" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="100%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="space-y-16">
                        {processSteps.map((step, i) => (
                            <AnimatedSection key={step.step} delay={i * 200}>
                                <div className={`lg:flex items-center justify-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                                    <div className="lg:w-1/2 p-8 text-center lg:text-left">
                                        <div className={`inline-block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500 mb-4`}>{step.step}</div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                        <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                                    </div>

                                    <div className="lg:w-1/2 flex justify-center p-8 relative">
                                        <div className={`absolute inset-0 bg-gradient-to-tr from-emerald-100 to-blue-100 blur-3xl opacity-50`}></div>
                                        <div className="relative w-48 h-48 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-emerald-500 shadow-xl border border-white">
                                            <span className="text-5xl">{step.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};

export default ProcessSection;