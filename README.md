# Pokémon TCG Collection App

Aplicación móvil para gestionar tu colección de **cartas Pokémon TCG** con información completa en español. Lleva un registro detallado de cada carta individual que posees.

## Características principales

### Galería de Cartas TCG
- **Más de 17,000 cartas** del Pokémon Trading Card Game oficial
- **Interfaz completamente en español** (nombres de cartas, sets y rarezas traducidos)
- **Visualización por Pokémon**: Cada Pokémon muestra todas sus cartas TCG disponibles
- **Sistema de doble filtro**:
  - **Filtro por forma del Pokémon**: Normal, Alola, Galar, Hisui, Paldea, Mega (Mega, Mega X, Mega Y), Gigantamax
  - **Filtro por tipo de carta**: Básica, Fase 1, Fase 2, V, VMAX, VSTAR, EX, GX, BREAK, Radiante
  - Nota: Si eliges Mega, la app detecta Mega, Mega X y Mega Y para mostrar solo las cartas correspondientes.
- **Gestión individual de cartas**:
  - Cada carta tiene su propio contador (+/-)
  - Badge visual muestra cantidad que posees
  - Información de set y rareza
  - HP visible cuando aplica
- **Visualización**:
  - Modal de pantalla completa para ver cartas
  - **Zoom 2x** con doble tap en la imagen
  - **Arrastre** para mover la imagen cuando está en zoom
  - Controles +/- accesibles sin salir del zoom

### Pokédex Integrada
- **1025 Pokémon** de las Generaciones 1-9
- **Información detallada** en español:
  - Tipos elementales con colores distintivos
  - Estadísticas base con barras visuales
  - Altura, peso y características
  - Descripción oficial traducida
  - Habilidades con explicación completa
  - Debilidades de tipo
  - Cadena evolutiva
  - Datos de crianza
- **Formas regionales** con selector interactivo:
  - Alola (Gen 7) - Adaptaciones tropicales
  - Galar (Gen 8) - Variantes británicas  
  - Hisui (Leyendas Arceus) - Formas antiguas
  - Paldea (Gen 9) - Variantes ibéricas
  - Mega Evoluciones (Gen 6-7)
  - Gigantamax (Gen 8)
- Búsqueda por nombre o número
- Filtros por tipo elemental
- Carga paginada optimizada

### Sistema de Colección
- **Gestión por carta individual** con ID único
- **Contador independiente** para cada versión de carta
- **Vista de colección** muestra solo las cartas que posees
- **Estadísticas en tiempo real**:
  - Cartas únicas en tu colección
  - Total de cartas (incluyendo repetidas)
- **Persistencia local** con AsyncStorage

## Pantallas principales

### 1️.- Pokédex
- Lista completa de Pokémon con búsqueda y filtros
- Acceso rápido a información del Pokémon
- Navegación por pestañas entre Info y Cartas TCG

### 2️.- Galería de Cartas TCG
Dentro del modal de cada Pokémon encontrarás:

**Tab "Información":**
- Datos completos del Pokémon (tipos, stats, habilidades, evoluciones, etc.)
- Información actualizada según forma seleccionada

**Tab "Cartas TCG":**
- **Selector de forma regional** (aparece si el Pokémon tiene variantes):
  - Normal, Alola, Galar, Hisui, Paldea, Mega, Gigantamax
  - Cada forma muestra sus cartas específicas
  
- **Filtros de tipo de carta** (aparecen según disponibilidad):
  - [Todas] - Muestra todas las cartas
  - [Básica] - Solo cartas básicas
  - [Fase 1] - Solo evoluciones fase 1
  - [Fase 2] - Solo evoluciones fase 2
  - [V] - Solo cartas V
  - [VMAX] - Solo cartas VMAX
  - [VSTAR] - Solo cartas VSTAR
  - [EX] - Solo cartas EX/ex
  - [GX] - Solo cartas GX
  - [BREAK] - Solo cartas BREAK
  - [Radiante] - Solo cartas Radiante

- **Galería de cartas** con:
  - Imagen oficial de cada carta
  - Nombre y set de procedencia
  - Rareza (cuando disponible)
  - Badge verde con tipo de carta
  - Badge rojo con cantidad que posees (si >0)
  - Botones +/- para gestionar cantidad

