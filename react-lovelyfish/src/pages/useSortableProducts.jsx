import { useState } from 'react';

// Function to extract wattage from product features
const getWattage = (product) => {
  let features = product.features;  // ✅ Use features array

  if (!Array.isArray(features)) return 0;

  // Find the feature containing 'watt'
  const wattItem = features.find(f => f.toLowerCase().includes('watt'));
  if (!wattItem) return 0;

  // Extract numeric value from the string
  const match = wattItem.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const useSortableProducts = (initialProducts) => {
  const [sortBy, setSortBy] = useState('default'); // Field to sort by
  const [sortOrder, setSortOrder] = useState('asc'); // Sort order

  // Dynamically generate available sort options
  const sortOptions = ['price'];
  if (initialProducts.some(p => getWattage(p) > 0)) sortOptions.push('wattage');

  // Sorting logic
  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (sortBy === 'default') return 0;

    let aVal = 0, bVal = 0;

    if (sortBy === 'price') {
      aVal = parseFloat(a.price || 0);
      bVal = parseFloat(b.price || 0);
    }

    if (sortBy === 'wattage') {
      aVal = getWattage(a);
      bVal = getWattage(b);
    }

    // Calculate result based on ascending or descending order
    const result = sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    console.log(`Sort field: ${sortBy}, ${a.Title}: ${aVal}, ${b.Title}: ${bVal}, Result: ${result}`);
    return result; 
  });

  // Update sorting field
  const handleSortChange = (e) => {
    console.log('Selected sort field:', e.target.value); // ✅ Debug selected sort field
    setSortBy(e.target.value);
  };

  // Toggle ascending/descending order
  const handleOrderChange = () => {
    setSortOrder(prev => {
      const newOrder = prev === 'asc' ? 'desc' : 'asc';
      console.log('Toggled sort order:', newOrder); // ✅ Debug sort order toggle
      return newOrder;
    });
  };

  return {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
    sortOptions
  };
};

export default useSortableProducts;
