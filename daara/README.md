# نظام إدارة المدرسة القرآنية — Gestion de l'école coranique (daara)

Application web **hors connexion**, en **arabe et en français**, pour gérer une école coranique :

| Module | Fonctions |
|---|---|
| لوحة القيادة / Tableau de bord | Élèves actifs, encaissé / attendu du mois, retards de paiement, absents du jour, séances de la semaine, moyenne des hizb, élèves à suivre |
| الطلاب / Élèves | Inscription (code automatique `DAARA-AA-NNN`), tuteur, mensualité, interne, recherche, filtre par classe, archivage, export CSV |
| الحلقات / Classes | Halqas, moniteur (serigne), salle, niveau, horaires, objectif, progression moyenne |
| الحفظ / Hifz | Carte des 60 hizb par élève, séances (nouvelle mémorisation / révision / validation) avec sourate et versets, qualité de récitation, sens de mémorisation (depuis Al-Fatiha ou depuis An-Nas) |
| الغياب / Absences | Appel du jour en un clic, absences sur plusieurs jours avec motif |
| الرسوم / Mensualités | Statut par mois (payé / partiel / impayé / exonéré), arriérés, espèces / Wave / Orange Money, reçus imprimables, relance WhatsApp du tuteur, rapport mensuel imprimable |
| Bulletin | Fiche imprimable par élève (progression, séances, paiements) à remettre aux parents |
| الإعدادات / Paramètres | Infos du daara, mensualité par défaut, langue, sauvegarde / restauration JSON, données de démonstration |

## Utilisation

Aucune installation : ouvrez `daara/index.html` dans un navigateur, ou publiez le dossier (GitHub Pages, Netlify…).
Sur téléphone, « Ajouter à l'écran d'accueil » installe l'application, qui fonctionne ensuite sans Internet.

> ⚠️ Les données sont enregistrées **dans le navigateur de l'appareil**. Téléchargez régulièrement une sauvegarde depuis *Paramètres*.

## Fichiers

- `index.html` — structure de la page
- `app.js` — logique de l'application
- `i18n.js` — traductions arabe / français
- `quran.js` — sourates, nombre de versets, début des 60 hizb
- `styles.css` — styles (écran et impression)
- `sw.js`, `manifest.webmanifest` — fonctionnement hors connexion (PWA)
