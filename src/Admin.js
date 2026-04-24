import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image_url: '', stock_quantity: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) setError(error.message);
    else setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (editingId) {
      // Update
      const { error } = await supabase.from('products').update(form).eq('id', editingId);
      if (error) setError(error.message);
      setEditingId(null);
    } else {
      // Create
      const { error } = await supabase.from('products').insert([{ ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) }]);
      if (error) setError(error.message);
    }
    setForm({ name: '', description: '', price: '', category: '', image_url: '', stock_quantity: '' });
    fetchProducts();
  };

  const handleEdit = product => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity || ''
    });
  };

  const handleDelete = async id => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) setError(error.message);
    fetchProducts();
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />{' '}
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />{' '}
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />{' '}
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />{' '}
        <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />{' '}
        <input name="stock_quantity" type="number" placeholder="Stock" value={form.stock_quantity} onChange={handleChange} />{' '}
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', category: '', image_url: '', stock_quantity: '' }); }}>Cancel</button>}
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th><th>Description</th><th>Price</th><th>Category</th><th>Image</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.image_url ? <img src={product.image_url} alt="" width={40} /> : ''}</td>
                <td>{product.stock_quantity}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
