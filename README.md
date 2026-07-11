# Zone Mortalis — Règles de Jeu (VF)

Site statique regroupant la traduction française des règles **Zone Mortalis** du *Journal Tactica* pour **Warhammer: The Horus Heresy** (30K). Pensé pour être consulté sur smartphone pendant les parties.

> ⚠️ Site fan-made, non officiel. Traduction partielle à usage personnel. *Warhammer* est une marque de Games Workshop.

## Structure

```
├── index.html              # Page d'accueil (navigation par cards)
├── css/style.css           # Thème sombre Horus Heresy, mobile-first
├── js/main.js              # Menu hamburger, recherche, retour en haut
└── pages/
    ├── core-rules.html     # ⚙️ Règles Principales
    ├── special-rules.html  # ✦ Règles Spéciales
    ├── reactions.html      # ⚡ Réactions
    ├── reserves.html       # 🔄 Réserves
    └── mission-pack.html   # 🎯 Pack de Missions « Protocole de Nettoyage »
```

Sections prévues (badge « Bientôt disponible ») : Armurerie, Listes d'armées, FAQ / Errata. Pour en ajouter une : dupliquer une page de `pages/`, remplacer le contenu, puis activer le lien dans le menu de chaque page.

## Fonctionnalités

- 100 % statique : HTML + CSS + JS vanilla, aucun framework
- Responsive mobile-first (breakpoints 375 / 768 / 1024 px), menu hamburger
- Recherche par mot-clé dans la page courante (surlignage + navigation entre résultats)
- Bouton « Retour en haut » flottant
- Google Fonts en `display=swap` avec polices de secours : le contenu reste lisible hors connexion

## Déploiement sur GitHub Pages

1. Créer un dépôt GitHub (ex. `zone-mortalis`) et pousser ces fichiers à la racine :
   ```bash
   git init
   git add index.html css js pages README.md
   git commit -m "Site Zone Mortalis VF"
   git branch -M main
   git remote add origin https://github.com/<votre-compte>/zone-mortalis.git
   git push -u origin main
   ```
2. Sur GitHub : **Settings → Pages → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est publié après une minute à l'adresse :
   `https://<votre-compte>.github.io/zone-mortalis/`

Aucune configuration supplémentaire n'est nécessaire (pas de `.htaccess`, pas de backend).
