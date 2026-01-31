// ============================================
// MODEL VERİ YAPISI
// ============================================

const modelsData = [
    {
        id: 1,
        title: "Modern Vazo",
        category: "decorative",
        description: "Modern ve şık tasarıma sahip dekoratif vazo. Her türlü iç mekana uyum sağlar.",
        difficulty: "easy",
        image: "vase",
        rating: 4.5,
        reviews: 12,
        specs: {
            format: "STL",
            dimensions: "120 x 80 x 150 mm",
            printTime: "4-5 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 2,
        title: "Dişli Çark Seti",
        category: "mechanical",
        description: "Farklı boyutlarda dişli çarklar içeren mekanik parça seti. Robotik projeler için ideal.",
        difficulty: "medium",
        image: "gears",
        rating: 4.8,
        reviews: 8,
        specs: {
            format: "STL",
            dimensions: "Çeşitli boyutlar",
            printTime: "6-8 saat",
            filament: "PLA / ABS",
            support: "Kısmen gerekli"
        }
    },
    {
        id: 3,
        title: "Masa Organizer",
        category: "organizer",
        description: "Kalem, klips ve küçük eşyalar için pratik masa organizer. Modüler tasarım.",
        difficulty: "easy",
        image: "organizer",
        rating: 4.7,
        reviews: 15,
        specs: {
            format: "STL",
            dimensions: "200 x 150 x 50 mm",
            printTime: "3-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 4,
        title: "Robot Figür",
        category: "toys",
        description: "Sevimli robot figürü. Çocuklar için güvenli ve dayanıklı oyuncak.",
        difficulty: "easy",
        image: "robot",
        rating: 4.9,
        reviews: 22,
        specs: {
            format: "STL",
            dimensions: "100 x 80 x 120 mm",
            printTime: "3-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 5,
        title: "Arduino Kutusu",
        category: "electronics",
        description: "Arduino Uno için özel tasarlanmış koruyucu kutu. Delikli tasarım ile erişim kolaylığı.",
        difficulty: "medium",
        image: "arduino",
        rating: 4.6,
        reviews: 18,
        specs: {
            format: "STL",
            dimensions: "75 x 55 x 25 mm",
            printTime: "2-3 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 6,
        title: "Duvar Saati",
        category: "decorative",
        description: "Minimalist duvar saati çerçevesi. Standart saat mekanizması ile uyumludur.",
        difficulty: "medium",
        image: "clock",
        rating: 4.4,
        reviews: 10,
        specs: {
            format: "STL",
            dimensions: "200 x 200 x 15 mm",
            printTime: "5-6 saat",
            filament: "PLA / Wood PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 7,
        title: "Bearing Yatağı",
        category: "mechanical",
        description: "608 rulman için özel yatak. Mekanik projelerde kullanım için optimize edilmiştir.",
        difficulty: "hard",
        image: "bearing",
        rating: 4.5,
        reviews: 7,
        specs: {
            format: "STL",
            dimensions: "22 x 22 x 7 mm",
            printTime: "1-2 saat",
            filament: "PLA / ABS",
            support: "Gerekmez"
        }
    },
    {
        id: 8,
        title: "Telefon Standı",
        category: "organizer",
        description: "Ayarlanabilir açılı telefon standı. Hem yatay hem dikey kullanım için uygundur.",
        difficulty: "easy",
        image: "stand",
        rating: 4.8,
        reviews: 20,
        specs: {
            format: "STL",
            dimensions: "120 x 80 x 60 mm",
            printTime: "2-3 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 9,
        title: "Puzzle Küp",
        category: "toys",
        description: "3D puzzle küp. Zihinsel gelişim için eğitici oyuncak.",
        difficulty: "hard",
        image: "puzzle",
        rating: 4.3,
        reviews: 14,
        specs: {
            format: "STL",
            dimensions: "60 x 60 x 60 mm",
            printTime: "4-5 saat",
            filament: "PLA",
            support: "Gerekli"
        }
    },
    {
        id: 10,
        title: "Raspberry Pi Kılıfı",
        category: "electronics",
        description: "Raspberry Pi 4 için havalandırmalı kılıf. Soğutma fanı desteği ile.",
        difficulty: "medium",
        image: "raspberry",
        rating: 4.7,
        reviews: 16,
        specs: {
            format: "STL",
            dimensions: "90 x 60 x 30 mm",
            printTime: "3-4 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 11,
        title: "Hediyelik Kutu",
        category: "decorative",
        description: "Özel günler için şık hediye kutusu. Kapaklı ve süslemeli tasarım.",
        difficulty: "medium",
        image: "giftbox",
        rating: 4.6,
        reviews: 11,
        specs: {
            format: "STL",
            dimensions: "100 x 100 x 80 mm",
            printTime: "5-6 saat",
            filament: "PLA / Silk PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 12,
        title: "Kablo Organizer",
        category: "organizer",
        description: "Kabloları düzenlemek için pratik organizer. Duvar montajı için delikli.",
        difficulty: "easy",
        image: "cable",
        rating: 4.5,
        reviews: 13,
        specs: {
            format: "STL",
            dimensions: "150 x 50 x 30 mm",
            printTime: "2-3 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 13,
        title: "Geometric Heykel",
        category: "decorative",
        description: "Modern geometrik heykel. Minimalist tasarım ile her mekana uyum sağlar.",
        difficulty: "medium",
        image: "sculpture",
        rating: 4.7,
        reviews: 19,
        specs: {
            format: "STL",
            dimensions: "150 x 150 x 200 mm",
            printTime: "6-7 saat",
            filament: "PLA / PETG",
            support: "Kısmen gerekli"
        }
    },
    {
        id: 14,
        title: "Motor Montaj Plakası",
        category: "mechanical",
        description: "NEMA 17 step motor için montaj plakası. Hassas delikler ve güçlü yapı.",
        difficulty: "medium",
        image: "motor",
        rating: 4.8,
        reviews: 25,
        specs: {
            format: "STL",
            dimensions: "42 x 42 x 5 mm",
            printTime: "1-2 saat",
            filament: "PLA / ABS",
            support: "Gerekmez"
        }
    },
    {
        id: 15,
        title: "Kulaklık Standı",
        category: "organizer",
        description: "Şık ve ergonomik kulaklık standı. Masa üstü için ideal.",
        difficulty: "easy",
        image: "headphone",
        rating: 4.9,
        reviews: 28,
        specs: {
            format: "STL",
            dimensions: "200 x 150 x 180 mm",
            printTime: "4-5 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 16,
        title: "Araba Modeli",
        category: "toys",
        description: "Detaylı araba modeli. Tekerlekler dönebilir, çocuklar için güvenli.",
        difficulty: "medium",
        image: "car",
        rating: 4.6,
        reviews: 21,
        specs: {
            format: "STL",
            dimensions: "120 x 60 x 50 mm",
            printTime: "3-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 17,
        title: "ESP32 Kılıfı",
        category: "electronics",
        description: "ESP32 geliştirme kartı için koruyucu kılıf. Anten erişimi için özel tasarım.",
        difficulty: "medium",
        image: "esp32",
        rating: 4.7,
        reviews: 17,
        specs: {
            format: "STL",
            dimensions: "55 x 28 x 15 mm",
            printTime: "1-2 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 18,
        title: "Duvar Süsü",
        category: "decorative",
        description: "Geometrik desenli duvar süsü. Modern iç mekan dekorasyonu için.",
        difficulty: "easy",
        image: "wallart",
        rating: 4.5,
        reviews: 16,
        specs: {
            format: "STL",
            dimensions: "300 x 300 x 10 mm",
            printTime: "8-10 saat",
            filament: "PLA / Wood PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 19,
        title: "Pulley Sistemi",
        category: "mechanical",
        description: "GT2 timing belt için pulley seti. 3D yazıcı ve CNC projelerinde kullanım.",
        difficulty: "hard",
        image: "pulley",
        rating: 4.8,
        reviews: 12,
        specs: {
            format: "STL",
            dimensions: "20 x 20 x 10 mm",
            printTime: "2-3 saat",
            filament: "PLA / ABS",
            support: "Gerekmez"
        }
    },
    {
        id: 20,
        title: "Kamera Standı",
        category: "organizer",
        description: "Akıllı telefon ve küçük kameralar için ayarlanabilir stand.",
        difficulty: "easy",
        image: "camera",
        rating: 4.7,
        reviews: 23,
        specs: {
            format: "STL",
            dimensions: "100 x 80 x 120 mm",
            printTime: "2-3 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 21,
        title: "Bina Blokları",
        category: "toys",
        description: "Çocuklar için yapı blokları seti. Farklı şekiller ve boyutlar.",
        difficulty: "easy",
        image: "blocks",
        rating: 4.9,
        reviews: 31,
        specs: {
            format: "STL",
            dimensions: "Çeşitli boyutlar",
            printTime: "2-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 22,
        title: "LED Strip Kılıfı",
        category: "electronics",
        description: "WS2812B LED strip için diffuser kılıf. Yumuşak ışık dağılımı.",
        difficulty: "medium",
        image: "led",
        rating: 4.6,
        reviews: 14,
        specs: {
            format: "STL",
            dimensions: "1000 x 10 x 8 mm",
            printTime: "5-6 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 23,
        title: "Mumluk",
        category: "decorative",
        description: "Romantik mumluk tasarımı. Yıldız desenli delikler ile gölge efekti.",
        difficulty: "medium",
        image: "candle",
        rating: 4.8,
        reviews: 20,
        specs: {
            format: "STL",
            dimensions: "80 x 80 x 100 mm",
            printTime: "4-5 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 24,
        title: "Vida Seti",
        category: "mechanical",
        description: "M3 ve M4 vidalar için standart vida seti. Farklı uzunluklar.",
        difficulty: "easy",
        image: "screw",
        rating: 4.4,
        reviews: 9,
        specs: {
            format: "STL",
            dimensions: "Çeşitli boyutlar",
            printTime: "1-2 saat",
            filament: "PLA / ABS",
            support: "Gerekmez"
        }
    },
    {
        id: 25,
        title: "Kitap Ayracı",
        category: "organizer",
        description: "Özel tasarım kitap ayracı. Geometrik desenli ve dayanıklı.",
        difficulty: "easy",
        image: "bookmark",
        rating: 4.5,
        reviews: 11,
        specs: {
            format: "STL",
            dimensions: "150 x 30 x 2 mm",
            printTime: "30-45 dakika",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 26,
        title: "Uçak Modeli",
        category: "toys",
        description: "Detaylı uçak modeli. Kanatlar ve gövde ayrı parçalar halinde.",
        difficulty: "hard",
        image: "plane",
        rating: 4.7,
        reviews: 18,
        specs: {
            format: "STL",
            dimensions: "200 x 180 x 60 mm",
            printTime: "5-6 saat",
            filament: "PLA",
            support: "Gerekli"
        }
    },
    {
        id: 27,
        title: "Sensör Kutusu",
        category: "electronics",
        description: "DHT22 ve benzeri sensörler için koruyucu kutu. Havalandırmalı tasarım.",
        difficulty: "easy",
        image: "sensor",
        rating: 4.6,
        reviews: 15,
        specs: {
            format: "STL",
            dimensions: "40 x 30 x 20 mm",
            printTime: "1 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 28,
        title: "Çiçek Vazosu",
        category: "decorative",
        description: "Modern çiçek vazosu. Farklı yüksekliklerde seçenekler.",
        difficulty: "medium",
        image: "flowerpot",
        rating: 4.7,
        reviews: 24,
        specs: {
            format: "STL",
            dimensions: "100 x 100 x 180 mm",
            printTime: "5-6 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 29,
        title: "Rulman Yatağı",
        category: "mechanical",
        description: "608 rulman için özel yatak. Yüksek toleranslı üretim.",
        difficulty: "hard",
        image: "bearing2",
        rating: 4.9,
        reviews: 13,
        specs: {
            format: "STL",
            dimensions: "30 x 30 x 10 mm",
            printTime: "2-3 saat",
            filament: "PLA / ABS",
            support: "Gerekmez"
        }
    },
    {
        id: 30,
        title: "Kalemlik",
        category: "organizer",
        description: "Masa üstü kalemlik. Modern ve şık tasarım.",
        difficulty: "easy",
        image: "penholder",
        rating: 4.8,
        reviews: 27,
        specs: {
            format: "STL",
            dimensions: "80 x 80 x 120 mm",
            printTime: "3-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    // DEKORATİF KATEGORİSİ - Ek Ürünler
    {
        id: 31,
        title: "Geometrik Lamba Gölgesi",
        category: "decorative",
        description: "Modern geometrik desenli lamba gölgesi. Işığı yumuşak bir şekilde dağıtır.",
        difficulty: "medium",
        image: "lamp",
        rating: 4.6,
        reviews: 18,
        specs: {
            format: "STL",
            dimensions: "200 x 200 x 150 mm",
            printTime: "6-8 saat",
            filament: "PLA / PETG",
            support: "Kısmen gerekli"
        }
    },
    {
        id: 32,
        title: "Masa Üstü Heykelcik",
        category: "decorative",
        description: "Minimalist masa üstü heykelcik. Ofis ve ev dekorasyonu için ideal.",
        difficulty: "easy",
        image: "statue",
        rating: 4.5,
        reviews: 15,
        specs: {
            format: "STL",
            dimensions: "80 x 80 x 120 mm",
            printTime: "3-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 33,
        title: "Duvar Paneli",
        category: "decorative",
        description: "3D duvar paneli. Modern iç mekan dekorasyonu için şık çözüm.",
        difficulty: "medium",
        image: "panel",
        rating: 4.7,
        reviews: 22,
        specs: {
            format: "STL",
            dimensions: "300 x 300 x 20 mm",
            printTime: "10-12 saat",
            filament: "PLA / Wood PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 34,
        title: "Şamdan",
        category: "decorative",
        description: "Klasik şamdan tasarımı. Standart mumlar için uyumlu.",
        difficulty: "easy",
        image: "candlestick",
        rating: 4.4,
        reviews: 13,
        specs: {
            format: "STL",
            dimensions: "60 x 60 x 150 mm",
            printTime: "2-3 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    // MEKANİK KATEGORİSİ - Ek Ürünler
    {
        id: 35,
        title: "Kremayer ve Pinyon Seti",
        category: "mechanical",
        description: "Doğrusal hareket için kremayer ve pinyon seti. Robotik projelerde kullanım.",
        difficulty: "hard",
        image: "rack",
        rating: 4.8,
        reviews: 11,
        specs: {
            format: "STL",
            dimensions: "100 x 20 x 10 mm",
            printTime: "3-4 saat",
            filament: "PLA / ABS",
            support: "Gerekli"
        }
    },
    {
        id: 36,
        title: "Bağlantı Parçası",
        category: "mechanical",
        description: "Modüler yapılar için bağlantı parçası. Farklı açılarda birleştirme imkanı.",
        difficulty: "medium",
        image: "connector",
        rating: 4.6,
        reviews: 16,
        specs: {
            format: "STL",
            dimensions: "30 x 30 x 30 mm",
            printTime: "1-2 saat",
            filament: "PLA / ABS",
            support: "Gerekmez"
        }
    },
    {
        id: 37,
        title: "Mil Yatağı",
        category: "mechanical",
        description: "8mm mil için özel yatak. Yüksek yük taşıma kapasitesi.",
        difficulty: "medium",
        image: "shaft",
        rating: 4.7,
        reviews: 14,
        specs: {
            format: "STL",
            dimensions: "25 x 25 x 15 mm",
            printTime: "2-3 saat",
            filament: "PLA / ABS",
            support: "Gerekmez"
        }
    },
    {
        id: 38,
        title: "Kavrama Sistemi",
        category: "mechanical",
        description: "Döner kavrama sistemi. Mekanik projeler için güvenilir çözüm.",
        difficulty: "hard",
        image: "clutch",
        rating: 4.5,
        reviews: 10,
        specs: {
            format: "STL",
            dimensions: "50 x 50 x 20 mm",
            printTime: "4-5 saat",
            filament: "PLA / ABS",
            support: "Gerekli"
        }
    },
    // ORGANİZER KATEGORİSİ - Ek Ürünler
    {
        id: 39,
        title: "Masa Üstü Dosyalama Sistemi",
        category: "organizer",
        description: "Dosya ve belgeler için pratik organizasyon sistemi. Modüler tasarım.",
        difficulty: "easy",
        image: "filing",
        rating: 4.7,
        reviews: 19,
        specs: {
            format: "STL",
            dimensions: "250 x 200 x 100 mm",
            printTime: "5-6 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 40,
        title: "Takı Organizer",
        category: "organizer",
        description: "Küpe, yüzük ve kolye için özel organizer. Kompakt ve şık tasarım.",
        difficulty: "easy",
        image: "jewelry",
        rating: 4.8,
        reviews: 24,
        specs: {
            format: "STL",
            dimensions: "150 x 100 x 60 mm",
            printTime: "3-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 41,
        title: "Bardak Altlığı Seti",
        category: "organizer",
        description: "Masa koruma için bardak altlığı seti. Farklı desenler ve boyutlar.",
        difficulty: "easy",
        image: "coaster",
        rating: 4.6,
        reviews: 17,
        specs: {
            format: "STL",
            dimensions: "100 x 100 x 5 mm",
            printTime: "1-2 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 42,
        title: "Çekmece Organizer",
        category: "organizer",
        description: "Çekmeceler için modüler organizer. Küçük eşyaları düzenlemek için ideal.",
        difficulty: "medium",
        image: "drawer",
        rating: 4.7,
        reviews: 21,
        specs: {
            format: "STL",
            dimensions: "200 x 150 x 40 mm",
            printTime: "4-5 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    // OYUNCAKLAR KATEGORİSİ - Ek Ürünler
    {
        id: 43,
        title: "Hayvan Figürü Seti",
        category: "toys",
        description: "Sevimli hayvan figürleri seti. Çocuklar için güvenli ve eğitici.",
        difficulty: "easy",
        image: "animals",
        rating: 4.9,
        reviews: 28,
        specs: {
            format: "STL",
            dimensions: "Çeşitli boyutlar",
            printTime: "2-3 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 44,
        title: "Yapboz Parçaları",
        category: "toys",
        description: "3D yapboz parçaları. Zihinsel gelişim için eğitici oyuncak.",
        difficulty: "medium",
        image: "puzzle2",
        rating: 4.6,
        reviews: 16,
        specs: {
            format: "STL",
            dimensions: "Çeşitli boyutlar",
            printTime: "3-4 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 45,
        title: "Oyuncak Tren",
        category: "toys",
        description: "Detaylı oyuncak tren seti. Lokomotif ve vagonlar ayrı parçalar.",
        difficulty: "hard",
        image: "train",
        rating: 4.8,
        reviews: 20,
        specs: {
            format: "STL",
            dimensions: "150 x 50 x 60 mm",
            printTime: "5-6 saat",
            filament: "PLA",
            support: "Gerekli"
        }
    },
    {
        id: 46,
        title: "Topaç",
        category: "toys",
        description: "Klasik topaç oyuncağı. Döndürme mekanizması ile eğlenceli.",
        difficulty: "easy",
        image: "spinning",
        rating: 4.5,
        reviews: 12,
        specs: {
            format: "STL",
            dimensions: "40 x 40 x 60 mm",
            printTime: "1-2 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 47,
        title: "Bebek Oyuncağı",
        category: "toys",
        description: "Bebekler için güvenli oyuncak. Yumuşak kenarlar ve büyük parçalar.",
        difficulty: "easy",
        image: "baby",
        rating: 4.7,
        reviews: 18,
        specs: {
            format: "STL",
            dimensions: "80 x 80 x 80 mm",
            printTime: "2-3 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    // ELEKTRONİK KATEGORİSİ - Ek Ürünler
    {
        id: 48,
        title: "NodeMCU Kılıfı",
        category: "electronics",
        description: "NodeMCU ESP8266 için koruyucu kılıf. Anten erişimi ve USB portu açık.",
        difficulty: "medium",
        image: "nodemcu",
        rating: 4.7,
        reviews: 19,
        specs: {
            format: "STL",
            dimensions: "60 x 30 x 15 mm",
            printTime: "1-2 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 49,
        title: "PCB Standı",
        category: "electronics",
        description: "Elektronik kartlar için stand. Test ve geliştirme sırasında kullanım.",
        difficulty: "easy",
        image: "pcb",
        rating: 4.6,
        reviews: 15,
        specs: {
            format: "STL",
            dimensions: "100 x 80 x 20 mm",
            printTime: "2-3 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 50,
        title: "Breadboard Kutusu",
        category: "electronics",
        description: "Breadboard ve jumper kablolar için özel kutu. Düzenli saklama çözümü.",
        difficulty: "easy",
        image: "breadboard",
        rating: 4.8,
        reviews: 22,
        specs: {
            format: "STL",
            dimensions: "200 x 150 x 50 mm",
            printTime: "4-5 saat",
            filament: "PLA",
            support: "Gerekmez"
        }
    },
    {
        id: 51,
        title: "OLED Ekran Kılıfı",
        category: "electronics",
        description: "128x64 OLED ekran için koruyucu kılıf. Montaj delikleri ile.",
        difficulty: "medium",
        image: "oled",
        rating: 4.5,
        reviews: 13,
        specs: {
            format: "STL",
            dimensions: "35 x 25 x 10 mm",
            printTime: "1 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    },
    {
        id: 52,
        title: "Batarya Kutusu",
        category: "electronics",
        description: "18650 batarya için güvenli kutu. Termal koruma ve havalandırma delikleri.",
        difficulty: "medium",
        image: "battery",
        rating: 4.7,
        reviews: 17,
        specs: {
            format: "STL",
            dimensions: "70 x 20 x 20 mm",
            printTime: "2-3 saat",
            filament: "PLA / PETG",
            support: "Gerekmez"
        }
    }
];

// ============================================
// GLOBAL DEĞİŞKENLER
// ============================================

let currentFilter = "all";
let currentSearch = "";
let currentModelReviews = {}; // Model ID'ye göre yorumlar
let favoriteModels = JSON.parse(localStorage.getItem('favorites') || '[]'); // Favori modeller
let showDiscountOnly = false;
let showFreeShipping = false;
let showInStock = false;
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]'); // Sepet ürünleri
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null'); // Giriş yapmış kullanıcı

// ============================================
// DOM ELEMENTLERİ
// ============================================

const header = document.getElementById('header');
const themeToggle = document.getElementById('themeToggle');
const userBtn = document.getElementById('userBtn');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.querySelector('.main-nav');
const modelsGrid = document.getElementById('modelsGrid');
const noResults = document.getElementById('noResults');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const modelModal = document.getElementById('modelModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const userModal = document.getElementById('userModal');
const userModalClose = document.getElementById('userModalClose');
const cartModal = document.getElementById('cartModal');
const cartModalClose = document.getElementById('cartModalClose');

// ============================================
// TEMA DEĞİŞTİRME (KIRMIZI-SİYAH / MAVİ-YEŞİL)
// ============================================

// Tema durumunu kontrol et (localStorage'dan)
const savedTheme = localStorage.getItem('theme') || 'red';
document.documentElement.setAttribute('data-theme', savedTheme);

// Tema değiştirme butonu - 2 tema arasında geçiş
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'red' ? 'blue' : 'red';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Tema değiştiğinde bildirim göster
        showNotification(`Tema ${newTheme === 'red' ? 'Kırmızı-Siyah' : 'Mavi-Yeşil'} olarak değiştirildi`);
    });
}

// ============================================
// ARAMA FONKSİYONLARI
// ============================================

// Arama input (header'daki arama çubuğu)
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        renderModels();
    });

    // Enter tuşu ile arama
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Arama butonu
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        searchInput?.focus();
    });
}

// ============================================
// MOBİL MENÜ
// ============================================

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.className = navMenu.classList.contains('active') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        }
    });
}

// Menü linklerine tıklandığında mobil menüyü kapat
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileMenuToggle) {
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });
});

// ============================================
// ============================================
// SIDEBAR FİLTRELEME VE KATEGORİLER
// ============================================

// Kategori checkbox'ları
document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            // Diğer checkbox'ları kapat
            document.querySelectorAll('.category-checkbox').forEach(cb => {
                if (cb !== e.target) cb.checked = false;
            });
            currentFilter = e.target.dataset.category || 'all';
            renderModels();
        }
    });
});

// Filtre checkbox'ları
const filterDiscount = document.getElementById('filterDiscount');
const filterFreeShipping = document.getElementById('filterFreeShipping');
const filterInStock = document.getElementById('filterInStock');

if (filterDiscount) {
    filterDiscount.addEventListener('change', (e) => {
        showDiscountOnly = e.target.checked;
        renderModels();
    });
}

if (filterFreeShipping) {
    filterFreeShipping.addEventListener('change', (e) => {
        showFreeShipping = e.target.checked;
        renderModels();
    });
}

if (filterInStock) {
    filterInStock.addEventListener('change', (e) => {
        showInStock = e.target.checked;
        renderModels();
    });
}

// Sıralama
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        renderModels();
    });
}

// Footer linklerindeki filtreler
document.querySelectorAll('.footer-section a[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        currentFilter = link.dataset.filter;
        
        // Kategori checkbox'ını güncelle
        document.querySelectorAll('.category-checkbox').forEach(cb => {
            cb.checked = cb.dataset.category === currentFilter;
        });
        
        renderModels();
        document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============================================
// MODEL RENDER FONKSİYONLARI
// ============================================

function renderModels() {
    // Filtreleme ve arama
    let filteredModels = modelsData.filter(model => {
        const matchesFilter = currentFilter === 'all' || model.category === currentFilter;
        const matchesSearch = currentSearch === '' || 
            model.title.toLowerCase().includes(currentSearch) ||
            model.description.toLowerCase().includes(currentSearch);
        
        // İndirim filtresi
        if (showDiscountOnly) {
            const basePrice = 500 + (model.id * 50);
            const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0;
            if (discount === 0) return false;
        }
        
        return matchesFilter && matchesSearch;
    });

    // Sıralama
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        filteredModels.sort((a, b) => {
            switch(sortValue) {
                case 'price-low':
                    return (500 + a.id * 50) - (500 + b.id * 50);
                case 'price-high':
                    return (500 + b.id * 50) - (500 + a.id * 50);
                case 'newest':
                    return b.id - a.id;
                case 'rating':
                    return b.rating - a.rating;
                default: // popular
                    return b.reviews - a.reviews;
            }
        });
    }

    // Sonuç yoksa mesaj göster
    if (filteredModels.length === 0) {
        if (modelsGrid) modelsGrid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    // Sonuç varsa grid göster
    if (modelsGrid) {
        modelsGrid.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';

        // Modelleri render et
        modelsGrid.innerHTML = filteredModels.map(model => createModelCard(model)).join('');
        
        // Kartlara tıklama
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Favori butonuna tıklanmışsa modal açma
                if (e.target.closest('.product-wishlist')) return;
                const modelId = parseInt(card.dataset.modelId);
                openModelModal(modelId);
            });
        });
    }
}

function createModelCard(model) {
    const difficultyLabels = {
        easy: 'Kolay',
        medium: 'Orta',
        hard: 'Zor'
    };

    const difficultyClasses = {
        easy: 'difficulty-easy',
        medium: 'difficulty-medium',
        hard: 'difficulty-hard'
    };

    const icons = {
        vase: 'fas fa-wine-bottle',
        gears: 'fas fa-cogs',
        organizer: 'fas fa-boxes',
        robot: 'fas fa-robot',
        arduino: 'fas fa-microchip',
        clock: 'fas fa-clock',
        bearing: 'fas fa-circle',
        stand: 'fas fa-mobile-alt',
        puzzle: 'fas fa-puzzle-piece',
        raspberry: 'fas fa-server',
        giftbox: 'fas fa-gift',
        cable: 'fas fa-plug',
        sculpture: 'fas fa-monument',
        motor: 'fas fa-cog',
        headphone: 'fas fa-headphones',
        car: 'fas fa-car',
        esp32: 'fas fa-microchip',
        wallart: 'fas fa-image',
        pulley: 'fas fa-circle-notch',
        camera: 'fas fa-camera',
        blocks: 'fas fa-cubes',
        led: 'fas fa-lightbulb',
        candle: 'fas fa-fire',
        screw: 'fas fa-screwdriver',
        bookmark: 'fas fa-bookmark',
        plane: 'fas fa-plane',
        sensor: 'fas fa-thermometer-half',
        flowerpot: 'fas fa-seedling',
        bearing2: 'fas fa-circle',
        penholder: 'fas fa-pen',
        lamp: 'fas fa-lightbulb',
        statue: 'fas fa-monument',
        panel: 'fas fa-th',
        candlestick: 'fas fa-fire',
        rack: 'fas fa-cogs',
        connector: 'fas fa-link',
        shaft: 'fas fa-circle',
        clutch: 'fas fa-cog',
        filing: 'fas fa-folder',
        jewelry: 'fas fa-gem',
        coaster: 'fas fa-circle',
        drawer: 'fas fa-drawer',
        animals: 'fas fa-paw',
        puzzle2: 'fas fa-puzzle-piece',
        train: 'fas fa-train',
        spinning: 'fas fa-circle-notch',
        baby: 'fas fa-baby',
        nodemcu: 'fas fa-microchip',
        pcb: 'fas fa-microchip',
        breadboard: 'fas fa-th',
        oled: 'fas fa-tv',
        battery: 'fas fa-battery-full'
    };

    // Fiyat hesaplama (rastgele indirim için)
    const basePrice = 500 + (model.id * 50);
    const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0;
    const finalPrice = discount > 0 ? Math.floor(basePrice * (1 - discount / 100)) : basePrice;
    const inStock = Math.random() > 0.2; // %80 stokta var
    const isFavorite = favoriteModels.includes(model.id);

    return `
        <div class="product-card" data-model-id="${model.id}">
            <div class="product-image-wrapper">
                <div class="product-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--accent-color);">
                    <i class="${icons[model.image] || 'fas fa-cube'}"></i>
                </div>
                ${discount > 0 ? `<div class="product-badge">%${discount}</div>` : ''}
                <button class="product-wishlist ${isFavorite ? 'active' : ''}" data-model-id="${model.id}" onclick="toggleFavorite(${model.id}, event)">
                    <i class="fas fa-heart"></i>
                </button>
                ${!inStock ? '<div class="product-out-of-stock">TÜKENDİ</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${model.title}</h3>
                <div class="product-price">
                    ${discount > 0 ? `<span class="price-old">${basePrice.toFixed(2)} ₺</span>` : ''}
                    <span class="price-new">${finalPrice.toFixed(2)} ₺</span>
                </div>
                <div class="product-meta">
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${model.rating}</span>
                        <span>(${model.reviews})</span>
                    </div>
                    <div class="product-colors">
                        <div class="color-dot active" style="background-color: #000;"></div>
                        <div class="color-dot" style="background-color: #fff; border-color: #ccc;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// MODAL FONKSİYONLARI
// ============================================

function openModelModal(modelId) {
    const model = modelsData.find(m => m.id === modelId);
    if (!model) return;

    const difficultyLabels = {
        easy: 'Kolay',
        medium: 'Orta',
        hard: 'Zor'
    };

    const icons = {
        vase: 'fas fa-wine-bottle',
        gears: 'fas fa-cogs',
        organizer: 'fas fa-boxes',
        robot: 'fas fa-robot',
        arduino: 'fas fa-microchip',
        clock: 'fas fa-clock',
        bearing: 'fas fa-circle',
        stand: 'fas fa-mobile-alt',
        puzzle: 'fas fa-puzzle-piece',
        raspberry: 'fas fa-server',
        giftbox: 'fas fa-gift',
        cable: 'fas fa-plug',
        sculpture: 'fas fa-monument',
        motor: 'fas fa-cog',
        headphone: 'fas fa-headphones',
        car: 'fas fa-car',
        esp32: 'fas fa-microchip',
        wallart: 'fas fa-image',
        pulley: 'fas fa-circle-notch',
        camera: 'fas fa-camera',
        blocks: 'fas fa-cubes',
        led: 'fas fa-lightbulb',
        candle: 'fas fa-fire',
        screw: 'fas fa-screwdriver',
        bookmark: 'fas fa-bookmark',
        plane: 'fas fa-plane',
        sensor: 'fas fa-thermometer-half',
        flowerpot: 'fas fa-seedling',
        bearing2: 'fas fa-circle',
        penholder: 'fas fa-pen',
        lamp: 'fas fa-lightbulb',
        statue: 'fas fa-monument',
        panel: 'fas fa-th',
        candlestick: 'fas fa-fire',
        rack: 'fas fa-cogs',
        connector: 'fas fa-link',
        shaft: 'fas fa-circle',
        clutch: 'fas fa-cog',
        filing: 'fas fa-folder',
        jewelry: 'fas fa-gem',
        coaster: 'fas fa-circle',
        drawer: 'fas fa-drawer',
        animals: 'fas fa-paw',
        puzzle2: 'fas fa-puzzle-piece',
        train: 'fas fa-train',
        spinning: 'fas fa-circle-notch',
        baby: 'fas fa-baby',
        nodemcu: 'fas fa-microchip',
        pcb: 'fas fa-microchip',
        breadboard: 'fas fa-th',
        oled: 'fas fa-tv',
        battery: 'fas fa-battery-full'
    };

    // Yorumları al
    const reviews = currentModelReviews[modelId] || [];

    // Modal içeriğini oluştur
    modalBody.innerHTML = `
        <div class="modal-image-container">
            <div class="modal-main-image">
                <i class="${icons[model.image] || 'fas fa-cube'}"></i>
            </div>
            <div class="modal-thumbnails">
                <div class="modal-thumbnail active"></div>
                <div class="modal-thumbnail"></div>
                <div class="modal-thumbnail"></div>
            </div>
        </div>
        
        <h2 class="modal-title">${model.title}</h2>
        <p class="modal-description">${model.description}</p>
        
        <div class="modal-specs">
            <h3>Teknik Bilgiler</h3>
            <div class="spec-item">
                <span class="spec-label">Dosya Formatı:</span>
                <span class="spec-value">${model.specs.format}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Ölçüler:</span>
                <span class="spec-value">${model.specs.dimensions}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Baskı Süresi:</span>
                <span class="spec-value">${model.specs.printTime}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Tavsiye Edilen Filament:</span>
                <span class="spec-value">${model.specs.filament}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Destek Gereksinimi:</span>
                <span class="spec-value">${model.specs.support}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Baskı Zorluğu:</span>
                <span class="spec-value">${difficultyLabels[model.difficulty]}</span>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-download" onclick="downloadSTL(${model.id}, '${model.title}')">
                <i class="fas fa-download"></i>
                STL Dosyasını İndir
            </button>
            <button class="btn-download btn-cart" onclick="addToCart(${model.id}); closeModal();">
                <i class="fas fa-shopping-cart"></i>
                Sepete Ekle
            </button>
        </div>
        
        <div class="modal-reviews">
            <h3>Yorumlar ve Puanlar</h3>
            
            <div class="review-form">
                <h4>Yorum Ekle</h4>
                <div class="rating-input">
                    <label>Puan:</label>
                    <div class="star-rating">
                        <input type="radio" id="star5-${model.id}" name="rating-${model.id}" value="5">
                        <label for="star5-${model.id}">★</label>
                        <input type="radio" id="star4-${model.id}" name="rating-${model.id}" value="4">
                        <label for="star4-${model.id}">★</label>
                        <input type="radio" id="star3-${model.id}" name="rating-${model.id}" value="3">
                        <label for="star3-${model.id}">★</label>
                        <input type="radio" id="star2-${model.id}" name="rating-${model.id}" value="2">
                        <label for="star2-${model.id}">★</label>
                        <input type="radio" id="star1-${model.id}" name="rating-${model.id}" value="1">
                        <label for="star1-${model.id}">★</label>
                    </div>
                </div>
                <textarea 
                    class="review-textarea" 
                    id="reviewText-${model.id}" 
                    placeholder="Yorumunuzu yazın..."
                ></textarea>
                <button class="btn-submit-review" onclick="submitReview(${model.id})">
                    Yorumu Gönder
                </button>
            </div>
            
            <div class="reviews-list" id="reviewsList-${model.id}">
                ${reviews.length > 0 
                    ? reviews.map(review => createReviewItem(review)).join('')
                    : '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Henüz yorum yapılmamış.</p>'
                }
            </div>
        </div>
    `;

    // Modal'ı göster
    modelModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function createReviewItem(review) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    return `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <div class="review-stars">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `;
}

// Modal kapatma
modalClose.addEventListener('click', closeModal);
modelModal.addEventListener('click', (e) => {
    if (e.target === modelModal) {
        closeModal();
    }
});

// ESC tuşu ile kapatma
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modelModal.classList.contains('active')) {
        closeModal();
    }
});

function closeModal() {
    modelModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// YORUM EKLEME FONKSİYONU
// ============================================

function submitReview(modelId) {
    const ratingInput = document.querySelector(`input[name="rating-${modelId}"]:checked`);
    const reviewText = document.getElementById(`reviewText-${modelId}`).value.trim();

    if (!ratingInput) {
        alert('Lütfen bir puan seçin!');
        return;
    }

    if (!reviewText) {
        alert('Lütfen yorumunuzu yazın!');
        return;
    }

    // Yorum objesi oluştur
    const review = {
        id: Date.now(),
        author: 'Kullanıcı',
        rating: parseInt(ratingInput.value),
        text: reviewText,
        date: new Date().toLocaleDateString('tr-TR')
    };

    // Yorumları kaydet
    if (!currentModelReviews[modelId]) {
        currentModelReviews[modelId] = [];
    }
    currentModelReviews[modelId].unshift(review); // En yeni yorum üste

    // Yorumları localStorage'a kaydet
    localStorage.setItem('modelReviews', JSON.stringify(currentModelReviews));

    // Modal'ı yeniden render et
    openModelModal(modelId);

    // Formu temizle
    document.getElementById(`reviewText-${modelId}`).value = '';
    document.querySelectorAll(`input[name="rating-${modelId}"]`).forEach(input => {
        input.checked = false;
    });
}

// ============================================
// STL İNDİRME FONKSİYONU
// ============================================

function downloadSTL(modelId, modelTitle) {
    // Basit bir STL dosyası oluştur (placeholder)
    // Gerçek bir STL dosyası binary formatında olmalı, bu örnek için basit bir text placeholder kullanıyoruz
    
    const stlContent = `solid ${modelTitle.replace(/\s+/g, '_')}
  facet normal 0.0 0.0 1.0
    outer loop
      vertex 0.0 0.0 0.0
      vertex 1.0 0.0 0.0
      vertex 0.5 1.0 0.0
    endloop
  endfacet
endsolid ${modelTitle.replace(/\s+/g, '_')}`;

    // Blob oluştur
    const blob = new Blob([stlContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    // İndirme linki oluştur
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modelTitle.replace(/\s+/g, '_')}.stl`;
    document.body.appendChild(a);
    a.click();
    
    // Temizlik
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Başarı mesajı
    alert(`${modelTitle} modeli başarıyla indirildi!`);
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// STICKY HEADER SCROLL EFFECT
// ============================================

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'var(--shadow-sm)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// ============================================
// FAVORİ SİSTEMİ
// ============================================

function toggleFavorite(modelId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const index = favoriteModels.indexOf(modelId);
    if (index > -1) {
        favoriteModels.splice(index, 1);
    } else {
        favoriteModels.push(modelId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favoriteModels));
    renderModels();
}

// Global olarak erişilebilir yap
window.toggleFavorite = toggleFavorite;

// ============================================
// ÜYE GİRİŞİ SİSTEMİ
// ============================================

// Üye girişi butonu
if (userBtn) {
    userBtn.addEventListener('click', () => {
        if (currentUser) {
            // Kullanıcı giriş yapmışsa, çıkış yap
            if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
                currentUser = null;
                localStorage.removeItem('currentUser');
                updateUserButton();
                showNotification('Başarıyla çıkış yaptınız');
            }
        } else {
            // Giriş yapmamışsa modal aç
            if (userModal) {
                userModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Giriş formunu göster
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('registerForm').style.display = 'none';
            }
        }
    });
}

// Üye girişi modal kapatma
if (userModalClose) {
    userModalClose.addEventListener('click', () => {
        closeUserModal();
    });
}

if (userModal) {
    userModal.addEventListener('click', (e) => {
        if (e.target === userModal) {
            closeUserModal();
        }
    });
}

function closeUserModal() {
    if (userModal) {
        userModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Giriş ve kayıt formları arasında geçiş
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });
}

// Giriş formu
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basit doğrulama (gerçek uygulamada backend'e gönderilir)
        if (email && password) {
            currentUser = {
                email: email,
                name: email.split('@')[0],
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserButton();
            closeUserModal();
            showNotification('Başarıyla giriş yaptınız!');
            loginForm.reset();
        } else {
            showNotification('Lütfen tüm alanları doldurun', 'error');
        }
    });
}

// Kayıt formu
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;
        
        if (password !== passwordConfirm) {
            showNotification('Şifreler eşleşmiyor!', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Şifre en az 6 karakter olmalıdır!', 'error');
            return;
        }
        
        if (name && email && password) {
            currentUser = {
                name: name,
                email: email,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserButton();
            closeUserModal();
            showNotification('Kayıt başarılı! Hoş geldiniz!');
            registerForm.reset();
        } else {
            showNotification('Lütfen tüm alanları doldurun', 'error');
        }
    });
}

// Kullanıcı butonunu güncelle
function updateUserButton() {
    if (userBtn) {
        if (currentUser) {
            userBtn.innerHTML = `
                <i class="fas fa-user-check"></i>
                <span>${currentUser.name || currentUser.email.split('@')[0]}</span>
            `;
        } else {
            userBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Üye Girişi</span>
            `;
        }
    }
}

// ============================================
// SEPET SİSTEMİ
// ============================================

// Sepet butonu
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        if (cartModal) {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCart();
        }
    });
}

// Sepet modal kapatma
if (cartModalClose) {
    cartModalClose.addEventListener('click', () => {
        closeCartModal();
    });
}

if (cartModal) {
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
}

function closeCartModal() {
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Sepeti render et
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Sepetiniz boş</p>
                <a href="#models" class="btn-download" onclick="closeCartModal()">Alışverişe Başla</a>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '0.00 ₺';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = cartItems.map((item, index) => {
        const model = modelsData.find(m => m.id === item.modelId);
        if (!model) return '';
        
        const basePrice = 500 + (model.id * 50);
        const discount = item.discount || 0;
        const finalPrice = discount > 0 ? Math.floor(basePrice * (1 - discount / 100)) : basePrice;
        const itemTotal = finalPrice * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-cube"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${model.title}</h4>
                    <p class="cart-item-price">${finalPrice.toFixed(2)} ₺ x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-quantity-btn" onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="cart-quantity-btn" onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                    <button class="cart-remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    if (cartTotal) cartTotal.textContent = total.toFixed(2) + ' ₺';
    updateCartCount();
}

// Sepete ekle (ürün detay modal'ından çağrılacak)
function addToCart(modelId) {
    const model = modelsData.find(m => m.id === modelId);
    if (!model) return;
    
    const existingItem = cartItems.find(item => item.modelId === modelId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const basePrice = 500 + (model.id * 50);
        const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0;
        cartItems.push({
            modelId: modelId,
            quantity: 1,
            discount: discount
        });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showNotification(`${model.title} sepete eklendi!`);
    
    // Eğer sepet modal açıksa güncelle
    if (cartModal && cartModal.classList.contains('active')) {
        renderCart();
    }
}

// Sepetten çıkar
function removeFromCart(index) {
    const item = cartItems[index];
    const model = modelsData.find(m => m.id === item.modelId);
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    renderCart();
    if (model) {
        showNotification(`${model.title} sepetten çıkarıldı`);
    }
}

// Sepet miktarını güncelle
function updateCartQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    cartItems[index].quantity = newQuantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    renderCart();
}

// Sepet sayısını güncelle
function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Ödeme butonu
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showNotification('Sepetiniz boş!', 'error');
            return;
        }
        
        if (!currentUser) {
            showNotification('Ödeme için lütfen giriş yapın!', 'error');
            closeCartModal();
            if (userBtn) userBtn.click();
            return;
        }
        
        // Ödeme simülasyonu
        if (confirm('Ödemeye geçmek istediğinize emin misiniz?')) {
            showNotification('Ödeme başarıyla tamamlandı! Siparişiniz hazırlanıyor.', 'success');
            cartItems = [];
            localStorage.removeItem('cartItems');
            updateCartCount();
            renderCart();
            closeCartModal();
        }
    });
}

// Global fonksiyonlar
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.closeCartModal = closeCartModal;

// ============================================
// BİLDİRİM SİSTEMİ
// ============================================

function showNotification(message, type = 'info') {
    // Mevcut bildirimi kaldır
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animasyon
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Otomatik kaldır
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SAYFA YÜKLENDİĞİNDE
// ============================================

// LocalStorage'dan yorumları yükle
const savedReviews = localStorage.getItem('modelReviews');
if (savedReviews) {
    try {
        currentModelReviews = JSON.parse(savedReviews);
    } catch (e) {
        console.error('Yorumlar yüklenirken hata oluştu:', e);
    }
}

// Favorileri yükle
const savedFavorites = localStorage.getItem('favorites');
if (savedFavorites) {
    try {
        favoriteModels = JSON.parse(savedFavorites);
    } catch (e) {
        console.error('Favoriler yüklenirken hata oluştu:', e);
    }
}

// Sepeti yükle
const savedCart = localStorage.getItem('cartItems');
if (savedCart) {
    try {
        cartItems = JSON.parse(savedCart);
    } catch (e) {
        console.error('Sepet yüklenirken hata oluştu:', e);
    }
}

// Kullanıcı bilgisini yükle
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
    try {
        currentUser = JSON.parse(savedUser);
    } catch (e) {
        console.error('Kullanıcı bilgisi yüklenirken hata oluştu:', e);
    }
}

// UI'ı güncelle
updateUserButton();
updateCartCount();

// Modelleri render et
renderModels();

// İlk yüklemede "Tümü" kategorisini seç
const allCategoryCheckbox = document.querySelector('.category-checkbox[data-category="all"]');
if (allCategoryCheckbox) {
    allCategoryCheckbox.checked = true;
}

// Toplam ürün sayısını konsola yazdır (test için)
console.log(`✅ Toplam ${modelsData.length} ürün yüklendi`);
console.log('📦 Kategoriler:', {
    'Dekoratif': modelsData.filter(m => m.category === 'decorative').length,
    'Mekanik': modelsData.filter(m => m.category === 'mechanical').length,
    'Organizer': modelsData.filter(m => m.category === 'organizer').length,
    'Oyuncaklar': modelsData.filter(m => m.category === 'toys').length,
    'Elektronik': modelsData.filter(m => m.category === 'electronics').length
});

// Sayfa yüklendiğinde ürünlerin göründüğünü kontrol et
setTimeout(() => {
    const renderedProducts = document.querySelectorAll('.product-card');
    if (renderedProducts.length > 0) {
        console.log(`✅ ${renderedProducts.length} ürün sayfada görüntüleniyor`);
    } else {
        console.warn('⚠️ Hiç ürün görüntülenmiyor! Kontrol edin.');
    }
}, 500);

// Pagination butonları
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.disabled) return;
        
        const currentPage = document.querySelector('.page-btn.active');
        if (currentPage) currentPage.classList.remove('active');
        
        // Sayı butonuna tıklandıysa
        if (!isNaN(parseInt(btn.textContent.trim()))) {
            btn.classList.add('active');
        } else {
            // Ok butonları
            const allPages = Array.from(document.querySelectorAll('.page-btn')).filter(b => !isNaN(parseInt(b.textContent.trim())));
            const currentIndex = allPages.findIndex(b => b.classList.contains('active'));
            
            if (btn.querySelector('.fa-chevron-right')) {
                // İleri
                if (currentIndex < allPages.length - 1) {
                    allPages[currentIndex + 1].classList.add('active');
                }
            } else if (btn.querySelector('.fa-chevron-left')) {
                // Geri
                if (currentIndex > 0) {
                    allPages[currentIndex - 1].classList.add('active');
                }
            }
        }
        
        // İlk ve son sayfa butonlarını güncelle
        const activePage = document.querySelector('.page-btn.active');
        const allPages = Array.from(document.querySelectorAll('.page-btn')).filter(b => !isNaN(parseInt(b.textContent.trim())));
        const activeIndex = allPages.findIndex(b => b.classList.contains('active'));
        
        document.querySelectorAll('.page-btn').forEach(b => {
            if (b.querySelector('.fa-chevron-left')) {
                b.disabled = activeIndex === 0;
            }
            if (b.querySelector('.fa-chevron-right')) {
                b.disabled = activeIndex === allPages.length - 1;
            }
        });
    });
});

// Sayfa yüklendiğinde animasyonlar
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

