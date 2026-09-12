import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, UploadCloud, MessageCircle, Mail, MapPin, Phone, Settings, Globe } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('Genel');

  // Form States (Mock)
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Neta Oto Market',
    maintenanceMode: false
  });

  const [contactSettings, setContactSettings] = useState({
    address: 'Neta Oto Market, İstanbul',
    email: 'destek@netaotomarket.com',
    phone: '0850 123 45 67',
    whatsapp: '+90 555 123 45 67',
    instagram: 'https://instagram.com/netaotomarket',
    facebook: 'https://facebook.com/netaotomarket'
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'Neta Oto Market - Kaliteli Oto Aksesuarları',
    metaDescription: 'En kaliteli oto dış görünüm, aydınlatma ve iç aksesuar ürünleri en uygun fiyatlarla Neta Oto Market\'te.'
  });

  const handleSave = () => {
    // Backend API çağrısı simülasyonu
    toast.success('Ayarlar başarıyla güncellendi!');
  };

  return (
    <div style={{ position: 'relative', paddingBottom: '4rem' }}>
      
      {/* Sticky Header with Save Button */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'transparent',
        padding: '1rem 0',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Site Ayarları</h2>
        <button 
          onClick={handleSave}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }}
        >
          <Save size={18} />
          Ayarları Kaydet
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
        {['Genel', 'İletişim & Sosyal Medya', 'SEO Ayarları'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #f97316' : '2px solid transparent',
              color: activeTab === tab ? '#f97316' : '#6b7280',
              fontWeight: activeTab === tab ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        
        {/* TAB 1: GENEL AYARLAR */}
        {activeTab === 'Genel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Site Adı</label>
                <input 
                  type="text" 
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Site Logosu (Header)</label>
                <div style={{ 
                  border: '2px dashed #d1d5db', 
                  borderRadius: '12px', 
                  padding: '2rem', 
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer'
                }}>
                  <UploadCloud size={32} color="#9ca3af" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>Tıklayın veya resmi buraya sürükleyin</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>PNG, JPG veya SVG (Önerilen: 200x50px)</div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Favicon (Tarayıcı İkonu)</label>
                <div style={{ 
                  border: '2px dashed #d1d5db', 
                  borderRadius: '12px', 
                  padding: '2rem', 
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer'
                }}>
                  <UploadCloud size={32} color="#9ca3af" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>Tıklayın veya resmi buraya sürükleyin</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>ICO veya PNG (Önerilen: 32x32px)</div>
                </div>
              </div>
            </div>

            <hr style={{ borderTop: '1px solid #e5e7eb', margin: '1rem 0' }} />

            {/* Maintenance Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fef2f2', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={18} />
                  Siteyi Bakım Moduna Al
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#ef4444' }}>Müşteriler siteye erişemez. Sadece yöneticiler giriş yapabilir.</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                <input 
                  type="checkbox" 
                  checked={generalSettings.maintenanceMode}
                  onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                  style={{ opacity: 0, width: 0, height: 0 }} 
                />
                <span style={{ 
                  position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: generalSettings.maintenanceMode ? '#ef4444' : '#d1d5db', 
                  transition: '.4s', borderRadius: '34px' 
                }}>
                  <span style={{
                    position: 'absolute', content: '""', height: '20px', width: '20px', 
                    left: generalSettings.maintenanceMode ? '26px' : '4px', bottom: '4px', 
                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                  }}></span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: İLETİŞİM & SOSYAL MEDYA */}
        {activeTab === 'İletişim & Sosyal Medya' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Şirket Adresi</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    type="text" 
                    value={contactSettings.address}
                    onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Destek E-Postası</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    type="email" 
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Müşteri Hizmetleri (Tel)</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    type="tel" 
                    value={contactSettings.phone}
                    onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Highlighted WhatsApp Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>WhatsApp Destek Numarası</label>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={18} color="#22c55e" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    type="tel" 
                    value={contactSettings.whatsapp}
                    onChange={(e) => setContactSettings({...contactSettings, whatsapp: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #22c55e', outline: 'none', backgroundColor: '#f0fdf4', boxSizing: 'border-box' }}
                  />
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>* Bu numara müşterilerin katalog ve sipariş soruları için kullanılır.</p>
              </div>
            </div>

            <hr style={{ borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />

            {/* Social Media */}
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Sosyal Medya Hesapları</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Instagram</label>
                <div style={{ position: 'relative' }}>
                  <FaInstagram size={18} color="#ec4899" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    type="url" 
                    value={contactSettings.instagram}
                    onChange={(e) => setContactSettings({...contactSettings, instagram: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Facebook</label>
                <div style={{ position: 'relative' }}>
                  <FaFacebook size={18} color="#3b5998" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    type="url" 
                    value={contactSettings.facebook}
                    onChange={(e) => setContactSettings({...contactSettings, facebook: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SEO AYARLARI */}
        {activeTab === 'SEO Ayarları' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Globe size={20} color="#3b82f6" style={{ marginTop: '0.125rem' }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e3a8a', fontSize: '0.875rem' }}>Arama Motoru Optimizasyonu</h4>
                <p style={{ margin: 0, color: '#3b82f6', fontSize: '0.875rem' }}>Buradaki bilgiler sitenizin Google ve diğer arama motorlarında nasıl görüneceğini belirler.</p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Ana Sayfa Başlığı (Meta Title)</label>
              <input 
                type="text" 
                value={seoSettings.metaTitle}
                onChange={(e) => setSeoSettings({...seoSettings, metaTitle: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
              />
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Önerilen uzunluk: 50-60 karakter. (Şu an: {seoSettings.metaTitle.length})</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Site Açıklaması (Meta Description)</label>
              <textarea 
                rows={4}
                value={seoSettings.metaDescription}
                onChange={(e) => setSeoSettings({...seoSettings, metaDescription: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Önerilen uzunluk: 150-160 karakter. (Şu an: {seoSettings.metaDescription.length})</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminSettings;
