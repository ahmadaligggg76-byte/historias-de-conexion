(function () {
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = localStorage.getItem("story-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (themeBtn) themeBtn.textContent = "☀";
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const dark = document.body.classList.contains("dark");
      localStorage.setItem("story-theme", dark ? "dark" : "light");
      themeBtn.textContent = dark ? "☀" : "☾";
    });
  }

  const progressBar = document.getElementById("progress");
  const topBtn = document.getElementById("topBtn");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";
    if (topBtn) {
      if (scrollTop > 500) topBtn.classList.add("show");
      else topBtn.classList.remove("show");
    }
  });
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  async function shareStory() {
    const title = document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : document.title;
    const descMeta = document.querySelector('meta[name="description"]');
    const shareData = {
      title: title,
      text: descMeta ? descMeta.getAttribute("content") : "",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Enlace copiado.");
      } else {
        alert("Copia el enlace de esta página para compartirla.");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  }
  const shareBtn = document.getElementById("shareBtn");
  const shareTop = document.getElementById("shareTop");
  if (shareBtn) shareBtn.addEventListener("click", shareStory);
  if (shareTop) shareTop.addEventListener("click", shareStory);

  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAccept = document.getElementById("cookieAccept");
  if (cookieBanner && localStorage.getItem("cookie-consent") === "accepted") {
    cookieBanner.classList.add("hide");
  }
  if (cookieAccept && cookieBanner) {
    cookieAccept.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "accepted");
      cookieBanner.classList.add("hide");
    });
  }
})();
