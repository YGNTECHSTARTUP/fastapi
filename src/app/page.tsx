"use client"

import { Command } from '@/components/ui/command'
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import React, { useEffect } from 'react'

const Page = () => {
  const[search, setSearch] = React.useState<string>('')
  const[results,setResults]=React.useState<{
    delay:number
    results:string[]
  }>()
  
  useEffect(()=>{
    const searchCountry = async () => {
    if(!search) return setResults(undefined)
      const res = await fetch(`https://fastapi.gagannaidu2006.workers.dev/api/search?q=${search}`).then((res)=>res.json())
      setResults(res)
  }
    searchCountry()
  },[search])
  return (
    <div className='flex-row text-center min-h-screen min-w-full   bg-black text-white'>
  <div className='  p-[2%]   lg:p-[15%] '>
   <div className='italic'>
    <h1 className='text-white font-sans font-extrabold tracking-tighter text-5xl md:text-6xl lg:text-7xl xl:text-8xl'>FAST<span className='text-teal-300'>API</span></h1>
     <div className='w-full'>
      <Command className="rounded-lg border shadow-md" >
<CommandInput value={search} onValueChange={setSearch} placeholder='Search Countries' className='text-zinc-900 font-extrabold text-sans p-2 '></CommandInput>
 <CommandList>
  {
    results?.results.length == 0   &&<CommandEmpty>No Results Found</CommandEmpty>
  }
  <CommandGroup className='cursor-pointer font-extrabold text-xl '>
  {
    results?.results.map((result,index)=>(
      <CommandItem className='hover:bg-neutral-200 active:bg-neutral-200 target:bg-neutral-400 focus:bg-neutral-200 ' key={index} value={result} onSelect={setSearch}>{result}</CommandItem>
    ))
  }

  </CommandGroup>

 </CommandList>
 {results?.results.length !== 0  ? 
 <div className='bg-teal-400 h-6'>

  <div>

Found {results?.results.length} countries in {results?.delay.toFixed(0)}ms
  </div> 


 </div>:null
}
      </Command>
     </div>

   </div>
 
    </div>
    </div>
  
  )
}

export default Page