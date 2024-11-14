import { Chart, ChartLoading } from '@/components/chart'
import { SpendingPie, SpendingPieLoading } from '@/components/spending-pie'
import { useGetAnalysis } from '@/features/admin/analysis/api/use-get-analysis'

type DataChartsProps = {}

export const DataCharts = ({}: DataChartsProps) => {
  const { data, isLoading } = useGetAnalysis()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  )
}
