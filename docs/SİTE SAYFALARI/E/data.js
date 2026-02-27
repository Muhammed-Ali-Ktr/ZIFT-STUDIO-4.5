// ============================================================
// YKS KONU VERİLERİ
// ============================================================

const YKS_DATA = {
  tyt: {
    label: "TYT",
    subjects: [
      {
        id: "tyt_turkce",
        label: "Türkçe",
        icon: "📖",
        color: "#6ee7f7",
        topics: [
          "Sözcükte Anlam", "Cümlede Anlam", "Paragraf", "Anlatım Bozukluğu",
          "Ses Bilgisi", "Yazım Kuralları", "Noktalama İşaretleri", "Sözcük Türleri",
          "Fiiller", "Ek Fiil", "Cümlenin Öğeleri", "Fiilimsiler",
          "Cümle Türleri", "Anlatım Teknikleri", "Metin Türleri"
        ]
      },
      {
        id: "tyt_matematik",
        label: "Matematik",
        icon: "🔢",
        color: "#818cf8",
        topics: [
          "Temel Kavramlar", "Sayı Basamakları", "Bölme ve Bölünebilme", "OBEB – OKEK",
          "Rasyonel Sayılar", "Basit Eşitsizlikler", "Mutlak Değer", "Üslü Sayılar",
          "Köklü Sayılar", "Çarpanlara Ayırma", "Oran Orantı", "Denklem Çözme",
          "Problemler", "Kümeler", "Fonksiyonlar", "Permütasyon",
          "Kombinasyon", "Olasılık", "Veri – İstatistik"
        ]
      },
      {
        id: "tyt_geometri",
        label: "Geometri",
        icon: "📐",
        color: "#34d399",
        topics: [
          "Doğruda Açılar", "Üçgende Açılar", "Üçgende Kenar – Açı", "Üçgende Alan",
          "Özel Üçgenler", "Çokgenler", "Dörtgenler", "Çember – Daire",
          "Analitik Geometri", "Katı Cisimler"
        ]
      },
      {
        id: "tyt_fizik",
        label: "Fizik",
        icon: "⚡",
        color: "#fbbf24",
        topics: [
          "Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket",
          "Kuvvet ve Newton Yasaları", "İş – Güç – Enerji", "Isı ve Sıcaklık",
          "Basınç", "Kaldırma Kuvveti", "Elektrik", "Manyetizma",
          "Dalgalar", "Optik"
        ]
      },
      {
        id: "tyt_kimya",
        label: "Kimya",
        icon: "🧪",
        color: "#f472b6",
        topics: [
          "Kimya Bilimi", "Atom Modelleri", "Periyodik Sistem", "Kimyasal Türler",
          "Kimyasal Hesaplamalar", "Gazlar", "Sıvılar", "Çözeltiler",
          "Asit – Baz – Tuz", "Kimya Her Yerde"
        ]
      },
      {
        id: "tyt_biyoloji",
        label: "Biyoloji",
        icon: "🧬",
        color: "#4ade80",
        topics: [
          "Canlıların Ortak Özellikleri", "İnorganik Bileşikler", "Organik Bileşikler",
          "Hücre", "Hücre Zarından Madde Geçişi", "Canlıların Sınıflandırılması",
          "Mitoz – Mayoz", "Eşeysiz Üreme", "Eşeyli Üreme", "Kalıtım", "Ekosistem"
        ]
      },
      {
        id: "tyt_tarih",
        label: "Tarih",
        icon: "🏛️",
        color: "#fb923c",
        topics: [
          "Tarih Bilimine Giriş", "İlk Çağ Uygarlıkları", "İslamiyet Öncesi Türk Tarihi",
          "İslam Tarihi", "Türk – İslam Devletleri", "Osmanlı Kuruluş",
          "Osmanlı Yükselme", "Kültür ve Medeniyet"
        ]
      },
      {
        id: "tyt_cografya",
        label: "Coğrafya",
        icon: "🌍",
        color: "#2dd4bf",
        topics: [
          "Doğa ve İnsan", "Harita Bilgisi", "Dünya'nın Şekli ve Hareketleri",
          "İklim Bilgisi", "Nüfus", "Göç",
          "Türkiye'nin Fiziki Özellikleri", "Türkiye Ekonomisi"
        ]
      },
      {
        id: "tyt_felsefe",
        label: "Felsefe",
        icon: "🤔",
        color: "#c084fc",
        topics: [
          "Felsefenin Konusu", "Bilgi Felsefesi", "Varlık Felsefesi",
          "Ahlak Felsefesi", "Siyaset Felsefesi", "Din Felsefesi"
        ]
      },
      {
        id: "tyt_din",
        label: "Din Kültürü",
        icon: "☪️",
        color: "#e2e8f0",
        topics: [
          "Bilgi ve İnanç", "İslam ve İbadet", "Ahlak",
          "Hz. Muhammed", "Kur'an ve Yorumu", "Din ve Hayat"
        ]
      }
    ]
  },

  ayt: {
    label: "AYT",
    subjects: [
      {
        id: "ayt_matematik",
        label: "Matematik",
        icon: "📊",
        color: "#818cf8",
        topics: [
          "Fonksiyonlar", "Polinomlar", "2. Dereceden Denklemler", "Trigonometri",
          "Logaritma", "Diziler", "Limit", "Türev", "İntegral",
          "Analitik Geometri", "Çember Analitiği"
        ]
      },
      {
        id: "ayt_fizik",
        label: "Fizik",
        icon: "🔬",
        color: "#fbbf24",
        topics: [
          "Vektörler", "Hareket", "Newton Yasaları", "Atışlar",
          "Enerji", "Momentum", "Tork", "Elektrik Alan",
          "Manyetik Alan", "Alternatif Akım", "Modern Fizik"
        ]
      },
      {
        id: "ayt_kimya",
        label: "Kimya",
        icon: "⚗️",
        color: "#f472b6",
        topics: [
          "Modern Atom Teorisi", "Gazlar", "Sıvı Çözeltiler",
          "Kimyasal Tepkimeler", "Tepkime Hızı", "Kimyasal Denge",
          "Asit Baz Dengesi", "Elektrokimya", "Organik Kimya"
        ]
      },
      {
        id: "ayt_biyoloji",
        label: "Biyoloji",
        icon: "🦠",
        color: "#4ade80",
        topics: [
          "Sinir Sistemi", "Duyu Organları", "Endokrin Sistem", "Dolaşım",
          "Solunum", "Fotosentez", "Protein Sentezi",
          "DNA – RNA", "Ekosistem", "Bitki Biyolojisi"
        ]
      },
      {
        id: "ayt_edebiyat",
        label: "Edebiyat",
        icon: "📜",
        color: "#6ee7f7",
        topics: [
          "Şiir Bilgisi", "İslamiyet Öncesi Türk Edebiyatı", "Halk Edebiyatı",
          "Divan Edebiyatı", "Tanzimat", "Servet-i Fünun",
          "Fecr-i Ati", "Milli Edebiyat", "Cumhuriyet Dönemi"
        ]
      },
      {
        id: "ayt_tarih",
        label: "Tarih",
        icon: "⚔️",
        color: "#fb923c",
        topics: [
          "Osmanlı Siyasi Tarih", "Osmanlı Kültür", "20. Yüzyıl Başları",
          "Kurtuluş Savaşı", "İnkılap Tarihi", "Çağdaş Dünya"
        ]
      },
      {
        id: "ayt_cografya",
        label: "Coğrafya",
        icon: "🗺️",
        color: "#2dd4bf",
        topics: [
          "Türkiye Fiziki", "Türkiye Beşeri", "Türkiye Ekonomi",
          "Küresel Ortam", "Doğal Afetler", "Çevre Politikaları"
        ]
      }
    ]
  }
};
