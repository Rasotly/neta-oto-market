import React from 'react';
import { Package, Tags, Eye, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics = () => {
  // --- Mock Data ---

  // Line Chart Data (Monthly Visits)
  const monthlyVisitsData = [
    { name: 'Oca', visits: 4000 },
    { name: 'Şub', visits: 3000 },
    { name: 'Mar', visits: 2000 },
    { name: 'Nis', visits: 2780 },
    { name: 'May', visits: 1890 },
    { name: 'Haz', visits: 2390 },
    { name: 'Tem', visits: 3490 },
    { name: 'Ağu', visits: 4500 },
    { name: 'Eyl', visits: 5200 },
  ];

  // Doughnut Chart Data (Category Distribution)
  const categoryData = [
    { name: 'Dış Görünüm', value: 400 },
    { name: 'Aydınlatma', value: 300 },
    { name: 'İç Aksesuar', value: 300 },
    { name: 'Jant & Lastik', value: 200 },
    { name: 'Performans', value: 100 },
  ];
  
  // Custom colors for pie chart
  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e'];

  // Top Products Mock Data
  const topProducts = [
    { id: 1, name: 'CIVIC 2022+ 4 LENS LED FAR', category: 'Aydınlatma', views: 3450 },
    { id: 2, name: 'BMW F30 M TAMPON SETİ', category: 'Dış Görünüm', views: 2890 },
    { id: 3, name: 'VW GOLF 7.5 KAYAR SİNYAL', category: 'Aydınlatma', views: 2100 },
    { id: 4, name: 'AUDI A3 RS PANJUR', category: 'Dış Görünüm', views: 1850 },
    { id: 5, name: 'MERCEDES C SERİSİ AMBİYANS', category: 'İç Aksesuar', views: 1620 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        
        {/* Card 1: Toplam Ürün */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '8px', color: '#d97706' }}>
              <Package size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: '600', backgroundColor: '#d1fae5', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>
              <TrendingUp size={14} />
              +5%
            </div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Toplam Ürün Sayısı</div>
            <div style={{ color: '#111827', fontSize: '1.875rem', fontWeight: '700' }}>1,245</div>
          </div>
        </div>

        {/* Card 2: Aktif Kategoriler */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '8px', color: '#2563eb' }}>
              <Tags size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: '600', backgroundColor: '#d1fae5', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>
              <TrendingUp size={14} />
              +2%
            </div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Aktif Kategoriler</div>
            <div style={{ color: '#111827', fontSize: '1.875rem', fontWeight: '700' }}>24</div>
          </div>
        </div>

        {/* Card 3: Toplam Katalog Ziyareti */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', borderRadius: '8px', color: '#059669' }}>
              <Eye size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: '600', backgroundColor: '#d1fae5', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>
              <TrendingUp size={14} />
              +12%
            </div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Toplam Katalog Ziyareti</div>
            <div style={{ color: '#111827', fontSize: '1.875rem', fontWeight: '700' }}>12,500</div>
          </div>
        </div>

        {/* Card 4: WhatsApp Tıklamaları */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', borderRadius: '8px', color: '#9333ea' }}>
              <MessageCircle size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.875rem', fontWeight: '600', backgroundColor: '#fee2e2', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>
              <TrendingDown size={14} />
              -3%
            </div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>İletişim / WhatsApp</div>
            <div style={{ color: '#111827', fontSize: '1.875rem', fontWeight: '700' }}>340</div>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Line Chart Panel */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Aylık Katalog Ziyaretleri</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyVisitsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}
                />
                <Line type="monotone" dataKey="visits" name="Ziyaret" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doughnut Chart Panel */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Kategori Dağılımı</h3>
          <div style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: '500' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              {categoryData.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Top 5 Products Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>En Çok İncelenen 5 Ürün</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Görsel</th>
                <th style={{ textAlign: 'left', padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Ürün Adı</th>
                <th style={{ textAlign: 'left', padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Kategorisi</th>
                <th style={{ textAlign: 'right', padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>Görüntülenme</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6', ':last-child': { borderBottom: 'none' } }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} color="#9ca3af" />
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500', color: '#111827' }}>{product.name}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '12px', fontSize: '0.875rem', color: '#4b5563' }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: '600', color: '#f97316' }}>
                    {product.views.toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminAnalytics;
