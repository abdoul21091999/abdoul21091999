/* =========================================================
   HI-TECH — Catalogue produits
   ---------------------------------------------------------
   Pour modifier le catalogue, éditez simplement ce fichier :
   - price   : prix en FCFA (nombre, sans espaces). 0 = "Prix sur demande"
   - oldPrice: ancien prix barré (optionnel)
   - img     : photo dans /img (sinon une icône est affichée)
   - badge   : "Neuf", "Reconditionné", "Promo", "Nouveau"...
   - options : variantes proposées (capacité, couleur...)
   - series  : gamme affichée en sous-filtre dans la boutique (Galaxy S, Galaxy A…)
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
  { id: "ip17pm",  cat: "iphone", series: "iPhone 17", brand: "Apple", name: "iPhone 17 Pro Max", price: 1050000, badge: "Nouveau", options: ["256 Go", "512 Go", "1 To"], desc: "Puce A19 Pro, triple caméra 48 Mpx, châssis aluminium, autonomie record.", featured: true },
  { id: "ip17p",   cat: "iphone", series: "iPhone 17", brand: "Apple", name: "iPhone 17 Pro", price: 920000, badge: "Nouveau", options: ["256 Go", "512 Go", "1 To"], desc: "Écran ProMotion 120 Hz, téléobjectif 48 Mpx, Wi-Fi 7." },
  { id: "ip16pm",  cat: "iphone", series: "iPhone 16", brand: "Apple", name: "iPhone 16 Pro Max", price: 780000, oldPrice: 850000, badge: "Promo", options: ["256 Go", "512 Go"], desc: "Écran 6,9\", puce A18 Pro, titane, bouton Commande de l'appareil photo.", featured: true },
  { id: "ip16",    cat: "iphone", series: "iPhone 16", brand: "Apple", name: "iPhone 16", price: 560000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Puce A18, bouton Action, appareil photo Fusion 48 Mpx." },
  { id: "ip15",    cat: "iphone", series: "iPhone 15", brand: "Apple", name: "iPhone 15", price: 430000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Dynamic Island, USB-C, caméra 48 Mpx." },
  { id: "ip13p-r", cat: "iphone", series: "iPhone 13", brand: "Apple", name: "iPhone 13 Pro", price: 300000, badge: "Reconditionné", options: ["128 Go", "256 Go"], desc: "Reconditionné grade A, écran ProMotion, batterie vérifiée." },
  { id: "ip13-r",  cat: "iphone", series: "iPhone 13", brand: "Apple", name: "iPhone 13", price: 240000, badge: "Reconditionné", options: ["128 Go", "256 Go"], desc: "Excellent état, testé et vérifié par nos techniciens." },

  // ---------- Android : Samsung Galaxy S ----------
  { id: "s25u",    cat: "android", series: "Galaxy S", brand: "Samsung", name: "Galaxy S25 Ultra", price: 820000, badge: "Neuf", options: ["256 Go", "512 Go", "1 To"], desc: "Écran 6,9\" QHD+, S Pen intégré, zoom 100x, Galaxy AI.", featured: true },
  { id: "s25",     cat: "android", series: "Galaxy S", brand: "Samsung", name: "Galaxy S25 / S25+", price: 560000, badge: "Neuf", options: ["S25 — 256 Go", "S25+ — 256 Go", "S25+ — 512 Go"], desc: "Compact et puissant, Snapdragon 8 Elite, Galaxy AI." },
  { id: "s24fe",   cat: "android", series: "Galaxy S", brand: "Samsung", name: "Galaxy S24 FE", price: 360000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "L'expérience Galaxy S à prix doux, zoom 3x." },

  // ---------- Android : Samsung Galaxy A ----------
  { id: "a56",     cat: "android", series: "Galaxy A", brand: "Samsung", name: "Galaxy A56 5G", price: 245000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Super AMOLED 120 Hz, triple caméra 50 Mpx, 5G." },
  { id: "a36",     cat: "android", series: "Galaxy A", brand: "Samsung", name: "Galaxy A36 5G", price: 195000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Grand écran 6,7\", charge rapide 45 W, 6 ans de mises à jour." },
  { id: "a16",     cat: "android", series: "Galaxy A", brand: "Samsung", name: "Galaxy A16", price: 115000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Le Galaxy essentiel : grand écran, grosse batterie 5000 mAh." },

  // ---------- Android : Samsung Galaxy Z (pliables) ----------
  { id: "fold7",   cat: "android", series: "Galaxy Z Fold / Flip", brand: "Samsung", name: "Galaxy Z Fold7", price: 1150000, badge: "Nouveau", options: ["256 Go", "512 Go"], desc: "Le pliable le plus fin de Samsung, grand écran 8\" intérieur.", featured: true },
  { id: "flip6",   cat: "android", series: "Galaxy Z Fold / Flip", brand: "Samsung", name: "Galaxy Z Flip6", price: 560000, badge: "Neuf", options: ["256 Go", "512 Go"], desc: "Format clapet compact, écran externe Flex Window 3,4\"." },

  // ---------- Android : Xiaomi / Redmi ----------
  { id: "xi15u",   cat: "android", series: "Xiaomi / Redmi", brand: "Xiaomi", name: "Xiaomi 15 Ultra", price: 780000, badge: "Neuf", options: ["512 Go"], desc: "Photo Leica 1 pouce, quadruple caméra, design premium." },
  { id: "xi15",    cat: "android", series: "Xiaomi / Redmi", brand: "Xiaomi", name: "Xiaomi 15", price: 480000, badge: "Neuf", options: ["256 Go", "512 Go"], desc: "Compact, Snapdragon 8 Elite, optique Leica." },
  { id: "rn14p",   cat: "android", series: "Xiaomi / Redmi", brand: "Xiaomi", name: "Redmi Note 14 Pro", price: 185000, badge: "Neuf", options: ["256 Go"], desc: "Caméra 200 Mpx, écran AMOLED 120 Hz, IP68." },
  { id: "r13c",    cat: "android", series: "Xiaomi / Redmi", brand: "Xiaomi", name: "Redmi 13C", price: 75000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Le smartphone accessible : grand écran 90 Hz, 5000 mAh." },

  // ---------- Android : Google ----------
  { id: "px10p",   cat: "android", series: "Google Pixel", brand: "Google", name: "Pixel 10 Pro", price: 690000, badge: "Neuf", options: ["256 Go", "512 Go"], desc: "Le meilleur de l'IA Google et un appareil photo d'exception." },

  // ---------- Ordinateurs ----------
  { id: "mba13",   cat: "ordinateur", series: "MacBook", brand: "Apple", name: "MacBook Air 13\" M4", price: 720000, badge: "Neuf", options: ["16 Go / 256 Go", "16 Go / 512 Go", "24 Go / 512 Go"], desc: "Ultra-fin, silencieux, jusqu'à 18 h d'autonomie.", featured: true },
  { id: "mba15",   cat: "ordinateur", series: "MacBook", brand: "Apple", name: "MacBook Air 15\" M4 — Minuit", price: 890000, badge: "Neuf", options: ["16 Go / 256 Go", "16 Go / 512 Go"], desc: "Grand écran Liquid Retina 15,3\" dans un châssis léger." },
  { id: "mbp14",   cat: "ordinateur", series: "MacBook", brand: "Apple", name: "MacBook Pro 14\" M4 Pro", price: 1450000, badge: "Neuf", options: ["24 Go / 512 Go", "48 Go / 1 To"], desc: "Puissance pro, écran XDR, ports HDMI et SD." },
  { id: "hpelite", cat: "ordinateur", series: "HP", brand: "HP", name: "HP EliteBook 840", price: 420000, badge: "Reconditionné", options: ["i5 / 16 Go / 512 Go", "i7 / 16 Go / 512 Go"], desc: "PC professionnel robuste, Windows 11 Pro installé." },
  { id: "hp15",    cat: "ordinateur", series: "HP", brand: "HP", name: "HP Laptop 15", price: 330000, badge: "Neuf", options: ["i3 / 8 Go / 256 Go", "i5 / 16 Go / 512 Go"], desc: "Ordinateur polyvalent pour les études et le bureau." },
  { id: "dellxps", cat: "ordinateur", series: "Dell", brand: "Dell", name: "Dell XPS 13", price: 610000, badge: "Neuf", options: ["i7 / 16 Go / 512 Go"], desc: "Design premium, écran InfinityEdge, très compact." },
  { id: "thinkpad",cat: "ordinateur", series: "Lenovo", brand: "Lenovo", name: "ThinkPad X1 Carbon", price: 520000, badge: "Reconditionné", options: ["i7 / 16 Go / 512 Go"], desc: "Le légendaire PC pro : léger, solide, clavier de référence." },
  { id: "vivobook",cat: "ordinateur", series: "ASUS", brand: "ASUS", name: "ASUS Vivobook 15", price: 310000, badge: "Neuf", options: ["i5 / 8 Go / 512 Go", "i7 / 16 Go / 512 Go"], desc: "Grand écran Full HD, idéal pour le quotidien." },

  // ---------- Tablettes ----------
  { id: "ipadair", cat: "tablette", brand: "Apple", name: "iPad Air 11\" M3", price: 480000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "Puce M3, compatible Apple Pencil Pro et Magic Keyboard." },
  { id: "ipad11",  cat: "tablette", brand: "Apple", name: "iPad 11\" (A16)", price: 290000, badge: "Neuf", options: ["128 Go", "256 Go"], desc: "L'iPad idéal pour les études, le travail et les loisirs." },
  { id: "tabs10",  cat: "tablette", brand: "Samsung", name: "Galaxy Tab S10 FE", price: 340000, badge: "Neuf", options: ["128 Go"], desc: "Grand écran, S Pen inclus, résistante à l'eau IP68." },

  // ---------- Montres ----------
  { id: "aw11",    cat: "montre", brand: "Apple", name: "Apple Watch Series 11", price: 330000, badge: "Nouveau", options: ["42 mm", "46 mm"], desc: "Suivi santé avancé, écran toujours activé, autonomie améliorée.", featured: true },
  { id: "awultra", cat: "montre", brand: "Apple", name: "Apple Watch Ultra 3", price: 620000, badge: "Neuf", options: ["49 mm"], desc: "Titane, GPS double fréquence, jusqu'à 42 h d'autonomie." },
  { id: "awse",    cat: "montre", brand: "Apple", name: "Apple Watch SE", price: 190000, badge: "Neuf", options: ["40 mm", "44 mm"], desc: "L'essentiel de l'Apple Watch à petit prix." },

  // ---------- Audio ----------
  { id: "app3",    cat: "audio", series: "AirPods", brand: "Apple", name: "AirPods Pro 3", price: 195000, badge: "Nouveau", img: "img/p/airpods-pro.jpg", desc: "Réduction de bruit active, audio spatial, suivi cardiaque.", featured: true },
  { id: "ap4",     cat: "audio", series: "AirPods", brand: "Apple", name: "AirPods 4", price: 110000, badge: "Neuf", img: "img/p/airpods-4.jpg", options: ["Standard", "Avec réduction de bruit"], desc: "Confort ouvert, nouvelle puce H2, boîtier USB-C." },
  { id: "apmax",   cat: "audio", series: "Casques", brand: "Apple", name: "AirPods Max", price: 390000, badge: "Neuf", img: "img/p/airpods-max.jpg", options: ["Minuit", "Lumière stellaire", "Bleu", "Orange", "Violet"], desc: "Son haute fidélité, réduction de bruit active, USB-C.", featured: true },
  { id: "sonyxm5", cat: "audio", series: "Casques", brand: "Sony", name: "Sony WH-1000XM5", price: 260000, badge: "Neuf", options: ["Noir", "Argent"], desc: "Référence de la réduction de bruit, 30 h d'autonomie." },
  { id: "beats",   cat: "audio", series: "Casques", brand: "Beats", name: "Beats Studio Pro", price: 210000, badge: "Neuf", img: "img/p/beats-studio.jpg", options: ["Noir", "Sable", "Bleu"], desc: "Son Beats signature, réduction de bruit, USB-C." },
  { id: "buds3p",  cat: "audio", series: "Écouteurs", brand: "Samsung", name: "Galaxy Buds FE / Buds2 Pro", price: 95000, badge: "Neuf", img: "img/p/galaxy-buds.jpg", desc: "Écouteurs Samsung sans fil avec réduction de bruit active.", options: ["Galaxy Buds FE", "Galaxy Buds2 Pro"] },
  { id: "jbl",     cat: "audio", series: "Enceintes", brand: "JBL", name: "Enceinte JBL Charge", price: 115000, badge: "Neuf", img: "img/p/jbl-charge.jpg", desc: "Son puissant, étanche IP67, 20 h d'autonomie." },

  // ---------- Gaming ----------
  { id: "ps5",     cat: "gaming", brand: "Sony", name: "PlayStation 5 Slim", price: 380000, badge: "Neuf", img: "img/p/playstation-5.jpg", options: ["Édition Standard", "Édition Digitale"], desc: "Jeux en 4K, SSD ultra-rapide, manette DualSense incluse.", featured: true },
  { id: "ps5pro",  cat: "gaming", brand: "Sony", name: "PlayStation 5 Pro", price: 560000, badge: "Neuf", img: "img/p/playstation-5.jpg", desc: "La PS5 la plus puissante, ray tracing avancé, 2 To." },
  { id: "dualsense", cat: "gaming", brand: "Sony", name: "Manette DualSense", price: 55000, badge: "Neuf", options: ["Blanc", "Noir", "Bleu"], desc: "Retour haptique et gâchettes adaptatives." },

  // ---------- Accessoires ----------
  { id: "chg20",   cat: "accessoires", brand: "Apple", name: "Chargeur USB-C 20 W", price: 15000, badge: "Original", desc: "Charge rapide pour iPhone et iPad." },
  { id: "magsafe", cat: "accessoires", brand: "Apple", name: "Chargeur MagSafe", price: 35000, badge: "Original", desc: "Charge sans fil magnétique jusqu'à 25 W." },
  { id: "coque",   cat: "accessoires", brand: "Hi-Tech", name: "Coque + verre trempé", price: 7500, badge: "Pack", options: ["iPhone", "Samsung", "Autre modèle"], desc: "Protection complète, pose du verre offerte en boutique." },
  { id: "pb",      cat: "accessoires", brand: "Anker", name: "Batterie externe 20 000 mAh", price: 25000, badge: "Neuf", desc: "Charge rapide PD, recharge un iPhone plus de 4 fois." },
  { id: "cable",   cat: "accessoires", brand: "Apple", name: "Câble USB-C tressé 1 m", price: 10000, badge: "Original", desc: "Câble de charge et de synchronisation." }
];

/* =========================================================
   Visuels « studio » + couleurs (style samsung.com)
   render : forme dessinée (voir js/renders.js)
            kind  : phone | fold | flip | tablet | laptop | watch
            cam   : disposition des caméras (téléphones)
            notch : "island" (iPhone) ou "punch" (Android)
   colors : [nom affiché, couleur hexadécimale] — cliquer sur une pastille
            redessine l'appareil dans cette couleur.
   ========================================================= */
