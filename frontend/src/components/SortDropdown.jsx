import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Info } from 'lucide-react';

const options = [
  { value: 'default', label: 'Önerilen Sıralama' },
  { value: 'price-asc', label: 'En Düşük Fiyat' },
  { value: 'price-desc', label: 'En Yüksek Fiyat' },
  { value: 'newest', label: 'En Yeniler' },
  { value: 'best-selling', label: 'En Çok Satan' },
  { value: 'most-favorites', label: 'En Favoriler' }
];

const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="custom-sort-dropdown" ref={dropdownRef} style={{ position: 'relative', width: '220px' }}>
      <button 
        className="sort-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.6rem 1rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: isOpen ? '12px 12px 0 0' : '20px',
          cursor: 'pointer',
          color: '#4b5563',
          fontSize: '0.95rem',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        <span>{selectedOption.label}</span>
        <ArrowUpDown size={16} style={{ color: '#f97316' }} />
      </button>

      {isOpen && (
        <div 
          className="sort-dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            zIndex: 50,
            overflow: 'hidden'
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: value === opt.value ? '#f9fafb' : 'white',
                border: 'none',
                cursor: 'pointer',
                color: value === opt.value ? '#f97316' : '#4b5563',
                fontSize: '0.9rem',
                fontWeight: value === opt.value ? '600' : '400',
                textAlign: 'left',
                borderBottom: '1px solid #f3f4f6'
              }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Info size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
