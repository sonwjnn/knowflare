import { v4 as uuidv4 } from 'uuid'

export const SEED_CATEGORIES = [
  { id: uuidv4(), name: 'IT' },
  { id: uuidv4(), name: 'Health' },
  { id: uuidv4(), name: 'Language' },
  { id: uuidv4(), name: 'Business' },
  { id: uuidv4(), name: 'Management' },
  { id: uuidv4(), name: 'English' },
  { id: uuidv4(), name: 'Personal Development' },
  { id: uuidv4(), name: 'Sales & Marketing' },
  { id: uuidv4(), name: 'Engineering & Construction' },
  { id: uuidv4(), name: 'Teaching & Academics' },
]

export const SEED_SUB_CATEGORIES = [
  // IT Sub-categories
  {
    id: uuidv4(),
    name: 'Web Development',
    categoryId: SEED_CATEGORIES[0].id,
  },
  {
    id: uuidv4(),
    name: 'Mobile Development',
    categoryId: SEED_CATEGORIES[0].id,
  },
  {
    id: uuidv4(),
    name: 'Data Science',
    categoryId: SEED_CATEGORIES[0].id,
  },

  // Health Sub-categories
  {
    id: uuidv4(),
    name: 'Nutrition',
    categoryId: SEED_CATEGORIES[1].id,
  },
  {
    id: uuidv4(),
    name: 'First Aid',
    categoryId: SEED_CATEGORIES[1].id,
  },
  {
    id: uuidv4(),
    name: 'Mental Health',
    categoryId: SEED_CATEGORIES[1].id,
  },

  // Language Sub-categories
  {
    id: uuidv4(),
    name: 'Japanese',
    categoryId: SEED_CATEGORIES[2].id,
  },
  {
    id: uuidv4(),
    name: 'Korean',
    categoryId: SEED_CATEGORIES[2].id,
  },
  {
    id: uuidv4(),
    name: 'Chinese',
    categoryId: SEED_CATEGORIES[2].id,
  },

  // Business Sub-categories
  {
    id: uuidv4(),
    name: 'Entrepreneurship',
    categoryId: SEED_CATEGORIES[3].id,
  },
  {
    id: uuidv4(),
    name: 'Finance',
    categoryId: SEED_CATEGORIES[3].id,
  },
  {
    id: uuidv4(),
    name: 'Marketing',
    categoryId: SEED_CATEGORIES[3].id,
  },

  // Management Sub-categories
  {
    id: uuidv4(),
    name: 'Project Management',
    categoryId: SEED_CATEGORIES[4].id,
  },
  {
    id: uuidv4(),
    name: 'Leadership',
    categoryId: SEED_CATEGORIES[4].id,
  },
  {
    id: uuidv4(),
    name: 'Team Management',
    categoryId: SEED_CATEGORIES[4].id,
  },

  // English Sub-categories
  {
    id: uuidv4(),
    name: 'Speaking',
    categoryId: SEED_CATEGORIES[5].id,
  },
  {
    id: uuidv4(),
    name: 'Writing',
    categoryId: SEED_CATEGORIES[5].id,
  },
  {
    id: uuidv4(),
    name: 'Grammar',
    categoryId: SEED_CATEGORIES[5].id,
  },

  // Personal Development Sub-categories
  {
    id: uuidv4(),
    name: 'Time Management',
    categoryId: SEED_CATEGORIES[6].id,
  },
  {
    id: uuidv4(),
    name: 'Communication Skills',
    categoryId: SEED_CATEGORIES[6].id,
  },
  {
    id: uuidv4(),
    name: 'Goal Setting',
    categoryId: SEED_CATEGORIES[6].id,
  },

  // Sales & Marketing Sub-categories
  {
    id: uuidv4(),
    name: 'Digital Marketing',
    categoryId: SEED_CATEGORIES[7].id,
  },
  {
    id: uuidv4(),
    name: 'Sales Strategy',
    categoryId: SEED_CATEGORIES[7].id,
  },
  {
    id: uuidv4(),
    name: 'Social Media Marketing',
    categoryId: SEED_CATEGORIES[7].id,
  },

  // Engineering & Construction Sub-categories
  {
    id: uuidv4(),
    name: 'Civil Engineering',
    categoryId: SEED_CATEGORIES[8].id,
  },
  {
    id: uuidv4(),
    name: 'Architecture',
    categoryId: SEED_CATEGORIES[8].id,
  },
  {
    id: uuidv4(),
    name: 'Construction Safety',
    categoryId: SEED_CATEGORIES[8].id,
  },

  // Teaching & Academics Sub-categories
  {
    id: uuidv4(),
    name: 'Education Technology',
    categoryId: SEED_CATEGORIES[9].id,
  },
  {
    id: uuidv4(),
    name: 'Teaching Methods',
    categoryId: SEED_CATEGORIES[9].id,
  },
  {
    id: uuidv4(),
    name: 'Curriculum Development',
    categoryId: SEED_CATEGORIES[9].id,
  },
]
