import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const filterData = [
  {
    filterType:"Location",
    array:["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Noida", "Gurugram", "Lucknow"]
  },
  {
    filterType:"Industry",
    array:["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Scientist", "AI Engineer"]
  },
  {
    filterType:"Salary",
    array:["0-40k ", "41k-1lakh", "1-2lakh", "2-5lakh",]
  },
]

const FilterCard = () => {
  return (
    <div className='w-full bg-amber-400 p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3'/>
      <RadioGroup>
        {
          filterData.map((data, index) =>(
            <div>
              <h2 className='font-bold text-lg'>{data.filterType}</h2>
              {
                data.array.map((item, index) => {
                 return (
                   <div className='flex items-center space-x-2 my-2'>
                    <RadioGroupItem value={item}/>
                    <Label>{item}</Label>
                  </div>
                 )
})
              }
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}

export default FilterCard
