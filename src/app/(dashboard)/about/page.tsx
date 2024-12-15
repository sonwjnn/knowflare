'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, BookOpen, Award, Clock, Globe, Target, Lightbulb, Trophy } from 'lucide-react'

export default function AboutPage() {
    const { ref: inViewRef, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    return (
        <div className="min-h-screen">
            {/* Hero Section with Parallax */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center text-white max-w-5xl mx-auto px-4"
                >
                    <h1 className="text-6xl md:text-7xl font-bold mb-8">
                        Shaping the Future of Learning
                    </h1>
                    <p className="text-2xl md:text-3xl text-sky-200 font-light">
                        Where Innovation Meets Education Excellence
                    </p>
                </motion.div>
            </section>

            {/* Vision & Values Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Globe className="w-8 h-8" />, title: 'Global Reach', description: 'Connecting learners across borders through innovative education solutions' },
                            { icon: <Target className="w-8 h-8" />, title: 'Focused Learning', description: 'Personalized learning paths tailored to individual goals' },
                            { icon: <Lightbulb className="w-8 h-8" />, title: 'Innovation First', description: 'Pioneering new methods in online education delivery' },
                            { icon: <Trophy className="w-8 h-8" />, title: 'Excellence', description: 'Committed to maintaining the highest standards in education' },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-slate-50 hover:bg-sky-50 transition-colors group"
                            >
                                <div className="mb-6 inline-block p-4 rounded-xl bg-sky-100 text-sky-600 group-hover:bg-sky-200 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-800">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievement Timeline */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">Our Journey of Excellence</h2>
                    <div className="max-w-4xl mx-auto">
                        {[
                            { year: '2024', title: 'Global Expansion', description: 'Reached students in over 150 countries' },
                            { year: '2023', title: 'Platform Innovation', description: 'Launched AI-powered learning assistance' },
                            { year: '2022', title: 'Community Growth', description: 'Surpassed 10,000 active learners' },
                            { year: '2021', title: 'Foundation', description: 'Started with a vision to transform education' },
                        ].map((milestone, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-center gap-8 mb-12"
                            >
                                <div className="w-32 text-2xl font-bold text-sky-600">{milestone.year}</div>
                                <div className="flex-1 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{milestone.title}</h3>
                                    <p className="text-slate-600">{milestone.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section with Modern Cards */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">Leadership Team</h2>
                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {[
                            {
                                name: 'Nguyen Le Hoang Son',
                                role: 'Fullstack Developer',
                                image: '/son.png',
                                bio: 'Expert in building scalable web applications and innovative learning platforms.'
                            },
                            {
                                name: 'Do Cong Ton Sach',
                                role: 'Frontend Developer',
                                image: '/sach.png',
                                bio: 'Specialized in creating intuitive and engaging user experiences.'
                            },
                            {
                                name: 'Nguyen Nhat Hao',
                                role: 'Information System Engineer',
                                image: '/hao.png',
                                bio: 'Focused on developing robust and secure educational infrastructure.'
                            }
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="relative h-[400px] rounded-2xl overflow-hidden mb-6">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-6 left-6 right-6 text-white">
                                            <p className="text-sm leading-relaxed">{member.bio}</p>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-slate-800">{member.name}</h3>
                                <p className="text-sky-600 font-medium">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats with Modern Design */}
            <section className="py-24 bg-sky-600">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12">
                        {[
                            { icon: <Users className="w-10 h-10" />, number: '10,000+', label: 'Active Students' },
                            { icon: <BookOpen className="w-10 h-10" />, number: '200+', label: 'Courses' },
                            { icon: <Award className="w-10 h-10" />, number: '50+', label: 'Expert Instructors' },
                            { icon: <Clock className="w-10 h-10" />, number: '24/7', label: 'Support' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center text-white"
                            >
                                <div className="mb-6 inline-block p-4 rounded-full bg-sky-500/50 backdrop-blur-lg">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="text-xl text-sky-100">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}