import { useState, useMemo, useCallback } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Network, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  change: number;
}

interface Correlation {
  asset1: string;
  asset2: string;
  value: number;
  strength: 'strong' | 'medium' | 'weak';
  type: 'positive' | 'negative';
  breaking?: boolean;
}

const assets: Asset[] = [
  { id: 'spx', name: 'S&P 500', symbol: 'SPX', change: 0.6 },
  { id: 'ndx', name: 'NASDAQ', symbol: 'NDX', change: 0.9 },
  { id: 'dxy', name: 'Dollar', symbol: 'DXY', change: -0.3 },
  { id: 'gold', name: 'Gold', symbol: 'GC', change: 0.8 },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', change: 3.2 },
  { id: 'vix', name: 'VIX', symbol: 'VIX', change: -8.0 },
];

const correlations: Correlation[] = [
  { asset1: 'SPX', asset2: 'NDX', value: 0.92, strength: 'strong', type: 'positive' },
  { asset1: 'SPX', asset2: 'VIX', value: -0.78, strength: 'strong', type: 'negative' },
  { asset1: 'DXY', asset2: 'Gold', value: -0.62, strength: 'medium', type: 'negative' },
  { asset1: 'BTC', asset2: 'SPX', value: 0.45, strength: 'medium', type: 'positive', breaking: true },
  { asset1: 'BTC', asset2: 'Gold', value: 0.38, strength: 'weak', type: 'positive' },
  { asset1: 'VIX', asset2: 'Gold', value: 0.42, strength: 'weak', type: 'positive' },
];

