# Guide du vendeur — Gérer le catalogue Hi-Tech

Tout se fait depuis le téléphone ou l'ordinateur, sans toucher au code, sur la page :

**https://general-hitech.netlify.app/admin** (ou `https://votre-domaine/admin`)

Connectez-vous avec **« Se connecter avec GitHub »**. Après chaque enregistrement, le site
se met à jour tout seul en **1 à 2 minutes**.

---

## 0. Afficher ou masquer les prix sur tout le site

**Réglages du site** → **Affichage des prix** → **Afficher les prix**.
- **Désactivé** (réglage actuel) : chaque produit affiche « Prix sur demande » et le client
  demande le prix sur WhatsApp. Aucun prix n'apparaît, ni dans le panier ni dans les messages.
- **Activé** : les prix saisis dans chaque produit s'affichent.
- ⚠️ Les prix actuels du catalogue sont **indicatifs** : vérifiez-les tous avant d'activer.

Touchez **Publier** → **Publier maintenant** ; le site change en 1 à 2 minutes.

## 1. Changer un prix

1. Ouvrez **Produits**, puis touchez le produit (utilisez **Filtrer par** → iPhone, Android…
   ou la loupe pour chercher).
2. Modifiez **Prix (FCFA)** : chiffres seulement, sans espace (ex. `450000`).
   - Pour une promotion : mettez l'ancien prix dans **Ancien prix barré**.
   - `0` affiche « Prix sur demande ».
3. Touchez **Publier** → **Publier maintenant**.

## 2. Produit épuisé / de retour en stock

Décochez **Disponible** : le produit reste visible avec la mention **« Épuisé »** et le bouton
Commander est désactivé (le client peut toujours vous écrire sur WhatsApp).
Recochez quand il est de nouveau en stock. Puis **Publier**.

## 3. Ajouter un nouveau produit

1. **Produits** → **＋ Produit**.
2. Remplissez : **Nom**, **Catégorie**, **Marque**, **Prix**, **Étiquette** (Neuf, Promo…).
3. **Gamme** (facultatif) : sert aux boutons de filtre de la boutique. Reprenez un nom existant
   pour ranger le produit avec les autres (ex. `iPhone 16`, `Galaxy S`, `Redmi`, `Huawei`).
4. **Capacités / variantes** : séparées par des virgules (ex. `128 Go, 256 Go`).
5. Photos :
   - **Une seule photo** → champ **Photo (si une seule couleur)** → *Choisir une image* →
     *Téléverser une nouvelle ressource* → choisissez la photo → *Choisir les éléments sélectionnés*.
   - **Plusieurs couleurs** → **Couleurs** → *Ajouter* pour chaque couleur : nom (ex. `Noir`),
     couleur de la pastille, et sa photo.
6. **Ordre d'affichage** : plus le nombre est petit, plus le produit apparaît haut
   (les produits existants vont de 10 à 1610).
7. **Publier** → **Publier maintenant**.

## 4. Mettre un produit en avant sur la page d'accueil

Cochez **Produit phare (page d'accueil)**.

## 5. Supprimer un produit

Ouvrez le produit → menu à côté de **Publier** → **Supprimer l'entrée publiée**.
(Pour une rupture temporaire, préférez décocher **Disponible**.)

---

## Conseils pour de belles photos

- Photo **carrée**, produit **centré**, **fond blanc** ou gris très clair : elle s'intègre
  parfaitement aux cartes du site (comme sur samsung.com).
- Le plus simple : enregistrer la photo officielle du produit (site du fabricant ou du
  fournisseur).
- Taille idéale : environ 800 × 800 pixels (une photo de téléphone convient aussi).
- Pour détourer automatiquement des photos prises en boutique (fond supprimé, produit
  centré), un informaticien peut utiliser `outils/preparer-photos.py` (voir README).

---

## Mise en place (une seule fois, par le propriétaire du site)

1. **Héberger le site sur Netlify** depuis GitHub (dossier `hi-tech`, réglages déjà fournis
   par `netlify.toml`).
2. **Créer une application OAuth GitHub** : GitHub → *Settings* → *Developer settings* →
   *OAuth Apps* → *New OAuth App*
   - Homepage URL : `https://general-hitech.netlify.app`
   - Authorization callback URL : `https://api.netlify.com/auth/done`
   - Copiez le **Client ID** et générez un **Client secret**.
3. **Netlify** → votre site → *Project configuration* → *Access & security* → *OAuth* →
   *Install provider* → **GitHub** → collez le Client ID et le Client secret.
4. **Donner l'accès au vendeur** : il crée un compte GitHub gratuit, puis le propriétaire
   l'invite : dépôt GitHub → *Settings* → *Collaborators* → *Add people*.
   Le vendeur accepte l'invitation reçue par e-mail.
5. Si le dépôt ou la branche publiée change, mettez à jour `repo` et `branch` en haut de
   `admin/config.yml`.
