"use client";
import React, { useState, ChangeEvent } from 'react';

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
  "Clarin": ["Bacani", "Bogtongbod", "Bonbon", "Cantoyoc", "Comago", "Lajog", "Mataub", "Nahawan", "Poblacion Centro", "Poblacion Norte", "Poblacion Sur", "Tangcasan", "Tontunan", "Tubod"],
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

export default function RegisterFarmer() {
    const [formData, setFormData] = useState({
        farmer_id: '',
        farmer_name: '',
        contact_number: '',
        barangay: '',
        municipality: '',
        farm_size: ''
    });

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
        visible: boolean;
    }>({
        message: "",
        type: "success",
        visible: false
    });

    const sanitize = (value: string) => {
        return typeof value === "string"
            ? value.replace(/<script.*?>.*?<\/script>/gi, '').replace(/[<>]/g, '')
            : value;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let newValue = value;

        // Prevent numbers in farmer name
        if (name === "farmer_name") {
            newValue = value.replace(/[^a-zA-Z\s.'-]/g, '');
        }

        // Prevent letters in contact number
        if (name === "contact_number") {
            newValue = value.replace(/[^0-9]/g, '');
        }

        // Prevent negative + invalid numbers (farm size)
        if (name === "farm_size") {
            newValue = value.replace(/[^0-9.]/g, '');

            // prevent multiple dots
            const parts = newValue.split('.');
            if (parts.length > 2) {
                newValue = parts[0] + '.' + parts[1];
            }
        }

        // Municipality logic (UNCHANGED)
        if (name === "municipality") {
            setFormData(prev => ({
                ...prev,
                municipality: newValue,
                barangay: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: newValue
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/farmers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    farmer_id: sanitize(formData.farmer_id),
                    farmer_name: sanitize(formData.farmer_name),
                }),
            });

            if (res.ok) {
                setToast({ message: "Farmer registered successfully!", type: "success", visible: true });
                setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
                setFormData({ farmer_id: '', farmer_name: '', contact_number: '', barangay: '', municipality: '', farm_size: '' });
            } else {
                const err = await res.json();
                setToast({ message: err.error || "Something went wrong", type: "error", visible: true });
                setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
            }
        } catch (err) {
            setToast({ message: "Network error. Please try again.", type: "error", visible: true });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
        }
    };

    const inputStyle = "bg-[#F1F3F4] p-2 rounded text-sm outline-none focus:ring-1 focus:ring-green-500 w-full h-[38px]";

    return (
        <div className="min-h-screen bg-[#E6F4EA] flex flex-col items-center p-8 font-sans text-black">
            {toast.visible && (
                <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 z-50
                    ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
                    {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
                </div>
            )}

            <div className="w-full max-w-5xl mt-10">
                <h2 className="text-[#0D6D32] text-xl font-semibold mb-6">Register Farmer</h2>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-6 border-b pb-2">
                        Farmer Registration Form
                    </h3>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        
                        <div className="flex flex-col">
                            <label className="text-[12px] font-medium text-gray-600 mb-1">Farmer ID</label>
                            <input name="farmer_id" type="text" className={inputStyle} placeholder="e.g., F-001" value={formData.farmer_id} onChange={handleInputChange} required />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[12px] font-medium text-gray-600 mb-1">Farmer Name</label>
                            <input name="farmer_name" type="text" className={inputStyle} placeholder="Enter Farmer Name" value={formData.farmer_name} onChange={handleInputChange} required />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[12px] font-medium text-gray-600 mb-1">Contact Number</label>
                            <input name="contact_number" type="text" className={inputStyle} placeholder="e.g., 09171234567" value={formData.contact_number} onChange={handleInputChange} />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[12px] font-medium text-gray-600 mb-1">Farm Size (hectares)</label>
                            <input name="farm_size" type="text" className={inputStyle} placeholder="e.g., 2.5" value={formData.farm_size} onChange={handleInputChange} />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[12px] font-medium text-gray-600 mb-1">Municipality (Bohol)</label>
                            <select name="municipality" value={formData.municipality} onChange={handleInputChange} className={inputStyle} required >
                                <option value="">Select Municipality</option>
                                {Object.keys(BOHOL_LOCATIONS).sort().map(muni => (
                                    <option key={muni} value={muni}>{muni}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="text-[12px] font-medium text-gray-600 mb-1">Barangay</label>
                            <select name="barangay" value={formData.barangay} onChange={handleInputChange} disabled={!formData.municipality} className={`${inputStyle} ${!formData.municipality ? 'opacity-50' : ''}`} required >
                                <option value="">Select Barangay</option>
                                {formData.municipality && BOHOL_LOCATIONS[formData.municipality].sort().map(brgy => (
                                    <option key={brgy} value={brgy}>{brgy}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-full flex gap-3 mt-6">
                            <button type="submit" className="bg-[#008137] text-white px-8 py-2 rounded text-sm font-bold hover:bg-[#006d2e] transition-colors">Save</button>
                            <button type="button" onClick={() => setFormData({ farmer_id: '', farmer_name: '', contact_number: '', barangay: '', municipality: '', farm_size: '' })} className="border border-[#008137] text-[#008137] px-8 py-2 rounded text-sm font-bold hover:bg-green-50 transition-colors">Clear</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}