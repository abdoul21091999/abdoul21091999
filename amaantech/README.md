# Amãan Tech — site officiel

Site vitrine officiel d'**Amãan Tech** (أمان تك) : sécurité électronique, sites web et applications, vente d'électronique, cybersécurité et réseaux. Touba, Dakar et tout le Sénégal.

- Bilingue **français / arabe** (bascule FR · ع, mise en page RTL automatique, choix mémorisé)
- Une seule page, sans dépendance ni étape de build : HTML, CSS et JavaScript simples
- Plan de protection interactif (villa, commerce, bureau), terminal d'audit animé, maquette web, catalogue
- Formulaire qui prépare la demande et l'envoie sur WhatsApp
- SEO : balises meta, Open Graph, données structurées `LocalBusiness`, favicon, manifeste, page 404

## Structure

```
amaantech/
├── index.html          # page principale
├── 404.html            # page introuvable
├── css/style.css       # styles
├── js/main.js          # traductions, interactions, formulaire
├── assets/             # logo, favicon, icônes, image de partage (og-image.jpg)
├── site.webmanifest
└── robots.txt
```

## À faire avant la mise en ligne

1. **Coordonnées** — en haut de `js/main.js` :
   ```js
   const CONTACT={phone:"+221 77 123 45 67",whatsapp:"221771234567",email:"contact@amaantech.sn"};
   ```
   Tant que ces champs sont vides, la section Contact affiche « À compléter » et le bouton WhatsApp flottant reste caché.
2. **Nom de domaine** — une fois le domaine choisi (ex. `amaantech.sn`), ajoutez dans `index.html` une balise
   `<link rel="canonical" href="https://amaantech.sn/">`, passez les URL `og:image` / `twitter:image` en absolu
   et indiquez ce domaine dans Google Search Console.

## Tester en local

```bash
cd amaantech
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Mettre en ligne

Le dossier `amaantech/` est autonome : déposez-le tel quel sur n'importe quel hébergeur statique.

- **Netlify** : app.netlify.com → *Add new site* → *Deploy manually* → glisser le dossier `amaantech`.
- **GitHub Pages** : copier le contenu de `amaantech/` à la racine d'un dépôt dédié (ex. `amaantech`), puis *Settings → Pages → Branch: main / root*.
- **Vercel / Cloudflare Pages** : importer le dépôt, dossier racine `amaantech`, aucune commande de build.

© Amãan Tech. Partenaire logiciels et data : [Salva Tech](https://salvatech.netlify.app).
