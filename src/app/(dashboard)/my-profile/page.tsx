import { auth } from '@/auth'
import { redirect } from 'next/navigation'

import { ProfileItem } from './item'

const ProfilePage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/')
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="space-y-6">
        <ProfileItem user={session.user} />
      </div>
    </div>
  )
}

export default ProfilePage
