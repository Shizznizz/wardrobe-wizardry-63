import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PageHeader from '@/components/layout/PageHeader';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { addDays, format } from "date-fns"

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    console.log("Selected date:", date);
  }, [date]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-16">
        <PageHeader 
          title="Your Style Planner & Insights"
          subtitle="Track, analyze, and optimize your outfits with visual AI and smart recommendations."
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center"
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > addDays(new Date(), 30) || date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </motion.div>
      </main>
    </div>
  );
};

export default CalendarPage;
