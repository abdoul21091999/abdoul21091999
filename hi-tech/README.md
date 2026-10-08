# Hi-Tech — Site web

Site vitrine + boutique en ligne pour **Hi-Tech — General High-Tech, The House of Technology**
(Centre S. Dame Atta N° 27 et 28 · 77 531 81 92 · 76 531 81 92).

Site 100 % statique (HTML / CSS / JavaScript, sans dépendance) : il s'héberge gratuitement
sur GitHub Pages, Netlify ou Vercel.

## Pages
- `index.html` — accueil : hero, catégories, produits phares, services (Vente, Échange,
  Installation, Réparation), simulateur de reprise, prise de rendez-vous, FAQ, contact + carte.
- `boutique.html` — catalogue complet : recherche, filtres (catégorie, gamme, marque, état), tri.
- `credits.html` — crédits et licences des photos produit.

## Fonctionnalités
- Panier (mémorisé dans le navigateur) et **commande envoyée sur WhatsApp** avec le récapitulatif.
- Fiche produit avec choix de l'option (capacité, couleur…).
- Simulateur d'échange / reprise avec envoi de la demande sur WhatsApp.
- Formulaire de réparation / installation → WhatsApp.
- Bouton WhatsApp flottant, design responsive (mobile d'abord), accessible.

## Modifier le site
- **Produits et prix** : `js/products.js` (un produit = une ligne). Les prix actuels sont
  **indicatifs** et doivent être vérifiés par la boutique. `price: 0` affiche « Prix sur demande ».
- **Numéro WhatsApp** : `WHATSAPP_NUMBER` en haut de `js/products.js`.
- **Valeurs de reprise** : objet `BASE` dans `js/app.js` (section « Estimation de reprise »).
- **Visuels produit (style samsung.com)** : les smartphones, tablettes, ordinateurs et montres
  sont dessinés en vectoriel par `js/renders.js` (dos + face de l'appareil). Les **couleurs**
  de chaque modèle se règlent dans le bloc `LOOKS` en bas de `js/products.js` : chaque pastille
  redessine l'appareil dans sa couleur. Pour utiliser une vraie photo à la place, retirez le
  produit de `LOOKS` et indiquez `img: "img/p/nom.jpg"`.
- **Photos** (audio, PlayStation) : dossier `img/p/`, carré 1000×1000 sur fond clair.
  Pour préparer une nouvelle photo au même style : `python3 outils/preparer-photos.py photos_brutes img/p`.
- **Gammes** (Galaxy S, Galaxy A, Galaxy Z Fold / Flip, Xiaomi / Redmi…) : champ `series` de chaque
  produit — elles apparaissent comme sous-filtres dans la boutique.
- **Carte** : l'iframe Google Maps dans `index.html` (section Contact) — remplacez par le lien
  « Intégrer une carte » de l'emplacement exact de la boutique.
- **Moyens de paiement** (Wave, Orange Money…) : section « Atouts » et FAQ de `index.html`.

## Tester en local
```
cd hi-tech && python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
