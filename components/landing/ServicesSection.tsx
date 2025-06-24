import { Eye, Target, Users, Sparkles, ArrowUpRight } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';

const services = [
    {
        icon: <Eye className="w-10 h-10" />,
        title: "Content That Connects",
        description: "We create authentic content that resonates with your audience, sparking conversations and building genuine community.",
        gradient: 'from-emerald-400 to-teal-500',
    },
    {
        icon: <Target className="w-10 h-10" />,
        title: "Growth Strategy",
        description: "A data-driven plan to grow your brand organically. No rushing, no pressure—just steady, sustainable expansion.",
        gradient: 'from-blue-400 to-indigo-500',
    },
    {
        icon: <Users className="w-10 h-10" />,
        title: "Community Building",
        description: "Turn followers into a loyal tribe. We help you create meaningful connections that foster loyalty and advocacy.",
        gradient: 'from-purple-400 to-pink-500',
    }
];

const ServicesSection = () => (
    <AnimatedSection as="section" id="services" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-sm mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>Our Superpowers</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black mb-6 text-gray-900">
                    A Full-Service Social Studio
                </h2>
                <p className="text-xl max-w-3xl mx-auto text-gray-600">
                    From strategy to content creation, we provide everything your brand needs to thrive online.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, i) => (
                    <AnimatedSection 
                        key={service.title} 
                        delay={i * 150}
                        className="group relative p-8 bg-white rounded-3xl border border-gray-200/80 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10"
                    >
                        {/* Subtle glow effect on hover */}
                        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-emerald-400 to-transparent"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex-shrink-0">
                                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                            </div>
                            <div className="mt-auto pt-4">
                                <a href="#" className="inline-block text-emerald-600 border-2 border-emerald-500/50 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white rounded-full px-6 py-2 font-semibold transition-all duration-300">
                                    <span className="flex items-center">
                                        Learn More <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </span>
                                </a>
                            </div>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </div>
    </AnimatedSection>
);

export default ServicesSection;