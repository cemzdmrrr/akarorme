import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import type { PageContent, PageSection } from '@/types/admin';

export const DEFAULT_PAGE_CONTENT: PageContent[] = [
  {
    id: 'page_global',
    slug: 'global',
    title: 'Genel İçerikler',
    sections: [
      { id: 'global_1', key: 'nav_home', label: 'Menü Ana Sayfa', type: 'text', content: 'Ana Sayfa', visible: true, order: 0 },
      { id: 'global_2', key: 'nav_about', label: 'Menü Hakkımızda', type: 'text', content: 'Hakkımızda', visible: true, order: 1 },
      { id: 'global_3', key: 'nav_collections', label: 'Menü Koleksiyonlar', type: 'text', content: 'Koleksiyonlar', visible: true, order: 2 },
      { id: 'global_4', key: 'nav_technology', label: 'Menü Teknoloji', type: 'text', content: 'Teknoloji', visible: true, order: 3 },
      { id: 'global_5', key: 'nav_blog', label: 'Menü Blog', type: 'text', content: 'Blog', visible: true, order: 4 },
      { id: 'global_6', key: 'nav_references', label: 'Menü Referanslar', type: 'text', content: 'Referanslar', visible: true, order: 5 },
      { id: 'global_7', key: 'nav_contact', label: 'Menü İletişim', type: 'text', content: 'İletişim', visible: true, order: 6 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_home',
    slug: 'home',
    title: 'Ana Sayfa',
    sections: [
      { id: 'home_1', key: 'hero_label', label: 'Hero üst etiket', type: 'text', content: 'Premium Triko Üretimi', visible: true, order: 0 },
      { id: 'home_2', key: 'hero_heading1', label: 'Hero başlık 1', type: 'text', content: 'Her İlmekte', visible: true, order: 1 },
      { id: 'home_3', key: 'hero_heading2', label: 'Hero başlık 2', type: 'text', content: 'Aynı', visible: true, order: 2 },
      { id: 'home_4', key: 'hero_highlight', label: 'Hero vurgu kelimesi', type: 'text', content: 'Kalite', visible: true, order: 3 },
      { id: 'home_5', key: 'hero_description', label: 'Hero açıklama', type: 'textarea', content: 'Tekstildeki onlarca yıllık uzmanlığımızı her metre kumaşa işliyoruz. Premium iplikten bitmiş ürüne kadar, dünyanın önde gelen moda markaları için yüksek standartta üretim yapıyoruz.', visible: true, order: 4 },
      { id: 'home_6', key: 'hero_cta_primary', label: 'Hero birincil buton', type: 'text', content: 'Koleksiyonları İncele', visible: true, order: 5 },
      { id: 'home_7', key: 'hero_cta_secondary', label: 'Hero ikincil buton', type: 'text', content: 'Numune Talep Et', visible: true, order: 6 },
      { id: 'home_8', key: 'brand_label', label: 'Marka hikayesi üst etiket', type: 'text', content: '2000’den Beri', visible: true, order: 7 },
      { id: 'home_9', key: 'brand_heading', label: 'Marka hikayesi başlık', type: 'text', content: 'Mükemmelliği', visible: true, order: 8 },
      { id: 'home_10', key: 'brand_highlight', label: 'Marka hikayesi vurgu', type: 'text', content: 'İlmek İlmek', visible: true, order: 9 },
      { id: 'home_11', key: 'brand_paragraph1', label: 'Marka hikayesi paragraf 1', type: 'textarea', content: 'Yirmi yılı aşkın süredir Akar Örme, dünyanın seçkin triko markaları için güvenilir üretim partneri olarak çalışıyor.', visible: true, order: 10 },
      { id: 'home_12', key: 'brand_paragraph2', label: 'Marka hikayesi paragraf 2', type: 'textarea', content: 'Sadece kumaş üretmiyoruz; iplik seçiminden son kalite kontrole kadar her markanın vizyonuna uygun tekstil çözümleri geliştiriyoruz.', visible: true, order: 11 },
      { id: 'home_13', key: 'brand_link_text', label: 'Marka hikayesi link metni', type: 'text', content: 'Hikayemizi Keşfedin', visible: true, order: 12 },
      { id: 'home_14', key: 'fabric_label', label: 'Kumaş bölümü üst etiket', type: 'text', content: 'Üretim Altyapısı', visible: true, order: 13 },
      { id: 'home_15', key: 'fabric_heading', label: 'Kumaş bölümü başlık', type: 'text', content: 'Öne Çıkan', visible: true, order: 14 },
      { id: 'home_16', key: 'fabric_highlight', label: 'Kumaş bölümü vurgu', type: 'text', content: 'Kumaş Yapıları', visible: true, order: 15 },
      { id: 'home_17', key: 'fabric_description', label: 'Kumaş bölümü açıklama', type: 'textarea', content: 'Üretim kabiliyetimizin merkezinde yer alan triko yüzeyleri ve teknik yapı gruplarını inceleyin.', visible: true, order: 16 },
      { id: 'home_18', key: 'cta_label', label: 'Alt CTA üst etiket', type: 'text', content: 'Projenizi Başlatın', visible: true, order: 17 },
      { id: 'home_19', key: 'cta_heading', label: 'Alt CTA başlık', type: 'text', content: 'Markanızın', visible: true, order: 18 },
      { id: 'home_20', key: 'cta_highlight', label: 'Alt CTA vurgu', type: 'text', content: 'Vizyonunu Hayata Geçirelim', visible: true, order: 19 },
      { id: 'home_21', key: 'cta_description', label: 'Alt CTA açıklama', type: 'textarea', content: '500 metre de isteseniz, 50.000 metre de; ekibimiz markanıza en uygun triko çözümünü birlikte geliştirmeye hazır.', visible: true, order: 20 },
      { id: 'home_22', key: 'cta_button_primary', label: 'Alt CTA birincil buton', type: 'text', content: 'İletişime Geçin', visible: true, order: 21 },
      { id: 'home_23', key: 'cta_button_secondary', label: 'Alt CTA ikincil buton', type: 'text', content: 'Referanslarımızı Görün', visible: true, order: 22 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_about',
    slug: 'about',
    title: 'Hakkımızda',
    sections: [
      { id: 'about_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Hakkımızda', visible: true, order: 0 },
      { id: 'about_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Akar Örme', visible: true, order: 1 },
      { id: 'about_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: '25 yılı aşkın hassas triko üretimi tecrübesiyle, 12 makinelik bir atölyeden dünya standartlarında bir üretim tesisine dönüştük.', visible: true, order: 2 },
      { id: 'about_4', key: 'philosophy_label', label: 'Felsefe üst etiket', type: 'text', content: 'Bizi Harekete Geçiren', visible: true, order: 3 },
      { id: 'about_5', key: 'philosophy_title', label: 'Felsefe başlık', type: 'text', content: 'Üretim', visible: true, order: 4 },
      { id: 'about_6', key: 'philosophy_highlight', label: 'Felsefe vurgu', type: 'text', content: 'Anlayışımız', visible: true, order: 5 },
      { id: 'about_7', key: 'value_1_title', label: 'Değer 1 başlık', type: 'text', content: 'Hassasiyet', visible: true, order: 6 },
      { id: 'about_8', key: 'value_1_description', label: 'Değer 1 açıklama', type: 'textarea', content: 'Her ilmek hesaplanır, her tansiyon dikkatle ayarlanır. Triko üretimini yüksek hassasiyet gerektiren bir uzmanlık alanı olarak görüyoruz.', visible: true, order: 7 },
      { id: 'about_9', key: 'value_2_title', label: 'Değer 2 başlık', type: 'text', content: 'Yenilik', visible: true, order: 8 },
      { id: 'about_10', key: 'value_2_description', label: 'Değer 2 açıklama', type: 'textarea', content: 'Ar-Ge ve yeni nesil örme teknolojilerine yaptığımız sürekli yatırımlar sayesinde tekstil üretiminde öncü kalıyoruz.', visible: true, order: 9 },
      { id: 'about_11', key: 'value_3_title', label: 'Değer 3 başlık', type: 'text', content: 'Sürdürülebilirlik', visible: true, order: 10 },
      { id: 'about_12', key: 'value_3_description', label: 'Değer 3 açıklama', type: 'textarea', content: 'Düşük kaynak tüketimli üretim yaklaşımlarından sorumlu operasyon modeline kadar, sürdürülebilirliği işimizin merkezine yerleştiriyoruz.', visible: true, order: 11 },
      { id: 'about_13', key: 'mission_title', label: 'Misyon başlık', type: 'text', content: 'Misyonumuz', visible: true, order: 12 },
      { id: 'about_14', key: 'mission_text', label: 'Misyon metni', type: 'textarea', content: 'İleri teknoloji, sıkı kalite kontrol ve güçlü iş birliği anlayışıyla; iş ortaklarımızın beklentilerini aşan premium triko kumaşlar ve bitmiş ürünler sunmak.', visible: true, order: 13 },
      { id: 'about_15', key: 'vision_title', label: 'Vizyon başlık', type: 'text', content: 'Vizyonumuz', visible: true, order: 14 },
      { id: 'about_16', key: 'vision_text', label: 'Vizyon metni', type: 'textarea', content: 'İleri teknoloji, sorumlu üretim uygulamaları ve ustalığa bağlılığımızla sürdürülebilir triko üretiminin geleceğine yön vermek.', visible: true, order: 15 },
      { id: 'about_17', key: 'factory_title', label: 'Fabrika başlık', type: 'text', content: 'Üretim', visible: true, order: 16 },
      { id: 'about_18', key: 'factory_highlight', label: 'Fabrika vurgu', type: 'text', content: 'Tesisimiz', visible: true, order: 17 },
      { id: 'about_19', key: 'factory_description', label: 'Fabrika açıklama', type: 'textarea', content: 'İstanbul’daki 15.000 m² üretim tesisimize yakından bakın.', visible: true, order: 18 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_contact',
    slug: 'contact',
    title: 'İletişim',
    sections: [
      { id: 'contact_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'İletişime', visible: true, order: 0 },
      { id: 'contact_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Geçin', visible: true, order: 1 },
      { id: 'contact_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Yeni triko projenizi başlatmaya hazır mısınız? Ekibimize ulaşın; sizi dinlemekten memnuniyet duyarız.', visible: true, order: 2 },
      { id: 'contact_4', key: 'form_heading', label: 'Form başlığı', type: 'text', content: 'Bize Mesaj Gönderin', visible: true, order: 3 },
      { id: 'contact_5', key: 'form_subheading', label: 'Form açıklaması', type: 'textarea', content: 'Aşağıdaki formu doldurun, ekibimiz size 24 saat içinde dönüş yapsın.', visible: true, order: 4 },
      { id: 'contact_6', key: 'field_full_name', label: 'Alan Ad Soyad', type: 'text', content: 'Ad Soyad', visible: true, order: 5 },
      { id: 'contact_7', key: 'field_email', label: 'Alan E-posta', type: 'text', content: 'E-posta', visible: true, order: 6 },
      { id: 'contact_8', key: 'field_company', label: 'Alan Firma', type: 'text', content: 'Firma', visible: true, order: 7 },
      { id: 'contact_9', key: 'field_phone', label: 'Alan Telefon', type: 'text', content: 'Telefon', visible: true, order: 8 },
      { id: 'contact_10', key: 'field_subject', label: 'Alan Konu', type: 'text', content: 'Konu', visible: true, order: 9 },
      { id: 'contact_11', key: 'field_message', label: 'Alan Mesaj', type: 'text', content: 'Mesaj', visible: true, order: 10 },
      { id: 'contact_12', key: 'placeholder_name', label: 'Placeholder Ad Soyad', type: 'text', content: 'Adınızı ve soyadınızı girin', visible: true, order: 11 },
      { id: 'contact_13', key: 'placeholder_email', label: 'Placeholder E-posta', type: 'text', content: 'ornek@firma.com', visible: true, order: 12 },
      { id: 'contact_14', key: 'placeholder_company', label: 'Placeholder Firma', type: 'text', content: 'Firma adınız', visible: true, order: 13 },
      { id: 'contact_15', key: 'placeholder_phone', label: 'Placeholder Telefon', type: 'text', content: '+90...', visible: true, order: 14 },
      { id: 'contact_16', key: 'placeholder_message', label: 'Placeholder Mesaj', type: 'textarea', content: 'İhtiyacınızı detaylandırın...', visible: true, order: 15 },
      { id: 'contact_17', key: 'subject_placeholder', label: 'Konu placeholder', type: 'text', content: 'Bir konu seçin', visible: true, order: 16 },
      { id: 'contact_18', key: 'subject_manufacturing', label: 'Konu Üretim', type: 'text', content: 'Üretim Görüşmesi', visible: true, order: 17 },
      { id: 'contact_19', key: 'subject_partnership', label: 'Konu İş Birliği', type: 'text', content: 'İş Birliği Talebi', visible: true, order: 18 },
      { id: 'contact_20', key: 'subject_sampling', label: 'Konu Numune', type: 'text', content: 'Numune Talebi', visible: true, order: 19 },
      { id: 'contact_21', key: 'subject_visit', label: 'Konu Ziyaret', type: 'text', content: 'Fabrika Ziyareti', visible: true, order: 20 },
      { id: 'contact_22', key: 'subject_other', label: 'Konu Diğer', type: 'text', content: 'Diğer', visible: true, order: 21 },
      { id: 'contact_23', key: 'send_button', label: 'Gönder butonu', type: 'text', content: 'Mesaj Gönder', visible: true, order: 22 },
      { id: 'contact_24', key: 'sending_text', label: 'Gönderiliyor metni', type: 'text', content: 'Gönderiliyor...', visible: true, order: 23 },
      { id: 'contact_25', key: 'sent_text', label: 'Gönderildi metni', type: 'text', content: 'Mesajınız Gönderildi', visible: true, order: 24 },
      { id: 'contact_26', key: 'error_text', label: 'Hata metni', type: 'text', content: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.', visible: true, order: 25 },
      { id: 'contact_27', key: 'info_address_title', label: 'İletişim kartı Adres başlık', type: 'text', content: 'Adres', visible: true, order: 26 },
      { id: 'contact_28', key: 'info_email_title', label: 'İletişim kartı E-posta başlık', type: 'text', content: 'E-posta', visible: true, order: 27 },
      { id: 'contact_29', key: 'info_phone_title', label: 'İletişim kartı Telefon başlık', type: 'text', content: 'Telefon', visible: true, order: 28 },
      { id: 'contact_30', key: 'info_hours_title', label: 'İletişim kartı Çalışma saatleri başlık', type: 'text', content: 'Çalışma Saatleri', visible: true, order: 29 },
      { id: 'contact_31', key: 'info_address_line_1', label: 'Adres satırı 1', type: 'text', content: 'İkitelli OSB, Atatürk Bulvarı No: 42', visible: true, order: 30 },
      { id: 'contact_32', key: 'info_address_line_2', label: 'Adres satırı 2', type: 'text', content: 'Başakşehir, İstanbul 34307', visible: true, order: 31 },
      { id: 'contact_33', key: 'info_hours_line_1', label: 'Çalışma saati satırı 1', type: 'text', content: 'Pazartesi - Cuma: 08:30 - 18:00', visible: true, order: 32 },
      { id: 'contact_34', key: 'info_hours_line_2', label: 'Çalışma saati satırı 2', type: 'text', content: 'Cumartesi: 09:00 - 13:00', visible: true, order: 33 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_collections',
    slug: 'collections',
    title: 'Koleksiyonlar',
    sections: [
      { id: 'collections_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Triko', visible: true, order: 0 },
      { id: 'collections_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Koleksiyonlarımız', visible: true, order: 1 },
      { id: 'collections_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Dünya moda markaları için yüksek hassasiyetle geliştirdiğimiz triko modellerin tamamını keşfedin.', visible: true, order: 2 },
      { id: 'collections_4', key: 'filter_men', label: 'Filtre Erkek', type: 'text', content: 'Erkek', visible: true, order: 3 },
      { id: 'collections_5', key: 'filter_women', label: 'Filtre Kadın', type: 'text', content: 'Kadın', visible: true, order: 4 },
      { id: 'collections_6', key: 'filter_winter', label: 'Filtre Kış', type: 'text', content: 'Kış', visible: true, order: 5 },
      { id: 'collections_7', key: 'filter_summer', label: 'Filtre Yaz', type: 'text', content: 'Yaz', visible: true, order: 6 },
      { id: 'collections_8', key: 'filter_fine', label: 'Filtre İnce', type: 'text', content: 'İnce', visible: true, order: 7 },
      { id: 'collections_9', key: 'filter_heavy', label: 'Filtre Kalın', type: 'text', content: 'Kalın', visible: true, order: 8 },
      { id: 'collections_10', key: 'view_details', label: 'Detay butonu', type: 'text', content: 'Detayları Gör', visible: true, order: 9 },
      { id: 'collections_11', key: 'no_match', label: 'Eşleşme yok metni', type: 'textarea', content: 'Seçtiğiniz filtrelere uygun model bulunamadı.', visible: true, order: 10 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_technology',
    slug: 'technology',
    title: 'Teknoloji',
    sections: [
      { id: 'technology_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Üretim', visible: true, order: 0 },
      { id: 'technology_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Teknolojimiz', visible: true, order: 1 },
      { id: 'technology_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Örme teknolojisi, desen geliştirme ve üretim kabiliyetlerimizi interaktif olarak keşfedin.', visible: true, order: 2 },
      { id: 'technology_4', key: 'section_title', label: 'Bölüm başlığı', type: 'text', content: 'Dijital', visible: true, order: 3 },
      { id: 'technology_5', key: 'section_highlight', label: 'Bölüm vurgu', type: 'text', content: 'Deneyim Alanları', visible: true, order: 4 },
      { id: 'technology_6', key: 'section_description', label: 'Bölüm açıklaması', type: 'textarea', content: 'Müşterilerimize sunduğumuz üretim ve geliştirme araçlarını inceleyin.', visible: true, order: 5 },
      { id: 'technology_7', key: 'module_1_title', label: 'Modül 1 başlık', type: 'text', content: '3D Triko Görüntüleyici', visible: true, order: 6 },
      { id: 'technology_8', key: 'module_1_description', label: 'Modül 1 açıklama', type: 'textarea', content: 'Örme yüzeylerin üç boyutlu formunu ve detaylarını yakın planda inceleyin.', visible: true, order: 7 },
      { id: 'technology_9', key: 'module_2_title', label: 'Modül 2 başlık', type: 'text', content: 'Desen Kütüphanesi', visible: true, order: 8 },
      { id: 'technology_10', key: 'module_2_description', label: 'Modül 2 açıklama', type: 'textarea', content: 'Üretimde kullandığımız örme desen yapılarını ve varyasyonlarını keşfedin.', visible: true, order: 9 },
      { id: 'technology_11', key: 'module_3_title', label: 'Modül 3 başlık', type: 'text', content: 'Fabrika Gösterge Paneli', visible: true, order: 10 },
      { id: 'technology_12', key: 'module_3_description', label: 'Modül 3 açıklama', type: 'textarea', content: 'Makine parkuru, üretim kapasitesi ve ihracat ağını özetleyen panel.', visible: true, order: 11 },
      { id: 'technology_13', key: 'launch_module', label: 'Modül buton metni', type: 'text', content: 'Modülü Aç', visible: true, order: 12 },
      { id: 'technology_14', key: 'module_1_tags', label: 'Modül 1 etiketleri', type: 'text', content: 'Three.js, WebGL, 360°, Gerçek Zamanlı', visible: true, order: 13 },
      { id: 'technology_15', key: 'module_2_tags', label: 'Modül 2 etiketleri', type: 'text', content: 'İnteraktif, Eğitici, Tekstil Bilgisi, Adım Adım', visible: true, order: 14 },
      { id: 'technology_16', key: 'module_3_tags', label: 'Modül 3 etiketleri', type: 'text', content: 'Canlı Grafikler, Dünya Haritası, Veri Odaklı, Gerçek Zamanlı', visible: true, order: 15 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_references',
    slug: 'references',
    title: 'Referanslar',
    sections: [
      { id: 'references_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Bize Güvenen', visible: true, order: 0 },
      { id: 'references_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Markalar', visible: true, order: 1 },
      { id: 'references_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: '30’dan fazla ülkede 500’ün üzerinde markayla, kalite ve güvenilirlik odaklı uzun vadeli iş ortaklıkları kuruyoruz.', visible: true, order: 2 },
      { id: 'references_4', key: 'logos_heading', label: 'Logo alanı başlık', type: 'text', content: 'Güvenilir', visible: true, order: 3 },
      { id: 'references_5', key: 'logos_highlight', label: 'Logo alanı vurgu', type: 'text', content: 'İş Ortaklarımız', visible: true, order: 4 },
      { id: 'references_6', key: 'logos_description', label: 'Logo alanı açıklama', type: 'textarea', content: 'Dünya genelinde önde gelen moda markalarına, perakendecilere ve private label markalara hizmet veriyoruz.', visible: true, order: 5 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_blog',
    slug: 'blog',
    title: 'Blog',
    sections: [
      { id: 'blog_1', key: 'hero_title', label: 'Sayfa başlığı', type: 'text', content: 'Akar Örme', visible: true, order: 0 },
      { id: 'blog_2', key: 'hero_highlight', label: 'Sayfa vurgu', type: 'text', content: 'Blog', visible: true, order: 1 },
      { id: 'blog_3', key: 'hero_subtitle', label: 'Sayfa açıklaması', type: 'textarea', content: 'Üretim, iplik, koleksiyon geliştirme ve sektör içgörülerine dair yazılarımızı keşfedin.', visible: true, order: 2 },
      { id: 'blog_4', key: 'featured_label', label: 'Öne çıkan etiketi', type: 'text', content: 'Öne Çıkan Yazı', visible: true, order: 3 },
      { id: 'blog_5', key: 'read_more', label: 'Devamını oku metni', type: 'text', content: 'Devamını Oku', visible: true, order: 4 },
      { id: 'blog_6', key: 'empty_title', label: 'Boş durum başlık', type: 'text', content: 'Henüz yayınlanmış yazı yok', visible: true, order: 5 },
      { id: 'blog_7', key: 'empty_description', label: 'Boş durum açıklama', type: 'textarea', content: 'Yeni blog içerikleri eklendiğinde burada görünecek.', visible: true, order: 6 },
      { id: 'blog_8', key: 'back_to_list', label: 'Detay geri dönüş metni', type: 'text', content: 'Blog listesine dön', visible: true, order: 7 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_model_detail',
    slug: 'model-detail',
    title: 'Model Detay',
    sections: [
      { id: 'model_detail_1', key: 'back_to_collections', label: 'Geri dönüş metni', type: 'text', content: 'Koleksiyona Dön', visible: true, order: 0 },
      { id: 'model_detail_2', key: 'available_colours', label: 'Renk başlığı', type: 'text', content: 'Renk Seçenekleri', visible: true, order: 1 },
      { id: 'model_detail_3', key: 'request_production', label: 'Üretim talebi butonu', type: 'text', content: 'Üretim Talebi Oluştur', visible: true, order: 2 },
      { id: 'model_detail_4', key: 'order_sample', label: 'Numune butonu', type: 'text', content: 'Numune Sipariş Ver', visible: true, order: 3 },
      { id: 'model_detail_5', key: 'tab_overview', label: 'Sekme Genel Bakış', type: 'text', content: 'Genel Bakış', visible: true, order: 4 },
      { id: 'model_detail_6', key: 'tab_technical', label: 'Sekme Teknik Bilgiler', type: 'text', content: 'Teknik Bilgiler', visible: true, order: 5 },
      { id: 'model_detail_7', key: 'tab_gallery', label: 'Sekme Galeri', type: 'text', content: 'Galeri', visible: true, order: 6 },
      { id: 'model_detail_8', key: 'overview_extra', label: 'Genel bakış ek metni', type: 'textarea', content: 'Tüm ürünlerimiz sevkiyat öncesinde detaylı kalite kontrolden geçer ve uluslararası standartlara uygunluğu doğrulanır.', visible: true, order: 7 },
      { id: 'model_detail_9', key: 'technical_empty', label: 'Teknik bilgi boş durum metni', type: 'text', content: 'Teknik bilgi henüz eklenmemiş.', visible: true, order: 8 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'page_footer',
    slug: 'footer',
    title: 'Footer',
    sections: [
      { id: 'footer_1', key: 'copyright', label: 'Telif metni', type: 'text', content: '© {year} Akar Örme. Tüm hakları saklıdır.', visible: true, order: 0 },
    ],
    updatedAt: '2026-07-20T10:00:00Z',
  },
];

function sortSections(sections: PageSection[]): PageSection[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

function normalizeSection(section: PageSection): PageSection {
  if (section.type === 'image') {
    return section;
  }

  return {
    ...section,
    translations: section.translations ? { ...section.translations } : undefined,
  };
}

function getSafePageId(page: PageContent): string {
  const slugBasedId = `page_${page.slug.replace(/[^a-z0-9_-]/gi, '_')}`;
  return slugBasedId;
}

function ensureUniquePageIds(pages: PageContent[]): PageContent[] {
  const usedIds = new Set<string>();

  return pages.map((page) => {
    let nextId = page.id?.trim() || getSafePageId(page);

    if (!usedIds.has(nextId)) {
      usedIds.add(nextId);
      return page;
    }

    nextId = getSafePageId(page);
    let suffix = 2;

    while (usedIds.has(nextId)) {
      nextId = `${getSafePageId(page)}_${suffix}`;
      suffix += 1;
    }

    usedIds.add(nextId);

    return {
      ...page,
      id: nextId,
    };
  });
}

export function mergePagesWithDefaults(pages: PageContent[]): PageContent[] {
  const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));

  const mergedDefaults = DEFAULT_PAGE_CONTENT.map((defaultPage) => {
    const existingPage = pagesBySlug.get(defaultPage.slug);
    if (!existingPage) {
      return defaultPage;
    }

    const existingSectionsByKey = new Map(existingPage.sections.map((section) => [section.key, section]));

    const mergedSections = defaultPage.sections.map((defaultSection) => {
      const existingSection = existingSectionsByKey.get(defaultSection.key);
      return existingSection
        ? normalizeSection({ ...defaultSection, ...existingSection })
        : normalizeSection(defaultSection);
    });

    const extraSections = existingPage.sections
      .filter((section) => !defaultPage.sections.some((defaultSection) => defaultSection.key === section.key))
      .map((section, index) => ({
        ...normalizeSection(section),
        order: defaultPage.sections.length + index,
      }));

    return {
      ...defaultPage,
      ...existingPage,
      sections: sortSections([...mergedSections, ...extraSections]),
    };
  });

  const extraPages = pages.filter(
    (page) => !DEFAULT_PAGE_CONTENT.some((defaultPage) => defaultPage.slug === page.slug),
  );

  return ensureUniquePageIds([...mergedDefaults, ...extraPages]);
}

export function getPageBySlug(pages: PageContent[], slug: string): PageContent | null {
  return pages.find((page) => page.slug === slug) ?? null;
}

export function getPageSectionContent(
  page: PageContent | null | undefined,
  key: string,
  locale: Locale,
  fallback: string,
): string {
  const section = page?.sections.find((item) => item.key === key && item.visible);
  if (!section) return fallback;

  if (section.type === 'image') {
    const value = section.content?.trim();
    return value || fallback;
  }

  if (!section.translations) {
    const legacyValue = section.content?.trim();
    return legacyValue || fallback;
  }

  const localizedValue = section.translations[locale]?.trim();
  if (localizedValue) return localizedValue;

  if (locale === 'tr') {
    const trValue = section.translations.tr?.trim() || section.content?.trim();
    return trValue || fallback;
  }

  return fallback;
}

export function getSectionLocaleValue(section: PageSection, locale: Locale): string {
  if (section.type === 'image') {
    return section.content ?? '';
  }

  if (section.translations) {
    return section.translations[locale] ?? '';
  }

  return locale === 'tr' ? section.content ?? '' : '';
}

export function setSectionLocaleValue(section: PageSection, locale: Locale, value: string): PageSection {
  if (section.type === 'image') {
    return { ...section, content: value };
  }

  const nextTranslations: Partial<Record<Locale, string>> = {};
  for (const item of locales) {
    nextTranslations[item] = section.translations?.[item] ?? (item === 'tr' ? section.content ?? '' : '');
  }
  nextTranslations[locale] = value;

  return {
    ...section,
    content: locale === 'tr' ? value : (nextTranslations.tr ?? section.content ?? ''),
    translations: nextTranslations,
  };
}
