import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            Gizlilik Politikası
          </h1>
          
          <div className="text-gray-600 leading-relaxed space-y-6 text-base">
            <p>
              Neta Oto Market ("biz", "bize" veya "bizim") olarak, netaotomarket.com ("Web Sitesi") adresini ziyaret eden veya alışveriş yapan kullanıcılarımızın ("Kullanıcı") kişisel verilerinin korunmasına büyük önem veriyoruz. Bu gizlilik politikası, hangi verileri topladığımızı, bu verileri nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
            </p>
            <p>
              Web sitemize üye olurken veya alışveriş yaparken adınız, soyadınız, e-posta adresiniz, teslimat ve fatura adresiniz ile telefon numaranız gibi temel iletişim ve kimlik bilgilerinizi topluyoruz. Bu bilgiler, siparişlerinizin sorunsuz bir şekilde teslim edilmesi, size kampanya ve duyurular hakkında bilgi verilmesi (onayınız dahilinde) ve müşteri hizmetleri süreçlerinin yürütülmesi amacıyla kullanılmaktadır.
            </p>
            <p>
              Ödeme aşamasında kullandığınız kredi kartı veya banka kartı bilgileriniz sistemlerimizde kesinlikle saklanmamaktadır. Tüm ödeme işlemleri, güvenli (SSL) bağlantılar üzerinden doğrudan anlaşmalı olduğumuz bankalar veya güvenilir ödeme altyapısı sağlayıcıları aracılığıyla gerçekleştirilmektedir.
            </p>
            <p>
              Kişisel verileriniz, yasal zorunluluklar haricinde hiçbir şekilde üçüncü şahıslarla paylaşılmamakta ve satılmamaktadır. Verilerinizin güvenliğini sağlamak amacıyla endüstri standartlarında güvenlik duvarları, şifreleme ve veri koruma protokolleri kullanmaktayız. Gizlilik haklarınız ve kişisel verilerinizin silinmesi talepleriniz için bizimle netaotomarket@gmail.com adresi üzerinden iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
