'use client'

import { useGetAnalysis } from '@/features/admin/analysis/api/use-get-analysis'

import Chart from './chart'
import DataCard from './data-card'

const AnalysisPage = () => {
  const { data, isPending } = useGetAnalysis()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!data) {
    return null
  }

  return (
    <div className="p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard
          label="Total Revenue"
          value={data.totalRevenue}
          shouldFormat
        />
        <DataCard label="Total Sales" value={data.totalSales} />
      </div>
      <Chart data={data.data} />
    </div>
  )
}

export default AnalysisPage
