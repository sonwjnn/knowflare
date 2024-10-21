import { useCurrentUser } from '@/hooks/use-current-user'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useVideo } from 'react-use'

export const Hero = () => {
  const [video, _, controls] = useVideo(
    <video
      src="/hero-home.mp4"
      className="absolute left-0 top-0 h-full w-full object-cover"
      autoPlay
      loop
      playsInline
      muted
    />
  )
  const currentUser = useCurrentUser()

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {video}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-white">
        <h1 className="mb-6 text-center text-4xl font-bold md:text-6xl">
          Unlock Your Potential with
          <br />
          World-Class Learning
        </h1>
        <p className="mb-8 max-w-2xl text-center text-xl">
          Join millions of learners worldwide and explore a universe of
          knowledge. Start your journey to success today!
        </p>
        <Link href={`${currentUser ? '/courses' : '/sign-up'}`}>
          <button className="flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-700">
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </section>
  )
}
