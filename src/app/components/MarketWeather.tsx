import { useState, useMemo } from 'react';

import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Wind, AlertTriangle } from 'lucide-react';

import { useFearGreed } from '@/hooks/useFearGreed';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';


interface WeatherCondition {
  type: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'tornado' | 'foggy' | 'frozen';
  icon: JSX.Element;
  label: string;
  color: string;
  bgGradient: string;
}

interface ForecastPeriod {
  time: string;
  weather: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  temperature: number;
  description: string;
}

interface RegionalWeather {
  region: string;
  weather: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  temperature: number;
  change: number;
}

const weatherConditions: Record<string, WeatherCondition> = {
  'sunny': {
    type: 'sunny',
    icon: <Sun className="w-16 h-16 text-yellow-400" />,
    label: 'MOSTLY SUNNY',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/10'
  },
  'partly-cloudy': {
    type: 'partly-cloudy',
    icon: <CloudDrizzle className="w-16 h-16 text-blue-300" />,
    label: 'PARTLY CLOUDY',
    color: 'text-blue-300',
    bgGradient: 'from-blue-500/20 to-gray-500/10'
  },
  'cloudy': {
    type: 'cloudy',
    icon: <Cloud className="w-16 h-16 text-gray-400" />,
    label: 'CLOUDY',
    color: 'text-gray-400',
    bgGradient: 'from-gray-500/20 to-gray-600/10'
  },
  'rainy': {
    type: 'rainy',
    icon: <CloudRain className="w-16 h-16 text-blue-400" />,
    label: 'RAINY',
    color: 'text-blue-400',
    bgGradient: 'from-blue-600/20 to-blue-700/10'
  },
  'stormy': {
    type: 'stormy',
    icon: <CloudRain className="w-16 h-16 text-purple-400" />,
    label: 'THUNDERSTORM',
    color: 'text-purple-400',
    bgGradient: 'from-purple-600/20 to-violet-700/10'
  }
};

const forecast: ForecastPeriod[] = [
  { time: 'NOW', weather: 'partly-cloudy', temperature: 24, description: 'Warm' },
  { time: '+2H', weather: 'sunny', temperature: 26, description: 'Hot' },
  { time: '+4H', weather: 'sunny', temperature: 27, description: 'Hot' },
  { time: '+8H', weather: 'partly-cloudy', temperature: 23, description: 'Cool' },
  { time: 'TMRW', weather: 'rainy', temperature: 18, description: 'Rainy' },
];

const regionalWeather: RegionalWeather[] = [
  { region: 'ASIA', weather: 'sunny', temperature: 26, change: 1.2 },
  { region: 'EUROPE', weather: 'cloudy', temperature: 18, change: 0.3 },
  { region: 'US (Pre)', weather: 'partly-cloudy', temperature: 22, change: 0.8 },
  { region: 'BONDS', weather: 'rainy', temperature: 12, change: -0.2 },
  { region: 'CRYPTO', weather: 'sunny', temperature: 28, change: 3.2 },
  { region: 'COMMODITIES', weather: 'cloudy', temperature: 19, change: 0.5 },
];

