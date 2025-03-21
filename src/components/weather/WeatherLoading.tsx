
const WeatherLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 min-h-[100px]">
      <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Loading weather data...</p>
    </div>
  );
};

export default WeatherLoading;
