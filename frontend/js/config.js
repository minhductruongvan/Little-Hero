const localHosts = new Set(["localhost", "127.0.0.1"]);
window.LITTLE_HERO_API_BASE = localHosts.has(window.location.hostname) && window.location.protocol === "http:"
  ? `http://${window.location.hostname}:31377`
  : "https://little-hero.onrender.com";
