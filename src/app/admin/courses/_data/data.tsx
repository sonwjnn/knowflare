import { CourseLevel } from '@/db/schema'
import { SEED_CATEGORIES } from '@/scripts/categories'
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

export const categoryOptions = SEED_CATEGORIES.map(item => ({
  label: item.name,
  value: item.id,
}))

export const levelOptions = [
  {
    label: 'Beginner',
    value: CourseLevel.BEGINNER,
    icon: MoveDownIcon,
  },
  {
    label: 'Intermediate',
    value: CourseLevel.INTERMEDIATE,
    icon: MoveRightIcon,
  },
  {
    label: 'Advanced',
    value: CourseLevel.ADVANCED,
    icon: MoveUpIcon,
  },
  {
    label: 'All Levels',
    value: CourseLevel.ALL_LEVEL,
    icon: CircleIcon,
  },
]
export const publishedOptions = [
  {
    label: 'Published',
    value: 'published',
    icon: CircleCheck,
  },
  {
    label: 'Unpublished',
    value: 'unpublished',
    icon: CircleX,
  },
]
