
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Outfit } from '@/lib/types';
import { OutfitLog } from '../OutfitLogItem';

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
});

interface OutfitLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: Outfit[];
  selectedDate?: Date;
  onSubmit: (log: Omit<OutfitLog, 'id'>) => void;
}

const OutfitLogForm = ({ isOpen, onClose, outfits, selectedDate, onSubmit }: OutfitLogFormProps) => {
  const form = useForm<z.infer<typeof OutfitLogSchema>>({
    resolver: zodResolver(OutfitLogSchema),
    defaultValues: {
      date: selectedDate || new Date(),
      notes: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof OutfitLogSchema>) => {
    onSubmit({
      outfitId: values.outfitId,
      date: values.date,
      timeOfDay: values.timeOfDay,
      notes: values.notes,
      weatherCondition: values.weatherCondition,
      temperature: values.temperature,
    });
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-purple-500/30 text-white">
        <h2 className="text-xl font-bold mb-4">Log an Outfit</h2>
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
                    <SelectContent className="bg-slate-900 border-purple-500/30">
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
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="border-purple-500/30 bg-slate-800">
                      <SelectValue placeholder="Select time of day" />
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
              name="weatherCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weather (Optional)</FormLabel>
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
                  <FormLabel>Temperature (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="border-purple-500/30 bg-slate-800">
                      <SelectValue placeholder="Select temperature range" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/30">
                      <SelectItem value="cold">Cold (Below 40°F / 5°C)</SelectItem>
                      <SelectItem value="cool">Cool (40-60°F / 5-15°C)</SelectItem>
                      <SelectItem value="mild">Mild (60-75°F / 15-24°C)</SelectItem>
                      <SelectItem value="warm">Warm (75-85°F / 24-30°C)</SelectItem>
                      <SelectItem value="hot">Hot (Above 85°F / 30°C)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="border-purple-500/30">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Save Log
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitLogForm;
