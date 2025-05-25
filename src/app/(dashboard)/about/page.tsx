'use client'

import { motion } from 'framer-motion'
import { Award, BookOpen, ChevronDown, Clock, Users } from 'lucide-react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

export default function AboutPage() {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/hero-home.mp4" type="video/mp4" />
          </video>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="animate-fade-in mb-6 text-5xl font-bold md:text-6xl">
            Transforming Education Through Technology
          </h1>
          <p className="text-xl opacity-90 md:text-2xl">
            Empowering learners worldwide with innovative online education
          </p>
        </div>
      </section>

      {/* Mission Section with 3D Card Effect */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            ref={inViewRef as any}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeIn}
            className="perspective group"
          >
            <div className="transform-style-3d group-hover:rotate-y-12 relative transition-transform duration-500">
              <div className="grid items-center gap-12 rounded-2xl bg-white p-8 shadow-xl md:grid-cols-2">
                <div>
                  <h2 className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                    Our Mission
                  </h2>
                  <p className="text-2xl leading-relaxed text-gray-800">
                    We are dedicated to revolutionizing online education through
                    cutting-edge technology and expert instruction. Our platform
                    combines innovation with accessibility to create an
                    unparalleled learning experience.
                  </p>
                </div>
                <div className="relative h-[400px] overflow-hidden rounded-xl">
                  <Image
                    src="/blog.jpg"
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

      <section className="relative overflow-hidden py-20">
        <div className="animate-gradient-x absolute inset-0 bg-white" />
        <div className="container relative mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6 text-4xl font-bold">
              Ready to Start Learning?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl">
              Join thousands of students already learning on our platform
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border bg-white px-8 py-3 font-semibold text-blue-600 transition-shadow hover:shadow-lg"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
