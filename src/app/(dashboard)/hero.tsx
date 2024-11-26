import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'
import { useVideo } from 'react-use'

export const Hero = () => {
    const [video] = useVideo(
        <video
            src="/online-courses-stocck.mp4"
            className="absolute left-0 top-0 h-full w-full object-cover"
            autoPlay
            loop
            playsInline
            muted
        />
    )
    const currentUser = useCurrentUser()

    return (
        <section className="relative min-h-[80vh] overflow-hidden">
            {video}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />

            {/* Centered content container */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-4xl px-4 text-center text-white">
                    <h1 className="mb-6">
                        <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent md:text-7xl">
                            Unlock Your Potential
                        </span>
                        <span className="mt-4 block text-4xl font-bold text-white md:text-6xl">
                            with World-Class Learning
                        </span>
                    </h1>

                    <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
                        Join millions of learners worldwide and explore a universe of
                        knowledge. Start your journey to success today!
                    </p>

                    <Link
                        href={`${currentUser ? '/courses' : '/sign-up'}`}
                        className="group inline-flex items-center px-8 py-4 text-lg font-semibold 
                        text-white border-2 border-white/20 rounded-lg 
                        backdrop-blur-sm bg-white/10
                        transition-all duration-300
                        hover:bg-white/20 hover:border-white/30 transform hover:-translate-y-1
                        hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.2)]
                        active:bg-white/30"
                    >
                        <span className="flex items-center gap-2">
                            Get Started Now
                            <svg
                                className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    )
}
