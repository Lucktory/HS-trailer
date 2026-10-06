# Imágenes del sitio

Reemplazá los archivos manteniendo **el mismo nombre y carpeta**. No hace falta tocar código.
Formato recomendado: JPG (o WebP), calidad ~80. Next.js las optimiza al publicar.
Al reemplazar una foto, la web muestra la nueva enseguida (cada URL lleva una versión según el contenido del archivo).

## Equipos — `public/img/equipos/<carpeta>/`

| Carpeta | Equipo | Fichas |
|---|---|---|
| `vivienda` | Tráiler Vivienda | `/flota/vivienda-12m` |
| `comedor` | Tráiler Comedor | `/flota/comedor-12m`, `/flota/comedor-6m` |
| `oficina` | Tráiler Oficina | `/flota/oficina-12m`, `/flota/oficina-6m` |
| `bano` | Tráiler Baño | `/flota/bano-12m`, `/flota/bano-6m` |
| `panol` | Pañol | `/flota/panol-12m`, `/flota/panol-6m` |
| `sum` | Tráiler SUM | `/flota/sum-12m`, `/flota/sum-6m` |
| `company-man` | Tráiler Company Man | `/flota/company-man-12m` |
| `generadores` | Generadores | (tarjeta en la home, consulta por WhatsApp) |

Una carpeta por tipo de equipo. Las versiones de 12 m y 6 m comparten carpeta; la de 6 m puede tener su propia portada
(se usa en su tarjeta y en el encabezado de su ficha).

Archivos dentro de cada carpeta:

| Archivo | Dónde se ve | Tamaño recomendado |
|---|---|---|
| `portada.jpg` | Tarjeta en "Nuestros equipos" (formato 16:10) | 1600 × 1000 px |
| `portada-6m.jpg` | Opcional: foto propia para la tarjeta de la versión 6 m (si no está, usa `portada.jpg`) | 1600 × 1000 px |
| `galeria-1.jpg` | Fondo del encabezado de la ficha de 12 m + galería | 2400 × 1350 px (16:9) |
| `galeria-2.jpg`, `galeria-3.jpg`, … | Galería de las fichas del equipo (aparece con 2 o más) | 2400 × 1350 px (16:9) |

Se pueden agregar tantas `galeria-N` como quieras; se ordenan por número.
Si una carpeta no tiene `galeria-1`, el encabezado de la ficha de 12 m usa `portada.jpg`.

## Secciones — `public/img/secciones/`

| Archivo | Dónde se ve | Tamaño recomendado |
|---|---|---|
| `servicio.jpg` | Banda "Más que un alquiler" (a la derecha) y vista previa al compartir el link | 1600 × 1200 px |
| `nosotros.jpg` | "Por qué elegirnos": foto en diagonal del panel azul (en celular, debajo del título). Hoy es un cuadro del video `hs-3`; mejor una foto real con el tráiler al centro | 1600 × 1200 px |
| `contacto.jpg` | Fondo de la sección de contacto (queda oscurecido) | 2400 × 1350 px |

## Videos del hero — `public/video/`

`hs-1`, `hs-2`, `hs-3` en `.mp4` y `.webm` (se reproducen en ese orden, en bucle) y `hs-1-poster.jpg`
(primer cuadro, se muestra mientras carga).

## Logo — `src/assets/brand/`

| Archivo | Uso |
|---|---|
| `logo-on-dark.png` | Header sobre el video y footer ("TRAILERS" en blanco) |
| `logo-on-light.png` | Header al hacer scroll ("TRAILERS" en azul oscuro) |

Íconos de la pestaña del navegador: `src/app/icon.png` (512 × 512) y `src/app/apple-icon.png` (180 × 180).
Si llega el logo en SVG, se reemplazan estos PNG por el vector.
