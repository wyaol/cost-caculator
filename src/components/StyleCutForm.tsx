import React, { useEffect, useState } from "react";
import {
  StyleInput,
  StyleType,
  FitType,
  FabricType,
  MaterialOption,
} from "@/lib/types";

interface StyleCutFormProps {
  formData: StyleInput;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isCalculating: boolean;
}

const STYLE_TYPES: StyleType[] = ["T-shirt", "Jeans"];
const FIT_TYPES: FitType[] = ["Slim", "Regular", "Loose"];
const FABRIC_TYPES: FabricType[] = ["Cotton Knit", "Denim Woven"];

export default function StyleCutForm({
  formData,
  handleChange,
  handleSubmit,
  isCalculating,
}: StyleCutFormProps) {
  const [materialOptions, setMaterialOptions] = useState<MaterialOption[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialError, setMaterialError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/admin/materials/api"); // <-- Call the new GET API
        if (!response.ok) {
          throw new Error("Failed to fetch material list.");
        }
        const data: MaterialOption[] = await response.json();
        setMaterialOptions(data);

        // Optional: If data is fetched, set the first item as the default selection
        if (data.length > 0 && formData.fabricType === "Cotton Knit") {
          handleChange({
            target: { name: "fabricType", value: data[0].fabric_type },
          } as React.ChangeEvent<HTMLSelectElement>);
        }
      } catch (err) {
        console.error(err);
        setMaterialError("Could not load material options from database.");
      } finally {
        setIsLoadingMaterials(false);
      }
    };
    fetchMaterials();
  }, []); // Run only once on mount

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
        📌 Step 1: Define Style Cut
      </h2>

      {/* Style Name */}
      <div className="mb-4">
        <label
          htmlFor="styleName"
          className="block text-sm font-medium text-gray-700"
        >
          Style Name
        </label>
        <input
          type="text"
          name="styleName"
          id="styleName"
          value={formData.styleName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>

      {/* Style Type */}
      <div className="mb-4">
        <label
          htmlFor="styleType"
          className="block text-sm font-medium text-gray-700"
        >
          Style Type
        </label>
        {isLoadingMaterials ? (
            <p className="mt-1 text-sm text-gray-500">Loading materials...</p>
          ) : materialError ? (
            <p className="mt-1 text-sm text-red-600">{materialError}</p>
          ) : (
            <select
              name="fabricType"
              id="fabricType"
              value={formData.fabricType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            >
              <option value="" disabled>
                Select fabric
              </option>
              {materialOptions.map(
                (
                  material // <-- Use dynamic options
                ) => (
                  <option
                    key={material.fabric_type}
                    value={material.fabric_type}
                  >
                    {material.fabric_type} ($
                    {material.unit_price_usd_per_meter.toFixed(2)}/m)
                  </option>
                )
              )}
            </select>
          )}
      </div>

      {/* Fit */}
      <div className="mb-4">
        <label
          htmlFor="fit"
          className="block text-sm font-medium text-gray-700"
        >
          Fit
        </label>
        <select
          name="fit"
          id="fit"
          value={formData.fit}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
        >
          <option value="" disabled>
            Select fit
          </option>
          {FIT_TYPES.map((fit) => (
            <option key={fit} value={fit}>
              {fit}
            </option>
          ))}
        </select>
      </div>

      {/* Fabric Type */}
      <div className="mb-4">
        <label
          htmlFor="fabricType"
          className="block text-sm font-medium text-gray-700"
        >
          Main Fabric Type
        </label>
        <select
          name="fabricType"
          id="fabricType"
          value={formData.fabricType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
        >
          <option value="" disabled>
            Select fabric
          </option>
          {FABRIC_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Fabric Width */}
      <div className="mb-6">
        <label
          htmlFor="fabricWidthCm"
          className="block text-sm font-medium text-gray-700"
        >
          Fabric Width (cm)
        </label>
        <input
          type="number"
          name="fabricWidthCm"
          id="fabricWidthCm"
          value={formData.fabricWidthCm || ""}
          onChange={handleChange}
          required
          min="100"
          max="200"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isCalculating}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
      >
        {isCalculating ? "Calculating..." : "⚡ Smart Estimate BOM & Cost"}
      </button>
    </form>
  );
}
