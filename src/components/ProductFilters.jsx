import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ProductFilters = ({ filters, onFilterChange, categories }) => {
  
  const formatPrice = (value) => {
    return `${value.toLocaleString()} VND`;
  };

  
  const maxPrice = 10000000;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
      
        
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Danh mục</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value ? parseInt(e.target.value) : '')}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

        
      <div className="mb-6">
        <label className="block text-sm font-medium mb-4">Khoảng giá</label>
        <Slider
          range
          min={0}
          max={maxPrice}
          step={100000}
          value={[filters.price.min || 0, filters.price.max || maxPrice]}
          onChange={(values) => {
            onFilterChange('price', {
              min: values[0],
              max: values[1]
            });
          }}
          railStyle={{ backgroundColor: '#e5e7eb' }}
          trackStyle={[{ backgroundColor: '#9C3F46' }]}
          handleStyle={[
            { borderColor: '#9C3F46', backgroundColor: '#fff' },
            { borderColor: '#9C3F46', backgroundColor: '#fff' }
          ]}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{formatPrice(filters.price.min || 0)}</span>
          <span>{formatPrice(filters.price.max || maxPrice)}</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sắp xếp theo</label>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="price-asc">Giá: Thấp đến cao</option>
          <option value="price-desc">Giá: Cao đến thấp</option>
          <option value="name-asc">Tên: A-Z</option>
          <option value="name-desc">Tên: Z-A</option>
        </select>
      </div>

      <button
        onClick={() => {
          onFilterChange('category', '');
          onFilterChange('price', { min: 0, max: maxPrice });
          onFilterChange('sort', 'price-asc');
        }}
        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default ProductFilters; 