"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';

// Specific locations for Bohol
const BOHOL_LOCATIONS: Record<string, string[]> = {
  "Alburquerque": ["Bahi", "Basacu", "Cantunoc", "Dangay", "East Poblacion", "Ponong", "San Roque", "Tagbuane", "Toril", "West Poblacion"],
  "Alicia": ["Cabatang", "Cagongcagong", "Cambaol", "Cayacay", "Del Monte", "Katipunan", "La Hacienda", "Mahayag", "Napo", "Poblacion", "Sudlon", "Untaga"],
  "Antiquera": ["Angilan", "Bantolinao", "Baucan Sur", "Baucan Norte", "Can-asuhan", "Cansinao", "Can-omay", "Celosia", "Poblacion"],
  "Baclayon": ["Guiwanon", "Laya", "Libertad", "Montana", "Pagnitoan", "Paya", "Poblacion", "San Roque", "Santa Cruz", "Taguihon"],
  "Balilihan": ["Baucan", "Cabad", "Candasig", "Cantalina", "Datag", "Hanopol Norte", "Hanopol Este", "Magsaysay", "Poblacion"],
  "Batuan": ["Aloja", "Cabacnitan", "Cambanay", "Cantigdas", "Garcia", "Janlupan", "Poblacion Norte", "Poblacion Sur", "Quezon"],
  "Bilar": ["Bonifacio", "Bugang Norte", "Bugang Sur", "Campagao", "Cansumbol", "Dagohoy", "Owac", "Poblacion", "Roxas", "Subayon", "Villa Aurora"],
  "Calape": ["Abucay Norte", "Abucay Sur", "Bantulan", "Binogawan", "Bonbon", "Cabayugan", "Desamparados", "Libaong", "Lucob", "Madangog", "Pangangan", "Poblacion"],
  "Candijay": ["Abihilan", "Anislag", "Can-olin", "Cogtong", "La Union", "Lunas", "Mahusay", "Pagahat", "Poblacion", "Tambongan", "Tawid"],
  "Carmen": ["Alicia", "Bicao", "Buenavista", "Caluasan", "Guadalupe", "La Libertad", "Montesuerte", "Nueva Fuerza", "Poblacion Norte", "Poblacion Sur"],
  "Clarin": ["Bacani", "Bogtongbod", "Bonbon", "Cantoyoc", "Comaang", "Lajog", "Mataub", "Nahawan", "Poblacion Centro", "Poblacion Norte", "Poblacion Sur", "Tangcasan", "Tontunan", "Tubod"],
  "Corella": ["Anislag", "Can-ampao", "Can-iwag", "Magsaysay", "Poblacion Blanco", "Poblacion Main", "Sambog"],
  "Cortes": ["De la Paz", "Fatima", "Laya", "Malayo Norte", "Malayo Sur", "Poblacion", "Salvador", "Upper de la Paz"],
  "Dagohoy": ["Babag", "Can-oling", "Candelaria", "Estaca", "La Esperanza", "Mahayag", "Malitbog", "Poblacion", "San Vicente", "Santa Cruz"],
  "Danao": ["Cabiturian", "Cantubod", "Carbon", "Concepcion", "Dagohoy", "Hibale", "Magtangtang", "Poblacion", "Remedios", "San Roque", "Santa Fe"],
  "Dauis": ["Biking", "Bingag", "Catarman", "Mariveles", "Poblacion", "San Isidro", "Songculan", "Tabalong", "Totolan"],
  "Dimiao": ["Abihid", "Aleman", "Bagua", "Bakilid", "Balbalan", "Can-andam", "Can-oling", "Guindaguitan", "Poblacion", "Tangohay"],
  "Duero": ["Alejawan", "Angilan", "Anislag", "Bangwalog", "Cansuhay", "Guinsularan", "Itum", "Langkis", "Madua Norte", "Madua Sur", "Poblacion", "San Antonio"],
  "Garcia Hernandez": ["Abijilan", "Antioquia", "Cabatang", "Cagawasan", "Can-aya", "Cansuje", "Libertad", "Poblacion", "Sacaon", "West Can-aya"],
  "Getafe": ["Banacon", "Buyog", "Cabiangon", "Campao Occidental", "Campao Oriental", "Cortes", "Handumon", "Jandayan Norte", "Jandayan Sur", "Poblacion", "Salog", "Tulang"],
  "Guindulman": ["Basdio", "Biabas", "Bulawan", "Cabantian", "Canhaway", "Casbu", "Guinacot", "Mayuga", "Poblacion", "Tabajan", "Trinidad"],
  "Inabanga": ["Badiang", "Bagohan", "Banahao", "Baogo", "Bugang", "Cagawasan", "Cambitayan", "Can-awa", "Dagnawan", "Liloan", "Lutao", "Mabuhay", "Nabuad", "Poblacion"],
  "Jagna": ["Alejawan", "Balbalan", "Boctol", "Buyog", "Can-upao", "Fina", "Looc", "Mayana", "Nausok", "Poblacion", "Tejero", "Tubod Monte"],
  "Lila": ["Banban", "Bonkokan Ilaya", "Bonkokan Ubos", "Calvario", "Candulang", "Catugasan", "Cayupo", "Lomanoy", "Poblacion", "Taug"],
  "Loay": ["Agape", "Booy", "Botoc Occidental", "Botoc Oriental", "Calvario", "Concepcion", "Poblacion Ibabao", "Poblacion Ubos", "Sacaon", "Tayong"],
  "Loboc": ["Agape", "Alegria", "Bagumbayan", "Bahian", "Bonbon Bajo", "Calvario", "Candasag", "Can-uayon", "Jimilian", "Oy", "Poblacion", "Quinoguitan"],
  "Loon": ["Agining", "Basdio", "Bintig", "Cabad", "Calayugan Norte", "Calayugan Sur", "Canmaag", "Cantam-is Bago", "Catagbacan Norte", "Catagbacan Sur", "Poblacion", "Sandingan", "Taytay"],
  "Mabini": ["Abaca", "Aguipo", "Baybayon", "Bulawan", "Can-asuhan", "Concepcion", "Minol", "Poblacion", "San Isidro", "Tambuan"],
  "Maribojoc": ["Agahay", "Aliguay", "Anislag", "Bayacabac", "Bood", "Busao", "Cabawan", "Candavid", "Dipatlong", "Guiwanon", "Jandig", "Poblacion", "Punsod", "San Roque"],
  "Panglao": ["Bil-isan", "Bolod", "Danao", "Libaong", "Looc", "Lourdes", "Poblacion", "Tangnan", "Tawala"],
  "Pilar": ["Bagumbayan", "Baguingin", "Buena Suerte", "Cagawasan", "Can-uayon", "Estaca", "Lumbay", "Poblacion", "Rizal", "San Isidro"],
  "Pres. Carlos P. Garcia": ["Aguining", "Basiao", "Baud", "Bonbonon", "Butan", "Canmancao", "Gaus", "Lipata", "Poblacion", "San Jose", "Tugas"],
  "Sagbayan": ["Canmaya Centro", "Canmaya Este", "Canmaya Norte", "Kagawasan", "Katipunan", "Poblacion", "San Agustin", "San Antonio", "San Isidro", "Santa Catalina"],
  "San Isidro": ["Abehilas", "Baryong Daan", "Baogo", "Cabanugan", "Caimbang", "Cambansag", "Candungao", "Masonoy", "Poblacion", "Urbiztondo"],
  "San Miguel": ["Bayongan", "Bugang", "Cabangahan", "Capayas", "Corazon", "Mahayag", "Poblacion", "San Isidro", "San Jose", "San Roque", "Tomoc"],
  "Sevilla": ["Bayawahan", "Cabancalan", "Calinginan Norte", "Calinginan Sur", "Cambagui", "Guinob-an", "Lagtangan", "Libaong", "Poblacion"],
  "Sierra Bullones": ["Abihilan", "Bugsoc", "Can-onong", "Casay", "Catagdaan", "Mabuhay", "Poblacion", "Salvador", "San Isidro", "San Jose", "Villa-Arca"],
  "Sikatuna": ["Abihid", "Badiang", "Bahayhayan", "Cambuac Norte", "Cambuac Sur", "Can-agong", "Libertad", "Poblacion", "Ubujan"],
  "Tagbilaran City": ["Bool", "Booy", "Cabawan", "Cogon", "Dampas", "Mansasa", "Poblacion I", "Poblacion II", "Poblacion III", "San Isidro", "Taloto", "Tiptip", "Ubujan"],
  "Talibon": ["Bagacay", "Balintawak", "Burgos", "Guindacpan", "Magsaysay", "Poblacion", "San Agustin", "San Francisco", "San Isidro", "San Jose", "Tanghaligue"],
  "Trinidad": ["Banlasan", "Bongbong", "Catoogan", "Guinobatan", "Hinlayagan Ilaud", "Hinlayagan Ilaya", "Kauswagan", "Mabuhay", "Poblacion", "San Isidro", "San Jose"],
  "Tubigon": ["Bagongbanwa", "Bunacan", "Cabolotan", "Cawayanan", "Ilijan Norte", "Ilijan Sur", "Macaas", "Poblacion Centro", "Poblacion Mabini", "Pinayagan Norte", "Pinayagan Sur", "Pooc Occidental", "Pooc Oriental", "Ubay Norte", "Ubay Sur"],
  "Ubay": ["Bayabasan", "Benliw", "Biabas", "Bongbong", "Bulilis", "California", "Camambugan", "Casate", "Cuya", "Fatima", "Gabi", "Imelda", "Lomangog", "Poblacion", "San Pascual", "Sentinela", "Tapal", "Tugas"],
  "Valencia": ["Adia", "Anas", "Balingasao", "Can-uba", "Can-umantad", "Libaong", "Luzon", "Poblacion Occidental", "Poblacion Oriental", "Taug", "Taytay"]
};

