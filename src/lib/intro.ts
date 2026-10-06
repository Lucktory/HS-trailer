// Intro de la primera visita (video del contenedor que termina en el logo).
// Se muestra una vez por sesión y solo al entrar por la home. Lo decide introScript, en el <head>,
// antes de pintar: marca <html data-intro="on"> y el CSS muestra el telón y bloquea el scroll.
// Estados de data-intro: "on" (reproduciendo) → "leaving" (el telón sube) → "done".

export const INTRO_KEY = "hs-intro";
export const INTRO_EVENT = "hs:intro-done";

// Sin intro si: otra página, link a una sección (#), ya se vio en la sesión, movimiento reducido o ahorro de datos.
// Al terminar de leer el HTML arranca el video, sin esperar a React.
export const introScript = `try{var d=document.documentElement,c=navigator.connection;if(location.pathname==="/"&&!location.hash&&!sessionStorage.getItem("${INTRO_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!(c&&c.saveData)){d.dataset.intro="on";document.addEventListener("DOMContentLoaded",function(){var v=document.getElementById("intro-video");if(v){v.muted=true;v.play().catch(function(){})}})}}catch(e){}`;

// Llama a fn cuando el telón empieza a subir (o enseguida si no hay intro). Devuelve la función para desuscribirse.
export function onIntroDone(fn: () => void): () => void {
  if (document.documentElement.dataset.intro !== "on") {
    fn();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, fn, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, fn);
}
