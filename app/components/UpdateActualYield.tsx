"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Crop = {
  crop_id: string;
  planting_date?: string;
  growth_stage?: string;
  expected_harvest_date?: string;
  estimated_yield: number;
  actual_yield?: number;
};

const UpdateActualYield: React.FC = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Crop[]>([]);
  const [cropData, setCropData] = useState<Crop | null>(null);
  const [actualYield, setActualYield] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch records
  const fetchRecords = async () => {
    setFetching(true);
    setError(null);

    try {
      const res = await fetch("/api/crops");

      if (!res.ok) throw new Error("Failed to fetch records");

      const data = await res.json();

      const safeData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setRecords(safeData);
    } catch (err) {
      console.error(err);
      setError("Unable to load crop records.");
      setRecords([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Select record
  const handleSelectRecord = (row: Crop) => {
    setCropData(row);
    setActualYield(row.actual_yield?.toString() || "");
  };

  // ✅ Validation
  const validateYield = (value: string): string | null => {
    if (!value.trim()) return "Actual yield is required.";

    const num = Number(value);

    if (isNaN(num)) return "Must be a valid number.";
    if (num < 0) return "Cannot be negative.";

    return null;
  };

  // ✅ Update
  const handleUpdate = async () => {
    if (!cropData) {
      setError("No crop selected.");
      return;
    }

    const validationError = validateYield(actualYield);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/crops/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId: cropData.crop_id,
          actualYield: Number(actualYield),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Update failed");
      }

      await fetchRecords();
      router.refresh();

      // Reset
      setCropData(null);
      setActualYield("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="update-actual-yield-page">
      <h2 className="text-[#0D6D32] text-xl font-semibold">
        Update Actual Yield
      </h2>

      {/* ✅ ERROR DISPLAY */}
      {error && (
        <div
          className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm"
          data-testid="error-message"
        >
          {error}
        </div>
      )}

      {/* ✅ TABLE */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-sm text-gray-700">Crop Records</h3>
        </div>
        <div className="px-6 py-4 border-b border-gray-50">
        <div className="bg-white rounded-xl shadow-sm border-r border-gray-100 overflow-hidden">
          {fetching ? (
            <p data-testid="loading-records" className="text-gray-500 text-sm">
              Loading records...
            </p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#DCFCE7] text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Crop ID</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Planting Date</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Growth Stage</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Expected Harvest</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Estimated Yield</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Actual Yield</th>
                </tr>
              </thead>

              <tbody className="divide-y text-sm text-black">
                {records.length > 0 ? (
                  records.map((row) => (
                    <tr
                      key={row.crop_id}
                      data-testid={`row-${row.crop_id}`}
                      onClick={() => handleSelectRecord(row)}
                      className={`cursor-pointer hover:bg-green-50 ${
                        cropData?.crop_id === row.crop_id
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 ">{row.crop_id}</td>
                      <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">
                        {row.planting_date
                          ? new Date(row.planting_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.growth_stage || "N/A"}</td>
                      <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">
                        {row.expected_harvest_date
                          ? new Date(
                              row.expected_harvest_date
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.estimated_yield}</td>
                      <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">
                        {row.actual_yield ?? "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-400"
                      data-testid="no-records"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        </div>
      </section>

      {/* ✅ UPDATE FORM */}
      {cropData && (
        <section
          className="bg-white p-6 rounded-lg shadow-sm border"
          data-testid="update-form"
        >
          <h3 className="text-gray-700 text-sm font-semibold">
            Selected: {cropData.crop_id}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">
                Estimated Yield
              </p>
              <p className="text-2xl text-gray-500 font-bold">
                {cropData.estimated_yield}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold">
                Actual Yield (Tons)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={actualYield}
                onChange={(e) => setActualYield(e.target.value)}
                className="p-2.5 bg-[#F1F3F4] text-black placeholder-gray-300 border border-gray-300 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="actual-yield-input"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleUpdate}
              disabled={loading}
              data-testid="update-button"
              className={`px-6 py-2 text-sm text-white rounded ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0D6D32] hover:bg-[#0a5628]"
              }`}
            >
              {loading ? "Updating..." : "Update Record"}
            </button>
          </div>
        </section>
      )}  
    </div>
  );
};

export default UpdateActualYield;