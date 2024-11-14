import { BarVariant } from '@/components/bar-variant'
import { useGetOverviewAnalysis } from '@/features/admin/analysis/api/use-get-overview-analysis'
import { Loader2 } from 'lucide-react'

type Props = {
  data?: {
    date: string
    revenue: number
  }[]
}
export function Overview({ data }: Props) {
  return <BarVariant data={data} />
}