interface Farmer {
  farmer_id: string;
  farmer_name: string;
  contact_number: string;
  barangay: string;
  municipality: string;
  farm_size: string | number;
}

const EditFarmerRecord: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    farmerId: '',
    name: '',
    contact: '',
    barangay: '',
    municipality: '',
    size: ''
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false
  });

  const fetchFarmers = async () => {
    try {
      const res = await fetch('/api/farmers');
      const data = await res.json();

      if (data && data.farmers) {
        setFarmers(data.farmers);
        if (!isEditing) {
          setFormData(prev => ({ ...prev, farmerId: data.nextId || '' }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => { fetchFarmers(); }, []);

  // ✅ FIXED INPUT HANDLER (no negatives, no letters)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  let newValue = value;

  // ❌ Prevent numbers in farmer name
  if (name === "name") {
    // allow letters, spaces, and basic punctuation only
    newValue = value.replace(/[^a-zA-Z\s.'-]/g, '');
  }

  // ❌ Prevent non-numeric & negative values (for size)
  if (name === "size") {
    // allow only positive numbers (no negative, no letters)
    newValue = value.replace(/[^0-9.]/g, '');

    // prevent multiple dots (e.g., 2.5.6)
    const parts = newValue.split('.');
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts[1];
    }
  }

  // ❌ Prevent letters in contact number
  if (name === "contact") {
    newValue = value.replace(/[^0-9]/g, '');
  }

  // Municipality logic stays the same
  if (name === "municipality") {
    setFormData({ ...formData, municipality: newValue, barangay: '' });
  } else {
    setFormData({ ...formData, [name]: newValue });
  }
};

  // ✅ VALIDATION (for testing)
  const validateForm = () => {
    if (!formData.farmerId.trim()) return "Farmer ID and Name are required";
    if (!formData.name.trim()) return "Farmer ID and Name are required";
    if (formData.size && parseFloat(formData.size) < 0) return "Invalid farm size";
    return null;
  };

  const handleSelectRecord = (f: Farmer) => {
    setIsEditing(true);
    setFormData({
      farmerId: f.farmer_id,
      name: f.farmer_name,
      contact: f.contact_number,
      barangay: f.barangay,
      municipality: f.municipality,
      size: f.farm_size.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ ONLY LOGIC UPDATED
  const handleSave = async () => {
    const errorMsg = validateForm();

    if (errorMsg) {
      setToast({ message: errorMsg, type: "error", visible: true });
      return;
    }

    const res = await fetch('/api/farmers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmer_id: formData.farmerId.trim(),
        farmer_name: formData.name.trim(),
        contact_number: formData.contact,
        barangay: formData.barangay,
        municipality: formData.municipality,
        farm_size: formData.size || 0
      }),
    });

    if (res.ok) {
      setToast({
        message: isEditing ? "Farmer Record Updated!" : "Farmer Registered!",
        type: "success",
        visible: true
      });

      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      fetchFarmers();
      handleClear();
    } else {
      const err = await res.json();
      setToast({
        message: err.error || "Something went wrong",
        type: "error",
        visible: true
      });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    }
  };

  const handleClear = () => {
    setIsEditing(false);
    setFormData({
      farmerId: '',
      name: '',
      contact: '',
      barangay: '',
      municipality: '',
      size: ''
    });
    fetchFarmers();
  };

  const inputBaseStyle = "p-2.5 text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full block";

  return (
    // ✅ ENTIRE JSX BELOW IS 100% UNCHANGED
    // (your original design is preserved exactly)
    <div className="space-y-6">
      {toast.visible && (
        <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold z-[9999] transition-all
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      <h2 className="text-[#0D6D32] text-xl font-semibold mb-4">Farmer Management</h2>

      {/* EVERYTHING ELSE REMAINS EXACTLY AS YOUR ORIGINAL CODE */}

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-700 font-bold text-sm mb-6 border-b pb-2">
          {isEditing ? "Update Farmer Profile" : "Register New Farmer"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Farmer ID {isEditing && <span className="text-red-500 font-normal">(Locked)</span>}
            </label>
            <input
              name="farmerId"
              value={formData.farmerId}
              onChange={handleInputChange}
              readOnly={isEditing}
              className={`${inputBaseStyle} ${isEditing ? 'bg-gray-200 text-gray-600 cursor-not-allowed italic' : 'bg-[#F1F3F4]'}`}
              placeholder="e.g., F-001"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Farmer Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter farmer name"
              className={`${inputBaseStyle} bg-[#F1F3F4]`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Contact Number</label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="e.g., 09171234567"
              className={`${inputBaseStyle} bg-[#F1F3F4]`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Farm Size (hectares)</label>
            <input
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="e.g., 2.5"
              className={`${inputBaseStyle} bg-[#F1F3F4]`}
            />
          </div>

          {/* Municipality Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Municipality (Bohol)</label>
            <select
              name="municipality"
              value={formData.municipality}
              onChange={handleInputChange}
              className={`${inputBaseStyle} bg-[#F1F3F4] cursor-pointer`}
            >
              <option value="">Select Municipality</option>
              {Object.keys(BOHOL_LOCATIONS).sort().map(muni => (
                <option key={muni} value={muni}>{muni}</option>
              ))}
            </select>
          </div>
          
          {/* Barangay Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Barangay</label>
            <select
              name="barangay"
              value={formData.barangay}
              onChange={handleInputChange}
              disabled={!formData.municipality}
              className={`${inputBaseStyle} bg-[#F1F3F4] cursor-pointer ${!formData.municipality ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">Select Barangay</option>
              {formData.municipality && (BOHOL_LOCATIONS[formData.municipality] || []).sort().map(brgy => (
                <option key={brgy} value={brgy}>{brgy}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSave}
            className="bg-[#0D6D32] text-white px-8 py-2 rounded font-semibold text-sm hover:bg-[#0a5628] transition-colors"
          >
            {isEditing ? "Update" : "Save"}
          </button>

          <button
            onClick={handleClear}
            className="bg-white border border-[#0D6D32] text-[#0D6D32] px-8 py-2 rounded font-semibold text-sm hover:bg-green-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 text-sm">Farmer List</h3>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-[#DCFCE7] text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-300 text-black">Farmer ID</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-300 text-black">Farmer Name</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-300 text-black">Contact</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-300 text-black">Location</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-300 text-black text-right">Farm Size</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-black">
                {farmers.length > 0 ? (
                  farmers.map((f) => (
                    <tr
                      key={f.farmer_id}
                      onClick={() => handleSelectRecord(f)}
                      className="hover:bg-green-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm border-b border-gray-300">{f.farmer_id}</td>
                      <td className="px-4 py-3 text-sm border-b border-gray-300">{f.farmer_name}</td>
                      <td className="px-4 py-3 text-sm border-b border-gray-300">{f.contact_number}</td>
                      <td className="px-4 py-3 text-sm border-b border-gray-300">{f.barangay}, {f.municipality}</td>
                      <td className="px-4 py-3 text-sm border-b border-gray-300 text-right">{f.farm_size} ha</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                      No farmers registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditFarmerRecord;