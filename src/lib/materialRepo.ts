import { supabaseServer } from './supabase';

interface MaterialPriceWriteInput {
    fabricType: string;
    unitPrice: number;
    overheadRate: number;
}

/**
 * 写入或更新 material_prices 表中的记录 (使用 UPSERT)
 */
export async function saveOrUpdateMaterialPrice(data: MaterialPriceWriteInput) {
    const { error, data: result } = await supabaseServer
        .from('material_prices')
        .upsert({
            fabric_type: data.fabricType,
            unit_price_usd_per_meter: data.unitPrice,
            overhead_rate_pct: data.overheadRate,
        }, { 
            onConflict: 'fabric_type', // 遇到冲突时更新
            ignoreDuplicates: false 
        })
        .select('fabric_type');

    if (error) {
        throw new Error(`Database error: ${error.message}`);
    }
    return result;
}
