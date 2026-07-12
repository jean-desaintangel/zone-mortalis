# Zone Mortalis — Règles de Jeu (VF)

Site statique regroupant la traduction française des règles **Zone Mortalis** du *Journal Tactica* pour **Warhammer: The Horus Heresy** (30K). Pensé pour être consulté sur smartphone pendant les parties.

> ⚠️ Site fan-made, non officiel. Traduction partielle à usage personnel. *Warhammer* est une marque de Games Workshop.

## Structure

```
├── index.html              # Page d'accueil (navigation par cards)
├── css/style.css           # Thème parchemin Horus Heresy, mobile-first
├── js/main.js              # Menu hamburger, accordéon des règles, retour en haut
└── pages/
    ├── core-rules.html     # Règles Principales
    ├── special-rules.html  # Règles Spéciales
    ├── reserves.html       # Réserves
    ├── mission-pack.html   # Pack de Missions « Protocole de Nettoyage »
    └── advanced-rules.html # Règles Avancées (dont réactions avancées)
```

Pour ajouter une nouvelle section : dupliquer une page de `pages/`, remplacer le contenu, puis ajouter le lien dans le menu de chaque page. Le comportement des accordéons est piloté par l'attribut `data-accordion` sur `<body>` (`sections`, `h3` ou `sequence` — voir l'en-tête de `js/main.js`).

## Fonctionnalités

- 100 % statique : HTML + CSS + JS vanilla, aucun framework
- Responsive mobile-first (breakpoints 375 / 768 / 1024 px), menu hamburger
- Accordéon pour les règles spéciales, réactions et stratagèmes de réserves
- Bouton « Retour en haut » flottant
- Accessibilité : lien d'évitement, focus clavier visible, accordéons à vrais boutons (`aria-expanded`/`aria-controls`), contrastes AA, `prefers-reduced-motion` respecté
- Google Fonts en `display=swap` avec polices de secours : le contenu reste lisible hors connexion

## Utilisation locale

Le site est entièrement statique : il suffit d'ouvrir [index.html](index.html) dans un navigateur, ou de l'héberger sur un simple serveur web local si vous préférez.

Aucune configuration supplémentaire n'est nécessaire (pas de `.htaccess`, pas de backend).
