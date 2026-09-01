import React, { useState, useMemo } from 'react';
import { Search, Globe, ChevronDown, Check } from 'lucide-react';
import { ALL_COUNTRIES, CountryInfo, findCountryByNameOrCode } from '@/utils/countryData';

interface CountrySelectProps {
  value?: string; // Country name or code
  onChange: (countryInfo: { country: string; countryCode: string; flagEmoji: string; timezone: string }) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  showTimezoneHint?: boolean;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value = '',
  onChange,
  label,
  className = '',
  disabled = false,
  required = false,
  placeholder = 'Select a country...',
  showTimezoneHint = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCountry = useMemo(() => {
    return findCountryByNameOrCode(value) || ALL_COUNTRIES.find(c => c.name.toLowerCase() === value.toLowerCase());
  }, [value]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return ALL_COUNTRIES;
    const q = search.toLowerCase().trim();
    return ALL_COUNTRIES.filter(
      c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.timezone.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (c: CountryInfo) => {
    onChange({
      country: c.name,
      countryCode: c.code,
      flagEmoji: c.flag,
      timezone: c.timezone
    });
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#18191D] uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            {label}
          </span>
          {selectedCountry && showTimezoneHint && (
            <span className="text-[10px] text-stone-500 font-mono font-normal">
              Default Tz: {selectedCountry.timezone}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl flex items-center justify-between gap-2 text-xs font-semibold transition-all text-left shadow-2xs hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
          disabled ? 'opacity-60 cursor-not-allowed bg-stone-50' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedCountry ? (
            <>
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="text-[#18191D] font-bold truncate">{selectedCountry.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono font-bold">
                {selectedCountry.code}
              </span>
            </>
          ) : (
            <span className="text-stone-400 font-normal">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => { setIsOpen(false); setSearch(''); }} 
          />
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#ECE6DD] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-72 flex flex-col">
            
            {/* Search Box */}
            <div className="p-2 border-b border-stone-100 bg-[#FAF8F5]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search 200+ countries or code..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {filteredCountries.map(c => {
                const isSelected = selectedCountry?.code === c.code || selectedCountry?.name === c.name;
                return (
                  <button
                    key={c.code + c.name}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors text-left ${
                      isSelected ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base leading-none shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">({c.code})</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-stone-400 font-mono truncate max-w-[100px] hidden sm:inline">
                        {c.timezone.split('/')[1]?.replace('_', ' ') || c.timezone}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                    </div>
                  </button>
                );
              })}

              {filteredCountries.length === 0 && (
                <div className="p-4 text-center text-stone-400 text-xs">
                  No matching country found for "{search}"
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};
