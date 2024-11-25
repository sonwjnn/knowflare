import {
  CheckCircleIcon,
  CircleCheck,
  CircleHelp,
  CircleIcon,
  CircleX,
  MoveDownIcon,
  MoveRightIcon,
  MoveUpIcon,
  Shield,
  Timer,
  UserRound,
  X,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: CircleHelp,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: CircleIcon,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: Timer,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircleIcon,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: X,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: MoveDownIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: MoveRightIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: MoveUpIcon,
  },
]

export const roleOptions = [
  {
    label: 'Admin',
    value: 'admin',
    icon: Shield,
  },
  {
    label: 'User',
    value: 'user',
    icon: UserRound,
  },
]

export const statusOptions = [
  {
    label: 'Active',
    value: 'active',
    icon: CircleCheck,
  },
  {
    label: 'Inactive',
    value: 'inactive',
    icon: CircleX,
  },
]
