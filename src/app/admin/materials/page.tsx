// /app/admin/materials/page.tsx (Server Component)

import { supabaseServer } from '@/lib/supabase';
import MaterialPriceForm from '@/components/MaterialPriceForm'; // 这是一个客户端组件

async function getMaterials() {
    const { data, error } = await supabaseServer
        .from('material_prices')
        .select('*')
        .order('fabric_type', { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }
    return data;
}

export default async function AdminMaterialsPage() {
    const materials = await getMaterials();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">⚙️ Admin: Material Price Management</h1>

            {/* 1. 现有数据列表 */}
            <h2 className="text-xl font-semibold mb-3">Existing Materials</h2>
            <div className="bg-white p-4 rounded-lg shadow mb-8">
                {materials.length === 0 ? (
                    <p>No materials found. Please add one below.</p>
                ) : (
                    <ul className="space-y-2">
                        {materials.map((m) => (
                            <li key={m.fabric_type} className="flex justify-between border-b pb-1">
                                <span className="font-mono text-sm">{m.fabric_type}</span>
                                <span className="text-sm text-gray-600">
                                    ${m.unit_price_usd_per_meter.toFixed(2)}/m | { (m.overhead_rate_pct * 100).toFixed(1) }% OH
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 2. 创建表单 (客户端组件) */}
            <h2 className="text-xl font-semibold mb-3">Add/Update New Material</h2>
            <MaterialPriceForm /> 
        </div>
    );
}