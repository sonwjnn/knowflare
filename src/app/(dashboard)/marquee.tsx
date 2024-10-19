import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export const Marquee = () => {
  const marqueeVariants = {
    animate: {
      x: [0, -1035],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 15,
          ease: 'linear',
        },
      },
    },
  }

  return (
    <section className="relative overflow-hidden bg-gray-900 py-8">
      <motion.div
        className="whitespace-nowrap"
        variants={marqueeVariants}
        animate="animate"
      >
        <div className="inline-block">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="mx-4 gap-x-1 text-3xl capitalize text-white opacity-50"
            >
              Knowflare
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
