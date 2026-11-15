# Vita-Cora

**Bitácora y guía de salud para misiones espaciales simuladas.**

Vita-Cora es un prototipo educativo para NASA Space Apps 2026. Ayuda a una tripulación a registrar su descanso y alimentación, consultar guías de salud y practicar cómo pedir ayuda durante una misión espacial. La versión portátil permite consultar la información esencial cuando se pierde el acceso a los sistemas de la estación o la comunicación con Tierra.

## Qué incluye

| Módulo | Qué puedes hacer |
| --- | --- |
| **Sueño y fatiga** | Revisar el historial, comparar el descanso con una referencia personal simulada y descargar resúmenes. |
| **Guía de síntomas** | Explorar fichas ilustradas con posibles factores, qué observar y cuándo pedir ayuda. |
| **Nutrición lunar** | Registrar raciones de un menú espacial simulado, con alimentos termoestabilizados y leche UHT, y consultar referencias de vitaminas y minerales. |
| **Ayudar a un compañero** | Revisar guías animadas sobre falta de respuesta, heridas con sangrado y mareo o desorientación. |
| **Pausa orbital** | Seguir el ascenso y el aterrizaje de un cohete alrededor de la Luna para acompañar una pausa de respiración de 45 segundos. |
| **Simulador de misión** | Ensayar avisos a bordo en situaciones de práctica y descargar el informe de la simulación. |

## Abrir sin conexión

Descarga [`Vita-Cora-offline.html`](offline/Vita-Cora-offline.html) y ábrelo desde tu dispositivo con un navegador compatible. En GitHub puedes guardar el archivo con el botón **Download raw file**. El archivo reúne la interfaz, las ilustraciones y las animaciones. Los videos y las referencias externas requieren conexión.

## Probar el código en tu computador

Descarga o clona el repositorio. Abre una terminal en la carpeta que contiene `index.html` y ejecuta este comando si tienes Python 3:

```bash
python3 -m http.server 8000
```

En Windows también puedes usar `py -m http.server 8000`. Abre [http://localhost:8000](http://localhost:8000) en el navegador. Para detener el servidor, presiona `Ctrl+C` en la terminal.

La aplicación usa HTML, CSS y JavaScript, con recursos incluidos en `assets/`. Los registros y resúmenes se guardan en el navegador con `localStorage`. El simulador usa datos ficticios y genera archivos de práctica para descargar.

## Volver a compilar la versión portátil

Después de editar la aplicación, ejecuta este comando en la raíz del repositorio. En Windows puedes reemplazar `python3` por `py`.

```bash
python3 scripts/compile.py . offline/Vita-Cora-offline.html
```

## Alcance y fuentes

La aplicación ofrece material de entrenamiento y consulta. La guía describe factores posibles y señales de aviso. En una emergencia real, aplica los protocolos de tu misión y sigue las indicaciones del equipo médico.

- [NASA Human Research Program · Riesgos del vuelo espacial](https://www.nasa.gov/hrp/risks/)
- [NASA · Sueño insuficiente y horarios irregulares](https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/)
- [NASA · Alimentos y nutrición en vuelos espaciales](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-013-food-and-nutrition.pdf)
- [MedlinePlus · Información de salud en español](https://medlineplus.gov/spanish/)

Las tipografías Bitcount, Geist e IBM Plex Mono incluyen sus licencias en [`assets/`](assets/).
