import { auth } from '@/auth'
import { redirect } from 'next/navigation'

type HomePageProps = {}

const HomePage = async ({}: HomePageProps) => {
  const session = await auth()

  if (!session) {
    return redirect('/sign-in')
  }

  return <div>Home Page</div>
}

export default HomePage
