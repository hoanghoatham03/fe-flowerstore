export const filterProducts = (products, filters) => {
  return products.filter(product => {
    if (filters.price.min && product.price < filters.price.min) return false;
    if (filters.price.max && product.price > filters.price.max) return false;
    
    if (filters.category && product.categoryId !== filters.category) return false;
    
    return true;
  });
};

export const sortProducts = (products, sortType) => {
  const sortedProducts = [...products];
  
  switch (sortType) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.productName.localeCompare(a.productName));
    default:
      return sortedProducts;
  }
}; 