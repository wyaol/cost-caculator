'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- 导入 useRouter

// 定义表单数据结构
interface MaterialPriceInput {
    fabricType: string;
    unitPrice: number;
    overheadRate: number; // 0.15 for 15%
}

const initialData: MaterialPriceInput = {
    fabricType: '',
    unitPrice: 0.00,
    overheadRate: 0.15,
};

export default function MaterialPricePage() {
    const [formData, setFormData] = useState<MaterialPriceInput>(initialData);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/admin/materials/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus('error');
                setMessage(data.error || 'Failed to save material price.');
                return;
            }

            setStatus('success');
            setMessage(`Material price for ${formData.fabricType} saved successfully!`);
            setFormData(initialData); 
            router.refresh()
        } catch (err) {
            setStatus('error');
            setMessage('Network error or server connection failed.');
        }
    };

    const isButtonDisabled = status === 'loading';

    return (
        <main className="container mx-auto p-8 max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">⚙️ Admin: Create Material Price</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                
                {/* 状态消息 */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                        status === 'success' ? 'bg-green-100 text-green-700' : 
                        status === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Fabric Type */}
                <div>
                    <label htmlFor="fabricType" className="block text-sm font-medium text-gray-700">Fabric Type (Unique ID)</label>
                    <input
                        type="text"
                        name="fabricType"
                        id="fabricType"
                        value={formData.fabricType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border p-2 text-gray-900"
                    />
                </div>

                {/* Unit Price */}
                <div>
                    <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Unit Price (USD/meter)</label>
                    <input
                        type="number"
                        name="unitPrice"
                        id="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border p-2 text-gray-900"
                    />
                </div>

                {/* Overhead Rate */}
                <div>
                    <label htmlFor="overheadRate" className="block text-sm font-medium text-gray-700">Overhead Rate (as decimal, e.g., 0.15 for 15%)</label>
                    <input
                        type="number"
                        name="overheadRate"
                        id="overheadRate"
                        value={formData.overheadRate}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border p-2 text-gray-900"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {status === 'loading' ? 'Saving...' : 'Save Material Price'}
                </button>
            </form>
        </main>
    );
}