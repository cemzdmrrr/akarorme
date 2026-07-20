'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminContext } from '../template';
import {
  apiCreateBlogPost,
  apiDeleteBlogPost,
  apiUpdateBlogPost,
  fetchBlogPosts,
} from '@/lib/admin-api';
import type { AdminBlogPost } from '@/types/admin';

function emptyForm(): Omit<AdminBlogPost, 'id' | 'slug' | 'createdAt' | 'updatedAt'> {
  return {
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    author: 'Akar Örme',
    seoDescription: '',
    tags: [],
    status: 'draft',
    featured: false,
    publishedAt: new Date().toISOString().slice(0, 16),
  };
}

export default function BlogAdminPage() {
  const { toggleSidebar } = useAdminContext();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [form, setForm] = useState(emptyForm());

  async function refresh() {
    setPosts(await fetchBlogPosts());
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const sortedPosts = useMemo(
    () =>
      posts
        .slice()
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [posts],
  );

  function resetForm() {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  }

  function openEdit(post: AdminBlogPost) {
    setEditing(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      author: post.author,
      seoDescription: post.seoDescription,
      tags: post.tags,
      status: post.status,
      featured: post.featured,
      publishedAt: post.publishedAt.slice(0, 16),
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      coverImage: form.coverImage.trim(),
      category: form.category.trim(),
      author: form.author.trim() || 'Akar Örme',
      seoDescription: (form.seoDescription || form.excerpt).trim(),
      tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
      publishedAt: new Date(form.publishedAt).toISOString(),
    };

    if (editing) {
      await apiUpdateBlogPost(editing.id, payload);
    } else {
      await apiCreateBlogPost(payload);
    }

    resetForm();
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu blog yazısını silmek istiyor musunuz?')) return;
    await apiDeleteBlogPost(id);
    await refresh();
  }

  const inputCls =
    'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';

  return (
    <>
      <AdminHeader
        title="Blog"
        subtitle={`${posts.length} yazı`}
        onMenuToggle={toggleSidebar}
        actions={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Yazı Ekle
          </button>
        }
      />

      <div className="space-y-4 p-4 sm:p-6">
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={resetForm}>
            <div
              className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {editing ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Başlık *</label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Kategori</label>
                    <input
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      className={inputCls}
                      placeholder="Örn. Üretim, İplik, Trendler"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Yazar</label>
                    <input
                      value={form.author}
                      onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Yayın Tarihi</label>
                    <input
                      type="datetime-local"
                      value={form.publishedAt}
                      onChange={(e) => setForm((prev) => ({ ...prev, publishedAt: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Özet *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.excerpt}
                    onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">İçerik *</label>
                  <textarea
                    required
                    rows={12}
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    className={inputCls}
                    placeholder="Paragrafları boş satır bırakarak ayırabilirsiniz."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Kapak Görseli</label>
                    <input
                      value={form.coverImage}
                      onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                      className={inputCls}
                      placeholder="/images/... veya tam URL"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Etiketler</label>
                    <input
                      value={form.tags.join(', ')}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
                        }))
                      }
                      className={inputCls}
                      placeholder="ör. sürdürülebilirlik, cotton, export"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">SEO Açıklaması</label>
                  <textarea
                    rows={2}
                    value={form.seoDescription}
                    onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                    className={inputCls}
                    placeholder="Boş bırakırsanız özet metni kullanılır."
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                    />
                    Öne çıkar
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={form.status === 'published'}
                      onChange={() => setForm((prev) => ({ ...prev, status: 'published' }))}
                    />
                    Yayında
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={form.status === 'draft'}
                      onChange={() => setForm((prev) => ({ ...prev, status: 'draft' }))}
                    />
                    Taslak
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {editing ? 'Kaydet' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedPosts.map((post) => (
            <div key={post.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {post.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                    {post.featured && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                        Öne Çıkan
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900">{post.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">/{post.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(post)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                {post.category && <span>{post.category}</span>}
                {post.author && <span>{post.author}</span>}
                <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))}
        </div>

        {!loading && sortedPosts.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center text-gray-400">
            <p>Henüz blog yazısı yok.</p>
            <button onClick={openNew} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              İlk yazınızı ekleyin
            </button>
          </div>
        )}
      </div>
    </>
  );
}
