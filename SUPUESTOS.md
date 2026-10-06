# Supuestos a confirmar con el cliente

El catálogo PDF (*HSTRAILERS COMERCIAL 07-26*) solo detalla **Vivienda 12 m, Comedor 12 m, Oficina 12 m y Pañol**.
Para publicar el sitio completo, el resto de las unidades se describió con **configuraciones estimadas**, tomadas de
lo que ofrecen otros proveedores de la región para campamentos petroleros y mineros (ver *Referencias*).
Todo lo de esta lista debe revisarse con Alejandro antes de publicar.

- Datos de cada unidad: `src/lib/fleet.ts` — cada variante tiene `source: "catalogo"` (del PDF) o `source: "estimado"`.
- Planos: `src/lib/plans.ts` — las configuraciones estimadas están debajo del separador *"Configuraciones estimadas"*.
- En todas las fichas se muestra la nota *"Equipamiento de referencia: puede variar según la unidad. Lo confirmamos al cotizar."*

## Unidades estimadas

| Ficha | Qué se asumió | Preguntar |
|---|---|---|
| **Company Man 12 m** | Dormitorio con 2 camas individuales, baño completo (con bidet), cocina-comedor (mesada con pileta, heladera, microondas, mesa para 4, termotanque 40 L) y oficina con 2 escritorios, mesa de reuniones para 4, pizarra y TV. Capacidad: 2 personas (company man de día y de noche). Aparece en los filtros Oficina, Dormitorio, Baño y Comedor. | ¿Es así la distribución? ¿1 dormitorio con 2 camas o 1 cama de 2 plazas? ¿Tiene cocina? |
| **Baño 12 m** | 4 inodoros en boxes, 4 mingitorios, 4 duchas de 90 × 90 con puerta, mesada con 5 bachas, vestuario con 2 lockers y 3 bancos, 2 termotanques de 150 L, 2 aires y 4 paneles. Alcanza para unas 50 personas por turno según el Decreto 351/79. | Cantidad real de inodoros, mingitorios, duchas y bachas. ¿Tiene vestuario? ¿Sectores separados (damas/caballeros)? Litros de termotanque. |
| **Baño 6 m** | 2 inodoros, 2 mingitorios, 2 duchas, mesada con 2 bachas, vestuario con 1 locker y banco, termotanque de 150 L. | Ídem (es el de menor certeza: muchos 6 m son solo baños y duchas). |
| **SUM 12 m** | Salón para 24 personas (6 mesas plegables, 24 sillas), TV 55", pizarra, biblioteca; sector de servicio con mesada y pileta, heladera, microondas, dispenser y termotanque 40 L; 2 aires y 2 paneles. Sin baño (se complementa con el Tráiler Baño). | ¿Para cuántas personas? ¿Qué equipamiento tiene? ¿Tiene agua? |
| **SUM 6 m** | Salón para 10 personas (2 mesas, 10 sillas), TV 55", pizarra; rincón de servicio sin agua (mesada, frigobar, microondas, dispenser); 1 aire y 1 panel. | Ídem |
| **Comedor 6 m** | Misma cocina que el de 12 m y mesa para 12 personas, 1 aire, 1 panel, dispenser, TV 55". | ¿Para cuántas personas? (el mercado va de 8 a 12) |
| **Oficina 6 m** | 4 escritorios, 4 sillas, 1 biblioteca, TV 55", dispenser, 1 aire, 1 panel. | ¿Cuántos puestos? |
| **Pañol 6 m** | Mismo equipamiento que el de 12 m (el PDF no distingue medidas; su foto es de un 6 m). | — |

## Otros supuestos

| Tema | Qué dice el sitio | Por qué es un supuesto |
|---|---|---|
| **Documentación firmada** (cálculo de vuelco, plano unifilar, carga de fuego) | Se lista en todas las unidades. | El PDF la muestra solo para Vivienda, Comedor y Oficina (pp. 5, 8, 11). ⚠ Es un compromiso técnico: confirmar antes de publicar. |
| **Entrega en locación** | Paso 3 del proceso: "Coordinamos el envío de las unidades a tu locación". | El PDF no menciona traslado ni montaje. |
| **"Salón de usos múltiples"** | Se usa para describir el SUM. | El PDF nunca desarrolla la sigla. |
| **Capacidad del Pañol** | "2 estanterías de 11 m" (12 m) y "2 estanterías de 5 m" (6 m). | Medido sobre nuestro plano; el PDF no da metros de estantería. |

## Contradicciones dentro del propio PDF (se eligió una versión)

| Unidad | En el sitio | La otra versión del PDF |
|---|---|---|
| **Vivienda 12 m – calefacción** | "2 paneles calefactores 550W por dormitorio" y "2 aires (1 por dormitorio)". | La ficha (p. 5) dice "2 paneles" sin aclarar si es por dormitorio o en total; el plano (p. 4) dibuja al menos 2 por dormitorio. |
| **Vivienda 12 m – TV** | TV Smart 55" en el grupo Dormitorios (ficha p. 5). | El plano (p. 4) dibuja un TV LED 32" junto a la mesa del comedor. |
| **Vivienda 12 m – cocina** | Heladera en el rincón junto al baño y mesada de 1,10 m, mesa contra el muro. | El plano (p. 4) dibuja una mesada de 1,40 m y no dibuja la heladera. |
| **Comedor 12 m** | Termotanque 40 L y heladera con freezer (ficha p. 8). | El plano (p. 7) indica termotanque 80 L y frigobar bajo. |

## Referencias usadas para estimar

- **Company Man:** Seroil (Neuquén), Kiter Simha (Neuquén), PyG Servicios, 4housing, Serval. Todos describen dormitorio + baño + cocina-comedor + oficina.
- **Baño:** plano del tráiler sanitario 12 m de PyG Servicios (4 inodoros, 5 mingitorios, 4 duchas, 5 bachas, vestuario); Basani, Tecno Fast y Alquimodul para 6 m.
- **SUM:** Serval (sala de capacitación), Mobilbox (SUM con módulos de 6 m), 4housing.
- **6 m:** PyG Servicios y GM Servicios (Neuquén), más proveedores de contenedores oficina/comedor de 20 pies.

## Pendientes (no son supuestos)

- Datos de contacto reales en `src/lib/site.ts` (WhatsApp, email, dominio, redes).
- Fotos reales de cada unidad (ver `IMAGENES.md`). Las actuales son provisorias.
