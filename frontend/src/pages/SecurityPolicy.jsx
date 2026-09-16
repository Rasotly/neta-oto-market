import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const SecurityPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <Navbar 
        onCartClick={() => navigate('/?cart=open')}
        onToggleFavorites={() => navigate('/?favorites=true')}
      />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen shadow-sm rounded-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
            Gizlilik ve Güvenlik
          </h1>
          
          <div className="text-sm text-gray-600 leading-relaxed text-justify space-y-4">
            
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">GİZLİLİK VE GÜVENLİK POLİTİKASI</h2>
              <p>
                Mağazamızda verilen tüm servisler ve hizmetler Neta Oto Market firmamıza aittir ve firmamız tarafından işletilmektedir. Firmamız, çeşitli amaçlarla kişisel veriler toplayabilir. Aşağıda, toplanan kişisel verilerin nasıl ve ne şekilde toplandığı, bu verilerin nasıl ve ne şekilde korunduğu belirtilmiştir.
              </p>
              <p className="mt-2">
                Üyelik veya mağazamız üzerindeki çeşitli form ve anketlerin doldurulması suretiyle üyelerin kendileriyle ilgili bir takım kişisel bilgileri (isim-soy isim, firma bilgileri, telefon, adres veya e-posta adresleri gibi) mağazamız tarafından işin doğası gereği toplanmaktadır. Firmamız bazı dönemlerde müşterilerine ve üyelerine kampanya bilgileri, yeni ürünler hakkında bilgiler, promosyon teklifleri gönderebilir. Üyelerimiz bu gibi bilgileri alıp almama konusunda her türlü seçimi üye olurken yapabilir, sonrasında hesap ayarları bölümünden bu seçimi değiştirebilirler.
              </p>
              <p className="mt-2">
                Sistemle ilgili sorunların tanımlanması ve verilen hizmet ile ilgili çıkabilecek sorunların veya uyuşmazlıkların hızla çözülmesi için, firmamız üyelerinin IP adresini kaydetmekte ve bunu kullanmaktadır. IP adresleri, kullanıcıları genel bir şekilde tanımlamak ve kapsamlı demografik bilgi toplamak amacıyla da kullanılabilir.
              </p>
              <p className="mt-2">
                Firmamız, gizli bilgileri kesinlikle özel ve gizli tutmayı, bunu bir sır saklama yükümlülüğü olarak addetmeyi ve gizliliğin sağlanması ve sürdürülmesi, gizli bilginin tamamının veya herhangi bir kısmının kamu alanına girmesini veya yetkisiz kullanımını veya üçüncü bir kişiye ifşasını önlemek için gerekli tüm tedbirleri almayı ve gerekli özeni göstermeyi taahhüt etmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">KREDİ KARTI GÜVENLİĞİ</h2>
              <p>
                Firmamız, alışveriş sitelerimizden alışveriş yapan kredi kartı sahiplerinin güvenliğini ilk planda tutmaktadır. Kredi kartı bilgileriniz hiçbir şekilde sistemimizde saklanmamaktadır.
              </p>
              <p className="mt-2">
                İşlemler sürecine girdiğinizde güvenli bir sitede olduğunuzu anlamak için dikkat etmeniz gereken iki şey vardır. Bunlardan biri tarayıcınızın adres çubuğunda bulunan bir kilit simgesidir. Bu güvenli bir internet sayfasında olduğunuzu gösterir ve her türlü bilgileriniz şifrelenerek korunur. Alışveriş sırasında kullanılan kredi kartı ile ilgili bilgiler sitelerimizden bağımsız olarak 256 bit SSL (Secure Sockets Layer) protokolü ile şifrelenip sorgulanmak üzere ilgili bankaya ulaştırılır. Kartın kullanılabilirliği onaylandığı takdirde alışverişe devam edilir.
              </p>
              <p className="mt-2">
                Online olarak kredi kartı ile verilen siparişlerin ödeme/fatura/teslimat adresi bilgilerinin güvenilirliği firmamız tarafından Kredi Kartları Dolandırıcılığı'na karşı denetlenmektedir. Bu yüzden, alışveriş sitelerimizden ilk defa sipariş veren müşterilerin siparişlerinin tedarik ve teslimat aşamasına gelebilmesi için öncelikle finansal ve adres/telefon bilgilerinin doğruluğunun onaylanması gereklidir.
              </p>
              <p className="mt-2 font-semibold text-gray-800">
                Not: İnternet alışveriş sitelerinde firmanın açık adresinin ve telefonun yer almasına dikkat edilmesini tavsiye ediyoruz. Eğer güvenmiyorsanız alışverişten önce telefon ederek teyit ediniz. Firmamıza ait tüm online alışveriş sitelerimizde firmamıza dair tüm bilgiler ve firma yeri belirtilmiştir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">MAİL ORDER KREDİ KARTI BİLGİLERİ GÜVENLİĞİ</h2>
              <p>
                Kredi kartı mail-order yöntemi ile bize göndereceğiniz kimlik ve kredi kart bilgileriniz firmamız tarafından gizlilik prensibine göre saklanacaktır. Bu bilgiler olası banka ile oluşabilecek kredi kartından para çekim itirazlarına karşı 60 gün süre ile bekletilip daha sonrasında imha edilmektedir. Sipariş ettiğiniz ürünlerin bedeli karşılığında bize göndereceğiniz tarafınızdan onaylı mail-order formu bedeli dışında herhangi bir bedelin kartınızdan çekilmesi halinde doğal olarak bankaya itiraz edebilir ve bu tutarın ödenmesini engelleyebileceğiniz için bir risk oluşturmamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">ÜÇÜNCÜ TARAF WEB SİTELERİ VE UYGULAMALAR</h2>
              <p>
                Mağazamız, web sitesi dahilinde başka sitelere link verebilir. Firmamız, bu linkler vasıtasıyla erişilen sitelerin gizlilik uygulamaları ve içeriklerine yönelik herhangi bir sorumluluk taşımamaktadır. İş bu sözleşmedeki Gizlilik Politikası Prensipleri, sadece mağazamızın kullanımına ilişkindir, üçüncü taraf web sitelerini kapsamaz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">İSTİSNAİ HALLER</h2>
              <p>
                Aşağıda belirtilen sınırlı hallerde Firmamız, işbu "Gizlilik Politikası" hükümleri dışında kullanıcılara ait bilgileri üçüncü kişilere açıklayabilir. Bu durumlar sınırlı sayıda olmak üzere;
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Kanun, Kanun Hükmünde Kararname, Yönetmelik v.b. yetkili hukuki otorite tarafından çıkarılan ve yürürlükte olan hukuk kurallarının getirdiği zorunluluklara uymak;</li>
                <li>Mağazamızın kullanıcılarla akdettiği "Üyelik Sözleşmesi"nin ve diğer sözleşmelerin gereklerini yerine getirmek ve bunları uygulamaya koymak amacıyla;</li>
                <li>Yetkili idari ve adli otorite tarafından usulüne göre yürütülen bir araştırma veya soruşturmanın yürütümü amacıyla kullanıcılarla ilgili bilgi talep edilmesi;</li>
                <li>Kullanıcıların hakları veya güvenliklerini korumak için bilgi vermenin gerekli olduğu hallerdir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">E-POSTA GÜVENLİĞİ</h2>
              <p>
                Mağazamızın Müşteri Hizmetleri'ne, herhangi bir siparişinizle ilgili olarak göndereceğiniz e-postalarda, asla kredi kartı numaranızı veya şifrelerinizi yazmayınız. E-postalarda yer alan bilgiler üçüncü şahıslar tarafından görülebilir. Firmamız e-postalarınızdan aktarılan bilgilerin güvenliğini hiçbir koşulda garanti edemez.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">TARAYICI ÇEREZLERİ</h2>
              <p>
                Firmamız, mağazamızı ziyaret eden kullanıcılar ve kullanıcıların web sitesini kullanımı hakkındaki bilgileri teknik bir iletişim dosyası (Çerez-Cookie) kullanarak elde edebilir. Bahsi geçen teknik iletişim dosyaları, ana bellekte saklanmak üzere bir internet sitesinin kullanıcının tarayıcısına (browser) gönderdiği küçük metin dosyalarıdır. Teknik iletişim dosyası site hakkında durum ve tercihleri saklayarak İnternet'in kullanımını kolaylaştırır.
              </p>
              <p className="mt-2">
                Teknik iletişim dosyası, siteyi kaç kişinin ziyaret ettiğini, bir kişinin siteyi hangi amaçla, kaç kez ziyaret ettiğini ve ne kadar sitede kaldıkları hakkında istatistiksel bilgileri elde etmeye ve kullanıcılar için özel tasarlanmış kullanıcı sayfalarından dinamik olarak reklam ve içerik üretilmesine yardımcı olur. Tarayıcıların pek çoğu başta teknik iletişim dosyasını kabul eder biçimde tasarlanmıştır ancak kullanıcılar dilerse teknik iletişim dosyasının gelmemesi veya teknik iletişim dosyasının gönderildiğinde uyarı verilmesini sağlayacak biçimde ayarları değiştirebilirler.
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecurityPolicy;
