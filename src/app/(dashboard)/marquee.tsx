import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, Rocket, Star, Trophy } from 'lucide-react'

const MarqueeItem = ({
  text,
  icon: Icon,
}: {
  text: string
  icon: React.ElementType
}) => (
  <div className="mx-8 flex items-center space-x-2">
    <Icon className="h-6 w-6 text-primary" />
    <span className="text-xl font-semibold text-white">{text}</span>
  </div>
)

const marqueeItems = [
  { text: 'Learn', icon: BookOpen },
  { text: 'Discover', icon: Lightbulb },
  { text: 'Achieve', icon: Trophy },
  { text: 'Innovate', icon: Rocket },
  { text: 'Excel', icon: Star },
  { text: 'Learn', icon: BookOpen },
  { text: 'Discover', icon: Lightbulb },
  { text: 'Achieve', icon: Trophy },
  { text: 'Innovate', icon: Rocket },
  { text: 'Excel', icon: Star },
]

export const Marquee = () => {
  const marqueeVariants = {
    animate: {
      x: [0, -1800],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 30,
          ease: 'linear',
        },
      },
    },
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative flex">
        <motion.div
          className="flex items-center whitespace-nowrap"
          variants={marqueeVariants}
          animate="animate"
        >
          {[...Array(3)].flatMap(() =>
            marqueeItems.map((item, index) => (
              <MarqueeItem
                key={`${index}-${item.text}`}
                text={item.text}
                icon={item.icon}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