- **Visualización en detalle**:
  - Toca cualquier carta para verla en pantalla completa
  - **Doble tap** para activar zoom 2x
  - **Arrastra** con el dedo cuando está en zoom
  - **Doble tap nuevamente** para salir del zoom
  - Controles +/- disponibles en la parte inferior
  - Contador actualizado en tiempo real

### 3.- Mi Colección
- **Vista de todas tus cartas TCG**
- Cada carta muestra:
  - Imagen oficial
  - Nombre y set
  - Rareza
  - Badge con cantidad que posees
  - Botones +/- para modificar cantidad
- **Toca para agrandar**: Modal de pantalla completa con zoom
- **Estadísticas generales** en la parte superior

## Requisitos

- Node.js versión 14 o superior
- npm (incluido con Node.js)
- Expo Go en tu dispositivo móvil
- Conexión a internet para cargar cartas TCG
- Android o iOS

## Instalación

### 1. Verificar Node.js

```bash
node --version
```

Si no está instalado: https://nodejs.org/ (versión LTS)

### 2. Instalar dependencias

```bash
npm install
```

Dependencias principales:
```bash
npm install @tcgdex/sdk
npm install react-native-gesture-handler
npm install @react-native-async-storage/async-storage
```

### 3. Instalar Expo Go

- **Android**: Google Play Store → "Expo Go"
- **iOS**: App Store → "Expo Go"  
- **Huawei**: AppGallery o https://expo.dev/go

## Ejecutar la aplicación

```bash
npm start
```

O alternativamente:
```bash
npx expo start
```

Escanea el código QR con Expo Go.

**Importante**: Computadora y dispositivo en la misma red WiFi.

## Guía de uso paso a paso

### Buscar y agregar cartas

1. **Abre la app** → Pantalla Pokédex
2. **Busca un Pokémon** (ej: "Charizard")
3. **Toca la carta** → Se abre el modal
4. **Ve al tab "Cartas TCG"**
5. **(Opcional) Selecciona una forma**: Normal, Alola, Mega, etc.
6. **(Opcional) Filtra por tipo**: Básica, V, VMAX, etc.
7. **Explora las cartas** disponibles
8. **Toca +** en la carta que tienes → Se agrega a tu colección
9. **Toca la imagen** para verla en grande:
   - Doble tap para zoom 2x
   - Arrastra para mover
   - Usa los controles +/- sin salir

### Ver tu colección

1. **Ve a la pestaña "Colección"**
2. **Visualiza** todas tus cartas TCG
3. **Toca +/-** para modificar cantidades
4. **Toca la imagen** para zoom completo
5. **Revisa estadísticas** arriba

## Ejemplos de uso

