import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const blogPosts = [
    {
        id: 1,
        title: 'Getting Started with Web Development in 2024',
        excerpt: 'Learn the essential skills and tools needed to begin your journey in web development.',
        category: 'Programming',
        author: 'John Doe',
        date: 'Mar 15, 2024',
        readTime: '5 min read',
        image: '/web-dev.jpg',
    },
    {
        id: 2,
        title: 'UI/UX Design Principles for Beginners',
        excerpt: 'Master the fundamentals of user interface and user experience design. ',
        category: 'Design',
        author: 'Sarah Johnson',
        date: 'Mar 14, 2024',
        readTime: '7 min read',
        image: '/design.jpg',
    },
    {
        id: 3,
        title: 'The Rise of AI in Education',
        excerpt: 'Explore how artificial intelligence is transforming the education landscape, from personalized learning to automated grading systems...',
        category: 'Technology',
        author: 'Michael Chen',
        date: 'Mar 13, 2024',
        readTime: '8 min read',
        image: '/ai-edu.jpg',
    },
    {
        id: 4,
        title: 'Digital Marketing Strategies for 2024',
        excerpt: 'Stay ahead of the curve with the latest digital marketing trends and strategies. Learn about SEO, social media, and content marketing...',
        category: 'Business',
        author: 'Emma Wilson',
        date: 'Mar 12, 2024',
        readTime: '6 min read',
        image: '/marketing.jpg',
    },
    {
        id: 5,
        title: 'Mastering Data Science with Python',
        excerpt: 'Deep dive into data science using Python. Learn about pandas, numpy, and machine learning libraries for data analysis...',
        category: 'Programming',
        author: 'Alex Thompson',
        date: 'Mar 11, 2024',
        readTime: '10 min read',
        image: '/data-science.jpg',
    },
    {
        id: 6,
        title: 'Career Growth in Tech Industry',
        excerpt: 'Navigate your career path in the technology industry. Tips for job searching, interviewing, and professional development...',
        category: 'Career Tips',
        author: 'Lisa Brown',
        date: 'Mar 10, 2024',
        readTime: '4 min read',
        image: '/career.jpg',
    },
    {
        id: 7,
        title: 'Mobile App Development Trends',
        excerpt: 'Stay updated with the latest trends in mobile app development. From Flutter to React Native, explore cross-platform development...',
        category: 'Programming',
        author: 'David Kim',
        date: 'Mar 9, 2024',
        readTime: '6 min read',
        image: '/mobile-dev.jpg',
    },
    {
        id: 8,
        title: 'Building a Personal Brand Online',
        excerpt: 'Learn how to establish and grow your personal brand in the digital age. Strategies for social media and content creation...',
        category: 'Business',
        author: 'Rachel Green',
        date: 'Mar 8, 2024',
        readTime: '5 min read',
        image: '/personal-brand.jpg',
    },
    {
        id: 9,
        title: 'Cybersecurity Best Practices',
        excerpt: 'Protect yourself and your organization with essential cybersecurity practices. Learn about common threats and prevention strategies...',
        category: 'Technology',
        author: 'James Wilson',
        date: 'Mar 7, 2024',
        readTime: '7 min read',
        image: '/security.jpg',
    }
]

const categories = [
    'All Posts',
    'IT',
    'Health',
    'Language',
    'Business',
    'Management',
    'English',
    'Personal Development',
    'Sales & Marketing',
]

const featuredPost = {
    id: 10,
    title: 'The Future of Online Learning: Trends to Watch in 2024',
    excerpt: 'Explore the revolutionary changes in online education. From virtual reality classrooms to AI-powered personalized learning, discover how technology is reshaping the way we learn and teach in the digital age...',
    category: 'Featured',
    author: 'Jane Smith',
    date: 'Mar 20, 2024',
    readTime: '10 min read',
    image: '/blog/featured.jpg',
}

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/blog.jpg" alt="Hero" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Our Blog
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90">
                        Discover insights, tutorials, and stories from our community of
                        experts and learners.
                    </p>
                </div>
            </section>

            {/* Categories */}
            <div className="border-b bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto py-4">
                        {categories.map(category => (
                            <button
                                key={category}
                                className="flex-shrink-0 text-sm font-medium text-gray-600 
                                         hover:text-primary focus:text-primary focus:outline-none"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Post */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-64 lg:h-auto">
                            <Image
                                src="/featured.jpg"
                                alt="Featured post"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-8 lg:p-12">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span className="font-medium text-primary">Featured</span>
                                <span>•</span>
                                <span>10 min read</span>
                            </div>
                            <h2 className="mt-4 text-3xl font-bold">
                                The Future of Online Learning: Trends to Watch in 2024
                            </h2>
                            <p className="mt-4 text-gray-600">
                                Explore the latest innovations and developments shaping the
                                future of education and online learning platforms...
                            </p>
                            <Button className="mt-6" size="lg">
                                Read More
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map(post => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="group overflow-hidden rounded-xl bg-white shadow-md 
                                     transition-transform hover:scale-[1.02]"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform 
                                             group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span className="font-medium text-primary">
                                        {post.category}
                                    </span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h3 className="mt-2 text-xl font-bold text-gray-900">
                                    {post.title}
                                </h3>
                                <p className="mt-2 text-gray-600">{post.excerpt}</p>
                                <div className="mt-4 flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {post.author}
                                        </p>
                                        <p className="text-sm text-gray-500">{post.date}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="mt-12 text-center">
                    <Button variant="outline" size="lg">
                        Load More Articles
                    </Button>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gray-900 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-3xl font-bold text-white">
                            Subscribe to Our Newsletter
                        </h2>
                        <p className="mt-4 max-w-2xl text-gray-400">
                            Get the latest articles, tutorials, and updates delivered straight
                            to your inbox.
                        </p>
                        <div className="mt-8 flex w-full max-w-md space-x-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-lg border-0 bg-white/10 px-4 py-3 
                                         text-white placeholder-gray-500 focus:ring-2 
                                         focus:ring-primary"
                            />
                            <Button size="lg">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
