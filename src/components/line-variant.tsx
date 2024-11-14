import { CustomTooltip } from '@/components/custom-tooltip'
import { format } from 'date-fns'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

type LineVariantProps = {
  data?: {
    date: string
    revenue: number
  }[]
}

export const LineVariant = ({ data = [] }: LineVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={value => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          dot={false}
          dataKey="revenue"
          strokeWidth={2}
          stroke="#3d82f6"
          className="drop-shadow-sm"
        />
        {/* <Line
          dot={false}
          dataKey="expenses"
          strokeWidth={2}
          stroke="#f43f5e"
          className="drop-shadow-sm"
        /> */}
      </LineChart>
    </ResponsiveContainer>
  )
}
