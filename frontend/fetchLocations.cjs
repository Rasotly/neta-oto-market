const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://turkiyeapi.dev/api/v1/provinces', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Geçersiz API yanıtı.");
        process.exit(1);
      }

      const provinces = response.data;
      
      const cities = provinces.map(p => p.name).sort((a, b) => a.localeCompare(b, 'tr'));
      
      const districts = {};
      provinces.forEach(p => {
        districts[p.name] = p.districts.map(d => d.name).sort((a, b) => a.localeCompare(b, 'tr'));
      });

      const fileContent = `// Otomatik oluşturulmuş Türkiye İl ve İlçe listesi\n\nexport const CITIES = ${JSON.stringify(cities, null, 2)};\n\nexport const DISTRICTS = ${JSON.stringify(districts, null, 2)};\n`;
      
      const targetPath = path.join(__dirname, 'src', 'utils', 'turkeyLocations.js');
      
      // Ensure directory exists
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(targetPath, fileContent);
      console.log('Başarıyla oluşturuldu: ' + targetPath);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

}).on('error', (err) => {
  console.error("API'ye bağlanırken hata oluştu: " + err.message);
  process.exit(1);
});
