'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, Users, BookOpen, Award, Clock } from 'lucide-react'

export default function AboutPage() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section with Parallax */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/hero-background.jpg"
                        alt="Hero Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
                </div>
                <div className="relative z-10 text-center text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl font-bold mb-6"
                    >
                        Transforming Education
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-xl mb-8 max-w-2xl mx-auto"
                    >
                        Empowering learners worldwide through innovative online education
                    </motion.p>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    >
                        <ChevronDown className="w-8 h-8" />
                    </motion.div>
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
                        ref={ref}
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
                                    <p className="text-gray-600 leading-relaxed">
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
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Nguyen Le Hoang Son',
                                role: 'Fullstack Developer',
                                image: '/son.png',
                                links: { github: '#', linkedin: '#' }
                            },
                            {
                                name: 'Do Cong Ton Sach',
                                role: 'Information System & Frontend Developer',
                                image: '/sach.png',
                                links: { github: '#', linkedin: '#' }
                            },
                            {
                                name: 'Nguyen Nhat Hao',
                                role: 'Information System Engineer',
                                image: '/hao.png',
                                links: { github: '#', linkedin: '#' }
                            }
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="relative group"
                            >
                                <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
                                    <div className="relative h-64">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                                        <p className="text-gray-600">{member.role}</p>
                                    </div>
                                </div>
                            </motion.div>
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
