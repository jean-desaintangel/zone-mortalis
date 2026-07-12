/* ==========================================================================
   Zone Mortalis — main.js
   Menu hamburger · Bouton retour en haut
   JavaScript vanilla, aucune dépendance.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Menu hamburger (mobile) ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      // aria-expanded : accessibilité + pilote l'animation CSS du bouton
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Ferme le menu quand on clique sur un lien (utile en navigation par ancres)
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. Accordéon des règles affichées en version compacte ---------- */
  if (window.location.pathname.toLowerCase().endsWith('special-rules.html') ||
      window.location.pathname.toLowerCase().endsWith('core-rules.html') ||
      window.location.pathname.toLowerCase().endsWith('reactions.html')) {
    var ruleCards = document.querySelectorAll('#content > section');

    ruleCards.forEach(function (card) {
      card.classList.add('rule-card');

      var heading = card.querySelector('h2');
      if (!heading) return;

      heading.classList.add('rule-trigger');
      heading.setAttribute('role', 'button');
      heading.setAttribute('tabindex', '0');
      heading.setAttribute('aria-expanded', 'false');

      var details = document.createElement('div');
      details.className = 'rule-details';

      // On ne déplace dans le tiroir "details" que ce qui vient APRES le résumé
      // (.rule-summary) : le titre et le résumé restent donc toujours visibles,
      // même carte fermée. Le drapeau "capture" bascule à true dès qu'on croise
      // le résumé, et repasse à false si un nouveau H2 apparaît (sécurité).
      var capture = false;
      Array.prototype.slice.call(card.childNodes).forEach(function (node) {
        if (node.nodeType !== 1) return;

        if (node.tagName === 'H2') {
          capture = false;
          return;
        }

        if (node.classList && node.classList.contains('rule-summary')) {
          capture = true;
          return;
        }

        if (capture) {
          details.appendChild(node);
        }
      });

      if (details.childNodes.length > 0) {
        card.appendChild(details);
      }

      // "force" permet d'imposer un état (true/false) plutôt que de toujours
      // basculer l'état courant ; pratique si on veut un jour ouvrir/fermer
      // une carte depuis l'extérieur sans passer par un clic utilisateur.
      function toggleCard(force) {
        var shouldOpen = typeof force === 'boolean' ? force : !card.classList.contains('is-open');
        card.classList.toggle('is-open', shouldOpen);
        // aria-expanded informe les lecteurs d'écran de l'état ouvert/fermé.
        heading.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      }

      heading.addEventListener('click', function () {
        toggleCard();
      });

      heading.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard();
        }
      });
    });
  }

  /* ---------- 2bis. Accordéon des Stratagèmes de Réserves (titres h3) ---------- */
  if (window.location.pathname.toLowerCase().endsWith('reserves.html')) {
    // Ici les H3 ne sont pas dans des <section> séparées : on exclut donc les
    // titres qui se trouvent déjà dans un encadré .callout (ils ne doivent
    // pas devenir des accordéons), et on garde ceux du texte courant.
    var stratHeadings = Array.prototype.filter.call(document.querySelectorAll('#content h3'), function (heading) {
      return !heading.closest('.callout');
    });

    stratHeadings.forEach(function (heading) {
      var card = document.createElement('div');
      card.className = 'rule-card';
      heading.parentNode.insertBefore(card, heading);
      card.appendChild(heading);

      heading.classList.add('rule-trigger');
      heading.setAttribute('role', 'button');
      heading.setAttribute('tabindex', '0');
      heading.setAttribute('aria-expanded', 'false');

      var details = document.createElement('div');
      details.className = 'rule-details';

      // Comme il n'y a pas de conteneur dédié par stratagème, on "aspire"
      // les éléments frères qui suivent le titre, un par un, jusqu'au H3
      // suivant (= le prochain stratagème) ou la fin du bloc.
      var next = card.nextSibling;
      while (next && !(next.nodeType === 1 && next.tagName === 'H3')) {
        var toMove = next;
        next = next.nextSibling;
        details.appendChild(toMove);
      }

      card.appendChild(details);

      function toggleCard() {
        var shouldOpen = !card.classList.contains('is-open');
        card.classList.toggle('is-open', shouldOpen);
        heading.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      }

      heading.addEventListener('click', toggleCard);
      heading.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard();
        }
      });
    });
  }

  /* ---------- 2ter. Accordéon de la Séquence de Mission (mission-pack.html) ---------- */
  if (window.location.pathname.toLowerCase().endsWith('mission-pack.html')) {
    // Seules les sections numérotées ("1. Sélectionner...", "2. ...") forment
    // la Séquence de Mission ; les sections d'objectifs, non numérotées, ne
    // doivent pas devenir des accordéons et sont donc ignorées par ce filtre.
    var sequenceSections = Array.prototype.filter.call(document.querySelectorAll('#content > section'), function (section) {
      var heading = section.querySelector('h2');
      return heading && /^\d+\.\s/.test(heading.textContent.trim());
    });

    sequenceSections.forEach(function (section) {
      section.classList.add('rule-card');

      var heading = section.querySelector('h2');
      heading.classList.add('rule-trigger');
      heading.setAttribute('role', 'button');
      heading.setAttribute('tabindex', '0');
      heading.setAttribute('aria-expanded', 'false');

      var details = document.createElement('div');
      details.className = 'rule-details';

      var next = heading.nextSibling;
      while (next) {
        var toMove = next;
        next = next.nextSibling;
        details.appendChild(toMove);
      }
      section.appendChild(details);

      function toggleCard() {
        var shouldOpen = !section.classList.contains('is-open');
        section.classList.toggle('is-open', shouldOpen);
        heading.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      }

      heading.addEventListener('click', toggleCard);
      heading.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard();
        }
      });
    });
  }

  /* ---------- 3. Bouton retour en haut ---------- */
  var topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      // Affiché après un écran de défilement
      topBtn.classList.toggle('visible', window.scrollY > window.innerHeight);
    }, { passive: true });

    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