export function MarketMatrix() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'table'>('network');

  const getCorrelationColor = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'border-purple-500/50 bg-purple-500/10';
    if (abs >= 0.4) return 'border-blue-500/50 bg-blue-500/10';
    return 'border-gray-500/50 bg-gray-500/10';
  };

  const getCorrelationStrength = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.4) return 'Medium';
    return 'Weak';
  };

  // Memoize filtered correlations to avoid recalculation on every render
  const selectedCorrelations = useMemo(() => {
    return selectedAsset
      ? correlations.filter(
          (c) => c.asset1 === selectedAsset || c.asset2 === selectedAsset
        )
      : [];
  }, [selectedAsset]);

  // Memoize callback handlers
  const handleSetViewMode = useCallback((mode: 'network' | 'table') => {
    setViewMode(mode);
  }, []);

  const handleSelectAsset = useCallback((asset: string | null) => {
    setSelectedAsset(asset);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            🕸️ MARKET MATRIX
          </h2>
          <p className="text-sm text-gray-400">Real-time correlation visualization</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            onClick={() => handleSetViewMode('network')}
            className={`${
              viewMode === 'network'
                ? 'bg-purple-500/30 text-purple-300 border-2 border-purple-400/50'
                : 'bg-gray-800/50 text-gray-400 border border-white/10'
            }`}
          >
            <Network className="w-4 h-4 mr-2" />
            Network View
          </Button>
          <Button
            onClick={() => handleSetViewMode('table')}
            className={`${
              viewMode === 'table'
                ? 'bg-purple-500/30 text-purple-300 border-2 border-purple-400/50'
                : 'bg-gray-800/50 text-gray-400 border border-white/10'
            }`}
          >
            📊 Table View
          </Button>
        </div>

        {/* Network View */}
        {viewMode === 'network' && (
          <div className="relative">
            {/* Network Visualization */}
            <div className="flex justify-center items-center min-h-[500px] relative">
              {/* Center Node - Selected Asset or Central Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <button
                  onClick={() => handleSelectAsset(null)}
                  className={`p-6 rounded-full border-4 transition-all ${
                    selectedAsset === null
                      ? 'bg-purple-500/30 border-purple-400/50 scale-110'
                      : 'bg-gray-800/50 border-white/20 hover:scale-105'
                  }`}
                >
                  <Network className="w-8 h-8 text-purple-400" />
                </button>
              </div>

              {/* Asset Nodes in Circle */}
              {assets.map((asset, index) => {
                const angle = (index * 360) / assets.length;
                const radius = 180;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={asset.id}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    <button
                      onClick={() => handleSelectAsset(asset.symbol)}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-110 ${
                        selectedAsset === asset.symbol
                          ? 'bg-blue-500/30 border-blue-400/50 scale-110'
                          : 'bg-gray-900/80 border-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-bold text-white mb-1">
                          {asset.symbol}
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            asset.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {asset.change >= 0 ? '+' : ''}
                          {asset.change.toFixed(1)}%
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* Correlation Lines */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: -1 }}
              >
                {correlations.map((corr, index) => {
                  const asset1Index = assets.findIndex((a) => a.symbol === corr.asset1);
                  const asset2Index = assets.findIndex((a) => a.symbol === corr.asset2);

                  if (asset1Index === -1 || asset2Index === -1) return null;

                  const angle1 = (asset1Index * 360) / assets.length;
                  const angle2 = (asset2Index * 360) / assets.length;
                  const radius = 180;

                  const x1 = 250 + Math.cos((angle1 * Math.PI) / 180) * radius;
                  const y1 = 250 + Math.sin((angle1 * Math.PI) / 180) * radius;
                  const x2 = 250 + Math.cos((angle2 * Math.PI) / 180) * radius;
                  const y2 = 250 + Math.sin((angle2 * Math.PI) / 180) * radius;

                  const opacity = Math.abs(corr.value);
                  const strokeColor =
                    corr.strength === 'strong'
                      ? '#a855f7'
                      : corr.strength === 'medium'
                      ? '#3b82f6'
                      : '#6b7280';

                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={corr.breaking ? 3 : Math.abs(corr.value) * 4}
                      strokeOpacity={opacity}
                      strokeDasharray={corr.breaking ? '5,5' : '0'}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-purple-500" />
                <span className="text-gray-400">Strong (&gt;0.7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-blue-500" />
                <span className="text-gray-400">Medium (0.4-0.7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-gray-500" />
                <span className="text-gray-400">Weak (&lt;0.4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-red-500 border-dashed border-2 border-red-400" />
                <span className="text-gray-400">Breaking</span>
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm text-gray-400">Asset Pair</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-400">Correlation</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-400">Strength</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-400">Type</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {correlations.map((corr, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{corr.asset1}</span>
                        <span className="text-gray-500">↔</span>
                        <span className="font-semibold text-white">{corr.asset2}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        className={`${
                          Math.abs(corr.value) >= 0.7
                            ? 'bg-purple-500/20 text-purple-300'
                            : Math.abs(corr.value) >= 0.4
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {corr.value >= 0 ? '+' : ''}
                        {corr.value.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-300 capitalize">{corr.strength}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {corr.type === 'positive' ? (
                        <div className="flex items-center justify-center gap-1 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Positive</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-red-400">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm">Negative</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {corr.breaking ? (
                        <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                          🔴 Breaking
                        </Badge>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          ✓ Normal
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Selected Asset Details */}
      {selectedAsset && (
        <Card className="p-6 bg-gray-800/50 border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🔍</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                Exploring: {selectedAsset}
              </h3>
              <p className="text-sm text-gray-400">How this asset correlates with others</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectAsset(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Correlations */}
            <div>
              <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                MOVES WITH (Positive)
              </h4>
              <div className="space-y-2">
                {selectedCorrelations
                  .filter((c) => c.type === 'positive')
                  .map((corr, index) => {
                    const otherAsset =
                      corr.asset1 === selectedAsset ? corr.asset2 : corr.asset1;
                    return (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">
                            {otherAsset}
                          </span>
                          <Badge className="bg-green-500/20 text-green-300">
                            +{corr.value.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Negative Correlations */}
            <div>
              <h4 className="text-sm font-semibold text-red-300 mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                MOVES AGAINST (Negative)
              </h4>
              <div className="space-y-2">
                {selectedCorrelations
                  .filter((c) => c.type === 'negative')
                  .map((corr, index) => {
                    const otherAsset =
                      corr.asset1 === selectedAsset ? corr.asset2 : corr.asset1;
                    return (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">
                            {otherAsset}
                          </span>
                          <Badge className="bg-red-500/20 text-red-300">
                            {corr.value.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-300 mb-2">TRANSLATION</h4>
                <p className="text-sm text-gray-300">
                  When {selectedAsset} moves, watch the correlated assets. Strong positive
                  correlations mean they tend to move together. Negative correlations mean they
                  move in opposite directions.
                </p>
              </div>
            </div>
          </div>

          {/* Breaking Correlation Alert */}
          {selectedCorrelations.some((c) => c.breaking) && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔴</div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-300 mb-2">
                    CORRELATION BREAKING!
                  </h4>
                  <p className="text-sm text-gray-300">
                    {selectedAsset} is decoupling from its normal correlations. Last 3 times this
                    happened, it signaled a major trend change. Monitor closely.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Insights Panel */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
        <h3 className="text-lg font-bold text-white mb-4">💡 Market Insights</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-white/10">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-purple-400">BTC Decoupling:</span> Bitcoin's
              correlation with SPX has dropped from 0.72 to 0.45. Last 3 times this happened,
              BTC outperformed SPX by 15% over the next 2 weeks.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-white/10">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-blue-400">Strong Tech Correlation:</span> SPX
              and NDX maintain 0.92 correlation - when one moves, the other follows closely.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
