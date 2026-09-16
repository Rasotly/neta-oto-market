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
          
          <div className="text-gray-600 leading-relaxed space-y-8 text-base">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Kişisel Verilerin Toplanması</h2>
              <p>
                Neta Oto Market olarak; ad, soyad, adres ve iletişim bilgileriniz sadece sipariş ve teslimat süreçlerinin sorunsuz yürütülmesi amacıyla kullanılmaktadır. Sitemizde yapılan ziyaretçi davranışları ve genel kullanıcı analizleri tamamen anonim olarak gerçekleştirilir, kişisel verilerinizle eşleştirilmez.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Ödeme Güvenliği</h2>
              <p>
                Sitemizde tüm veri akışı 256-bit SSL (Secure Sockets Layer) şifreleme teknolojisiyle güvence altına alınmıştır. Kredi kartı ve banka kartı bilgileriniz sunucularımızda, loglarımızda veya veri tabanlarımızda <strong>asla</strong> saklanmaz. Ödeme işlemleri onay için doğrudan Troy, Visa ve Mastercard gibi güvenilir altyapı sağlayıcılarına şifreli ve kapalı devre olarak iletilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Bilgi Paylaşımı</h2>
              <p>
                Sistemimize kayıtlı olan hiçbir kişisel veriniz, üçüncü şahıslara veya kurumlara ticari amaçla satılmaz, kiralanmaz ve paylaşılmaz. Bilgileriniz yalnızca satın aldığınız ürünlerin size güvenli bir biçimde ulaşabilmesi için, resmi anlaşmamız bulunan kargo ve lojistik firmalarıyla (gerekli olduğu kadarıyla) paylaşılmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Çerezler (Cookies) ve Haklarınız</h2>
              <p className="mb-3">
                Web sitemizde, sepet deneyiminizi iyileştirmek, oturumunuzu açık tutmak ve size daha iyi hizmet sunabilmek amacıyla temel çerezler (cookies) kullanılmaktadır. KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında sahip olduğunuz haklar:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                <li>Verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                <li>Verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme.</li>
              </ul>
              <p className="mt-4">
                KVKK haklarınız kapsamında sistemimizdeki verilerinizin tamamen silinmesi, güncellenmesi veya bilgi talepleriniz için bize <a href="mailto:netaotomarket@gmail.com" className="font-semibold text-orange-500 hover:underline">netaotomarket@gmail.com</a> adresi üzerinden dilediğiniz zaman ulaşabilirsiniz.
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
