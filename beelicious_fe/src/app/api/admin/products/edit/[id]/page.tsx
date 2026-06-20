'use client';

import api from '@/lib/api';
import AdminGuard from '@/components/admin/AdminGuard';
import ProductForm from '@/components/admin/ProductForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { showErrorToast } from '@/components/toast-popup/Toastify';
import { Spinner } from 'react-bootstrap';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        showErrorToast('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="container py-5">
        <h2 className="mb-4">Edit Product</h2>
        <ProductForm initialData={product} isEdit />
      </div>
    </AdminGuard>
  );
}
