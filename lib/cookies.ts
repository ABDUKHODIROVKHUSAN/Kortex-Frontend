export function setClientCookie(name: string, value: string, maxAge = 31536000) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}
