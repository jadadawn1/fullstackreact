import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) {
        setError(error.message);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong> - ${product.price}
            <br />
            {product.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
