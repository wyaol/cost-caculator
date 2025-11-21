// /app/api/bom/calculate/route.ts

import { NextResponse } from 'next/server';
// 导入我们创建的 Supabase 服务器端实例和类型
import { supabaseServer } from '@/lib/supabase';
import { StyleInput, CostResult } from '@/lib/types';

// -------------------------------------------------------------------
// 步骤 A: 硬编码 Mock 推导函数 (取代 Gemini/LLM)
// -------------------------------------------------------------------

interface MockEstimates {
    material_consu_mock: number;
    labor_cost_mock: number;
    trim_cost_mock: number;
}

/**
 * 根据款式属性执行硬编码算法，模拟 LLM 的消耗量和成本推导。
 */
function mockBomEstimator(input: StyleInput): MockEstimates {
    // 基础值设定 (基于款式类型)
    const isTshirt = input.styleType === 'T-shirt';
    let consuBase = isTshirt ? 1.2 : 1.8; // T恤 1.2m, 牛仔裤 1.8m
    let laborBase = isTshirt ? 3.50 : 8.00; // T恤 $3.5, 牛仔裤 $8.0
    let trimBase = isTshirt ? 0.50 : 2.50; // T恤 $0.5, 牛仔裤 $2.5

    // 1. 版型系数 (Fit Multiplier)
    let fitMultiplier = 1.0;
    if (input.fit === 'Slim') fitMultiplier = 0.95; // 修身版型消耗略少
    if (input.fit === 'Loose') fitMultiplier = 1.15; // 宽松版型消耗略多

    // 2. 幅宽系数 (Width Multiplier)
    // 假设 150cm 为标准幅宽。幅宽越窄，消耗量越高（乘数 > 1.0）
    const standardWidth = 150;
    let widthFactor = standardWidth / input.fabricWidthCm;
    
    // 最终估算结果
    return {
        // 面料消耗量 (基础 * 版型 * 幅宽)
        material_consu_mock: Number((consuBase * fitMultiplier * widthFactor).toFixed(3)),
        
        // 人工成本 (基础成本 * 版型复杂性系数)
        // 修身版型人工成本略高 (1.1)
        labor_cost_mock: Number((laborBase * (input.fit === 'Slim' ? 1.1 : 1.0)).toFixed(2)), 
        
        // 辅料成本 (基础成本)
        trim_cost_mock: Number(trimBase.toFixed(2)),
    };
}

// -------------------------------------------------------------------
// 步骤 B: Next.js POST API 路由处理器
// -------------------------------------------------------------------

export async function POST(request: Request) {
    const inputData: StyleInput = await request.json();

    try {
        const estimates = mockBomEstimator(inputData);

        
        const { data: priceData, error: dbError } = await supabaseServer
            .from('material_prices')
            .select('unit_price_usd_per_meter, overhead_rate_pct')
            .eq('fabric_type', inputData.fabricType)
            .single();

        if (dbError || !priceData) {
            console.error("DB Price Lookup Error:", dbError);
            return NextResponse.json(
                { error: `Failed to retrieve material prices for ${inputData.fabricType}. Check DB.` }, 
                { status: 500 }
            );
        }

        const unitPrice = priceData.unit_price_usd_per_meter;
        const overheadRate = priceData.overhead_rate_pct;

        // 3. **最终成本计算 (P3)**
        
        // (a) 总材料成本 (Total Material Cost)
        const totalMaterialCost = (estimates.material_consu_mock * unitPrice) + estimates.trim_cost_mock;

        // (b) FOB 目标总成本 (FOB Cost)
        // FOB Cost = Total Material Cost + Labor Cost + (Total Material Cost * Overhead Rate)
        const totalFobCost = totalMaterialCost + estimates.labor_cost_mock + (totalMaterialCost * overheadRate);

        const responseData: CostResult = {
            ...estimates, 
            unit_price_usd_per_meter: Number(unitPrice),
            overhead_rate_pct: Number(overheadRate),
            total_material_cost_usd: Number(totalMaterialCost.toFixed(2)),
            total_fob_cost_usd: Number(totalFobCost.toFixed(2)),
        };

        return NextResponse.json(responseData);

    } catch (e) {
        console.error("API calculation failed:", e);
        return NextResponse.json({ error: 'Internal server calculation error.' }, { status: 500 });
    }
}