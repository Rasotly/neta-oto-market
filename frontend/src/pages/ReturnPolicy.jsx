import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ReturnPolicy = () => {
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
            İade Koşulları
          </h1>
          
          <div className="text-gray-600 leading-relaxed space-y-6 text-base">
            <p>
              Neta Oto Market'ten yaptığınız alışverişlerde müşteri memnuniyeti önceliğimizdir. Satın almış olduğunuz ürünleri, teslimat tarihinden itibaren 14 gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin iade edebilirsiniz.
            </p>
            <p>
              İade işlemlerinin başlatılabilmesi için ürünün kullanılmamış, montajı yapılmamış, kutusu veya ambalajı zarar görmemiş ve tekrar satılabilir özelliğini yitirmemiş olması gerekmektedir. Özellikle elektronik ürünler, aydınlatma ve multimedya sistemlerinde ürünün güvenlik etiketinin yırtılmamış olması şarttır.
            </p>
            <p>
              İade edilecek ürünle birlikte orijinal faturanın (tüm kopyalarıyla birlikte) ve ürünün tüm aksesuarlarının eksiksiz olarak tarafımıza gönderilmesi gerekmektedir. İade kargo bedelleri, anlaşmalı olduğumuz kargo firmaları kullanıldığı takdirde tarafımızca karşılanmaktadır. Farklı bir kargo firması ile gönderimlerde kargo ücreti müşterimize aittir.
            </p>
            <p>
              İade ettiğiniz ürün depolarımıza ulaştıktan sonra ilgili birimlerimiz tarafından incelenir. İade şartlarına uygun olan ürünlerin bedeli, inceleme tamamlandıktan sonraki 3 iş günü içerisinde ödeme yaptığınız yönteme sadık kalınarak tarafınıza iade edilir.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReturnPolicy;
