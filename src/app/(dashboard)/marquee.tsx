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
    <span className="text-md font-regular text-white">{text}</span>
  </div>
)

const marqueeItems = [
  { id: 1, text: 'Learn', icon: BookOpen },
  { id: 2, text: 'Discover', icon: Lightbulb },
  { id: 3, text: 'Achieve', icon: Trophy },
  { id: 4, text: 'Innovate', icon: Rocket },
  { id: 5, text: 'Excel', icon: Star },
  { id: 6, text: 'Learn', icon: BookOpen },
  { id: 7, text: 'Discover', icon: Lightbulb },
  { id: 8, text: 'Achieve', icon: Trophy },
  { id: 9, text: 'Innovate', icon: Rocket },
  { id: 10, text: 'Excel', icon: Star },
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
          {[...Array(3)].flatMap((_, index) =>
            marqueeItems.map(item => (
              <MarqueeItem
                key={`${item.id}-${index}`}
                icon={item.icon}
                text={item.text}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
