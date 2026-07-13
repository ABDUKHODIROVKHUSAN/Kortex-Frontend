export function smoothScrollTo(hash: string) {
  const id = hash.replace(/^#/, "").replace(/^\//, "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window !== "undefined" && id) {
      const next = `#${id}`;
      if (window.location.hash !== next) {
        window.history.replaceState(null, "", next);
      }
    }
  }
}

export function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  pathname: string,
  anchor: string
) {
  const normalized = anchor.startsWith("#") ? anchor : `#${anchor}`;
  if (pathname === "/") {
    e.preventDefault();
    smoothScrollTo(normalized);
  } else {
    e.preventDefault();
    window.location.href = `/${normalized}`;
  }
}
