'use client'

import { DataCharts } from '@/components/data-charts'
import { Filters } from '@/components/filters'
import { SingleBarVariant } from '@/components/single-bar-variant'
import { useGetCourseAnalysis } from '@/features/admin/analysis/api/use-get-course-analysis'
import { Loader2 } from 'lucide-react'

import DataCard from './data-card'

const AnalysisPage = () => {
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
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard Analytics
          </h2>
          <Filters />
        </div>
        {/* <SingleBarVariant data={formattedData} /> */}
        <DataCharts />
      </div>
    </div>
  )
}

export default AnalysisPage
