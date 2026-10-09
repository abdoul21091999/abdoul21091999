/* =========================================================
   HI-TECH — Catalogue produits
   ---------------------------------------------------------
   Pour modifier le catalogue : page /admin du site (voir GUIDE-VENDEUR.md).
   Champs d'une fiche produit :
   - price   : prix en FCFA (nombre, sans espaces). 0 = "Prix sur demande"
   - oldPrice: ancien prix barré (optionnel)
   - img     : photo du produit (img/p/...) ; sinon une icône est affichée
   - colors  : [{ name, hex, img }] — chaque pastille de couleur affiche sa photo officielle
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

/* ---------------------------------------------------------
   Le catalogue n'est plus ici : chaque produit a sa fiche dans
   data/produits/<identifiant>.json (modifiable depuis /admin),
   assemblée dans data/produits.json par outils/construire-catalogue.mjs.
   --------------------------------------------------------- */
var PRODUCTS = [];
var SHOW_PRICES = true;   // réglage « Afficher les prix » (data/reglages.json, modifiable depuis /admin)
function catalogueUrl() {
  // Prévisualisation via htmlpreview.github.io : lire le fichier directement sur GitHub
  const m = location.href.match(/htmlpreview\.github\.io\/\?(https:\/\/[^?#]+\/)/);
  if (m) return m[1].replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/blob/", "/") + "data/produits.json";
  return new URL("data/produits.json", location.href).href;
}
