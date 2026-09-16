import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, PackageOpen, Zap, HeadphonesIcon } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <Navbar 
        onCartClick={() => navigate('/?cart=open')}
        onToggleFavorites={() => navigate('/?favorites=true')}
      />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 py-16 bg-white min-h-screen shadow-sm rounded-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Hakkımızda
          </h1>
          
          {/* Görsel Alanı */}
          <div className="mb-10 w-full rounded-2xl overflow-hidden shadow-md">
            <img 
              src="/about-header.png" 
              alt="Neta Oto Market Kurumsal" 
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="text-gray-600 leading-relaxed space-y-8 text-lg">
            
            {/* Biz Kimiz? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Biz Kimiz?</h2>
              <p>
                Neta Oto Market olarak, araç sahiplerinin otomobillerini kişiselleştirme ve sürüş deneyimlerini iyileştirme tutkusuna profesyonel çözümler sunuyoruz. Otomotiv aksesuar sektöründeki yenilikleri yakından takip ederek; body kit, yeni nesil aydınlatma teknolojileri, akıllı multimedya sistemleri ve premium donanım parçalarından oluşan geniş ürün yelpazemizi müşterilerimizle buluşturuyoruz.
              </p>
            </section>

            {/* Vizyonumuz ve Kalite Anlayışımız */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz ve Kalite Anlayışımız</h2>
              <p>
                Amacımız, aracınıza sadece estetik bir görünüm kazandırmak değil; aynı zamanda konforu ve teknolojiyi en üst düzeye çıkarmaktır. Sektördeki standartları yükseltme vizyonuyla, amatör çözümlerden uzaklaşarak tamamen kurumsal, şeffaf ve güvenilir bir e-ticaret deneyimi inşa ettik. Satışa sunduğumuz her bir parçanın, kalite standartlarımıza ve aracınızın dinamiğine tam uyumlu olmasına büyük özen gösteriyoruz.
              </p>
            </section>

            {/* Neden Neta Oto Market? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Neden Neta Oto Market?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Tam Uyum Garantisi</h3>
                    <p className="text-sm">Aracınızın marka, model ve üretim yılına kusursuz şekilde entegre olabilen, montaja hazır ve spesifik ürünler sunuyoruz.</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Premium Ürün Seçkisi</h3>
                    <p className="text-sm">Sadece dayanıklılığı kanıtlanmış, aerodinamik testlerden geçmiş ve yüksek teknoloji barındıran markalara kataloğumuzda yer veriyoruz.</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                    <PackageOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Şeffaf ve Hızlı Operasyon</h3>
                    <p className="text-sm">Siparişinizin alındığı andan kargo teslimatına kadar süreci titizlikle yönetiyor, güvenli paketleme ve hızlı lojistik ağıyla ürünlerinizi kapınıza ulaştırıyoruz.</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                    <HeadphonesIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Satış Sonrası Destek</h3>
                    <p className="text-sm">Doğru parçayı seçmenizden, ürünün montaj süreçlerine kadar her adımda profesyonel müşteri hizmetlerimizle yanınızdayız.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Yolculuğumuzda Bize Katılın */}
            <section className="mt-12 bg-orange-50 p-8 rounded-2xl border border-orange-100 text-center">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">Yolculuğumuzda Bize Katılın</h2>
              <p className="text-orange-900 mb-0">
                Kocaeli Kartepe'deki merkezimizden Türkiye'nin dört bir yanındaki otomobil tutkunlarına ulaşıyor, her geçen gün büyüyen ailemizle araçları hayal edilen görünüme kavuşturuyoruz. Aracınızın tarzını ve performansını artırırken, Neta Oto Market güvencesini tercih ettiğiniz için teşekkür ederiz.
              </p>
            </section>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
