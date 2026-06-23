export function smoothScrollTo(hash: string) {
  const id = hash.replace(/^#/, "").replace(/^\//, "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  pathname: string,
  anchor: string
) {
  const href = pathname === "/" ? anchor : `/${anchor}`;
  if (pathname === "/") {
    e.preventDefault();
    smoothScrollTo(anchor);
  } else if (href.startsWith("/#")) {
    e.preventDefault();
    window.location.href = href;
  }
}
