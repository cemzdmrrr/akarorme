'use client';

import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ModelForm from '@/components/admin/ModelForm';
import { useAdminContext } from '../../template';
import { createModel } from '@/lib/admin-store';

export default function NewModelPage() {
  const { toggleSidebar } = useAdminContext();
  const router = useRouter();

  return (
    <>
      <AdminHeader title="Add New Model" subtitle="Create a new knitwear design" onMenuToggle={toggleSidebar} />
      <div className="p-4 sm:p-6 max-w-4xl">
        <ModelForm
          submitLabel="Create Model"
          onSubmit={(data) => {
            createModel(data);
            router.push('/admin/models');
          }}
        />
      </div>
    </>
  );
}
