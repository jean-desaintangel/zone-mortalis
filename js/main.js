/* ==========================================================================
   Zone Mortalis — main.js
   Menu hamburger · Accordéons des règles · Bouton retour en haut
   JavaScript vanilla (ES6), aucune dépendance.

   Le comportement des accordéons est piloté par l'attribut data-accordion
   posé sur <body> dans chaque page HTML (et non par l'URL de la page,
   qui pourrait changer avec un renommage ou une réécriture d'URL) :
     - data-accordion="sections" : chaque <section> à résumé devient un tiroir
     - data-accordion="h3"       : chaque titre <h3> ouvre son propre tiroir
     - data-accordion="sequence" : seules les sections numérotées se replient
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Menu hamburger (mobile) ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      // aria-expanded : accessibilité + pilote l'animation CSS du bouton
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Ferme le menu quand on clique sur un lien (utile en navigation par ancres)
    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. Accordéons ---------- */

  // Compteur global : garantit un id unique par tiroir pour aria-controls.
  let accordionCount = 0;

  /**
   * Transforme un trio (carte, titre, tiroir) en accordéon accessible.
   * Un vrai <button> est injecté DANS le titre : le h2/h3 conserve ainsi sa
   * sémantique de titre pour les lecteurs d'écran (navigation par titres),
   * et le bouton natif gère Entrée/Espace sans code clavier supplémentaire.
   */
  function makeAccordion(card, heading, details) {
    card.classList.add('rule-card');
    heading.classList.add('rule-heading');

    const btn = document.createElement('button');
    btn.type = 'button'; // évite tout comportement "submit" si un jour dans un <form>
    btn.className = 'rule-trigger';
    btn.setAttribute('aria-expanded', 'false');

    // On déplace le contenu du titre dans le bouton (le titre enveloppe le bouton).
    while (heading.firstChild) {
      btn.appendChild(heading.firstChild);
    }
    heading.appendChild(btn);

    // Lien programmatique bouton → panneau (aria-controls exige un id).
    accordionCount += 1;
    details.id = `rule-details-${accordionCount}`;
    btn.setAttribute('aria-controls', details.id);

    card.appendChild(details);

    btn.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      // aria-expanded informe les lecteurs d'écran de l'état ouvert/fermé.
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const mode = document.body.dataset.accordion;

  /* --- Mode "sections" : règles principales, spéciales et réactions --- */
  if (mode === 'sections') {
    document.querySelectorAll('.rules-content > section').forEach((card) => {
      const heading = card.querySelector(':scope > h2');
      if (!heading) return; // section sans titre h2 direct (ex. encadré seul)

      const details = document.createElement('div');
      details.className = 'rule-details';

      // On ne déplace dans le tiroir que ce qui vient APRÈS le résumé
      // (.rule-summary) : le titre et le résumé restent toujours visibles,
      // même carte fermée. Le drapeau "capture" bascule à true dès qu'on
      // croise le résumé, et repasse à false si un nouveau H2 apparaît.
      // Si la section ne contient aucun résumé, il n'y a rien à garder
      // visible en permanence : tout ce qui suit le H2 se replie.
      const hasSummary = !!card.querySelector(':scope > .rule-summary');
      let capture = !hasSummary;
      Array.from(card.children).forEach((node) => {
        if (node.tagName === 'H2') {
          capture = !hasSummary;
          return;
        }
        if (node.classList.contains('rule-summary')) {
          capture = true;
          return;
        }
        if (capture) {
          details.appendChild(node);
        }
      });

      // Rien à replier (pas de résumé ou pas de détail) : pas d'accordéon.
      if (details.childNodes.length === 0) return;

      makeAccordion(card, heading, details);
    });
  }

  /* --- Mode "h3" : stratagèmes de réserves --- */
  if (mode === 'h3') {
    // Les H3 ne sont pas dans des <section> séparées : on exclut ceux qui se
    // trouvent dans un encadré .callout (ils ne doivent pas devenir des
    // accordéons), et on garde ceux du texte courant.
    const stratHeadings = Array.from(document.querySelectorAll('.rules-content h3'))
      .filter((heading) => !heading.closest('.callout'));

    stratHeadings.forEach((heading) => {
      const card = document.createElement('div');
      heading.parentNode.insertBefore(card, heading);
      card.appendChild(heading);

      const details = document.createElement('div');
      details.className = 'rule-details';

      // Comme il n'y a pas de conteneur dédié par stratagème, on "aspire"
      // les éléments frères qui suivent le titre, un par un, jusqu'au H3
      // suivant (= le prochain stratagème) ou la fin du bloc.
      let next = card.nextSibling;
      while (next && !(next.nodeType === 1 && next.tagName === 'H3')) {
        const toMove = next;
        next = next.nextSibling;
        details.appendChild(toMove);
      }

      makeAccordion(card, heading, details);
    });
  }

  /* --- Mode "sequence" : séquence de mission (sections numérotées) --- */
  if (mode === 'sequence') {
    // Seules les sections numérotées ("1. Sélectionner…", "2. …") forment la
    // Séquence de Mission ; les sections d'objectifs, non numérotées, ne
    // doivent pas devenir des accordéons et sont donc ignorées par ce filtre.
    Array.from(document.querySelectorAll('.rules-content > section'))
      .filter((section) => {
        const heading = section.querySelector(':scope > h2');
        return heading && /^\d+\.\s/.test(heading.textContent.trim());
      })
      .forEach((section) => {
        const heading = section.querySelector(':scope > h2');

        const details = document.createElement('div');
        details.className = 'rule-details';

        let next = heading.nextSibling;
        while (next) {
          const toMove = next;
          next = next.nextSibling;
          details.appendChild(toMove);
        }

        makeAccordion(section, heading, details);
      });
  }

  /* ---------- 3. Bouton retour en haut ---------- */
  const topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      // Affiché après un écran de défilement
      topBtn.classList.toggle('visible', window.scrollY > window.innerHeight);
    }, { passive: true });

    topBtn.addEventListener('click', () => {
      // Respecte le réglage "réduire les animations" du système (a11y).
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

});
