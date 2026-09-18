# Historias de Conexión

Sitio estático en español. Se publica en Vercel. Los artículos nuevos los crea n8n y los sube a GitHub.

## No tocar

- Códigos de anuncios Accedelid en las plantillas
- Historia original en `/articulo/le-escribi-estas-bien/`
- Colores, tipografía y modo oscuro

## Estructura

- `/` listado
- `/categoria/{slug}/` categorías
- `/articulo/{slug}/` artículos
- `/data/articles.json` catálogo
- `/templates/article.html` plantilla que usa n8n
- `/sitemap.xml` y `/robots.txt`

## Variables que usa n8n

SITE_BASE_URL, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, IMGBB_API_KEY, CLOUDFLARE_ACCOUNT_ID
