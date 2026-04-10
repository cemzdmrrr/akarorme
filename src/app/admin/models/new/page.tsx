'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ModelForm from '@/components/admin/ModelForm';
import { useAdminContext } from '../../template';
import { apiCreateModel } from '@/lib/admin-api';

export default function NewModelPage() {
  const { toggleSidebar } = useAdminContext();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  return (
    <>
      <AdminHeader title="Add New Model" subtitle="Create a new knitwear design" onMenuToggle={toggleSidebar} />
      <div className="p-4 sm:p-6 max-w-4xl">
        <ModelForm
          submitLabel={saving ? 'Saving…' : 'Create Model'}
          onSubmit={async (data) => {
            setSaving(true);
            try {
              await apiCreateModel(data);
              router.push('/admin/models');
            } catch (err) {
              alert(err instanceof Error ? err.message : 'Failed to create model');
              setSaving(false);
            }
          }}
        />
      </div>
    </>
  );
}
