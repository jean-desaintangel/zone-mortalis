# Zone Mortalis — Règles de Jeu (VF)

Site statique regroupant la traduction française des règles **Zone Mortalis** du *Journal Tactica* pour **Warhammer: The Horus Heresy** (30K). Pensé pour être consulté sur smartphone pendant les parties.

> ⚠️ Site fan-made, non officiel. Traduction partielle à usage personnel. *Warhammer* est une marque de Games Workshop.

## Structure

```
├── index.html              # Page d'accueil (navigation par cards)
├── css/style.css           # Thème parchemin Horus Heresy, mobile-first
├── js/main.js              # Menu hamburger, accordéon des règles, retour en haut
└── pages/
    ├── rules-core.html     # Règles Principales
    ├── rules-special.html  # Règles Spéciales
    ├── reserves.html       # Réserves
    ├── mission-pack.html   # Pack de Missions « Protocole de Nettoyage » (dont détachements et cartes de déploiement)
    ├── missions/            # Une page par mission du protocole de nettoyage
    ├── rules-advanced.html  # Règles Avancées (dont réactions avancées)
    ├── units.html           # Unités spéciales (sommaire)
    ├── units/               # Une fiche technique par unité additionnelle
    └── plan-du-site.html    # Plan du site (accès direct à toutes les pages)
```

Pour ajouter une nouvelle section : dupliquer une page de `pages/`, remplacer le contenu, puis ajouter le lien dans le menu de chaque page. Le comportement des accordéons est piloté par l'attribut `data-accordion` sur `<body>` (`sections`, `h3` ou `sequence` — voir l'en-tête de `js/main.js`).

Pour ajouter une nouvelle fiche d'unité : dupliquer une page de `pages/units/`, remplacer le contenu (le composant `.datasheet` et les tableaux `.rule-table` sont définis dans `css/style.css`), puis ajouter une carte vers la nouvelle fiche dans `pages/units.html`.

## Fonctionnalités

- 100 % statique : HTML + CSS + JS vanilla, aucun framework
- Responsive mobile-first (breakpoints 375 / 768 / 1024 px), menu hamburger
- Accordéon sur les pages de règles, en 3 variantes selon le contenu (voir `data-accordion` ci-dessus)
- Bouton « Retour en haut » flottant
- Accessibilité : lien d'évitement, focus clavier visible, accordéons à vrais boutons (`aria-expanded`/`aria-controls`), contrastes AA, cibles tactiles ≥ 44×44px, taille de police en unité relative (respecte les réglages du navigateur), `prefers-reduced-motion` respecté
- Balises Open Graph sur chaque page pour un aperçu enrichi lors d'un partage (Discord, réseaux sociaux)
- Script chargé en `defer` : n'interrompt pas l'affichage de la page
- Content-Security-Policy restrictive et favicon en SVG embarqué (pas de requête externe superflue)
- Google Fonts en `display=swap` avec polices de secours : le contenu reste lisible hors connexion

## Utilisation locale

Le site est entièrement statique : il suffit d'ouvrir [index.html](index.html) dans un navigateur, ou de l'héberger sur un simple serveur web local si vous préférez.

Aucune configuration supplémentaire n'est nécessaire (pas de `.htaccess`, pas de backend).
