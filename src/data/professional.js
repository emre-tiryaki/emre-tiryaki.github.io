/**
 * Professional Landing Page Data (/work-with-me)
 * Multilingual Data (TR & EN) - Client-Centric & Non-Technical Friendly
 */

export const WORK_WITH_ME_DATA = {
  tr: {
    meta: {
      title: "Emre Tiryaki — Software Engineer | Web & Software Solutions",
      description: "İşletmeler ve kişiler için web siteleri, kafe & restoran QR menüleri, online mağazalar, randevu sistemleri, yönetim panelleri, otomasyon ve yapay zekâ çözümleri geliştiriyorum.",
    },

    navigation: [
      { label: "Hizmetler", href: "#services" },
      { label: "Neden Ben?", href: "#why-me" },
      { label: "Süreç", href: "#process" },
      { label: "SSS", href: "#faq" },
    ],

    hero: {
      badge: "Yazılım Mühendisliği & Dijital Çözümler",
      headlineLead: "Sizin için",
      headlineEnd: "geliştirelim.",
      primaryCta: "Projenizi Anlatın",
      secondaryCta: "Neler Yapıyorum?",
      trustPoints: [
        "Hızlı & Performanslı",
        "Tüm Telefon ve Tabletlerle Uyumlu",
        "İşletmenize Özel Tasarım",
        "Kesintisiz Destek",
      ],
      showcaseLabel: "Örnek çalışmalar",

      // Hero'daki mockup bu sahneler arasında döner; başlık ve alt metin de sahneyle birlikte değişir.
      showcases: [
        {
          id: "website",
          tab: "Web Sitesi",
          highlight: "müşteri kazandıran bir web sitesi",
          description:
            "Kafe, restoran, klinik veya mağazanız için; telefonda hızlı açılan, Google'da bulunan ve ziyaretçiyi müşteriye dönüştüren şık bir web sitesi.",
          url: "lezzetduragi.com",
          content: {
            brand: "Lezzet Durağı",
            nav: ["Menü", "Hakkımızda", "İletişim"],
            navCta: "Rezervasyon",
            kicker: "Kadıköy · Ev Yemekleri",
            title: "Her gün taze, her tabak ev yapımı.",
            text: "Online menü, masa rezervasyonu ve paket sipariş tek bir yerde.",
            button: "Menüyü İncele",
            rating: "4.9 · 1.200+ Google yorumu",
            badge: "Mobil uyumlu · 0.8 sn açılış",
            dishes: [
              { name: "Ev Mantısı", price: "₺240" },
              { name: "Karnıyarık", price: "₺210" },
              { name: "Künefe", price: "₺160" },
            ],
          },
        },
        {
          id: "menu",
          tab: "QR Menü",
          highlight: "kolay güncellenen bir QR menü",
          description:
            "Kafe ve restoranlar için telefondan açılan, fotoğraflı ve çok dilli QR menü. Fiyatları ve ürünleri saniyeler içinde kendiniz güncelleyin; yeniden baskı derdine son.",
          url: "menu.kahvedurak.com/masa-7",
          content: {
            brand: "Kahve Durağı",
            table: "Masa 7",
            categories: ["Kahveler", "Tatlılar", "Kahvaltı"],
            items: [
              { name: "Latte", desc: "Çift shot espresso, süt", price: "₺95" },
              { name: "Flat White", desc: "Yoğun ve kadifemsi", price: "₺105" },
              { name: "San Sebastian", desc: "Günün tatlısı", price: "₺160", tag: "Yeni" },
              { name: "Limonata", desc: "Ev yapımı, taze nane", price: "₺80" },
            ],
            callWaiter: "Garson Çağır",
            qrTitle: "Masaya okut, menüyü aç",
            qrText: "Her masaya özel QR kod",
            featuresTitle: "Menünüzde neler var?",
            features: [
              "Fiyatları anında kendiniz güncelleyin",
              "Türkçe / English menü",
              "Fotoğraflı ürünler & alerjen bilgisi",
              "Masadan garson çağırma",
            ],
            statLabel: "Bugün menü görüntülenmesi",
            statValue: "214",
          },
        },
        {
          id: "personal",
          tab: "Kişisel Site",
          highlight: "sizi anlatan kişisel bir web sitesi",
          description:
            "Doktor, avukat, psikolog, fotoğrafçı ya da serbest çalışan… Sizi, işinizi ve referanslarınızı profesyonelce anlatan, size ulaşmayı kolaylaştıran kişisel bir site.",
          url: "denizarslan.com",
          content: {
            name: "Deniz Arslan",
            role: "Fotoğrafçı & Görsel Hikâye Anlatıcısı",
            nav: ["Hakkımda", "Portfolyo", "Blog", "İletişim"],
            available: "Yeni çekimlere açık",
            bio: "10 yıldır düğün, portre ve marka çekimleriyle insanların en özel anlarını kalıcı kılıyorum.",
            primary: "Çekim Planla",
            secondary: "Portfolyoyu Gör",
            stats: [
              { value: "10+", label: "Yıl deneyim" },
              { value: "350+", label: "Mutlu çift" },
              { value: "4.9★", label: "Yorum puanı" },
            ],
            gallery: ["Düğün", "Portre", "Marka", "Doğa"],
            testimonial: "“Fotoğraflara her baktığımızda o günü yeniden yaşıyoruz.”",
            testimonialAuthor: "Ece & Mert",
          },
        },
        {
          id: "store",
          tab: "E-Ticaret",
          highlight: "satış yapan bir online mağaza",
          description:
            "Ürünlerinizi sergileyen, kartla ödeme alan, kargo ve stok takibini kolaylaştıran; sosyal medyaya bağımlı kalmadan tamamen size ait bir online mağaza.",
          url: "atolyeseramik.com",
          content: {
            brand: "Atölye Seramik",
            nav: ["Yeni Gelenler", "Kupalar", "Tabaklar", "Vazolar"],
            search: "Ürün ara…",
            cartCount: "2",
            sectionTitle: "Çok Satanlar",
            trust: ["Güvenli ödeme", "Hızlı kargo", "Kolay iade"],
            products: [
              { name: "El Yapımı Kupa", price: "₺320", tag: "Çok satan" },
              { name: "Servis Tabağı", price: "₺540" },
              { name: "Mini Vazo", price: "₺410", tag: "%15 İndirim" },
              { name: "Kahve Seti", price: "₺890" },
            ],
            addToCart: "Sepete Ekle",
            toastTitle: "Yeni sipariş alındı",
            toastText: "#2041 · ₺860 · Kartla ödendi",
          },
        },
        {
          id: "booking",
          tab: "Randevu",
          highlight: "online bir randevu sistemi",
          description:
            "Kuaför, klinik, güzellik salonu veya danışmanlar için: müşteriler boş saatleri görüp randevusunu kendisi alır, sistem SMS ile hatırlatır. Telefon trafiğine son.",
          url: "novakuafor.com/randevu",
          content: {
            brand: "Nova Kuaför",
            stepTitle: "Online Randevu",
            servicesTitle: "Hizmet seçin",
            services: [
              { name: "Saç Kesimi", meta: "45 dk", price: "₺450" },
              { name: "Fön & Şekillendirme", meta: "30 dk", price: "₺300" },
              { name: "Saç Boyama", meta: "2 sa", price: "₺1.400" },
            ],
            dateTitle: "Tarih & saat",
            days: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
            slots: ["10:00", "10:45", "11:30", "13:00", "14:15", "15:00", "16:30", "17:15"],
            takenLabel: "Dolu",
            summaryTitle: "Randevu Özeti",
            summary: [
              { label: "Hizmet", value: "Saç Kesimi" },
              { label: "Tarih", value: "14 Mayıs, Çarşamba" },
              { label: "Saat", value: "13:00" },
              { label: "Uzman", value: "Merve Y." },
            ],
            confirm: "Randevuyu Onayla",
            reminder: "1 saat önce SMS hatırlatma",
          },
        },
        {
          id: "dashboard",
          tab: "Yönetim Paneli",
          highlight: "işinizi yöneten özel bir panel",
          description:
            "Siparişleri, randevuları, müşterileri ve raporları tek ekranda toplayan; Excel ve kâğıt karmaşasını bitiren, işinize özel bir yönetim paneli.",
          url: "panel.isletmeniz.com",
          content: {
            brand: "İşletme Paneli",
            nav: ["Genel Bakış", "Siparişler", "Randevular", "Müşteriler", "Raporlar"],
            title: "Günaydın, Ayşe Hanım",
            subtitle: "Bugün işletmenizde neler oluyor?",
            filter: "Bu Hafta",
            metrics: [
              { label: "Siparişler", value: "348", diff: "↑ %18" },
              { label: "Ciro", value: "₺84.2B", diff: "↑ %12" },
              { label: "Yeni Müşteri", value: "57", diff: "↑ %9" },
            ],
            chartTitle: "Haftalık Satışlar",
            days: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
            listTitle: "Bugünkü Randevular",
            list: [
              { time: "10:00", name: "Mehmet K.", status: "Onaylandı", confirmed: true },
              { time: "11:30", name: "Zeynep A.", status: "Onaylandı", confirmed: true },
              { time: "14:00", name: "Can D.", status: "Bekliyor", confirmed: false },
              { time: "16:15", name: "Elif S.", status: "Onaylandı", confirmed: true },
            ],
          },
        },
        {
          id: "ai",
          tab: "AI Asistan",
          highlight: "7/24 yanıt veren bir AI asistanı",
          description:
            "Müşterilerinizin sorularını menünüz, fiyatlarınız ve belgeleriniz üzerinden saniyeler içinde yanıtlayan, işletmenize özel eğitilmiş akıllı bir asistan.",
          url: "lezzetduragi.com/asistan",
          content: {
            botName: "Lezzet Asistanı",
            status: "Çevrimiçi · ortalama 2 sn'de yanıt",
            messages: [
              { from: "user", text: "Bu akşam 4 kişilik masa var mı?" },
              { from: "bot", text: "Evet! 19:30 ve 20:15 için bahçede yerimiz var. Hangisini ayırayım?" },
              { from: "user", text: "20:15 olsun. Glutensiz yemeğiniz var mı?" },
              { from: "bot", text: "Rezervasyonunuz hazır ✓ Menümüzde 6 glutensiz yemek var, en sevileni mercimek çorbası." },
            ],
            inputPlaceholder: "Mesajınızı yazın…",
            statsTitle: "Bugün",
            stats: [
              { label: "Yanıtlanan soru", value: "126" },
              { label: "Alınan rezervasyon", value: "18" },
              { label: "İnsan desteği gerekmeden", value: "%94" },
            ],
            sourcesTitle: "Öğrendiği kaynaklar",
            sources: ["Menü.pdf", "Fiyat Listesi.xlsx", "Sık Sorulanlar"],
          },
        },
        {
          id: "automation",
          tab: "Otomasyon",
          highlight: "zaman kazandıran otomasyonlar",
          description:
            "Fatura kesmek, e-posta göndermek, stok güncellemek gibi her gün elle yaptığınız işleri sizin yerinize hatasız yapan iş akışları.",
          url: "otomasyon.isletmeniz.com",
          content: {
            flowName: "Yeni Sipariş Akışı",
            status: "Aktif",
            runsLabel: "Bu ay otomatik işlem",
            runsValue: "1.284",
            savedLabel: "Kazanılan zaman",
            savedValue: "42 saat",
            steps: [
              { title: "Yeni sipariş", detail: "Web sitesinden" },
              { title: "Fatura oluştur", detail: "e-Fatura" },
              { title: "Müşteriye e-posta", detail: "Onay + fatura" },
              { title: "Stok güncelle", detail: "Otomatik" },
              { title: "Ekibe bildir", detail: "WhatsApp" },
            ],
            logTitle: "Son Çalışmalar",
            logs: [
              { time: "14:32", text: "Sipariş #1048 · fatura kesildi, müşteriye gönderildi" },
              { time: "14:05", text: "Sipariş #1047 · stok güncellendi, ekip bilgilendirildi" },
              { time: "13:41", text: "Sipariş #1046 · tüm adımlar tamamlandı" },
            ],
          },
        },
      ],
    },

    services: {
      tag: "Hizmet Alanları",
      title: "Size ne geliştirebilirim?",
      subtitle:
        "Bir kafenin QR menüsünden bir kliniğin randevu sistemine, kişisel sitenizden online mağazanıza kadar; işinizi kolaylaştıracak ve büyütecek dijital çözümü birlikte tasarlayalım.",
      badge: "Özel Geliştirme",
      items: [
        {
          id: "websites",
          icon: "layout",
          title: "İşletme Web Siteleri",
          description:
            "Kafeler, restoranlar, mağazalar, klinikler ve kurumsal markalar için hızlı açılan, Google'da bulunan ve telefon uyumlu şık web siteleri.",
        },
        {
          id: "qr-menu",
          icon: "coffee",
          title: "Kafe & Restoran QR Menü",
          description:
            "Masadan okutulan, fotoğraflı ve çok dilli dijital menü. Fiyatları ve ürünleri kendiniz anında güncelleyin; menü bastırma derdine son.",
        },
        {
          id: "personal-site",
          icon: "user",
          title: "Kişisel Web Siteleri",
          description:
            "Doktor, avukat, psikolog, fotoğrafçı, eğitmen veya serbest çalışanlar için sizi ve işinizi profesyonelce anlatan kişisel siteler.",
        },
        {
          id: "ecommerce",
          icon: "bag",
          title: "Online Mağaza (E-Ticaret)",
          description:
            "Ürünlerinizi sergileyen, kartla ödeme alan, kargo ve stok takibini kolaylaştıran, tamamen size ait bir online mağaza.",
        },
        {
          id: "booking",
          icon: "calendar",
          title: "Online Randevu Sistemleri",
          description:
            "Kuaför, klinik, güzellik salonu ve danışmanlar için müşterilerin boş saatleri görüp kendisi randevu aldığı, SMS ile hatırlatan sistemler.",
        },
        {
          id: "web-apps",
          icon: "app",
          title: "Yönetim Panelleri & Özel Yazılımlar",
          description:
            "Siparişleri, müşterileri ve raporları tek ekranda toplayan; ödeme, SMS ve e-posta gibi sistemlerle entegre, işinize özel paneller.",
        },
        {
          id: "ai-solutions",
          icon: "cpu",
          title: "Yapay Zekâ Asistanları",
          description:
            "Menünüz, fiyatlarınız ve belgeleriniz üzerinden müşterilerinize 7/24 yanıt veren akıllı asistanlar ve işinize özel AI çözümleri.",
        },
        {
          id: "automation",
          icon: "workflow",
          title: "İş Akışı Otomasyonları",
          description:
            "Her gün elle yaptığınız tekrarlayan işleri (fatura, e-posta, stok, sipariş bildirimleri) yazılımla otomatikleştirme.",
        },
        {
          id: "system-evolution",
          icon: "wrench",
          title: "Mevcut Sitenizi Yenileme",
          description:
            "Yavaş çalışan veya eski web sitenizi hızlandırma, yeni özellikler ekleme ve modern, telefon uyumlu hale getirme.",
        },
      ],
    },

    whyMe: {
      tag: "Neden Birlikte Çalışmalıyız?",
      title: "Sadece bir web sitesi teslim etmiyorum.",
      subtitle:
        "İşinizin ihtiyaçlarını dinliyor, doğru çözümü planlıyor ve yıllarca sorunsuz kullanabileceğiniz sağlam sistemler kuruyorum.",
      points: [
        {
          id: "engineering",
          number: "01",
          title: "Mühendislik Yaklaşımı",
          description:
            "Sadece dışarıdan güzel görünen değil; arkasında sağlam, hızlı ve çökmeyen bir yazılım mimarisi olan sistemler geliştiriyorum.",
        },
        {
          id: "custom",
          number: "02",
          title: "Tamamen İhtiyacınıza Özel",
          description:
            "Bir kafenin menüsü ile bir kliniğin randevu sistemi aynı değildir. Hazır kalıpları kopyalamak yerine; iş modelinize, müşterilerinize ve hedeflerinize tam uyan çözümler üretiyorum.",
        },
        {
          id: "performance",
          number: "03",
          title: "Hız ve Kolay Kullanım",
          description:
            "Ziyaretçilerinizin telefonlarından tek tıkla size ulaşabileceği, son derece hızlı açılan ve göz yormayan arayüzler tasarlıyorum.",
        },
        {
          id: "long-term",
          number: "04",
          title: "Uzun Vadeli Güvenilir Destek",
          description:
            "İş bittikten sonra ortadan kaybolmuyorum. Yayına aldıktan sonra da bakım, güncelleme ve yeni fikirlerinizde yanınızda oluyorum.",
        },
      ],
    },

    process: {
      tag: "Çalışma Adımları",
      title: "Nasıl çalışıyoruz?",
      subtitle:
        "Karmaşık teknik terimler olmadan, şeffaf ve adım adım ilerleyen rahat bir çalışma süreci.",
      stepLabel: "Aşama",
      clientLabel: "Sizden beklenen",
      deliverablesLabel: "Elinize geçen",
      steps: [
        {
          step: "01",
          title: "Tanışalım & Dinleyelim",
          client: "İşinizi, hedefinizi ve aklınızdaki fikri anlatmanız yeterli.",
          deliverables: ["İhtiyaçlarınızın kısa özeti", "İlk öneri ve yol haritası"],
          description:
            "Ne yapmak istediğinizi, işletmenizi ve müşterilerinize nasıl bir deneyim sunmak istediğinizi samimiyetle konuşalım.",
        },
        {
          step: "02",
          title: "Planlayalım & Netleştirelim",
          client: "Teklifi inceleyip onaylamanız.",
          deliverables: ["Yazılı kapsam ve sayfa listesi", "Net fiyat ve teslim tarihi"],
          description:
            "İhtiyaçlarınıza en uygun çözümü, işin süresini ve yapılacakları net bir dille belirleyelim; sürprizlere yer bırakmayalım.",
        },
        {
          step: "03",
          title: "Geliştirelim & Paylaşalım",
          client: "Ara demolara göz atıp geri bildirim vermeniz.",
          deliverables: ["Ara demolar", "Canlı önizleme bağlantısı"],
          description:
            "Ürünü geliştirirken önemli aşamalarda size ara demolar göstererek fikirlerinizi alalım, birlikte şekillendirelim.",
        },
        {
          step: "04",
          title: "Yayına Alalım & Büyütelim",
          client: "Son kontrolü yapıp onay vermeniz.",
          deliverables: ["Yayındaki site veya uygulama", "Kısa kullanım rehberi", "Yayın sonrası destek"],
          description:
            "Tüm kontrolleri tamamlayıp sitenizi veya uygulamanızı canlıya alalım. Sonrasında ihtiyaç halinde geliştirmeye devam edelim.",
        },
      ],
    },

    selectedWork: {
      tag: "Gerçek Projeler",
      title: "Neler geliştirdim?",
      subtitle: "Daha önce hayata geçirdiğim projelerden bazı örnekler ve sağladığı somut faydalar.",
      problemLabel: "Sağlanan Çözüm & Sonuç:",
      techLabel: "Kullanılan Teknolojiler:",
      projectBadge: "Geliştirilmiş Ürün",
      items: [
        {
          id: "clearsky",
          title: "ClearSky — Canlı Takip & Analiz Platformu",
          category: "Web Uygulaması",
          clientSummary:
            "Binlerce anlık uçuş verisini harita üzerinde saniyeler içinde görselleştiren, yüksek performanslı ve akıcı bir canlı izleme platformu.",
          outcome:
            "Karmaşık ve yoğun verileri herkesin tek bakışta anlayabileceği modern bir harita paneline dönüştürdü.",
          tags: ["Modern Web Arayüzü", "Canlı Veri Akışı", "Harita Entegrasyonu", "Hızlı Altyapı"],
          alt: "ClearSky Platform Görünümü",
        },
        {
          id: "okur",
          title: "OKUR — Yapay Zekâ Destekli Doküman Analiz Sistemi",
          category: "Yapay Zekâ & Otomasyon",
          clientSummary:
            "Kamera veya tarayıcıdan yüklenen yazılı evrakları yapay zekâ ile otomatik okuyup değerlendiren akıllı yazılım çözümü.",
          outcome:
            "Günler süren elle evrak kontrolü işini dakikalar içinde hatasız tamamlayan otonom bir sistem sağladı.",
          tags: ["Yapay Zekâ", "Görüntü İşleme", "Otomasyon", "Veri Analizi"],
          alt: "OKUR Akıllı Değerlendirme Sistemi",
        },
      ],
    },

    faq: {
      tag: "Sıkça Sorulan Sorular",
      title: "Merak edilenler",
      subtitle: "Aklınıza takılan sorular ve iş birliği süreci hakkında bilmek istedikleriniz.",
      items: [
        {
          question: "Ne tür projeler yapıyorsunuz?",
          answer:
            "İşletme ve kişisel web sitelerinden kafe & restoran QR menülerine, online mağazalardan randevu sistemlerine, yönetim panellerinden otomasyon ve yapay zekâ asistanlarına kadar farklı ölçeklerde yazılımlar geliştiriyorum.",
        },
        {
          question: "Kafem / restoranım için QR menü yaptırabilir miyim? Fiyatları kendim değiştirebilir miyim?",
          answer:
            "Evet. Her masaya özel QR kodlu, fotoğraflı ve istenirse çok dilli bir menü hazırlıyorum. Size verdiğim basit bir panelden ürün ekleyip fiyatları saniyeler içinde kendiniz güncelleyebilirsiniz; tekrar baskı gerekmez.",
        },
        {
          question: "İşletmem yok, kendim için kişisel bir site yaptırabilir miyim?",
          answer:
            "Elbette. Doktor, avukat, psikolog, fotoğrafçı, eğitmen veya serbest çalışan olun; sizi, hizmetlerinizi ve referanslarınızı anlatan, size ulaşmayı kolaylaştıran kişisel bir site hazırlıyorum.",
        },
        {
          question: "Sadece tasarım mı yapıyorsunuz, yazılım da var mı?",
          answer:
            "Tasarımından yazılımına, veritabanından sunucu kurulumuna kadar tüm süreci tek elden anahtar teslim olarak üstleniyorum. Başka kimseyle uğraşmanız gerekmez.",
        },
        {
          question: "Hazır kalıp (template) mi kullanıyorsunuz?",
          answer:
            "İşinizin ihtiyacına göre hareket ediyorum. Eğer amacınız hız ve bütçeyse uygun modern şablonları özelleştiriyoruz; özel bir iş akışınız varsa sıfırdan tamamen size özel kodluyorum.",
        },
        {
          question: "Bir proje ne kadar sürede tamamlanır?",
          answer:
            "QR menü ve kişisel siteler genellikle 1 hafta, işletme web siteleri 1-2 hafta sürer. Online mağaza, randevu sistemi ve özel paneller kapsamına göre 3-6 hafta sürebilir. İlk görüşmede net takvimi birlikte belirleriz.",
        },
        {
          question: "Proje bittikten sonra destek veriyor musunuz?",
          answer:
            "Evet. Siteniz yayına girdikten sonra da yalnız değilsiniz. Bakım, güncelleme, yedekleme ve yeni ekleme talepleriniz için her zaman destek sağlıyorum.",
        },
        {
          question: "Teknik hiçbir şey bilmiyorum. Yine de proje yaptırabilir miyim?",
          answer:
            "Kesinlikle evet! Teknik ayrıntıları bilmek zorunda değilsiniz. Siz sadece işinizi, hayalinizdeki hedefi ve çözmek istediğiniz problemi anlatın; yazılım tarafını ben hallediyorum.",
        },
      ],
    },

    cta: {
      tag: "İletişim & Proje Başlangıcı",
      title: "Aklınızda bir proje mi var?",
      subtitle:
        "İşinizi veya fikrinizi kısaca anlatın. Size en uygun dijital çözümü birlikte konuşalım.",
      email: "tiryakiemre18@gmail.com",
      emailBtn: "Doğrudan E-posta:",
      intro: {
        name: "Emre Tiryaki",
        role: "Freelance Web Geliştirici",
        note: "Mesajınızı doğrudan ben okuyup yanıtlıyorum — arada ajans ya da aracı yok. Projeniz baştan sona benimle konuşulur.",
        response: "Genellikle 24 saat içinde dönüş",
      },
      formTitle: "Proje Detaylarını Paylaşın",
      formSubtitle: "Formu doldurarak ilk adımı atabilirsiniz. En geç 24 saat içinde dönüş yapacağım.",
      successTitle: "E-posta Taslağınız Hazırlandı!",
      successDesc: "E-posta istemciniz açıldıysa gönder butonuna basarak başvurunuzu tamamlayabilirsiniz.",
      successReset: "Yeni bir mesaj gönder",
      labels: {
        name: "Adınız Soyadınız",
        company: "İşletme / Şirket Adı (Opsiyonel)",
        email: "E-posta Adresiniz",
        projectType: "Ne Geliştirmek İstiyorsunuz?",
        budget: "Tahmini Bütçeniz (Opsiyonel)",
        timeline: "Ne Zaman Başlamak İstersiniz?",
        details: "Aklınızdaki Fikri Kısaca Anlatın",
        submit: "Projeyi Başlat / Mesaj Gönder",
        privacy: "Bilgileriniz tamamen gizli tutulur, üçüncü şahıslarla asla paylaşılmaz.",
      },
      placeholders: {
        name: "Örn: Ahmet Yılmaz",
        company: "Örn: Yılmaz Butik Kahve (veya Bireysel)",
        email: "ahmet@sirketiniz.com",
        details: "Nasıl bir siteye veya sisteme ihtiyacınız var? Hedefiniz nedir? Kısaca bahsedin...",
      },
      projectTypes: [
        "İşletme Web Sitesi",
        "Kafe / Restoran QR Menü",
        "Kişisel Web Sitesi",
        "Online Mağaza (E-Ticaret)",
        "Online Randevu Sistemi",
        "Yönetim Paneli / Özel Yazılım",
        "Yapay Zekâ Asistanı",
        "İş Akışı / Otomasyon",
        "Mevcut Sitemi Yenilemek İstiyorum",
        "Diğer / Fikir Aşamasında",
      ],
      budgetRanges: [
        "Henüz belirlemedim / Fikir almak istiyorum",
        "15.000 ₺ - 30.000 ₺",
        "30.000 ₺ - 60.000 ₺",
        "60.000 ₺ - 120.000 ₺",
        "120.000 ₺ ve üzeri",
      ],
      timelines: [
        "Hemen (1-2 hafta içinde)",
        "Önümüzdeki 1 ay içinde",
        "1-3 ay içinde",
        "Acelem yok / Planlama yapıyorum",
      ],
    },

    footer: {
      brand: "Emre Tiryaki",
      title: "Yazılım Mühendisi",
      tagline: "İşletmeler ve kişiler için güvenilir, modern ve değer üreten dijital çözümler geliştiriyorum.",
      copyright: "© 2026 Emre Tiryaki. Tüm hakları saklıdır.",
    },
  },

  en: {
    meta: {
      title: "Emre Tiryaki — Software Engineer | Web & Software Solutions",
      description: "Building websites, café & restaurant QR menus, online stores, booking systems, management portals, automations and AI solutions for businesses and individuals.",
    },

    navigation: [
      { label: "Services", href: "#services" },
      { label: "Why Me?", href: "#why-me" },
      { label: "Process", href: "#process" },
      { label: "FAQ", href: "#faq" },
    ],

    hero: {
      badge: "Software Engineering & Digital Solutions",
      headlineLead: "Let's build",
      headlineEnd: "for you.",
      primaryCta: "Tell Me About Your Project",
      secondaryCta: "What I Do",
      trustPoints: [
        "Fast & Performant",
        "Optimized for All Phones & Tablets",
        "Custom Tailored Design",
        "Reliable Ongoing Support",
      ],
      showcaseLabel: "Example work",

      // The hero mockup cycles through these scenes; the headline and subtitle change with each one.
      showcases: [
        {
          id: "website",
          tab: "Website",
          highlight: "a website that wins customers",
          description:
            "A polished website for your café, restaurant, clinic or store — loads fast on phones, gets found on Google, and turns visitors into paying customers.",
          url: "cornerkitchen.com",
          content: {
            brand: "Corner Kitchen",
            nav: ["Menu", "About", "Contact"],
            navCta: "Book a Table",
            kicker: "Downtown · Homemade Food",
            title: "Fresh every day, homemade on every plate.",
            text: "Online menu, table booking and takeaway orders in one place.",
            button: "View the Menu",
            rating: "4.9 · 1,200+ Google reviews",
            badge: "Mobile-ready · 0.8s load",
            dishes: [
              { name: "Homemade Ravioli", price: "$14" },
              { name: "Roast Chicken", price: "$16" },
              { name: "Baklava", price: "$8" },
            ],
          },
        },
        {
          id: "menu",
          tab: "QR Menu",
          highlight: "a QR menu you update in seconds",
          description:
            "A photo-rich, multi-language QR menu for cafés and restaurants that opens on any phone. Change prices and dishes yourself in seconds — no more reprinting.",
          url: "menu.cornercafe.com/table-7",
          content: {
            brand: "Corner Café",
            table: "Table 7",
            categories: ["Coffee", "Desserts", "Breakfast"],
            items: [
              { name: "Latte", desc: "Double shot, steamed milk", price: "$4.5" },
              { name: "Flat White", desc: "Rich and velvety", price: "$5" },
              { name: "Cheesecake", desc: "Today's special", price: "$6", tag: "New" },
              { name: "Lemonade", desc: "Homemade, fresh mint", price: "$4" },
            ],
            callWaiter: "Call Waiter",
            qrTitle: "Scan at the table, open the menu",
            qrText: "A unique QR code for every table",
            featuresTitle: "What's included",
            features: [
              "Update prices yourself, instantly",
              "Multi-language menu",
              "Photos & allergen info",
              "Call the waiter from the table",
            ],
            statLabel: "Menu views today",
            statValue: "214",
          },
        },
        {
          id: "personal",
          tab: "Personal Site",
          highlight: "a personal website that tells your story",
          description:
            "Doctor, lawyer, therapist, photographer or freelancer — a personal site that presents you, your work and your references professionally, and makes it easy to reach you.",
          url: "denizarslan.com",
          content: {
            name: "Deniz Arslan",
            role: "Photographer & Visual Storyteller",
            nav: ["About", "Portfolio", "Blog", "Contact"],
            available: "Booking new shoots",
            bio: "For 10 years I've been turning weddings, portraits and brand shoots into moments that last.",
            primary: "Book a Shoot",
            secondary: "View Portfolio",
            stats: [
              { value: "10+", label: "Years experience" },
              { value: "350+", label: "Happy couples" },
              { value: "4.9★", label: "Review score" },
            ],
            gallery: ["Wedding", "Portrait", "Brand", "Nature"],
            testimonial: "“Every time we look at the photos, we relive that day.”",
            testimonialAuthor: "Ece & Mert",
          },
        },
        {
          id: "store",
          tab: "Online Store",
          highlight: "an online store that sells while you sleep",
          description:
            "An online store that's fully yours — showcases your products, takes card payments, and simplifies shipping and stock, without depending on social media.",
          url: "claystudio.com",
          content: {
            brand: "Clay Studio",
            nav: ["New In", "Mugs", "Plates", "Vases"],
            search: "Search products…",
            cartCount: "2",
            sectionTitle: "Best Sellers",
            trust: ["Secure checkout", "Fast shipping", "Easy returns"],
            products: [
              { name: "Handmade Mug", price: "$24", tag: "Best seller" },
              { name: "Serving Plate", price: "$38" },
              { name: "Mini Vase", price: "$29", tag: "15% off" },
              { name: "Coffee Set", price: "$64" },
            ],
            addToCart: "Add to Cart",
            toastTitle: "New order received",
            toastText: "#2041 · $62 · Paid by card",
          },
        },
        {
          id: "booking",
          tab: "Bookings",
          highlight: "a booking system that fills itself",
          description:
            "For salons, clinics and consultants: customers see your free slots and book themselves, and the system sends SMS reminders. No more phone tag.",
          url: "novasalon.com/book",
          content: {
            brand: "Nova Salon",
            stepTitle: "Online Booking",
            servicesTitle: "Choose a service",
            services: [
              { name: "Haircut", meta: "45 min", price: "$35" },
              { name: "Blow-dry & Styling", meta: "30 min", price: "$25" },
              { name: "Hair Colour", meta: "2 hrs", price: "$95" },
            ],
            dateTitle: "Date & time",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            slots: ["10:00", "10:45", "11:30", "13:00", "14:15", "15:00", "16:30", "17:15"],
            takenLabel: "Taken",
            summaryTitle: "Booking Summary",
            summary: [
              { label: "Service", value: "Haircut" },
              { label: "Date", value: "Wednesday, May 14" },
              { label: "Time", value: "13:00" },
              { label: "Stylist", value: "Megan Y." },
            ],
            confirm: "Confirm Booking",
            reminder: "SMS reminder 1 hour before",
          },
        },
        {
          id: "dashboard",
          tab: "Admin Portal",
          highlight: "a portal that runs your business",
          description:
            "One screen for your orders, bookings, customers and reports — a management portal built around how you work, replacing spreadsheets and paperwork.",
          url: "portal.yourbusiness.com",
          content: {
            brand: "Business Portal",
            nav: ["Overview", "Orders", "Bookings", "Customers", "Reports"],
            title: "Good morning, Sarah",
            subtitle: "Here's what's happening today.",
            filter: "This Week",
            metrics: [
              { label: "Orders", value: "348", diff: "↑ 18%" },
              { label: "Revenue", value: "$24.8k", diff: "↑ 12%" },
              { label: "New Clients", value: "57", diff: "↑ 9%" },
            ],
            chartTitle: "Weekly Sales",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            listTitle: "Today's Bookings",
            list: [
              { time: "10:00", name: "Michael K.", status: "Confirmed", confirmed: true },
              { time: "11:30", name: "Emma A.", status: "Confirmed", confirmed: true },
              { time: "14:00", name: "Daniel R.", status: "Pending", confirmed: false },
              { time: "16:15", name: "Olivia S.", status: "Confirmed", confirmed: true },
            ],
          },
        },
        {
          id: "ai",
          tab: "AI Assistant",
          highlight: "an AI assistant that answers 24/7",
          description:
            "A smart assistant trained on your menu, prices and documents that answers your customers' questions in seconds — day or night.",
          url: "cornerkitchen.com/assistant",
          content: {
            botName: "Kitchen Assistant",
            status: "Online · replies in ~2s",
            messages: [
              { from: "user", text: "Do you have a table for 4 tonight?" },
              { from: "bot", text: "Yes! We have garden seating at 7:30 and 8:15 PM. Which one should I book?" },
              { from: "user", text: "8:15 please. Any gluten-free dishes?" },
              { from: "bot", text: "You're booked ✓ We have 6 gluten-free dishes — the lentil soup is a favourite." },
            ],
            inputPlaceholder: "Type your message…",
            statsTitle: "Today",
            stats: [
              { label: "Questions answered", value: "126" },
              { label: "Bookings taken", value: "18" },
              { label: "Resolved without staff", value: "94%" },
            ],
            sourcesTitle: "Trained on",
            sources: ["Menu.pdf", "Price List.xlsx", "FAQ"],
          },
        },
        {
          id: "automation",
          tab: "Automation",
          highlight: "automations that save you hours",
          description:
            "Workflows that handle the tasks you do by hand every day — invoicing, emails, stock updates — automatically and without mistakes.",
          url: "automations.yourbusiness.com",
          content: {
            flowName: "New Order Workflow",
            status: "Active",
            runsLabel: "Automated tasks this month",
            runsValue: "1,284",
            savedLabel: "Time saved",
            savedValue: "42 hours",
            steps: [
              { title: "New order", detail: "From website" },
              { title: "Create invoice", detail: "Auto-generated" },
              { title: "Email customer", detail: "Receipt + invoice" },
              { title: "Update stock", detail: "Automatic" },
              { title: "Notify team", detail: "WhatsApp" },
            ],
            logTitle: "Recent Runs",
            logs: [
              { time: "14:32", text: "Order #1048 · invoice created and sent to customer" },
              { time: "14:05", text: "Order #1047 · stock updated, team notified" },
              { time: "13:41", text: "Order #1046 · all steps completed" },
            ],
          },
        },
      ],
    },

    services: {
      tag: "Services & Capabilities",
      title: "What can I build for you?",
      subtitle:
        "From a café's QR menu to a clinic's booking system, from your personal site to your online store — let's build the digital tool that makes your day-to-day easier and helps you grow.",
      badge: "Custom Tailored",
      items: [
        {
          id: "websites",
          icon: "layout",
          title: "Business Websites",
          description:
            "Fast, elegant, mobile-friendly websites for cafés, restaurants, shops, clinics and companies — built to be found on Google and win customers.",
        },
        {
          id: "qr-menu",
          icon: "coffee",
          title: "Café & Restaurant QR Menus",
          description:
            "A photo-rich, multi-language digital menu scanned at the table. Update prices and dishes yourself, instantly — no more reprinting.",
        },
        {
          id: "personal-site",
          icon: "user",
          title: "Personal Websites",
          description:
            "Professional personal sites for doctors, lawyers, therapists, photographers, coaches and freelancers that present you and your work.",
        },
        {
          id: "ecommerce",
          icon: "bag",
          title: "Online Stores (E-Commerce)",
          description:
            "A store that's fully yours — showcases your products, takes card payments, and simplifies shipping and stock management.",
        },
        {
          id: "booking",
          icon: "calendar",
          title: "Online Booking Systems",
          description:
            "For salons, clinics and consultants: customers see free slots, book themselves, and get automatic SMS reminders.",
        },
        {
          id: "web-apps",
          icon: "app",
          title: "Management Portals & Custom Software",
          description:
            "One screen for orders, customers and reports — custom portals integrated with payments, SMS, email and the tools you already use.",
        },
        {
          id: "ai-solutions",
          icon: "cpu",
          title: "AI Assistants",
          description:
            "Smart assistants that answer your customers 24/7 using your menu, prices and documents, plus custom AI tools that save you time.",
        },
        {
          id: "automation",
          icon: "workflow",
          title: "Workflow Automations",
          description:
            "Eliminating repetitive manual work (invoicing, emails, stock updates, order notifications) with automated software.",
        },
        {
          id: "system-evolution",
          icon: "wrench",
          title: "Website & System Upgrades",
          description:
            "Revamping slow or outdated websites — faster, mobile-friendly, with the modern features your customers expect.",
        },
      ],
    },

    whyMe: {
      tag: "Why Work With Me?",
      title: "I don't just deliver a static website.",
      subtitle:
        "I focus on understanding your business goals, engineering reliable software, and providing long-term peace of mind.",
      points: [
        {
          id: "engineering",
          number: "01",
          title: "True Engineering Quality",
          description:
            "I build architectures that don't just look pretty, but are fast, secure, bug-free, and dependable under real-world usage.",
        },
        {
          id: "custom",
          number: "02",
          title: "Built Around Your Needs",
          description:
            "A café's menu and a clinic's booking system aren't the same thing. Instead of squeezing you into a generic template, I build tools that genuinely match how you operate.",
        },
        {
          id: "performance",
          number: "03",
          title: "Blazing Speed & Ease of Use",
          description:
            "Simple, clean interfaces that your customers can browse effortlessly from their smartphones in seconds.",
        },
        {
          id: "long-term",
          number: "04",
          title: "Long-Term Trust & Support",
          description:
            "I don't disappear after launch. I remain available for maintenance, feature expansions, and tech advice as you grow.",
        },
      ],
    },

    process: {
      tag: "How We Work",
      title: "A simple, stress-free process",
      subtitle:
        "No confusing tech jargon. Just a clear, step-by-step roadmap from initial chat to live product.",
      stepLabel: "Step",
      clientLabel: "What you do",
      deliverablesLabel: "What you get",
      steps: [
        {
          step: "01",
          title: "Chat & Discovery",
          client: "Just tell me about your business, your goal and your idea.",
          deliverables: ["A short summary of your needs", "First recommendation & roadmap"],
          description:
            "We sit down to talk about your business, the customers you serve, and what problem you'd like software to solve.",
        },
        {
          step: "02",
          title: "Plan & Proposal",
          client: "Review and approve the proposal.",
          deliverables: ["Written scope & page list", "Fixed price and delivery date"],
          description:
            "I outline the exact solution, clear timelines, and fixed scope in plain language so there are zero surprises.",
        },
        {
          step: "03",
          title: "Build & Review",
          client: "Check the previews and share feedback.",
          deliverables: ["Regular progress demos", "Live preview link"],
          description:
            "I develop your product step-by-step, sharing interactive previews along the way to gather your thoughts and fine-tune.",
        },
        {
          step: "04",
          title: "Launch & Support",
          client: "Do a final review and give the go-ahead.",
          deliverables: ["Your live website or app", "A short how-to guide", "Post-launch support"],
          description:
            "We run thorough quality tests and launch your site or software to the public, followed by ongoing support whenever needed.",
        },
      ],
    },

    selectedWork: {
      tag: "Real Projects",
      title: "What I have built?",
      subtitle: "A few real-world software products and the tangible value they delivered.",
      problemLabel: "Solution & Outcome:",
      techLabel: "Capabilities Delivered:",
      projectBadge: "Production Software",
      items: [
        {
          id: "clearsky",
          title: "ClearSky — Live Telemetry & Tracking Platform",
          category: "Web Application",
          clientSummary:
            "A high-speed live flight monitoring platform transforming massive live tracking streams into an intuitive, responsive map interface.",
          outcome:
            "Made complex high-velocity flight data effortless to monitor in real-time for any team member.",
          tags: ["Real-time Maps", "Instant Live Updates", "Mobile Responsive", "High-Speed Backend"],
          alt: "ClearSky Platform Preview",
        },
        {
          id: "okur",
          title: "OKUR — Intelligent Document & Paper Evaluation",
          category: "AI & Automation",
          clientSummary:
            "An autonomous AI system that scans handwritten paper documents and evaluates answers automatically via computer vision.",
          outcome:
            "Reduced days of repetitive manual grading and paper handling into just minutes of automated processing.",
          tags: ["AI Vision", "Automated Reading", "High Accuracy", "Paperless Workflow"],
          alt: "OKUR Intelligent Exam Evaluation System",
        },
      ],
    },

    faq: {
      tag: "Got Questions?",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about starting a project and working together.",
      items: [
        {
          question: "What types of projects can you build for me?",
          answer:
            "From business and personal websites to café & restaurant QR menus, online stores, booking systems, management portals, automations and AI assistants — I handle projects of every size.",
        },
        {
          question: "Can you build a QR menu for my café or restaurant? Can I change the prices myself?",
          answer:
            "Yes. I set up a photo-rich menu with a QR code for every table, in multiple languages if you like. You get a simple panel to add items and update prices yourself in seconds — no reprinting needed.",
        },
        {
          question: "I don't have a business. Can you build a personal website for me?",
          answer:
            "Of course. Whether you're a doctor, lawyer, therapist, photographer, coach or freelancer, I build a personal site that presents you, your services and your references, and makes it easy to contact you.",
        },
        {
          question: "Do you handle both design and coding?",
          answer:
            "Yes! I manage the full end-to-end journey: interface design, mobile responsiveness, coding, database setup, and server deployment. You get a turnkey solution.",
        },
        {
          question: "Do you use pre-made website templates?",
          answer:
            "It depends on your schedule and budget. For quick turnarounds, we can customize a top-tier modern foundation; for unique business workflows, I write clean, custom software tailored directly to you.",
        },
        {
          question: "How long does a typical project take?",
          answer:
            "QR menus and personal sites usually take about 1 week, business websites 1 to 2 weeks. Online stores, booking systems and custom portals generally take 3 to 6 weeks. We'll set clear dates during our kickoff.",
        },
        {
          question: "Will you provide support after launch?",
          answer:
            "Yes! I don't abandon clients after delivery. I offer ongoing maintenance, security updates, backups, and new feature development as your business evolves.",
        },
        {
          question: "I have no technical knowledge. Can I still hire you?",
          answer:
            "100% yes! You don't need any technical expertise. Just tell me what your business does and what problem you'd like solved—I will handle all the technical heavy lifting for you.",
        },
      ],
    },

    cta: {
      tag: "Let's Get Started",
      title: "Have an idea in mind?",
      subtitle:
        "Briefly describe your business needs. Let's discuss how we can build the right digital solution together.",
      email: "tiryakiemre18@gmail.com",
      emailBtn: "Direct Email:",
      intro: {
        name: "Emre Tiryaki",
        role: "Freelance Web Developer",
        note: "I read and reply to every message myself — no agency, no middleman. You talk to the same person from first call to launch.",
        response: "Usually replies within 24 hours",
      },
      formTitle: "Share Your Project Details",
      formSubtitle: "Fill out the brief below to get started. I will personally review and respond within 24 hours.",
      successTitle: "Email Draft Ready!",
      successDesc: "Your email client should be open with your project brief. Hit send and I'll get back to you shortly.",
      successReset: "Send another message",
      labels: {
        name: "Your Name",
        company: "Business / Company Name (Optional)",
        email: "Your Email Address",
        projectType: "What would you like to build?",
        budget: "Estimated Budget (Optional)",
        timeline: "When would you like to start?",
        details: "Briefly Describe Your Idea",
        submit: "Start Project / Send Message",
        privacy: "Your details remain 100% confidential and will never be shared.",
      },
      placeholders: {
        name: "e.g. John Doe",
        company: "e.g. Acme Coffee Roasters (or Individual)",
        email: "john@yourcompany.com",
        details: "What kind of website or software do you need? What is your main goal? Feel free to share in plain language...",
      },
      projectTypes: [
        "Business Website",
        "Café / Restaurant QR Menu",
        "Personal Website",
        "Online Store (E-Commerce)",
        "Online Booking System",
        "Management Portal / Custom Software",
        "AI Assistant",
        "Workflow / Automation",
        "Website Redesign / Upgrade",
        "Other / Still Brainstorming",
      ],
      budgetRanges: [
        "Not sure yet / Want to discuss options",
        "$500 - $1,500",
        "$1,500 - $3,000",
        "$3,000 - $6,000",
        "$6,000+",
      ],
      timelines: [
        "Immediately (Within 1-2 weeks)",
        "Within 1 month",
        "Within 1-3 months",
        "No rush / In planning stage",
      ],
    },

    footer: {
      brand: "Emre Tiryaki",
      title: "Software Engineer",
      tagline: "Building reliable, modern, and high-impact digital solutions for businesses and individuals.",
      copyright: "© 2026 Emre Tiryaki. All rights reserved.",
    },
  },
};
