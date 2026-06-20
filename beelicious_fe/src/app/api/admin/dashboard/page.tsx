'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import ProductTable from '@/components/admin/ProductTable';

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <div className="container py-5">
        <ProductTable />
      </div>
    </AdminGuard>
  );
}
