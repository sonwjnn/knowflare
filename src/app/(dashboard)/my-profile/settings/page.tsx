import { auth } from '@/auth'
import { redirect } from 'next/navigation'

import { AccountSettingsForm } from '../settings/account-settings-form'

const SettingsPage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/')
  }

  return (
    <div className="mx-auto h-full w-full max-w-5xl pb-6">
      <AccountSettingsForm user={session.user} />
    </div>
  )
}

export default SettingsPage