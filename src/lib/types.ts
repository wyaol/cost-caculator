// /lib/types.ts

export type StyleType = 'T-shirt' | 'Jeans';
export type FitType = 'Slim' | 'Regular' | 'Loose';
export type FabricType = 'Cotton Knit' | 'Denim Woven';

export interface StyleInput {
    styleName: string;
    styleType: StyleType;
    fit: FitType;
    fabricWidthCm: number;
    fabricType: FabricType;
}

export interface CostResult {
    material_consu_mock: number;
    labor_cost_mock: number;
    trim_cost_mock: number;

    unit_price_usd_per_meter: number;
    overhead_rate_pct: number;

    total_material_cost_usd: number;
    total_fob_cost_usd: number;
}

export interface MaterialOption {
    fabric_type: string;
    unit_price_usd_per_meter: number;
    overhead_rate_pct: number;
}