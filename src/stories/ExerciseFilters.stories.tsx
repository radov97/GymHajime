'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ExerciseFilters from '../components/exercises/ExerciseFilters';

const meta = {
  title: 'Exercises/ExerciseFilters',
  component: ExerciseFilters,
  render: function Render(args) {
    const [search, setSearch] = useState(args.search);
    const [category, setCategory] = useState(args.category);
    return (
      <ExerciseFilters
        {...args}
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />
    );
  },
  args: {
    search: '',
    category: '',
    categories: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'],
    onSearchChange: () => undefined,
    onCategoryChange: () => undefined,
    labels: {
      search: 'Search exercises...',
      clear: 'Clear search',
      all: 'All',
      category: 'Exercise category',
    },
  },
} satisfies Meta<typeof ExerciseFilters>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithSearch: Story = { args: { search: 'bench' } };
export const CategorySelected: Story = { args: { category: 'chest' } };
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
