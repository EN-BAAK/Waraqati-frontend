"use client"

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectorProps } from '@/types/forms'

const Selector: React.FC<SelectorProps> = ({ data, placeholder, styles, setFunction }) => {
  return (
    <Select onValueChange={setFunction}>
      <SelectTrigger className={styles}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Select</SelectItem>
        {data.map(d =>
          <SelectItem key={d.value} value={d.value}>{d.key}</SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}

export default Selector