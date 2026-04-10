'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ModelForm from '@/components/admin/ModelForm';
import { useAdminContext } from '../../template';
import { fetchModel, apiUpdateModel } from '@/lib/admin-api';
import type { AdminModel } from '@/types/admin';

export default function EditModelPage() {
  const { toggleSidebar } = useAdminContext();
  const router = useRouter();
  const params = useParams();
  const [model, setModel] = useState<AdminModel | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    fetchModel(id).then((found) => {
      if (found) setModel(found);
      else setNotFound(true);
    }).catch(() => setNotFound(true));
  }, [params.id]);

  if (notFound) {
    return (
      <>
        <AdminHeader title="Model Bulunamadı" onMenuToggle={toggleSidebar} />
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg">Aradığınız model bulunamadı.</p>
          <button onClick={() => router.push('/admin/models')} className="mt-4 text-sm text-blue-600 hover:text-blue-800">
            &larr; Modellere Dön
          </button>
        </div>
      </>
    );
  }

  if (!model) {
    return <div className="flex items-center justify-center h-full"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>;
  }

  return (
    <>
      <AdminHeader title={`Düzenle: ${model.name}`} subtitle={model.collection} onMenuToggle={toggleSidebar} />
      <div className="p-4 sm:p-6 max-w-4xl">
        <ModelForm
          initial={model}
          submitLabel={saving ? 'Kaydediliyor…' : 'Değişiklikleri Kaydet'}
          onSubmit={async (data) => {
            setSaving(true);
            try {
              await apiUpdateModel(model.id, data);
              router.push('/admin/models');
            } catch (err) {
              alert(err instanceof Error ? err.message : 'Model güncellenemedi');
              setSaving(false);
            }
          }}
        />
      </div>
    </>
  );
}
