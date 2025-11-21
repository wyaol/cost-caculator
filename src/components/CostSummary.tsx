import { CostResult } from '@/lib/types';
import React from 'react';

interface CostSummaryProps {
  result: CostResult;
}

export default function CostSummary({ result }: CostSummaryProps) {
  // 辅助函数：格式化为美元
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatPercentage = (rate: number) => 
    `${(rate * 100).toFixed(1)}%`;

  const dataPoints = [
    { label: 'Material Consumption (m/unit)', value: `${result.material_consu_mock.toFixed(3)} m`, type: 'info' },
    { label: 'Labor Cost (USD/unit)', value: formatCurrency(result.labor_cost_mock), type: 'info' },
    { label: 'Trim Cost (USD/unit)', value: formatCurrency(result.trim_cost_mock), type: 'info' },
    { label: '---', value: '---', type: 'divider' },
    { label: 'TOTAL MATERIAL COST', value: formatCurrency(result.total_material_cost_usd), type: 'material' },
    { label: 'Overhead Rate', value: formatPercentage(result.overhead_rate_pct), type: 'info' },
    { label: '---', value: '---', type: 'divider' },
    { label: 'TOTAL FOB COST (Est.)', value: formatCurrency(result.total_fob_cost_usd), type: 'total' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">💰 Step 3: Cost Summary</h2>
      
      <dl className="space-y-3">
        {dataPoints.map((item, index) => (
          <div key={index}>
            {item.type === 'divider' ? (
              <hr className="my-2 border-dashed border-gray-300" />
            ) : (
              <div className={`flex justify-between ${item.type === 'total' ? 'font-bold text-lg text-indigo-700' : ''}`}>
                <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
              </div>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}