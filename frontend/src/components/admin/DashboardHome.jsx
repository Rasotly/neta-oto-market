import React, { useState } from 'react';
import { Wallet, Clock, Users, AlertTriangle } from 'lucide-react';

const DashboardHome = () => {
  // Mock Data
  const [recentOrders, setRecentOrders] = useState([
    { id: '#1024', customer: 'Ahmet Yılmaz', date: '10 Eyl 2026', total: '1.250 ₺', status: 'Onay Bekliyor' },
    { id: '#1026', customer: 'Ayşe Kaya', date: '08 Eyl 2026', total: '450 ₺', status: 'Hazırlanıyor' },
    { id: '#1028', customer: 'Caner Öz', date: '08 Eyl 2026', total: '1.450 ₺', status: 'Onay Bekliyor' },
  ]);

  const lowStockItems = [
    { id: 1, name: 'CIVIC 2022+ 4 LENS LED FAR', stock: 2 },
    { id: 2, name: 'BMW F30 M TAMPON SETİ', stock: 4 },
    { id: 3, name: 'VW GOLF 7.5 KAYAR SİNYAL', stock: 1 },
    { id: 4, name: 'AUDI A3 RS PANJUR', stock: 3 },
  ];

  const handleAction = (orderId, currentStatus) => {
    // Basic mock logic to transition state
    setRecentOrders(prev => prev.filter(order => order.id !== orderId));
    // In a real app, this would make an API call to update the order status
  };

  return (
    <div className="w-full">
      {/* 1. Üst Metrik Kartları (4'lü Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Kart 1: Aylık Ciro */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Aylık Ciro</p>
            <p className="text-2xl font-bold text-gray-900">124.500 ₺</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <Wallet className="text-green-600" size={24} />
          </div>
        </div>

        {/* Kart 2: Bekleyen Siparişler */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Bekleyen Siparişler</p>
            <p className="text-2xl font-bold text-gray-900">14</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <Clock className="text-[#D5A738]" size={24} />
          </div>
        </div>

        {/* Kart 3: Toplam Müşteri */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Toplam Müşteri</p>
            <p className="text-2xl font-bold text-gray-900">84</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="text-blue-600" size={24} />
          </div>
        </div>

        {/* Kart 4: Kritik Stok */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Kritik Stok</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Bekleyen Siparişler Hızlı Yönetim Tablosu */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Bekleyen Siparişler</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-5 font-medium">Sipariş No</th>
                  <th className="py-3 px-5 font-medium">Müşteri</th>
                  <th className="py-3 px-5 font-medium">Tutar</th>
                  <th className="py-3 px-5 font-medium">Tarih</th>
                  <th className="py-3 px-5 font-medium text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">Bekleyen sipariş bulunmuyor.</td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-5 font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 px-5 text-gray-700">{order.customer}</td>
                      <td className="py-3 px-5 font-medium">{order.total}</td>
                      <td className="py-3 px-5 text-gray-500">{order.date}</td>
                      <td className="py-3 px-5 text-right">
                        <button 
                          onClick={() => handleAction(order.id, order.status)}
                          className="bg-[#D5A738] hover:opacity-90 transition-opacity text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {order.status === 'Onay Bekliyor' ? 'Onayla' : 'Kargoya Ver'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Tükenmek Üzere Olan Ürünler (Kısa Liste) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Tükenmek Üzere Olan Ürünler</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-red-50/50 p-3 rounded-xl border border-red-100">
                <span className="text-sm font-medium text-gray-800 truncate pr-2">{item.name}</span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Kalan: {item.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
