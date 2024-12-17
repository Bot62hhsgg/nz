export default {
  async fetch(request) {
    const ipAddress = request.headers.get('CF-Connecting-IP') || 'Tidak dapat mendeteksi IP';

    // Mengambil informasi geolokasi berdasarkan IP
    const geoInfo = await getGeolocation(ipAddress);

    // Menambahkan elemen untuk menampilkan IP Address, Kota, dan Kecepatan Jaringan
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate HTTPS URL</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
        }

        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            width: 100%;
        }

        h1 {
            margin-bottom: 20px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        input, select, button {
            width: 100%;
            padding: 14px;
            margin: 10px 0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        input, select {
            background: rgba(255, 255, 255, 0.8);
            color: #333;
        }

        button {
            background: #ff6b6b;
            color: white;
            cursor: pointer;
        }

        button:hover {
            background: #ee5253;
            transform: translateY(-2px);
        }

        button:active {
            transform: translateY(2px);
        }

        #message {
            margin-top: 20px;
            font-size: 14px;
        }

        #message.green {
            color: #00ff6b;
        }

        #message.red {
            color: #ff6b6b;
        }

        #network-info {
            margin-top: 20px;
            font-size: 16px;
        }

        .info-box {
            background-color: rgba(0, 0, 0, 0.3);
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
            display: inline-block;
        }

        .flag {
            width: 40px;
            height: auto;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Generate HTTPS URL</h1>
        <p>Masukkan subdomain dan pilih domain:</p>

        <input type="text" id="subdomainInput" placeholder="Masukkan subdomain">
        
        <select id="domainSelect">
            <option value="ari-andika2.site">ari-andika2.site</option>
            <option value="ari-andikha.web.id">ari-andikha.web.id</option>
            <option value="gendarxml.web.id">gendarxml.web.id</option>
        </select>

        <button onclick="openUrl()">Buka URL</button>

        <div id="message"></div>

        <div id="network-info">
            <div class="info-box">
                <p><strong>IP Address Anda:</strong> <span id="ipAddress">${ipAddress}</span></p>
                <p><strong>Kota:</strong> <span id="city">${geoInfo.city || 'Tidak dapat mendeteksi kota'}</span></p>
                <p><strong>Kecepatan Jaringan:</strong> <span id="networkSpeed">Menghitung...</span></p>
            </div>
        </div>
    </div>

    <script>
        let generatedUrl = "";

        function openUrl() {
            const subdomain = document.getElementById('subdomainInput').value.trim();
            const domain = document.getElementById('domainSelect').value;
            const message = document.getElementById('message');

            if (subdomain === '') {
                message.innerHTML = "Subdomain tidak boleh kosong!";
                message.className = 'red';
                return;
            }

            generatedUrl = \`https://\${subdomain}.\${domain}\`;
            window.location.href = generatedUrl;  // Meneruskan langsung ke URL yang digabungkan
        }

        // Fungsi untuk mengukur kecepatan jaringan (menggunakan API Browser)
        async function getNetworkSpeed() {
            const networkSpeedElement = document.getElementById('networkSpeed');
            try {
                const startTime = performance.now();
                const image = new Image();
                image.src = 'https://www.gstatic.com/webp/gallery/2.jpg';  // Menggunakan gambar sebagai sumber untuk pengukuran
                await image.decode();
                const endTime = performance.now();
                const duration = endTime - startTime;
                const speed = (image.width * image.height) / (duration * 1000); // Kecepatan dalam KB/ms
                networkSpeedElement.innerHTML = speed.toFixed(2) + ' KB/ms';
            } catch (error) {
                networkSpeedElement.innerHTML = 'Tidak dapat mengukur kecepatan';
            }
        }

        // Memanggil fungsi getNetworkSpeed saat halaman dimuat
        getNetworkSpeed();

        // Fungsi untuk mendapatkan informasi geolokasi berdasarkan IP
        async function getGeolocation(ip) {
            try {
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                if (response.ok) {
                    const data = await response.json();
                    return {
                        city: data.city || 'Tidak tersedia',
                        country: data.country_name || 'Tidak tersedia',
                        country_code: data.country_code || 'ID'
                    };
                } else {
                    return {
                        city: 'Tidak dapat mendeteksi kota',
                        country: 'Tidak dapat mendeteksi negara',
                        country_code: 'ID'
                    };
                }
            } catch (error) {
                return {
                    city: 'Tidak dapat mendeteksi kota',
                    country: 'Tidak dapat mendeteksi negara',
                    country_code: 'ID'
                };
            }
        }
    </script>
</body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
        },
      }
    );
  },
};