const LOOKS = {
  // iPhone
  ip17pm:  [{ kind: "phone", cam: "iphone-plateau", notch: "island" }, [["Bleu intense", "#33415f"], ["Orange cosmique", "#e2783c"], ["Argent", "#dcdcdc"]]],
  ip17p:   [{ kind: "phone", cam: "iphone-plateau", notch: "island" }, [["Argent", "#dcdcdc"], ["Orange cosmique", "#e2783c"], ["Bleu intense", "#33415f"]]],
  ip16pm:  [{ kind: "phone", cam: "iphone-pro", notch: "island" }, [["Titane désert", "#c8b29a"], ["Titane naturel", "#bdb7ab"], ["Titane blanc", "#e9e7e2"], ["Titane noir", "#3c3c3d"]]],
  ip16:    [{ kind: "phone", cam: "iphone-duo-v", notch: "island" }, [["Outremer", "#6f8fe6"], ["Sarcelle", "#9ccfc9"], ["Rose", "#f2b8cf"], ["Blanc", "#f0f0f0"], ["Noir", "#3a3b3d"]]],
  ip15:    [{ kind: "phone", cam: "iphone-duo-d", notch: "island" }, [["Noir", "#3a3b3d"], ["Bleu", "#d4e3ec"], ["Vert", "#dbe8d4"], ["Jaune", "#f4ecc4"], ["Rose", "#f3d9de"]]],
  "ip13p-r": [{ kind: "phone", cam: "iphone-pro", notch: "island" }, [["Vert alpin", "#576856"], ["Bleu alpin", "#9fb5cf"], ["Graphite", "#4f4e4b"], ["Argent", "#e3e4e0"], ["Or", "#f0dfc2"]]],
  "ip13-r":  [{ kind: "phone", cam: "iphone-duo-d", notch: "island" }, [["Minuit", "#2c3137"], ["Bleu", "#3d6d8f"], ["Rose", "#f6dbd8"], ["Vert", "#3e5143"], ["Lumière stellaire", "#f2ece4"]]],
  // Samsung Galaxy S
  s25u:    [{ kind: "phone", cam: "s-ultra", corner: 16 }, [["Titane Silverblue", "#a9b4c6"], ["Titane Noir", "#3b3d42"], ["Titane Gris", "#8d8f93"], ["Titane Blanc argent", "#e6e5e1"]]],
  s25:     [{ kind: "phone", cam: "s" }, [["Bleu glacier", "#b9cfe3"], ["Menthe", "#cfe5d6"], ["Marine", "#2f3a5a"], ["Argent ombré", "#d9dadd"]]],
  s24fe:   [{ kind: "phone", cam: "s" }, [["Bleu", "#6f7fb8"], ["Graphite", "#4a4c51"], ["Gris", "#c9c9cc"], ["Menthe", "#bfe0d0"], ["Jaune", "#f1e3a8"]]],
  // Samsung Galaxy A
  a56:     [{ kind: "phone", cam: "a" }, [["Gris clair", "#d8d9db"], ["Graphite", "#55575c"], ["Rose", "#f1cfd5"], ["Olive", "#bfc4ad"]]],
  a36:     [{ kind: "phone", cam: "a" }, [["Lavande", "#c8bfe0"], ["Noir", "#2d2e33"], ["Blanc", "#ecebe8"], ["Citron vert", "#d6ebbf"]]],
  a16:     [{ kind: "phone", cam: "a" }, [["Noir", "#26272b"], ["Gris", "#b9bbbf"], ["Vert clair", "#c9e2cf"]]],
  // Samsung Galaxy Z
  fold7:   [{ kind: "fold" }, [["Bleu ombre", "#3b4e72"], ["Argent ombre", "#c4c7cc"], ["Jet Black", "#1e1f22"], ["Menthe", "#b8dccd"]]],
  flip6:   [{ kind: "flip" }, [["Bleu", "#a9c6ea"], ["Menthe", "#c8e6d4"], ["Jaune", "#f3e49c"], ["Argent ombre", "#d5d6d9"]]],
  // Xiaomi / Google
  xi15u:   [{ kind: "phone", cam: "xiaomi-ultra" }, [["Blanc", "#ecebe6"], ["Noir", "#1f1f21"], ["Argent chromé", "#c9c9c9"]]],
  xi15:    [{ kind: "phone", cam: "xiaomi" }, [["Noir", "#1f1f21"], ["Blanc", "#ecebe6"], ["Vert", "#a9c4b3"]]],
  rn14p:   [{ kind: "phone", cam: "redmi" }, [["Violet lavande", "#b9a9d9"], ["Noir minuit", "#24262a"], ["Vert océan", "#7fb3a6"]]],
  r13c:    [{ kind: "phone", cam: "redmi" }, [["Vert trèfle", "#8fb79e"], ["Noir", "#222326"], ["Bleu navy", "#3d4f78"]]],
  px10p:   [{ kind: "phone", cam: "pixel" }, [["Porcelaine", "#ece6dd"], ["Obsidienne", "#2b2c2e"], ["Moonstone", "#9aa6b4"], ["Jade", "#c9dccf"]]],
  // Tablettes
  ipadair: [{ kind: "tablet" }, [["Bleu", "#9bb6d1"], ["Gris sidéral", "#5e5f63"], ["Violet", "#c7bde0"], ["Lumière stellaire", "#ece6dc"]]],
  ipad11:  [{ kind: "tablet" }, [["Rose", "#f2c4cf"], ["Bleu", "#a8c1dd"], ["Jaune", "#f2dc85"], ["Argent", "#e3e4e6"]]],
  tabs10:  [{ kind: "tablet" }, [["Gris", "#5d5f64"], ["Argent", "#d8d9db"], ["Bleu", "#b9cbe2"]]],
  // Ordinateurs
  mba13:   [{ kind: "laptop" }, [["Bleu ciel", "#c5d3e0"], ["Argent", "#d9dadc"], ["Lumière stellaire", "#e8e1d4"], ["Minuit", "#2e3640"]]],
  mba15:   [{ kind: "laptop" }, [["Minuit", "#2e3640"], ["Bleu ciel", "#c5d3e0"], ["Argent", "#d9dadc"], ["Lumière stellaire", "#e8e1d4"]]],
  mbp14:   [{ kind: "laptop" }, [["Noir sidéral", "#2e2f31"], ["Argent", "#d9dadc"]]],
  hpelite: [{ kind: "laptop", style: "pc" }, [["Argent", "#cfd1d4"]]],
  hp15:    [{ kind: "laptop", style: "pc" }, [["Argent naturel", "#d6d7d9"], ["Bleu", "#3f5a7d"]]],
  dellxps: [{ kind: "laptop", style: "pc" }, [["Platine", "#d5d6d8"], ["Graphite", "#3b3c40"]]],
  thinkpad:[{ kind: "laptop", style: "pc" }, [["Noir", "#2a2b2e"]]],
  vivobook:[{ kind: "laptop", style: "pc" }, [["Argent", "#cfd0d3"], ["Bleu nuit", "#2e3a52"]]],
  // Montres
  aw11:    [{ kind: "watch", band: "#2b2d31" }, [["Minuit", "#2b2d31"], ["Argent", "#d9d9d9"], ["Or rose", "#e8c9b9"]]],
  awultra: [{ kind: "watch", band: "#e6763b" }, [["Titane naturel", "#b8b2a6"], ["Titane noir", "#2f3032"]]],
  awse:    [{ kind: "watch", band: "#e9e2d6" }, [["Lumière stellaire", "#e9e2d6"], ["Minuit", "#2b2d31"], ["Argent", "#d9d9d9"]]]
};
PRODUCTS.forEach((p) => {
  const l = LOOKS[p.id];
  if (l) { p.render = l[0]; p.colors = l[1].map(([name, hex]) => ({ name, hex })); }
});
