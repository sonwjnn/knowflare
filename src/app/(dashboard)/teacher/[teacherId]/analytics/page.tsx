// import { getAnalytics } from '@/actions/get-analytics'
import { protectServer } from '@/features/auth/utils'
import { redirect } from 'next/navigation'

import Chart from './chart'
import DataCard from './data-card'

const AnalyticsPage = async () => {
  await protectServer()

  // const { data, totalRevenue, totalSales } = await getAnalytics(userId)
  return (
    <div className="p-6">
      {/* <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} /> */}
    </div>
  )
}

export default AnalyticsPage
