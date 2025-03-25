
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, citiesByCountry } from "@/lib/locationData";

type FormValues = {
  country: string;
  city: string;
};

interface WeatherSelectionFormProps {
  defaultCountry?: string;
  defaultCity?: string;
}

const WeatherSelectionForm = ({ 
  defaultCountry = 'US', 
  defaultCity = 'New York' 
}: WeatherSelectionFormProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      country: defaultCountry,
      city: defaultCity,
    },
  });
  
  const selectedCountry = form.watch('country');
  const cities = selectedCountry ? 
    citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || [] : [];
  
  return (
    <Form {...form}>
      <form className="space-y-4 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default WeatherSelectionForm;
