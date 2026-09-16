import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <Navbar 
        onCartClick={() => navigate('/?cart=open')}
        onToggleFavorites={() => navigate('/?favorites=true')}
      />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 py-16 bg-white min-h-screen shadow-sm rounded-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Hakkımızda
          </h1>
          
          <div className="text-gray-600 leading-relaxed space-y-6 text-base">
            <p>
              Neta Oto Market olarak, otomotiv sektöründeki tutkumuzu ve uzmanlığımızı siz değerli araç sahipleriyle buluşturuyoruz. Kurulduğumuz günden bu yana, aracınız için en kaliteli oto aksesuarları, aydınlatma sistemleri, multimedya çözümleri ve body kit ürünlerini güvenilir bir şekilde sunmayı ilke edindik.
            </p>
            <p>
              Amacımız sadece ürün satmak değil, aynı zamanda aracınızı kişiselleştirirken veya performansını artırırken ihtiyaç duyduğunuz teknik desteği ve doğru yönlendirmeyi sağlamaktır. Sektördeki yenilikleri yakından takip ederek, en güncel ve en trend ürünleri stoklarımızda bulundurmaya özen gösteriyoruz.
            </p>
            <p>
              Müşteri memnuniyetini her zaman ön planda tutan anlayışımızla, satış öncesi ve sonrası destek hizmetlerimizle yanınızdayız. Neta Oto Market ile aracınızda fark yaratın, yola güvenle devam edin. Bizi tercih ettiğiniz için teşekkür ederiz.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
