import { Chart, ChartLoading } from '@/components/chart'
import { DateRangePicker } from '@/components/date-range-picker'
import { SpendingPie, SpendingPieLoading } from '@/components/spending-pie'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetAnalysis } from '@/features/admin/analysis/api/use-get-analysis'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

type DataChartsProps = {}

export const DataCharts = ({}: DataChartsProps) => {
  const { data, isLoading } = useGetAnalysis()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Tabs defaultValue="charts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="charts">Charts View</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
              <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartLoading />
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SpendingPieLoading />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardContent>
                <p className="p-4 text-center text-muted-foreground">
                  Loading detailed view...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts View</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart data={data?.days} />
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingPie data={data?.categories} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardContent>
              <div className="space-y-4">
                {data?.categories.map(category => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{category.name}</span>
                    <span>{category.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
