'use client'

import { Filters } from '@/components/filters'
import { useGetCourseAnalysis } from '@/features/admin/analysis/api/use-get-course-analysis'
import { useGetMonthlyAnalysis } from '@/features/admin/analysis/api/use-get-monthly-analysis'
import { Loader2 } from 'lucide-react'

import Chart from './chart'
import DataCard from './data-card'

const AnalysisPage = () => {
  const { data, isPending } = useGetMonthlyAnalysis()

  if (isPending) {
    return (
      <div className="flex h-full min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const formattedData = (data ?? []).map(item => ({
    ...item,
    name: item.month,
    total: item.revenue,
  }))

  return (
    <div className="p-6">
      {/* <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard
          label="Total Revenue"
          value={data.totalRevenue}
          shouldFormat
        />
        <DataCard label="Total Sales" value={data.totalSales} />
      </div> */}
      <div className="flex flex-col gap-y-2">
        <Filters />
        <Chart data={formattedData} />
      </div>
    </div>
  )
}

export default AnalysisPage
