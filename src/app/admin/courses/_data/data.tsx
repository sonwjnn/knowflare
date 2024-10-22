import {
  CheckCircleIcon,
  CircleHelp,
  CircleIcon,
  MoveDownIcon,
  MoveRightIcon,
  MoveUpIcon,
  Timer,
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
