# DAROU KARIM TRADING — Site Web Portfolio Professionnel

Site web vitrine professionnel pour **DAROU KARIM TRADING**, société spécialisée dans le commerce international, basée à Dakar, Sénégal.

---

## Aperçu du Projet

Ce site présente les services, l'histoire et les coordonnées de DAROU KARIM TRADING — une entreprise experte en import/export, sourcing, logistique et conseil en commerce international depuis 2014.

- **Langue** : Français (`lang="fr"`)
- **Couleurs** : Marine profond (#1a2744), or (#c9a84c), blanc
- **Polices** : Playfair Display (titres) + Inter (corps)
- **Design** : Responsive mobile-first, moderne et professionnel

---

## Structure des Fichiers

```
abdoul21091999/
│
├── index.html          # Page d'accueil (héros, services, À propos, stats)
├── about.html          # Page À Propos (histoire, mission, équipe, valeurs)
├── services.html       # Page Services (4 services détaillés, processus, FAQ)
├── contact.html        # Page Contact (formulaire, carte, horaires, FAQ)
│
├── css/
│   ├── style.css       # Styles principaux (variables CSS, composants, animations)
│   └── responsive.css  # Media queries (mobile, tablette, desktop, impression)
│
├── js/
│   └── main.js         # JavaScript principal (nav, animations, compteurs, FAQ)
│
├── sitemap.xml         # Plan du site pour les moteurs de recherche
├── robots.txt          # Instructions pour les robots d'indexation
└── README.md           # Ce fichier
```

---

## Fonctionnalités Techniques

### HTML
- Sémantique HTML5 complète (`<nav>`, `<section>`, `<article>`, `<footer>`, etc.)
- Attributs ARIA pour l'accessibilité
- Balises meta SEO complètes (title, description, keywords, OG, Twitter Cards)
- Données structurées JSON-LD (Schema.org : Organization, AboutPage, Service, ContactPage)
- URLs canoniques sur toutes les pages

### CSS
- **Variables CSS** (couleurs, polices, espacements, ombres, transitions)
- **CSS Grid et Flexbox** pour tous les layouts
- **Animations CSS** (keyframes fadeInUp, fadeIn, pulse, scrollPulse)
- **Design mobile-first** avec media queries progressifs
- Support `prefers-reduced-motion` pour l'accessibilité
- Styles d'impression

### JavaScript (Vanilla ES6+)
- **Intersection Observer API** pour les animations au défilement
- **Compteurs animés** avec easing (statistiques clés)
- **Menu hamburger** mobile avec overlay
- **Accordéon FAQ** accessible au clavier
- **Défilement fluide** vers les ancres
- **Bouton retour en haut** avec apparition progressive
- **Validation de formulaire** côté client
- Mise à jour automatique de l'année dans le footer

---

## Déploiement sur GitHub Pages

### Étape 1 — Créer un dépôt GitHub

1. Connectez-vous à [github.com](https://github.com)
2. Cliquez sur **"New repository"**
3. Nommez-le `daroukarimtrading` (ou le nom de votre choix)
4. Laissez-le **Public**
5. Cliquez sur **"Create repository"**

### Étape 2 — Initialiser le dépôt local

```bash
cd /chemin/vers/votre/projet
git init
git add -A
git commit -m "feat: initial commit — DAROU KARIM TRADING website"
git branch -M main
git remote add origin https://github.com/VOTRE-UTILISATEUR/daroukarimtrading.git
git push -u origin main
```

### Étape 3 — Activer GitHub Pages

1. Allez dans votre dépôt sur GitHub
2. Cliquez sur **Settings** (onglet paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **"Source"**, sélectionnez :
   - Branch : `main`
   - Folder : `/ (root)`
5. Cliquez sur **Save**

### Étape 4 — Accéder au site

Après quelques minutes (1–5 minutes en général), votre site sera accessible à :

```
https://VOTRE-UTILISATEUR.github.io/daroukarimtrading/
```

### Mise à jour du site

Pour mettre à jour votre site après des modifications :

```bash
git add -A
git commit -m "update: description des changements"
git push origin main
```

Les changements seront en ligne dans 1–2 minutes.

---

## Développement Local

### Option 1 — Ouvrir directement dans le navigateur

Ouvrez simplement `index.html` dans votre navigateur web. Aucune dépendance requise.

### Option 2 — Serveur local (recommandé pour le développement)

**Avec Python (pré-installé sur macOS et Linux) :**

```bash
# Python 3
python3 -m http.server 8080

# Python 2 (si nécessaire)
python -m SimpleHTTPServer 8080
```

Puis ouvrez `http://localhost:8080` dans votre navigateur.

**Avec Node.js :**

```bash
# Installer un serveur local simple
npm install -g live-server

# Lancer avec rechargement automatique
live-server --port=8080
```

**Avec VS Code :**

Installez l'extension **Live Server** (Ritwick Dey), puis cliquez sur "Go Live" dans la barre d'état.

---

## Personnalisation

### Modifier les couleurs

Éditez les variables CSS dans `css/style.css` (section `:root`) :

```css
:root {
  --color-navy:  #1a2744;  /* Marine principal */
  --color-gold:  #c9a84c;  /* Or principal     */
  /* ... */
}
```

### Modifier les informations de contact

Recherchez et remplacez dans tous les fichiers HTML :
- `contact@daroukarimtrading.com` → votre email
- `+221 77 000 00 00` → votre numéro
- `Dakar, Sénégal` → votre adresse

### Activer le formulaire de contact

Le formulaire simule actuellement l'envoi. Pour l'activer vraiment :

1. **Formspree** (gratuit, facile) :
   ```html
   <form action="https://formspree.io/f/VOTRE-ID" method="POST">
   ```

2. **EmailJS** : Intégrez le SDK EmailJS dans `main.js`

3. **Backend custom** : Pointez `action` vers votre endpoint API

### Remplacer les images placeholder

Les icônes emoji sont utilisées comme placeholders. Pour ajouter de vraies images :
```html
<!-- Remplacez les blocs avec class about-teaser__img-wrap -->
<img src="assets/votre-image.jpg" alt="Description" loading="lazy" />
```

---

## Conformité et Accessibilité

- Structure ARIA complète (landmarks, labels, rôles)
- Navigation clavier complète (Tab, Escape, Enter/Space)
- Contraste des couleurs conforme WCAG 2.1 AA
- Textes alternatifs sur tous les éléments décoratifs (`aria-hidden="true"`)
- Support `prefers-reduced-motion`
- HTML sémantique valide

---

## Informations de Contact

| Champ      | Valeur                            |
|------------|-----------------------------------|
| Email      | contact@daroukarimtrading.com     |
| Téléphone  | +221 77 000 00 00                 |
| Adresse    | Dakar, Sénégal                    |
| Site web   | https://daroukarimtrading.com     |

---

## Licence

© 2024 DAROU KARIM TRADING. Tous droits réservés.  
Développé par [DAROU KARIM TRADING](https://daroukarimtrading.com).
