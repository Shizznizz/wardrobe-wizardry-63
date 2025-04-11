import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Outfit, Activity, TimeOfDay } from '@/lib/types';
import { OutfitLog } from '../OutfitLogItem';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  Calendar as CalendarIcon2,
  Clock,
  Umbrella,
  Thermometer,
  Tag,
  X,
  MoveVertical
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

const OutfitLogSchema = z.object({
  outfitId: z.string({
    required_error: "Please select an outfit",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeOfDay: z.string({
    required_error: "Please select a time of day",
  }),
  notes: z.string().optional(),
  weatherCondition: z.string().optional(),
  temperature: z.string().optional(),
  activity: z.string().optional(),
  customActivity: z.string().optional(),
  askForAiSuggestion: z.boolean().optional().default(false),
});

interface OutfitLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: Outfit[];
  selectedDate?: Date;
  onSubmit: (log: Omit<OutfitLog, 'id'>) => void;
}

const OutfitLogForm = ({ isOpen, onClose, outfits, selectedDate, onSubmit }: OutfitLogFormProps) => {
  const [showCustomActivity, setShowCustomActivity] = useState(false);
  const isFutureDate = selectedDate ? selectedDate > new Date() : false;
  const isMobile = useIsMobile();
  const [showHint, setShowHint] = useState(true);

  const form = useForm<z.infer<typeof OutfitLogSchema>>({
    resolver: zodResolver(OutfitLogSchema),
    defaultValues: {
      date: selectedDate || new Date(),
      notes: "",
      askForAiSuggestion: false,
    },
  });

  useEffect(() => {
    if (selectedDate) {
      form.setValue("date", selectedDate);
    }
  }, [selectedDate, form]);

  useEffect(() => {
    if (isOpen && showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showHint]);

  const handleSubmit = (values: z.infer<typeof OutfitLogSchema>) => {
    if (!values.outfitId) {
      toast.error("Please select an outfit");
      return;
    }
    
    const activity = values.activity === 'other' ? values.customActivity : values.activity;
    
    onSubmit({
      outfitId: values.outfitId,
      date: values.date,
      timeOfDay: values.timeOfDay as TimeOfDay,
      notes: values.notes,
      weatherCondition: values.weatherCondition,
      temperature: values.temperature,
      activity: activity as Activity,
      customActivity: values.customActivity,
      askForAiSuggestion: values.askForAiSuggestion,
    });
    
    form.reset();
    onClose();
    toast.success('Outfit saved successfully');
  };

  const handleActivityChange = (value: string) => {
    form.setValue("activity", value);
    setShowCustomActivity(value === "other");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-slate-900 border-purple-500/30 text-white ${isMobile ? 'p-3 max-w-[calc(100vw-24px)]' : 'p-6'}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isFutureDate ? "Plan an Outfit" : "Log an Outfit"}
          </h2>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {isMobile && showHint && (
          <div className="flex items-center justify-center bg-slate-800/80 rounded-md p-2 mb-2 text-sm">
            <MoveVertical className="h-4 w-4 mr-2 text-purple-400" />
            <span>Swipe down to close</span>
          </div>
        )}
        
        <ScrollArea className={`${isMobile ? 'max-h-[70vh] pr-4' : ''}`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="outfitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Outfit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="border-purple-500/30 bg-slate-800">
                        <SelectValue placeholder="Choose an outfit" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-purple-500/30 max-h-[200px]">
                        {outfits.map(outfit => (
                          <SelectItem key={outfit.id} value={outfit.id}>{outfit.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-purple-500/30 bg-slate-800",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-900 border-purple-500/30">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                <FormField
                  control={form.control}
                  name="timeOfDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-400" />
                        Time of Day
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-purple-500/30 bg-slate-800">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-purple-500/30">
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-purple-400" />
                        Occasion/Activity
                      </FormLabel>
                      <Select onValueChange={handleActivityChange} defaultValue={field.value}>
                        <SelectTrigger className="border-purple-500/30 bg-slate-800">
                          <SelectValue placeholder="Select occasion" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-purple-500/30">
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="party">Party</SelectItem>
                          <SelectItem value="date">Date night</SelectItem>
                          <SelectItem value="interview">Job interview</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="other">Other (custom)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {showCustomActivity && (
                <FormField
                  control={form.control}
                  name="customActivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Activity</FormLabel>
                      <Input 
                        {...field} 
                        placeholder="Specify occasion"
                        className="border-purple-500/30 bg-slate-800"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                <FormField
                  control={form.control}
                  name="weatherCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Umbrella className="h-4 w-4 mr-2 text-purple-400" />
                        Weather (Optional)
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-purple-500/30 bg-slate-800">
                          <SelectValue placeholder="Select weather" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-purple-500/30">
                          <SelectItem value="sunny">Sunny</SelectItem>
                          <SelectItem value="cloudy">Cloudy</SelectItem>
                          <SelectItem value="rainy">Rainy</SelectItem>
                          <SelectItem value="snowy">Snowy</SelectItem>
                          <SelectItem value="windy">Windy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Thermometer className="h-4 w-4 mr-2 text-purple-400" />
                        Temperature (Optional)
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-purple-500/30 bg-slate-800">
                          <SelectValue placeholder="Select temperature" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-purple-500/30">
                          <SelectItem value="cold">Cold (Below 40°F / 5°C)</SelectItem>
                          <SelectItem value="cool">Cool (40-60°F / 15-24°C)</SelectItem>
                          <SelectItem value="mild">Mild (60-75°F / 15-24°C)</SelectItem>
                          <SelectItem value="warm">Warm (75-85°F / 24-30°C)</SelectItem>
                          <SelectItem value="hot">Hot (Above 85°F / 30°C)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <Textarea 
                      {...field} 
                      placeholder="Add notes about how you felt, compliments received, etc."
                      className="border-purple-500/30 bg-slate-800"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isFutureDate && (
                <FormField
                  control={form.control}
                  name="askForAiSuggestion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-purple-500/30 p-4">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Ask Olivia for outfit advice for this event
                        </FormLabel>
                        <FormDescription className="text-slate-400">
                          Olivia will generate a suggestion based on weather, location, and your preferences
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </ScrollArea>
        
        <DialogFooter className={`mt-4 flex ${isMobile ? 'flex-col space-y-2' : 'flex-row space-x-2 justify-end'}`}>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-purple-500/30 hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isFutureDate ? "Plan Outfit" : "Save Log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitLogForm;
