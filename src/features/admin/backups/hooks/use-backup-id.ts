import { useParams } from 'next/navigation'

export const useBackupId = () => {
  const params = useParams()

  return params.backupId as string
}
