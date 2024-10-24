import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'
import { useVideo } from 'react-use'

export const Hero = () => {
  const [video] = useVideo(
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
    <section className="relative h-[90vh] overflow-hidden">
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

        <Link
          href={`${currentUser ? '/courses' : '/sign-up'}`}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 p-4 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-out"
        >
          <span className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-white text-indigo-600 duration-300 group-hover:translate-x-0">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="ease absolute flex h-full w-full transform items-center justify-center transition-all duration-300 group-hover:translate-x-full">
            Get started
          </span>
          <span className="invisible relative">Get started</span>
        </Link>
      </div>
    </section>
  )
}
