"use client"

import Selector from '@/components/forms/Selector'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetAllCategoriesIdentities } from '@/hooks/useCategory'
import { TasksFilterProps } from '@/types/components'
import { Category, REQUESTS_STATE } from '@/types/global'
import React from 'react'

const Filter: React.FC<TasksFilterProps> = ({ search, setSearch, setCategory, setState }) => {
  const { data, isFetching, isError } = useGetAllCategoriesIdentities()
  const categories = data?.data || []

  const unWantedStates = [REQUESTS_STATE.IN_QUEUE, REQUESTS_STATE.SUCCEED]

  const categoryOptions = categories.map((cat: Omit<Category, "desc" | "id">) => ({
    key: cat.title,
    value: cat.title,
  }))

  const stateOptions = [
    ...Object.entries(REQUESTS_STATE)
      .filter(([_, v]) => !unWantedStates.includes(v))
      .map(([_, v]) => ({ key: v.charAt(0).toUpperCase() + v.slice(1), value: v }))
  ]

  return (
    <div className="md:w-[75%] w-full flex md:flex-row flex-col items-center flex-wrap gap-2">
      <Input
        placeholder="Search employees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='flex-1'
      />

      {isFetching ? (
        <Skeleton className="h-10 w-[180px] flex-1" />
      ) : !isError && (
        <Selector
          setFunction={setCategory}
          data={categoryOptions}
          placeholder="Category"
          styles="flex-1"
        />
      )}

      <Selector
        setFunction={setState}
        data={stateOptions}
        placeholder="State"
        styles="flex-1"
      />
    </div>
  )
}

export default Filter