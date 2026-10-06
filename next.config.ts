import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos de /img llevan ?v=<hash del archivo> para que un reemplazo se vea al instante;
    // el resto de las imágenes locales, sin parámetros (valor por defecto de Next 16).
    localPatterns: [{ pathname: "/img/**" }, { pathname: "/**", search: "" }],
  },
};

export default nextConfig;
