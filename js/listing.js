(function () {
  const root = document.getElementById("listing-root");
  if (!root) return;

  const mode = root.getAttribute("data-mode") || "home";
  const category = root.getAttribute("data-category") || "";
  const pageSize = 9;

  function byDate(a, b) {
    return new Date(b.date) - new Date(a.date);
  }

  function cardHTML(item) {
    const img = item.image || "/images/valeria-story.jpg";
    const alt = item.imageAlt || item.title;
    const excerpt = item.excerpt || "";
    const dateLabel = item.dateDisplay || "";
    return (
      '<a class="article-card" href="/articulo/' + item.slug + '/">' +
        '<img src="' + img + '" alt="' + alt.replace(/"/g, "&quot;") + '" width="640" height="400" loading="lazy">' +
        '<div class="card-body">' +
          '<div class="card-meta">' +
            '<span class="meta-pill">' + (item.categoryName || "") + '</span>' +
            (dateLabel ? '<span class="meta-pill">' + dateLabel + '</span>' : "") +
          "</div>" +
          "<h3>" + item.title + "</h3>" +
          "<p>" + excerpt + "</p>" +
        "</div>" +
      "</a>"
    );
  }

  function featuredHTML(item) {
    const img = item.image || "/images/valeria-story.jpg";
    const alt = item.imageAlt || item.title;
    return (
      '<a class="featured-card" href="/articulo/' + item.slug + '/">' +
        '<img src="' + img + '" alt="' + alt.replace(/"/g, "&quot;") + '" width="1200" height="630">' +
        '<div class="featured-body">' +
          '<div class="eyebrow">♥ Destacada</div>' +
          "<h2>" + item.title + "</h2>" +
          "<p>" + (item.excerpt || "") + "</p>" +
          '<div class="story-meta" style="justify-content:flex-start;margin-top:18px">' +
            '<span class="meta-pill">' + (item.categoryName || "") + '</span>' +
            (item.dateDisplay ? '<span class="meta-pill">' + item.dateDisplay + "</span>" : "") +
          "</div>" +
        "</div>" +
      "</a>"
    );
  }

  fetch("/data/articles.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      const all = (data.articles || []).filter(function (a) { return a.status === "published"; }).sort(byDate);
      let items = all;
      if (mode === "category") {
        items = all.filter(function (a) { return a.category === category; });
      }

      if (!items.length) {
        root.innerHTML = '<div class="empty-state">Todavía no hay artículos en esta sección. Vuelve pronto.</div>';
        return;
      }

      let html = "";
      if (mode === "home") {
        html += featuredHTML(items[0]);
        html += '</div><div class="section-label">Últimas historias</div><div class="listing-wrap"><div class="card-grid" id="cardGrid">';
        const rest = items.slice(1);
        if (!rest.length) {
          html += '<div class="empty-state">Más historias aparecerán aquí cuando se publiquen.</div>';
        } else {
          html += rest.map(cardHTML).join("");
        }
      } else {
        html += '<div class="card-grid" id="cardGrid">';
        html += items.map(cardHTML).join("");
      }
      html += "</div>";
      if (items.length > pageSize + (mode === "home" ? 1 : 0)) {
        html += '<div class="load-more-wrap"><button class="share-btn" type="button" id="loadMore">Ver más</button></div>';
      }
      root.innerHTML = html;
    })
    .catch(function () {
      root.innerHTML = '<div class="empty-state">No se pudo cargar el catálogo de artículos.</div>';
    });
})();
