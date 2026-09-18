import React, { useState, useEffect } from 'react';
import { VEHICLE_DATA } from '../utils/vehicleData';
import { Search } from 'lucide-react';

const VehicleFilterBar = ({ onFilterSubmit }) => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const makes = Object.keys(VEHICLE_DATA);
  const models = selectedMake ? Object.keys(VEHICLE_DATA[selectedMake]) : [];
  const years = (selectedMake && selectedModel) ? VEHICLE_DATA[selectedMake][selectedModel] : [];

  // Reset dependent fields when parent changes
  useEffect(() => {
    setSelectedModel('');
    setSelectedYear('');
  }, [selectedMake]);

  useEffect(() => {
    setSelectedYear('');
  }, [selectedModel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMake && selectedModel && selectedYear) {
      onFilterSubmit({
        make: selectedMake,
        model: selectedModel,
        year: selectedYear
      });
    } else {
      // Opt: Allow partial filtering, but the prompt says "Bu 3 parametreye göre filtrele"
      // and "Seçim yapmadan diğer kutular aktifleşmeyecek". Let's require all 3 for the demo.
      alert('Lütfen aramanızı başlatmak için tüm araç bilgilerini seçiniz.');
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center relative z-10 mt-6 mx-auto max-w-7xl">
      <div className="flex-grow w-full md:w-auto flex flex-col md:flex-row gap-4">
        
        {/* Marka Seçimi */}
        <div className="flex-1">
          <select 
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D5A738] focus:border-transparent transition-shadow text-gray-700"
          >
            <option value="">1. Marka Seçiniz</option>
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Model Seçimi */}
        <div className="flex-1">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake}
            className={`w-full border border-gray-200 rounded-xl px-4 py-3 ${!selectedMake ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D5A738] focus:border-transparent transition-shadow'}`}
          >
            <option value="">2. Model Seçiniz</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* Yıl/Kasa Seçimi */}
        <div className="flex-1">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedModel}
            className={`w-full border border-gray-200 rounded-xl px-4 py-3 ${!selectedModel ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D5A738] focus:border-transparent transition-shadow'}`}
          >
            <option value="">3. Kasa/Yıl Seçiniz</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtrele Butonu */}
      <div 
        onClick={handleSubmit}
        className="bg-[#D5A738] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all border-0 shadow-none w-full md:w-auto whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
      >
        <Search size={18} />
        Aracıma Uygun Ürünleri Bul
      </div>
    </div>
  );
};

export default VehicleFilterBar;
