'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, Users, BookOpen, Award, Clock } from 'lucide-react'

export default function AboutPage() {
    const { ref: inViewRef, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section with Video Background */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/hero-home.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Transforming Education Through Technology
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90">
                        Empowering learners worldwide with innovative online education
                    </p>
                </div>
            </section>

            {/* Interactive Stats Section */}
            <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: <Users className="w-8 h-8" />, number: '10,000+', label: 'Active Students' },
                            { icon: <BookOpen className="w-8 h-8" />, number: '200+', label: 'Courses' },
                            { icon: <Award className="w-8 h-8" />, number: '50+', label: 'Expert Instructors' },
                            { icon: <Clock className="w-8 h-8" />, number: '24/7', label: 'Support' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center text-white p-6 rounded-lg backdrop-blur-lg bg-white/10"
                            >
                                <div className="mb-4 inline-block p-3 rounded-full bg-white/20">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                                <div className="text-blue-200">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section with 3D Card Effect */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        ref={inViewRef as any}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={fadeIn}
                        className="group perspective"
                    >
                        <div className="relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-12">
                            <div className="grid md:grid-cols-2 gap-12 items-center bg-white p-8 rounded-2xl shadow-xl">
                                <div>
                                    <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                        Our Mission
                                    </h2>
                                    <p className="text-gray-800 leading-relaxed text-2xl">
                                        We are dedicated to revolutionizing online education through cutting-edge
                                        technology and expert instruction. Our platform combines innovation with
                                        accessibility to create an unparalleled learning experience.
                                    </p>
                                </div>
                                <div className="relative h-[400px] rounded-xl overflow-hidden">
                                    <Image
                                        src="/mission-image.jpg"
                                        alt="Our Mission"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section with Hover Effects */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Meet Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {[
                            {
                                name: 'Nguyen Le Hoang Son',
                                role: 'Fullstack Developer',
                                image: '/son.png',
                            },
                            {
                                name: 'Do Cong Ton Sach',
                                role: 'Frontend Developer',
                                image: '/sach.png',
                            },
                            {
                                name: 'Nguyen Nhat Hao',
                                role: 'Information System Engineer',
                                image: '/hao.png',
                            }
                        ].map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative w-48 h-48 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse group-hover:opacity-100 opacity-0 transition-opacity" />
                                    <div className="absolute inset-1 rounded-full overflow-hidden bg-white">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                                <p className="text-gray-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section with Gradient Animation */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x" />
                <div className="relative container mx-auto px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of students already learning on our platform
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition-shadow"
                        >
                            Get Started Now
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
