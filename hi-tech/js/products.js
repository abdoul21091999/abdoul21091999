/* =========================================================
   HI-TECH — Catalogue produits
   ---------------------------------------------------------
   Pour modifier le catalogue, éditez simplement ce fichier :
   - price   : prix en FCFA (nombre, sans espaces). 0 = "Prix sur demande"
   - oldPrice: ancien prix barré (optionnel)
   - img     : photo dans /img (sinon une icône est affichée)
   - badge   : "Neuf", "Reconditionné", "Promo", "Nouveau"...
   - options : variantes proposées (capacité, couleur...)
   Les prix ci-dessous sont INDICATIFS : à mettre à jour par la boutique.
   ========================================================= */

const WHATSAPP_NUMBER = "221775318192"; // 77 531 81 92
const PHONE_1 = "+221 77 531 81 92";
const PHONE_2 = "+221 76 531 81 92";

const CATEGORIES = [
  { id: "iphone",      label: "iPhone",       icon: "phone"   },
  { id: "android",     label: "Android",      icon: "android" },
  { id: "ordinateur",  label: "Ordinateurs",  icon: "laptop"  },
  { id: "tablette",    label: "Tablettes",    icon: "tablet"  },
  { id: "montre",      label: "Montres",      icon: "watch"   },
  { id: "audio",       label: "Audio",        icon: "audio"   },
  { id: "gaming",      label: "PlayStation",  icon: "gamepad" },
  { id: "accessoires", label: "Accessoires",  icon: "plug"    }
];

