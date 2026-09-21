(function () {
  const root = document.getElementById("listing-root");
  if (!root) return;

  const mode = root.getAttribute("data-mode") || "home";
  const category = root.getAttribute("data-category") || "";
  const pageSize = 9;

  function byDate(a, b) {
    return new Date(b.date) - new Date(a.date);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardHTML(item) {
    const img = item.image || "/images/valeria-story.jpg";
    const alt = item.imageAlt || item.title;
    return (
      '<a class="article-card" href="/articulo/' + esc(item.slug) + '/">' +
        '<span class="card-img"><img src="' + esc(img) + '" alt="' + esc(alt) + '" width="640" height="400" loading="lazy"></span>' +
        '<span class="card-body">' +
          '<span class="card-meta">' +
            '<span class="meta-pill">' + esc(item.categoryName || "") + "</span>" +
            (item.dateDisplay ? '<span class="meta-pill">' + esc(item.dateDisplay) + "</span>" : "") +
          "</span>" +
          '<span class="card-title">' + esc(item.title) + "</span>" +
          '<span class="card-excerpt">' + esc(item.excerpt || "") + "</span>" +
        "</span>" +
      "</a>"
    );
  }

  function featuredHTML(item) {
    const img = item.image || "/images/valeria-story.jpg";
    const alt = item.imageAlt || item.title;
    return (
      '<a class="featured-card" href="/articulo/' + esc(item.slug) + '/">' +
        '<span class="featured-img"><img src="' + esc(img) + '" alt="' + esc(alt) + '" width="1200" height="630" loading="eager"></span>' +
        '<span class="featured-body">' +
          '<span class="eyebrow">\u2665 Destaque</span>' +
          '<span class="featured-title">' + esc(item.title) + "</span>" +
          '<span class="featured-excerpt">' + esc(item.excerpt || "") + "</span>" +
          '<span class="story-meta" style="justify-content:flex-start;margin-top:4px">' +
            '<span class="meta-pill">' + esc(item.categoryName || "") + "</span>" +
            (item.dateDisplay ? '<span class="meta-pill">' + esc(item.dateDisplay) + "</span>" : "") +
          "</span>" +
        "</span>" +
      "</a>"
    );
  }

  function emptyHTML(msg) {
    return '<div class="empty-state">' + msg + "</div>";
  }

  let pool = [];
  let shown = 0;

  function paint() {
    const grid = document.getElementById("cardGrid");
    const btn = document.getElementById("loadMore");
    if (!grid) return;
    grid.innerHTML = pool.slice(0, shown).map(cardHTML).join("");
    if (btn) {
      btn.style.display = shown >= pool.length ? "none" : "";
    }
  }

  fetch("/data/articles.json")
    .then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    })
    .then(function (data) {
      let items = (data.articles || [])
        .filter(function (a) { return a.status === "published"; })
        .sort(byDate);
      if (mode === "category") {
        items = items.filter(function (a) { return a.category === category; });
      }

      if (!items.length) {
        root.innerHTML = emptyHTML("Ainda n\u00e3o h\u00e1 artigos nesta se\u00e7\u00e3o. Volte em breve.");
        return;
      }

      let html = "";
      if (mode === "home") {
        html += featuredHTML(items[0]);
        pool = items.slice(1);
        html += '<div class="section-label">\u00daltimas hist\u00f3rias</div>';
        html += '<div class="card-grid" id="cardGrid"></div>';
        if (!pool.length) {
          html += emptyHTML("Mais hist\u00f3rias aparecer\u00e3o aqui quando forem publicadas.");
        } else if (pool.length > pageSize) {
          html += '<div class="load-more-wrap"><button class="share-btn" type="button" id="loadMore">Ver mais</button></div>';
        }
      } else {
        pool = items;
        html += '<div class="card-grid" id="cardGrid"></div>';
        if (pool.length > pageSize) {
          html += '<div class="load-more-wrap"><button class="share-btn" type="button" id="loadMore">Ver mais</button></div>';
        }
      }

      shown = Math.min(pageSize, pool.length);
      root.innerHTML = html;
      paint();

      const btn = document.getElementById("loadMore");
      if (btn) {
        btn.addEventListener("click", function () {
          shown += pageSize;
          paint();
        });
      }
    })
    .catch(function () {
      root.innerHTML = emptyHTML("N\u00e3o foi poss\u00edvel carregar o cat\u00e1logo de artigos.");
    });
})();
