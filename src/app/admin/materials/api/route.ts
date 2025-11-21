// /app/admin/materials/api/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase'; // 使用服务端客户端

// 定义传入的 JSON 结构
interface MaterialPriceInput {
    fabricType: string;
    unitPrice: number;
    overheadRate: number;
}

export async function POST(request: Request) {
    const inputData: MaterialPriceInput = await request.json();

    // 1. 数据验证 (基础检查)
    if (!inputData.fabricType || inputData.unitPrice <= 0 || inputData.overheadRate < 0) {
        return NextResponse.json({ error: 'Invalid input data.' }, { status: 400 });
    }

    try {
        // 2. 写入 Supabase
        const { error: dbError, data } = await supabaseServer
            .from('material_prices')
            .upsert({
                fabric_type: inputData.fabricType,
                unit_price_usd_per_meter: inputData.unitPrice,
                overhead_rate_pct: inputData.overheadRate,
            }, {
                // 1. 指定冲突键：如果 fabric_type 冲突，则执行更新
                onConflict: 'fabric_type', 
                // 2. 指定更新的列 (如果未指定，则更新所有列)
                // 我们可以省略 doUpdate，因为 upsert 默认会使用提供的对象进行更新
            })
            .select(); // 确保返回数据

        if (dbError) {
            console.error("Supabase write error:", dbError);
            // 检查是否是由于重复的 fabric_type 导致的错误
            return NextResponse.json(
                { error: `Database error: Could not save/update material. ${dbError.message}` }, 
                { status: 500 }
            );
        }

        // 3. 成功响应
        return NextResponse.json({ 
            message: 'Material price successfully saved/updated.', 
            data: data[0] // 返回写入的数据
        }, { status: 200 });

    } catch (e) {
        console.error("API handler failed:", e);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Fetch all materials data
        const { data, error } = await supabaseServer
            .from('material_prices')
            .select('fabric_type, unit_price_usd_per_meter, overhead_rate_pct')
            .order('fabric_type', { ascending: true });

        if (error) {
            console.error("Supabase read error:", error);
            return NextResponse.json(
                { error: 'Failed to retrieve material data.' }, 
                { status: 500 }
            );
        }

        // Return the data array
        return NextResponse.json(data);

    } catch (e) {
        console.error("API GET handler failed:", e);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}