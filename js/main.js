/* ==========================================================================
   Zone Mortalis — main.js
   Menu hamburger · Recherche dans la page · Bouton retour en haut
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

  /* ---------- 2. Recherche dans la page courante ---------- */
  var input = document.getElementById('search-input');
  var btn = document.getElementById('search-btn');
  var counter = document.getElementById('search-count');
  var content = document.getElementById('content'); // zone dans laquelle on cherche
  var hits = [];       // liste des <mark> créés
  var current = -1;    // index du résultat courant

  // Supprime les surlignages existants (on "défait" les <mark>)
  function clearHighlights() {
    if (!content) return;
    var marks = content.querySelectorAll('mark.search-hit');
    marks.forEach(function (m) {
      var parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize(); // fusionne les nœuds texte adjacents
    });
    hits = [];
    current = -1;
    if (counter) counter.textContent = '';
  }

  // Parcourt tous les nœuds texte et entoure chaque occurrence d'un <mark>
  function highlight(term) {
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        // On ignore les scripts et les zones déjà surlignées
        var tag = node.parentNode.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') {
          return NodeFilter.FILTER_REJECT;
        }
        return node.nodeValue.toLowerCase().indexOf(term) !== -1
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      }
    });

    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function (node) {
      var text = node.nodeValue;
      var lower = text.toLowerCase();
      var frag = document.createDocumentFragment();
      var pos = 0;
      var idx = lower.indexOf(term);

      while (idx !== -1) {
        // Texte avant l'occurrence
        frag.appendChild(document.createTextNode(text.slice(pos, idx)));
        // L'occurrence, entourée d'un <mark>
        var mark = document.createElement('mark');
        mark.className = 'search-hit';
        mark.textContent = text.slice(idx, idx + term.length);
        frag.appendChild(mark);
        hits.push(mark);
        pos = idx + term.length;
        idx = lower.indexOf(term, pos);
      }
      // Reste du texte
      frag.appendChild(document.createTextNode(text.slice(pos)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  // Met en évidence le résultat courant et défile jusqu'à lui
  function goTo(index) {
    if (hits.length === 0) return;
    if (current >= 0) hits[current].classList.remove('current');
    current = (index + hits.length) % hits.length; // boucle
    hits[current].classList.add('current');
    hits[current].scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (counter) counter.textContent = (current + 1) + ' / ' + hits.length + ' résultat(s)';
  }

  function doSearch() {
    if (!content || !input) return;
    clearHighlights();
    var term = input.value.trim().toLowerCase();
    if (term.length < 2) {
      if (counter) counter.textContent = term.length === 1 ? 'Saisissez au moins 2 caractères.' : '';
      return;
    }
    highlight(term);
    if (hits.length === 0) {
      if (counter) counter.textContent = 'Aucun résultat pour « ' + input.value.trim() + ' ».';
    } else {
      goTo(0);
    }
  }

  if (btn) btn.addEventListener('click', doSearch);
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Entrée : nouvelle recherche, ou résultat suivant si déjà surligné
        if (hits.length > 0 && input.value.trim().toLowerCase() === hits[0].textContent.toLowerCase()) {
          goTo(current + 1);
        } else {
          doSearch();
        }
      }
    });
    // Efface les surlignages si le champ est vidé
    input.addEventListener('input', function () {
      if (input.value.trim() === '') clearHighlights();
    });
  }

  /* ---------- 3. Accordéon des règles spéciales ---------- */
  if (window.location.pathname.toLowerCase().endsWith('special-rules.html')) {
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

        if (node.classList && node.classList.contains('flavor')) {
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

  /* ---------- 4. Bouton retour en haut ---------- */
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
