import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Layers, Eye, EyeOff } from 'lucide-react';

type Layer = 1 | 2 | 3;

const layerData = {
  symbol: 'S&P 500',
  layer1: {
    price: '4,789.50',
    change: '+0.62%',
    status: '🟢 BULLISH',
    summary: 'Near all-time highs, momentum strong',
  },
  layer2: {
    priceContext: {
      distanceATH: '0.4% from ATH (4,808)',
      ytd: '+12.3% YTD',
      movingAverages: 'Above all major MAs',
    },
    marketContext: {
      greenDays: '8 consecutive green days',
      breadth: '73% stocks above 50 DMA',
      advanceDecline: 'Advancing vs declining: 3:1',
    },
    technical: {
      support: '4,750 (1%)',
      resistance: '4,808 (ATH)',
      nextSupport: '4,680 (2.3%)',
    },
    sentiment: {
      putCall: '0.82 (neutral)',
      fearGreed: '72 (greed)',
      bullish: '48% AAII Bulls',
    },
  },
  layer3: {
    internals: [
      { metric: 'Advance/Decline', value: '+1,247', signal: 'Bullish', vs20day: '+15% above' },
      { metric: 'New Highs/Lows', value: '234/12', signal: 'Bullish', vs20day: 'Expanding' },
      { metric: 'Up Volume %', value: '78%', signal: 'Bullish', vs20day: '+8% above' },
      { metric: 'McClellan Osc.', value: '+45', signal: 'Bullish', vs20day: 'Overbought zone' },
      { metric: '% > 200 DMA', value: '68%', signal: 'Healthy', vs20day: 'Stable' },
    ],
    flow: {
      etfInflows: '+$1.2B today (SPY)',
      futuresPositioning: 'Net long +12% vs avg',
      darkPool: '38% (slightly elevated)',
      blockTrades: '2.3x normal (institutional interest)',
    },
    options: {
      maxPain: '4,775 (current price above)',
      gammaExposure: '+$4.2B (dealers will buy dips)',
      zeroDTE: '2.1x avg (day traders active)',
    },
  },
};

export function MarketLayers() {
  const [activeLayer, setActiveLayer] = useState<Layer>(1);

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-7 h-7" />
          MARKET LAYERS
        </h2>
        <p className="text-sm text-gray-400">Progressive depth - see what you need, when you need it</p>
      </div>

      <div className="flex gap-3 mb-6">
        {[1, 2, 3].map((layer) => (
          <Button
            key={layer}
            onClick={() => setActiveLayer(layer as Layer)}
            className={
              activeLayer === layer
                ? 'flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0'
                : 'flex-1 bg-gray-900/30 border border-white/10 text-gray-400 hover:bg-gray-900/50'
            }
          >
            <Layers className="w-4 h-4 mr-2" />
            Layer {layer}
          </Button>
        ))}
      </div>

      {/* LAYER 1 - GLANCE */}
      {activeLayer >= 1 && (
        <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 mb-4 animate-in slide-in-from-left">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">LAYER 1: GLANCE</Badge>
            <span className="text-xs text-gray-500">Default view - quick understanding</span>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">{layerData.layer1.price}</div>
            <div className="text-2xl font-semibold text-green-400 mb-3">{layerData.layer1.change}</div>
            <Badge className="text-lg mb-3">{layerData.layer1.status}</Badge>
            <p className="text-gray-300">{layerData.layer1.summary}</p>
          </div>
        </Card>
      )}

      {/* LAYER 2 - CONTEXT */}
      {activeLayer >= 2 && (
        <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-4 animate-in slide-in-from-left">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">LAYER 2: CONTEXT</Badge>
            {activeLayer === 2 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveLayer(1)}
                className="text-gray-400"
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Hide
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">PRICE CONTEXT:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Distance from ATH:</span>
                  <span className="text-white">{layerData.layer2.priceContext.distanceATH}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">YTD:</span>
                  <span className="text-green-400">{layerData.layer2.priceContext.ytd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MAs:</span>
                  <span className="text-white">{layerData.layer2.priceContext.movingAverages}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">MARKET CONTEXT:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Green days:</span>
                  <span className="text-white">{layerData.layer2.marketContext.greenDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Breadth:</span>
                  <span className="text-white">{layerData.layer2.marketContext.breadth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">A/D ratio:</span>
                  <span className="text-white">{layerData.layer2.marketContext.advanceDecline}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">TECHNICAL LEVELS:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Support:</span>
                  <span className="text-green-400">{layerData.layer2.technical.support}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resistance:</span>
                  <span className="text-red-400">{layerData.layer2.technical.resistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Next support:</span>
                  <span className="text-yellow-400">{layerData.layer2.technical.nextSupport}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">SENTIMENT:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Put/Call:</span>
                  <span className="text-white">{layerData.layer2.sentiment.putCall}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fear & Greed:</span>
                  <span className="text-orange-400">{layerData.layer2.sentiment.fearGreed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AAII Bulls:</span>
                  <span className="text-white">{layerData.layer2.sentiment.bullish}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* LAYER 3 - DEEP DIVE */}
      {activeLayer >= 3 && (
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 animate-in slide-in-from-left">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
              LAYER 3: DEEP DIVE
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveLayer(2)}
              className="text-gray-400"
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Hide
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">INTERNALS:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-400 pb-2">Metric</th>
                      <th className="text-left text-gray-400 pb-2">Value</th>
                      <th className="text-left text-gray-400 pb-2">Signal</th>
                      <th className="text-left text-gray-400 pb-2">vs 20-day avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {layerData.layer3.internals.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2 text-white">{row.metric}</td>
                        <td className="py-2 text-blue-400">{row.value}</td>
                        <td className="py-2">
                          <Badge
                            className={
                              row.signal === 'Bullish'
                                ? 'bg-green-500/20 text-green-300 text-xs'
                                : 'bg-blue-500/20 text-blue-300 text-xs'
                            }
                          >
                            {row.signal}
                          </Badge>
                        </td>
                        <td className="py-2 text-gray-400">{row.vs20day}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">FLOW DATA:</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• {layerData.layer3.flow.etfInflows}</div>
                  <div>• {layerData.layer3.flow.futuresPositioning}</div>
                  <div>• {layerData.layer3.flow.darkPool}</div>
                  <div>• {layerData.layer3.flow.blockTrades}</div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">OPTIONS MARKET:</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• {layerData.layer3.options.maxPain}</div>
                  <div>• {layerData.layer3.options.gammaExposure}</div>
                  <div>• {layerData.layer3.options.zeroDTE}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 p-4 rounded-lg bg-gray-900/30 border border-white/5">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-blue-400" />
          <div className="text-sm text-gray-300">
            <strong className="text-white">Progressive disclosure:</strong> Layer 1 for everyone,
            Layer 2 when you need context, Layer 3 for deep analysis. Information when you need it.
          </div>
        </div>
      </div>
    </Card>
  );
}
