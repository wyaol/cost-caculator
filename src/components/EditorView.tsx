'use client';

import React, { useState } from 'react';
import StyleCutForm from './StyleCutForm';
import CostSummary from './CostSummary';
import { StyleInput, CostResult, StyleType, FitType, FabricType } from '@/lib/types';

const initialFormData: StyleInput = {
  styleName: '',
  styleType: 'T-shirt' as StyleType,
  fit: 'Regular' as FitType,
  fabricWidthCm: 150,
  fabricType: 'Cotton Knit' as FabricType, 
};

const initialCostResult: CostResult = {
  material_consu_mock: 0,
  labor_cost_mock: 0,
  trim_cost_mock: 0,
  unit_price_usd_per_meter: 0,
  overhead_rate_pct: 0,
  total_material_cost_usd: 0,
  total_fob_cost_usd: 0,
};


export default function EditorView() {
  const [formData, setFormData] = useState<StyleInput>(initialFormData);
  const [costResult, setCostResult] = useState<CostResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理所有表单元素的更改
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: (type === 'number') ? parseFloat(value) : value,
    }));
    setCostResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);

    if (formData.fabricWidthCm <= 0 || !formData.styleType) {
        setError("Please ensure all fields are correctly filled.");
        setIsCalculating(false);
        return;
    }

    try {
      const response = await fetch('/api/bom/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // 如果 API 返回错误状态码 (如 500)
        setError(data.error || 'Failed to calculate cost. Check API route logs.');
        setCostResult(null);
        return;
      }
      
      // 成功获取结果
      setCostResult(data as CostResult);

    } catch (err) {
      console.error("Fetch error:", err);
      setError('Network or server connection failed.');
      setCostResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div>
        <StyleCutForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isCalculating={isCalculating}
        />
      </div>

      <div>
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            🚨 Calculation Error: {error}
          </div>
        )}

        {costResult && (
          <CostSummary result={costResult} />
        )}

        {!costResult && !isCalculating && !error && (
            <div className="p-10 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
                Define the style cut and click the button to see the cost summary.
            </div>
        )}
      </div>
    </div>
  );
}