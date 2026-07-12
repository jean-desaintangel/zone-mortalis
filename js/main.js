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

      var capture = false;
      Array.prototype.slice.call(card.childNodes).forEach(function (node) {
        if (node.nodeType !== 1) return;

        if (node.tagName === 'H2') {
          capture = false;
          return;
        }

        if (node.classList && (node.classList.contains('flavor') || node.classList.contains('rule-summary'))) {
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

      function toggleCard(force) {
        var shouldOpen = typeof force === 'boolean' ? force : !card.classList.contains('is-open');
        card.classList.toggle('is-open', shouldOpen);
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
