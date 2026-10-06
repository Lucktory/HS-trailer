// Solo servidor (usa el sistema de archivos al generar las páginas).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// URL con versión según el contenido del archivo: al reemplazar una foto (mismo nombre) cambia la URL,
// así la caché del optimizador de imágenes (4 h por defecto) nunca muestra la foto anterior.
export function versioned(publicPath: string): string {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", publicPath));
    return `${publicPath}?v=${crypto.createHash("sha1").update(buf).digest("hex").slice(0, 8)}`;
  } catch {
    return publicPath;
  }
}

const IMG = /^galeria-(\d+)\.(jpe?g|png|webp|avif)$/i;

// Devuelve las imágenes public/img/equipos/<slug>/galeria-N.* ordenadas por N.
// Para sumar fotos a una ficha alcanza con agregar archivos a esa carpeta.
export function galleryOf(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "img", "equipos", slug);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => IMG.test(f))
    .sort((a, b) => Number(a.match(IMG)![1]) - Number(b.match(IMG)![1]))
    .map((f) => versioned(`/img/equipos/${slug}/${f}`));
}

// Portada de un equipo. La versión de 6 m puede tener su propia foto (portada-6m.jpg);
// si no existe, se usa portada.jpg.
export function coverFor(slug: string, size?: string): string {
  const own = `/img/equipos/${slug}/portada-6m.jpg`;
  if (size === "6 m" && fs.existsSync(path.join(process.cwd(), "public", own))) return versioned(own);
  return versioned(`/img/equipos/${slug}/portada.jpg`);
}