export function MarketWeather() {
  // Fetch real Fear & Greed data
  const { data: fearGreedData, loading: fearGreedLoading } = useFearGreed({
    pollingInterval: 3600000 // Update every hour
  });

  // Calculate temperature from Fear & Greed score
  // Formula: Temperature = (score / 100) * 30 (0-30°C scale)
  // Score 0-25 = 0-7.5°C (Extreme Fear = Stormy/Frozen)
  // Score 25-45 = 7.5-13.5°C (Fear = Rainy/Cold)
  // Score 45-55 = 13.5-16.5°C (Neutral = Cloudy/Cool)
  // Score 55-75 = 16.5-22.5°C (Greed = Partly Cloudy/Warm)
  // Score 75-100 = 22.5-30°C (Extreme Greed = Sunny/Hot)
  const temperature = useMemo(() => {
    if (!fearGreedData) {return 15;} // Default fallback (neutral)
    return Math.round((fearGreedData.score / 100) * 30);
  }, [fearGreedData]);

  // Determine weather condition from temperature
  const currentWeather = useMemo<keyof typeof weatherConditions>(() => {
    if (temperature < 8) {return 'stormy';} // Extreme Fear
    if (temperature < 14) {return 'rainy';} // Fear
    if (temperature < 17) {return 'cloudy';} // Neutral
    if (temperature < 23) {return 'partly-cloudy';} // Greed
    return 'sunny'; // Extreme Greed
  }, [temperature]);

  const currentCondition = weatherConditions[currentWeather];
  
  const getWeatherIcon = (weather: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    
    switch (weather) {
      case 'sunny':
        return <Sun className={`${sizeClasses[size]} text-yellow-400`} />;
      case 'partly-cloudy':
        return <CloudDrizzle className={`${sizeClasses[size]} text-blue-300`} />;
      case 'cloudy':
        return <Cloud className={`${sizeClasses[size]} text-gray-400`} />;
      case 'rainy':
        return <CloudRain className={`${sizeClasses[size]} text-blue-400`} />;
      default:
        return <Cloud className={`${sizeClasses[size]} text-gray-400`} />;
    }
  };
  
  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) {return 'text-red-400';}
    if (temp >= 20) {return 'text-green-400';}
    if (temp >= 10) {return 'text-yellow-400';}
    if (temp >= 0) {return 'text-blue-400';}
    return 'text-cyan-400';
  };
  
  const getTemperatureDescription = (temp: number) => {
    if (temp >= 30) {return 'Extreme greed (overheated)';}
    if (temp >= 20) {return 'Healthy optimism';}
    if (temp >= 10) {return 'Cautious / neutral';}
    if (temp >= 0) {return 'Fear creeping in';}
    return 'Extreme fear (frozen)';
  };
  
  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <Card className={`p-8 bg-gradient-to-br ${currentCondition.bgGradient} border-white/10 backdrop-blur-sm`}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">TODAY'S MARKET WEATHER</h2>
            {!fearGreedLoading && fearGreedData && (
              <Badge className="text-xs" variant="outline">
                F&G: {fearGreedData.score}/100
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-400">Understanding markets through weather metaphors</p>
        </div>
        
        {/* Weather Display */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            {currentCondition.icon}
          </div>
          <h3 className={`text-3xl font-bold ${currentCondition.color} mb-2`}>
            {currentCondition.label}
          </h3>
          <p className="text-gray-300 mb-6">with scattered opportunities</p>
          
          {/* Weather Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌡️</span>
                <span className="text-sm text-gray-400">Temperature</span>
              </div>
              <div className={`text-2xl font-bold ${getTemperatureColor(temperature)}`}>
                {temperature}°C
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {temperature >= 20 && temperature < 30 ? 'Warm' : temperature >= 30 ? 'Hot' : 'Cool'}
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">Winds</span>
              </div>
              <div className="text-sm font-semibold text-white">
                Light tailwinds
              </div>
              <div className="text-xs text-gray-400 mt-1">
                from Asia
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👁️</span>
                <span className="text-sm text-gray-400">Visibility</span>
              </div>
              <div className="text-sm font-semibold text-green-400">
                Clear
              </div>
              <div className="text-xs text-gray-400 mt-1">
                low uncertainty
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">☀️</span>
                <span className="text-sm text-gray-400">UV Index</span>
              </div>
              <div className="text-sm font-semibold text-yellow-400">
                Moderate
              </div>
              <div className="text-xs text-gray-400 mt-1">
                some risk OK
              </div>
            </div>
          </div>
        </div>
        
        {/* Temperature Sentiment */}
        <div className="mb-6 p-4 rounded-lg bg-black/20 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Market Sentiment</span>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              {getTemperatureDescription(temperature)}
            </Badge>
          </div>
          <Progress className="h-2" value={(temperature / 40) * 100} />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Frozen (-10°C)</span>
            <span>Overheated (40°C)</span>
          </div>
        </div>
        
        {/* Forecast */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">FORECAST</h4>
          <div className="grid grid-cols-5 gap-3">
            {forecast.map((period, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-xs text-gray-400 mb-2">{period.time}</div>
                <div className="mb-2 flex justify-center">
                  {getWeatherIcon(period.weather, 'sm')}
                </div>
                <div className={`text-lg font-bold ${getTemperatureColor(period.temperature)} mb-1`}>
                  {period.temperature}°
                </div>
                <div className="text-xs text-gray-400">{period.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Weather Alert */}
        <div className="mt-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-orange-300 mb-1">⚠️ WEATHER ALERT</div>
            <div className="text-sm text-gray-300">
              Storm system (FOMC) approaching at 14:00 UTC. Expect increased volatility.
            </div>
          </div>
        </div>
      </Card>
      
      {/* Regional Weather Map */}
      <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          GLOBAL MARKET WEATHER MAP
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {regionalWeather.map((region, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:bg-gray-900/70 transition-colors"
            >
              <div className="flex justify-center mb-3">
                {getWeatherIcon(region.weather, 'md')}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-white mb-2">{region.region}</div>
                <div className={`text-2xl font-bold ${getTemperatureColor(region.temperature)} mb-1`}>
                  {region.temperature}°C
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {region.temperature >= 20 ? 'Hot' : region.temperature >= 10 ? 'Warm' : 'Cool'}
                </div>
                <div className={`text-sm font-semibold ${region.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {region.change >= 0 ? '+' : ''}{region.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <span className="text-2xl">🌡️</span>
            <span className="text-sm text-gray-400">Global Average:</span>
            <span className="text-lg font-bold text-green-400">21°C</span>
            <span className="text-sm text-gray-400">(Comfortable for risk-taking)</span>
          </div>
        </div>
      </Card>
      
      {/* Weather Vocabulary Guide */}
      <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6">Weather Translation Guide</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Sun className="w-6 h-6 text-yellow-400" />
                <span className="font-semibold text-yellow-300">☀️ Sunny</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> Strong bull trend</div>
                <div><strong>Action:</strong> Full exposure OK</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <CloudDrizzle className="w-6 h-6 text-blue-300" />
                <span className="font-semibold text-blue-300">🌤️ Partly Cloudy</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> Bullish with caution</div>
                <div><strong>Action:</strong> Normal positions</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-6 h-6 text-gray-400" />
                <span className="font-semibold text-gray-300">⛅ Cloudy</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> Mixed signals</div>
                <div><strong>Action:</strong> Reduce size</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-600/20">
              <div className="flex items-center gap-3 mb-2">
                <CloudRain className="w-6 h-6 text-blue-400" />
                <span className="font-semibold text-blue-400">🌧️ Rainy</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> Bearish pressure</div>
                <div><strong>Action:</strong> Defensive stance</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <CloudRain className="w-6 h-6 text-purple-400" />
                <span className="font-semibold text-purple-300">⛈️ Thunderstorm</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> High volatility event</div>
                <div><strong>Action:</strong> Cash or hedged</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Wind className="w-6 h-6 text-red-400" />
                <span className="font-semibold text-red-300">🌪️ Tornado</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> Black swan / crash</div>
                <div><strong>Action:</strong> Emergency mode</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-600/10 border border-gray-600/20">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-6 h-6 text-gray-500" />
                <span className="font-semibold text-gray-400">🌫️ Foggy</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> Low visibility / uncertain</div>
                <div><strong>Action:</strong> Wait for clarity</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-2">
                <CloudSnow className="w-6 h-6 text-cyan-400" />
                <span className="font-semibold text-cyan-300">❄️ Frozen</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-1"><strong>Trading:</strong> No movement / holiday</div>
                <div><strong>Action:</strong> Nothing to do</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
