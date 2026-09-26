import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { sizeGuideOpen, setSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  if (!sizeGuideOpen) return null;

  const measurements = [
    { size: 'XS', chest: unit === 'cm' ? '92 - 96' : '36 - 38', waist: unit === 'cm' ? '76 - 80' : '30 - 31', shoulder: unit === 'cm' ? '46' : '18.1', length: unit === 'cm' ? '72' : '28.3' },
    { size: 'S', chest: unit === 'cm' ? '97 - 102' : '38 - 40', waist: unit === 'cm' ? '81 - 86' : '32 - 34', shoulder: unit === 'cm' ? '48' : '18.9', length: unit === 'cm' ? '74' : '29.1' },
    { size: 'M', chest: unit === 'cm' ? '103 - 108' : '40 - 42', waist: unit === 'cm' ? '87 - 92' : '34 - 36', shoulder: unit === 'cm' ? '50' : '19.7', length: unit === 'cm' ? '76' : '29.9' },
    { size: 'L', chest: unit === 'cm' ? '109 - 114' : '43 - 45', waist: unit === 'cm' ? '93 - 98' : '37 - 38', shoulder: unit === 'cm' ? '52' : '20.5', length: unit === 'cm' ? '78' : '30.7' },
    { size: 'XL', chest: unit === 'cm' ? '115 - 122' : '45 - 48', waist: unit === 'cm' ? '99 - 106' : '39 - 41', shoulder: unit === 'cm' ? '54' : '21.2', length: unit === 'cm' ? '80' : '31.5' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FBFBFA] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#121212]/10 p-6 md:p-8 relative">
        <button
          onClick={() => setSizeGuideOpen(false)}
          className="absolute top-6 right-6 p-1 text-[#121212] hover:opacity-60 transition-opacity"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Ruler className="w-5 h-5 text-[#121212]" />
          <h2 className="text-base font-bold uppercase tracking-[0.2em] font-['Syne'] text-[#121212]">
            Zenvy Size Architecture
          </h2>
        </div>

        <p className="text-xs text-[#737373] mb-6">
          Our garments are engineered with relaxed architectural proportions. If you prefer a traditional fitted drape, we recommend ordering one size down.
        </p>

        {/* Unit Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs uppercase font-medium text-[#737373]">Units:</span>
          <div className="flex bg-[#EFEFEA] p-0.5">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                unit === 'cm' ? 'bg-[#121212] text-white shadow-xs' : 'text-[#666666] hover:text-[#121212]'
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                unit === 'inches' ? 'bg-[#121212] text-white shadow-xs' : 'text-[#666666] hover:text-[#121212]'
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#121212]/10">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F2F2EE] text-[#555555] uppercase tracking-wider font-semibold border-b border-[#121212]/10">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest ({unit})</th>
                <th className="py-3 px-4">Waist ({unit})</th>
                <th className="py-3 px-4">Shoulder ({unit})</th>
                <th className="py-3 px-4">Back Length ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#121212]/10 font-mono tabular-nums">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-black/2 transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-[#121212]">{row.size}</td>
                  <td className="py-3 px-4">{row.chest}</td>
                  <td className="py-3 px-4">{row.waist}</td>
                  <td className="py-3 px-4">{row.shoulder}</td>
                  <td className="py-3 px-4">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tips */}
        <div className="mt-6 pt-6 border-t border-[#121212]/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#555555]">
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-[#121212] mb-1">Chest Measurement</h4>
            <p>Measure horizontally across the fullest part of your chest, keeping the tape parallel to the floor.</p>
          </div>
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-[#121212] mb-1">Shoulder Width</h4>
            <p>Measure from the tip of one shoulder bone across the natural curve of your upper back to the opposite shoulder tip.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