### Caso 1: Coleccionas Charizard
- Abres Charizard en la Pokédex
- Cambias al tab "Cartas TCG"
- Filtras por "VMAX"
- Ves 5 cartas diferentes de Charizard VMAX
- Agregas la que tienes (ej: del set Champion's Path)
- Cada carta tiene su contador individual

### Caso 2: Buscas cartas de Alola
- Abres Raichu en la Pokédex
- Seleccionas forma "Alola"
- Ves todas las cartas de "Raichu de Alola"
- Agregas las que posees
- Cambias a "Normal" para ver cartas del Raichu normal

### Caso 3: Solo quieres cartas básicas
- Abres cualquier Pokémon
- Tab "Cartas TCG"
- Tocas filtro "Básica"
- Solo aparecen cartas básicas
- Encuentras fácilmente la carta que tienes

## Detalles técnicos

### API de Cartas TCG

**TCGdex** (https://api.tcgdex.net):
- Base de datos oficial del Pokémon TCG
- Más de 17,000 cartas
- Contenido en español
- Actualización constante con nuevos sets
- Imágenes de alta calidad

### Sistema de almacenamiento

**Estructura de colección**:
```javascript
{
  "swsh10.5-001": 2,    
  "sv01-025": 1,       
  "base1-4": 3         
}
```

Cada carta tiene:
- **ID único** del formato `{set}-{número}`
- **Contador individual** de cantidad
- **Persistencia** en dispositivo con AsyncStorage

### Detección automática de tipos

El sistema identifica automáticamente el tipo de cada carta:

**Por nombre**:
- Contiene "VMAX" → Tipo: VMAX
- Contiene "VSTAR" → Tipo: VSTAR
- Contiene "V" → Tipo: V
- Contiene "GX" → Tipo: GX
- Contiene "EX" o "ex" → Tipo: EX

**Por campo "stage"**:
- stage: "basic" → Tipo: Básica
- stage: "stage1" → Tipo: Fase 1
- stage: "stage2" → Tipo: Fase 2

### Formas regionales en español

Mapeo automático para búsqueda en TCG:

Forma Pokédex	Búsqueda en TCG	Ejemplo
Alola	"de alola"	Raichu de Alola
Galar	"de galar"	Ponyta de Galar
Paldea	"de paldea"	Tauros de Paldea
Hisui	"de hisui"	Zorua de Hisui
Mega	"mega", "mega x", "mega y"	Mega-Charizard X, Mega-Charizard Y
Gigamax	"gigantamax"	Pikachu Gigamax

### Optimizaciones

- **Carga de hasta 200 cartas** por Pokémon
- **Sin duplicados**: Agrupa cartas del mismo set
- **Modal pantalla completa**: Aprovecha todo el espacio
- **Gestos táctiles**: Zoom y arrastre fluidos
- **Caché de imágenes**: Carga más rápida
- **SafeAreaView**: Respeta áreas del sistema

## Notas importantes

### Cartas TCG vs Formas de Pokédex

**No todas las formas del videojuego tienen cartas TCG.**

Si seleccionas una forma y aparece "0 cartas disponibles", es porque esa variante específica no tiene cartas físicas en el TCG.

### Requisitos de pantalla

- **Modal optimizado** para pantallas desde 5" hasta tablets
- **Zoom 2x** funciona mejor en pantallas >6"
- **Gestos táctiles** requieren pantalla táctil capacitiva

## Estructura del proyecto

```
pokemon-tcg-collection/
├── src/
│   ├── components/
│   │   ├── PokemonDetailModal.js      # Modal con Info y Cartas TCG
│   │   └── PokemonTCGGallery.js       # Galería con filtros y zoom
│   ├── screens/
│   │   ├── PokedexScreen.js           # Lista de Pokémon
│   │   └── CollectionScreen.js        # Vista de colección TCG
│   └── services/
│       ├── PokeAPI.js                 # Datos de Pokémon
│       ├── TcgdexService.js           # API de cartas TCG
│       └── StorageService.js          # Persistencia de colección
├── App.js
├── package.json
└── README.md
```

## Solución de problemas

### No aparecen cartas TCG
- Verifica conexión a internet (primera carga)
- Espera unos segundos, la API puede tardar
- Prueba con otro Pokémon popular (ej: Pikachu)

### El zoom no funciona
- Asegúrate de hacer **doble tap rápido**
- Verifica que react-native-gesture-handler esté instalado
- Reinicia la app si persiste

### La app va lenta
- Cierra otras apps en segundo plano
- Limpia caché: `npx expo start --clear`
- Reduce filtros (selecciona tipo específico)

### Modal se ve cortado
- El modal usa pantalla completa con SafeAreaView
- Verifica que tu dispositivo tenga Android 5+ o iOS 11+
- Reinicia la app

## Tecnologías utilizadas

- **Expo** - Plataforma de desarrollo React Native
- **React Native** - Framework de apps móviles
- **TCGdex SDK** - Base de datos de cartas TCG
- **PokeAPI** - Información de Pokémon
- **React Native Gesture Handler** - Gestos táctiles (zoom, pan)
- **AsyncStorage** - Almacenamiento local
- **React Navigation** - Navegación entre pantallas
- **Expo Image** - Optimización de imágenes
- **Ionicons** - Biblioteca de iconos

## Créditos

- **Cartas TCG** proporcionadas por TCGdex (https://www.tcgdex.net/)
- **Datos Pokémon** de PokeAPI (https://pokeapi.co/)
- **Pokémon** es marca registrada de Nintendo, Game Freak y The Pokémon Company
- Proyecto sin fines comerciales, solo educativo

## APK Disponible

Descarga directa:
- https://expo.dev/artifacts/eas/dbwU36464QUeVebLSN8ba4.apk
- Alternativa: https://expo.dev/accounts/mjsanzana/projects/pokeWi/builds/62a62486-9834-4ac1-9877-c509e7e4adad

---

**Versión 2.0** - Gestión completa de cartas Pokémon TCG

Desarrollado para coleccionistas que quieren llevar un registro preciso de cada carta individual que poseen.