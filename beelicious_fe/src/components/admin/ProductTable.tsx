'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Spinner, Table, Image } from 'react-bootstrap';
import { showErrorToast, showSuccessToast } from '../toast-popup/Toastify';

type Product = {
  _id: string;
  title: string;
  category: string;
  quantity: number;
  newPrice: string;
  image: string;
  description: string;
};

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string>('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      showErrorToast('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this product?');

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const token = localStorage.getItem('accessToken');

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((item) => item._id !== id));

      showSuccessToast('Product deleted successfully');
    } catch (error) {
      showErrorToast('Delete failed');
    } finally {
      setDeletingId('');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-5">
        <h4>No products found</h4>

        <Link href="/admin/products/create">
          <Button className="mt-3">Create Product</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>

        <Link href="/api/admin/products/create">
          <Button>Create Product</Button>
        </Link>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr className="table-dashboard">
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Description</th>
            <th style={{ width: '220px' }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <Image
                  src={product.image}
                  width={70}
                  height={70}
                  rounded
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </td>

              <td>{product.title}</td>

              <td>{product.category}</td>

              <td>{product.quantity}</td>

              <td>{product.newPrice}</td>

              <td>
                <div className="d-flex gap-2">
                  <Link href={`/admin/products/edit/${product._id}`}>
                    <Button variant="warning" size="sm">
                      Edit
                    </Button>
                  </Link>

                  <Button
                    style={{
                      backgroundColor: '#ff8888',
                      borderColor: '#dc3545',
                    }}
                    size="sm"
                    disabled={deletingId === product._id}
                    onClick={() => handleDelete(product._id)}
                  >
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