const PRODUCTS = [
  // ---------- iPhone ----------
  { id: "ip17pm",  cat: "iphone", brand: "Apple", name: "iPhone 17 Pro Max", price: 1050000, badge: "Nouveau", img: "img/iphone.jpg", options: ["256 Go", "512 Go", "1 To"], desc: "Puce A19 Pro, triple caméra 48 Mpx, châssis aluminium, autonomie record.", featured: true },
  { id: "ip17p",   cat: "iphone", brand: "Apple", name: "iPhone 17 Pro", price: 920000, badge: "Nouveau", img: "img/iphone.jpg", options: ["256 Go", "512 Go", "1 To"], desc: "Écran ProMotion 120 Hz, téléobjectif 48 Mpx, Wi-Fi 7." },
  { id: "ip16pm",  cat: "iphone", brand: "Apple", name: "iPhone 16 Pro Max", price: 780000, oldPrice: 850000, badge: "Promo", img: "img/iphone.jpg", options: ["256 Go", "512 Go"], desc: "Écran 6,9\", puce A18 Pro, bouton Commande de l'appareil photo.", featured: true },
  { id: "ip15pm-r",cat: "iphone", brand: "Apple", name: "iPhone 15 Pro Max", price: 560000, badge: "Reconditionné", img: "img/iphone.jpg", options: ["256 Go", "512 Go"], desc: "Reconditionné grade A, batterie ≥ 90 %, garantie boutique." },
  { id: "ip14-r",  cat: "iphone", brand: "Apple", name: "iPhone 14", price: 290000, badge: "Reconditionné", img: "img/iphone.jpg", options: ["128 Go", "256 Go"], desc: "Excellent état, testé et vérifié par nos techniciens." },

  // ---------- Android ----------
  { id: "s25u",    cat: "android", brand: "Samsung", name: "Galaxy S25 Ultra", price: 820000, badge: "Neuf", options: ["256 Go", "512 Go"], desc: "Écran 6,9\" QHD+, S Pen intégré, zoom 100x, Galaxy AI.", featured: true },
  { id: "a56",     cat: "android", brand: "Samsung", name: "Galaxy A56 5G", price: 245000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Super AMOLED 120 Hz, triple caméra 50 Mpx, 5G." },
  { id: "px10p",   cat: "android", brand: "Google", name: "Pixel 10 Pro", price: 690000, badge: "Neuf", options: ["256 Go", "512 Go"], desc: "Le meilleur de l'IA Google et un appareil photo d'exception." },
  { id: "rn14",    cat: "android", brand: "Xiaomi", name: "Redmi Note 14 Pro", price: 185000, badge: "Neuf", options: ["256 Go"], desc: "Charge rapide 120 W, caméra 200 Mpx, excellent rapport qualité-prix." },

  // ---------- Ordinateurs ----------
  { id: "mba13",   cat: "ordinateur", brand: "Apple", name: "MacBook Air 13\" M4", price: 720000, badge: "Neuf", img: "img/macbook.jpg", options: ["16 Go / 256 Go", "16 Go / 512 Go", "24 Go / 512 Go"], desc: "Ultra-fin, silencieux, jusqu'à 18 h d'autonomie.", featured: true },
  { id: "mba15",   cat: "ordinateur", brand: "Apple", name: "MacBook Air 15\" M4", price: 890000, badge: "Neuf", img: "img/macbook.jpg", options: ["16 Go / 256 Go", "16 Go / 512 Go"], desc: "Grand écran Liquid Retina 15,3\" dans un châssis léger." },
  { id: "mbp14",   cat: "ordinateur", brand: "Apple", name: "MacBook Pro 14\" M4 Pro", price: 1450000, badge: "Neuf", img: "img/macbook.jpg", options: ["24 Go / 512 Go", "48 Go / 1 To"], desc: "Puissance pro, écran XDR, ports HDMI et SD." },
  { id: "hpelite", cat: "ordinateur", brand: "HP", name: "HP EliteBook 840 G9", price: 420000, badge: "Reconditionné", options: ["i5 / 16 Go / 512 Go", "i7 / 16 Go / 512 Go"], desc: "PC professionnel robuste, Windows 11 Pro installé." },
  { id: "dellxps", cat: "ordinateur", brand: "Dell", name: "Dell XPS 13", price: 610000, badge: "Neuf", options: ["i7 / 16 Go / 512 Go"], desc: "Design premium, écran InfinityEdge, très compact." },

  // ---------- Tablettes ----------
  { id: "ipadair", cat: "tablette", brand: "Apple", name: "iPad Air 11\" M3", price: 480000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Puce M3, compatible Apple Pencil Pro et Magic Keyboard." },
  { id: "ipad11",  cat: "tablette", brand: "Apple", name: "iPad 11\" (A16)", price: 290000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "L'iPad idéal pour les études, le travail et les loisirs." },
  { id: "tabs10",  cat: "tablette", brand: "Samsung", name: "Galaxy Tab S10 FE", price: 340000, badge: "Neuf", options: ["128 Go"], desc: "Grand écran, S Pen inclus, résistante à l'eau IP68." },

  // ---------- Montres ----------
  { id: "aw11",    cat: "montre", brand: "Apple", name: "Apple Watch Series 11", price: 330000, badge: "Nouveau", img: "img/watch.jpg", options: ["42 mm", "46 mm"], desc: "Suivi santé avancé, écran toujours activé, autonomie améliorée.", featured: true },
  { id: "awultra", cat: "montre", brand: "Apple", name: "Apple Watch Ultra 3", price: 620000, badge: "Neuf", img: "img/watch.jpg", options: ["49 mm"], desc: "Titane, GPS double fréquence, jusqu'à 42 h d'autonomie." },
  { id: "awse",    cat: "montre", brand: "Apple", name: "Apple Watch SE", price: 190000, badge: "Neuf", img: "img/watch.jpg", options: ["40 mm", "44 mm"], desc: "L'essentiel de l'Apple Watch à petit prix." },

  // ---------- Audio ----------
  { id: "app3",    cat: "audio", brand: "Apple", name: "AirPods Pro 3", price: 195000, badge: "Nouveau", img: "img/airpods.jpg", desc: "Réduction de bruit active, audio spatial, suivi cardiaque.", featured: true },
  { id: "ap4",     cat: "audio", brand: "Apple", name: "AirPods 4", price: 110000, badge: "Neuf", img: "img/airpods.jpg", options: ["Standard", "Avec réduction de bruit"], desc: "Confort ouvert, nouvelle puce H2, boîtier USB-C." },
  { id: "apmax",   cat: "audio", brand: "Apple", name: "AirPods Max", price: 390000, badge: "Neuf", img: "img/casque.jpg", options: ["Minuit", "Lumière stellaire", "Bleu", "Orange", "Violet"], desc: "Son haute fidélité, réduction de bruit active, USB-C.", featured: true },
  { id: "jbl",     cat: "audio", brand: "JBL", name: "Enceinte JBL Charge 5", price: 115000, badge: "Neuf", desc: "Son puissant, étanche IP67, 20 h d'autonomie." },

  // ---------- Gaming ----------
  { id: "ps5",     cat: "gaming", brand: "Sony", name: "PlayStation 5 Slim", price: 380000, badge: "Neuf", img: "img/ps5.jpg", options: ["Édition Standard", "Édition Digitale"], desc: "Jeux en 4K, SSD ultra-rapide, manette DualSense incluse.", featured: true },
  { id: "ps5pro",  cat: "gaming", brand: "Sony", name: "PlayStation 5 Pro", price: 560000, badge: "Neuf", img: "img/ps5.jpg", desc: "La PS5 la plus puissante, ray tracing avancé, 2 To." },
  { id: "dualsense", cat: "gaming", brand: "Sony", name: "Manette DualSense", price: 55000, badge: "Neuf", options: ["Blanc", "Noir", "Bleu"], desc: "Retour haptique et gâchettes adaptatives." },

  // ---------- Accessoires ----------
  { id: "chg20",   cat: "accessoires", brand: "Apple", name: "Chargeur USB-C 20 W", price: 15000, badge: "Original", desc: "Charge rapide pour iPhone et iPad." },
  { id: "magsafe", cat: "accessoires", brand: "Apple", name: "Chargeur MagSafe", price: 35000, badge: "Original", desc: "Charge sans fil magnétique jusqu'à 25 W." },
  { id: "coque",   cat: "accessoires", brand: "Hi-Tech", name: "Coque + verre trempé", price: 7500, badge: "Pack", options: ["iPhone", "Samsung", "Autre modèle"], desc: "Protection complète, pose du verre offerte en boutique." },
  { id: "pb",      cat: "accessoires", brand: "Anker", name: "Batterie externe 20 000 mAh", price: 25000, badge: "Neuf", desc: "Charge rapide PD, recharge un iPhone plus de 4 fois." },
  { id: "cable",   cat: "accessoires", brand: "Apple", name: "Câble USB-C tressé 1 m", price: 10000, badge: "Original", desc: "Câble de charge et de synchronisation." }
];
