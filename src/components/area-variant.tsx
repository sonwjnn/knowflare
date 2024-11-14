import { CustomTooltip } from '@/components/custom-tooltip'
import { format } from 'date-fns'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

type AreaVariantProps = {
  data?: {
    date: string
    revenue: number
  }[]
}

export const AreaVariant = ({ data = [] }: AreaVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          {/* <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient> */}
          <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={value => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        {/* <Area
          type="monotone"
          dataKey="income"
          stackId="income"
          strokeWidth={2}
          stroke="#3d82f6"
          fill="url(#income)"
          className="drop-shadow-sm"
        /> */}
        <Area
          type="monotone"
          dataKey="revenue"
          stackId="revenue"
          strokeWidth={2}
          stroke="#3d82f6"
          fill="url(#revenue)"
          className="drop-shadow-sm"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
