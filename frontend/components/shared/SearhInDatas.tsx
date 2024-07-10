"use client"
import React, { useEffect, useState } from 'react';
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from '@radix-ui/react-icons';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Input } from '@/components/ui/input';
import moment from 'moment';


interface SearchInDatasProps {
  data: any[];
  valueKey: string;
  textKey: string;
  mode?: string;
  onSelect: (value:string) => void;
}

export function SearchInDatas({
  data,
  valueKey,
  textKey,
  mode,
  onSelect,
}: SearchInDatasProps) {
  const [search, setSearch] = useState<string>('');

  // Vérifier si le tableau de données est vide
  if (!data) {
    return (
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search..." disabled />
        <CommandList>
          <CommandEmpty>No data available.</CommandEmpty>
        </CommandList>
      </Command>
    );
  }

  const filteredData = data.filter((item) =>{
    if(mode === "patient") {
      return item[textKey]?.toLowerCase().includes(search.toLowerCase())
    }else {
      return item[textKey].toLowerCase().startsWith(search.toLowerCase())
    }
  }
   
    
  );

  const handleInputSearch = (event:any) => {
    setSearch(event.target.value);
    
  }


  const triggerClick = (value:any)=> {
    onSelect(value)
    setSearch('')
  }

  return (
    <div className='relative'>
      <Input 
      placeholder="Search..."
      value={search} 
      type="search" 
      onChange={handleInputSearch} 
      className='w-full'
      />

      {search !== '' &&
        <ScrollArea className="h-72 w-full rounded-md border bg-white !absolute">
        <div className="p-4 ">
          {
          filteredData.map((item,index) => (
            <div key={index} className="hover:bg-slate-100 cursor-pointer">
              <div 
                onSelect={() => triggerClick(mode === 'patient' ? item : item[valueKey])}
                onClick={() => triggerClick(mode === 'patient' ? item : item[valueKey])}
                className="text-sm pt-2 px-2">
                {item[textKey]}
              </div>
              {mode === 'patient' &&
                <div className="text-xs pb-2 px-2">
                  {moment(item.dateNaissance).format('DD/MM/YYYY')}
                </div>
              }
              <Separator/>
            </div>
          ))}
        </div>
      </ScrollArea>
   
      }
      
    </div>

    
  );
}
