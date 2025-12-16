# Pokémon Collection App

Aplicación móvil para gestionar tu colección de cartas Pokémon con información completa en español. Diseñada especialmente para llevar un registro detallado de tus cartas, incluyendo la posibilidad de agregar múltiples copias de la misma carta.

## Características principales

- Pokédex completa con los 1025 Pokémon (Generaciones 1-9)
- Interfaz completamente en español (nombres, descripciones, tipos y habilidades)
- Sistema de gestión para cartas repetidas
- Filtros avanzados por tipo de Pokémon
- Búsqueda por nombre o número de Pokédex
- Información detallada de cada Pokémon:
  - Tipos elementales con colores distintivos
  - **Formas regionales** (Alola, Galar, Hisui, Paldea) con selector interactivo
  - Estadísticas base con barras visuales (cambian según la forma)
  - Altura, peso y características físicas
  - Descripción oficial traducida
  - Habilidades con explicación detallada
  - Debilidades de tipo (actualizadas según la forma regional)
  - Cadena evolutiva completa
  - Datos de crianza (grupos huevo, género, ciclos de eclosión)
  - Información de especie (color, generación, ratio de captura)
- Colección personal con estadísticas de progreso
- Carga paginada (50 Pokémon por vez) para mejor rendimiento
- Sistema de caché para traducciones más rápidas
- Funciona offline después de cargar los datos

## Requisitos

- Node.js versión 14 o superior (https://nodejs.org/)
- npm (incluido con Node.js)
- Expo Go instalado en tu dispositivo móvil
- Conexión a internet para la primera carga y traducciones
- Android o iOS

## Instalación

### 1. Preparar el entorno

Primero, asegúrate de tener Node.js instalado. Puedes verificarlo abriendo una terminal y ejecutando:
```bash
node --version
```

Si no está instalado, descárgalo desde https://nodejs.org/ (versión LTS recomendada).

### 2. Instalar dependencias del proyecto

Abre VSCode en la carpeta del proyecto y ejecuta en la terminal:
```bash
npm install
```

### 3. Instalar Expo Go en tu dispositivo

- **Android**: Busca "Expo Go" en Google Play Store
- **iOS**: Busca "Expo Go" en App Store
- **Huawei (AppGallery)**: Busca "Expo Go" o descarga el APK desde https://expo.dev/go

## Ejecutar la aplicación

1. En la terminal de VSCode, ejecuta:
```bash
npm start
```

También puedes usar:
```bash
npx expo start
```

2. Se abrirá Metro Bundler en tu navegador con un código QR

3. En tu dispositivo móvil:
   - Abre la app Expo Go
   - Android: Escanea el código QR desde la app
   - iOS: Abre la cámara y escanea el QR (te redirigirá a Expo Go)

**Importante**: Tu computadora y tu dispositivo deben estar conectados a la misma red WiFi.

## Guía de uso

### Pantalla Pokédex

- **Navegar**: Desplázate por la lista para ver todos los Pokémon
- **Buscar**: Usa la barra de búsqueda para encontrar por nombre o número
- **Filtrar**: Toca el ícono de filtro para ver solo Pokémon de un tipo específico
- **Ver detalles**: Toca cualquier carta para abrir la información completa
- **Agregar a colección**: Usa el botón "+" en cada carta
- **Cargar más**: Al llegar al final, se cargarán automáticamente los siguientes 50 Pokémon
- **Recargar**: Desliza hacia abajo para recargar la lista

### Pantalla Mi Colección

- **Estadísticas**: Ver total de cartas y Pokémon únicos coleccionados
- **Gestionar cartas**: Usa los botones "+" y "-" para agregar o quitar copias
- **Detalles**: Toca cualquier carta para ver su información completa
- **Badge numérico**: El número en cada carta indica cuántas copias tienes

### Modal de Detalles

Al abrir un Pokémon verás:
- Nombre en español y número de Pokédex
- **Selector de formas regionales** (si tiene variantes Alola, Galar, Hisui o Paldea)
- Clasificación de especie (ej: "Pokémon Ratón")
- Imagen oficial de alta calidad que cambia según la forma seleccionada
- Tipos elementales con sus colores (diferentes para cada forma)
- Descripción traducida de la Pokédex
- Altura y peso (varían según la forma)
- Estadísticas base (PS, Ataque, Defensa, etc.) con barras de progreso
- Cadena evolutiva (si aplica)
- Habilidades con descripción completa de su efecto
- Debilidades de tipo con multiplicadores (recalculadas para cada forma)
- Información de especie (color, generación, ratio de captura)
- Datos de crianza (grupos huevo, género, pasos para eclosión, experiencia necesaria)
- Control de cantidad en tu colección

**Formas regionales disponibles:**
- **Alola**: Variantes de la región de Alola (Gen 7) - ejemplo: Raichu Alola (Eléctrico/Psíquico)
- **Galar**: Variantes de la región de Galar (Gen 8) - ejemplo: Ponyta Galar (Psíquico)
- **Hisui**: Variantes antiguas de la región de Hisui (Leyendas Arceus)
- **Paldea**: Variantes de la región de Paldea (Gen 9)
- **Mega**: Megaevoluciones (cuando estén disponibles)

Las formas cosméticas (como Pikachu con gorras) se filtran automáticamente para mostrar solo variantes con cambios significativos en tipos, estadísticas o habilidades.

## Detalles técnicos

### Sistema de traducción

La aplicación utiliza un sistema híbrido de traducción:

1. **Datos oficiales**: Prioriza información en español de PokeAPI cuando está disponible
2. **Diccionario local**: Más de 100 traducciones comunes almacenadas offline
3. **Traducción automática**: Para contenido no disponible en español, usa Google Translate API
4. **Caché inteligente**: Las traducciones se guardan en memoria para evitar llamadas repetidas

Los Pokémon de generaciones recientes (Gen 9) pueden no tener traducciones oficiales, por lo que se traducen automáticamente al abrir sus detalles.

### Paginación y rendimiento

- La app carga 50 Pokémon a la vez para no saturar la memoria
- Al llegar al final de la lista, carga automáticamente los siguientes 50
- Sistema de caché de imágenes para carga más rápida
- Filtro de duplicados para evitar errores de la API

### Almacenamiento local

La colección se guarda usando AsyncStorage, lo que significa:
- Tus datos persisten aunque cierres la app
- No necesitas cuenta ni login
- La información se guarda solo en tu dispositivo
- Formato: `{ pokemonId: cantidad }`

## Personalización

### Cambiar cantidad de Pokémon por carga

En `src/screens/PokedexScreen.js`, línea 17:
```javascript
const LIMIT = 50; // Cambia a 25, 100, etc.
```

### Modificar colores del tema

En `App.js`:
```javascript
tabBarActiveTintColor: '#e74c3c', // Color del tab activo
headerStyle: {
  backgroundColor: '#e74c3c', // Color del header
}
```

### Agregar más traducciones al diccionario

En `src/services/PokeAPI.js`, en la función `translateToSpanish`, agrega más entradas al objeto `translations`.

## Estructura del proyecto
```
pokemon-collection/
├── src/
│   ├── components/
│   │   └── PokemonDetailModal.js   # Modal con información detallada
│   ├── screens/
│   │   ├── PokedexScreen.js        # Pantalla principal con lista
│   │   ├── CollectionScreen.js     # Gestión de colección personal
│   │   └── DetailsScreen.js        # Pantalla placeholder
│   └── services/
│       ├── PokeAPI.js              # Consumo de API y traducciones
│       └── StorageService.js       # Persistencia de colección
├── App.js                          # Navegación y configuración principal
├── package.json                    # Dependencias del proyecto
├── app.json                        # Configuración de Expo
└── README.md                       # Documentación del proyecto
```

## Solución de problemas comunes

### La app no se conecta al dispositivo

- Verifica que ambos dispositivos estén en la misma red WiFi
- Desactiva VPN o proxy si los tienes activos
- Reinicia el servidor (Ctrl+C y ejecuta `npm start` de nuevo)
- Cierra completamente Expo Go y vuelve a abrirlo

### Error "Network request failed" al cargar Pokémon

- Verifica tu conexión a internet
- La primera carga siempre requiere internet
- Si persiste, ejecuta `npx expo start --clear` para limpiar caché

### Las traducciones no funcionan

- Las traducciones requieren conexión a internet la primera vez
- Una vez cargadas, se guardan en caché
- Si ves texto en inglés, abre el Pokémon para que se traduzca automáticamente

### El QR no escanea

- Asegúrate de que el código QR esté completamente visible en pantalla
- Aumenta el brillo de tu monitor
- En Expo Go, ve a la pestaña "Projects" donde debería aparecer automáticamente

### Error de duplicados o keys

- Ejecuta `npx expo start --clear` para limpiar caché
- El sistema ya filtra duplicados automáticamente desde la versión actual

### Rendimiento lento en dispositivos antiguos

- Reduce el LIMIT a 25 en lugar de 50
- Cierra otras apps en segundo plano

## Tecnologías utilizadas

- **Expo** (https://expo.dev/) - Plataforma para desarrollo de apps React Native
- **React Native** (https://reactnative.dev/) - Framework desarrollado por Meta para crear aplicaciones móviles nativas usando React
- **PokeAPI** (https://pokeapi.co/) - API REST gratuita con información de todos los Pokémon
- **Google Translate API** - Traducción automática para contenido no disponible en español
- **AsyncStorage** (@react-native-async-storage/async-storage) - Almacenamiento local persistente
- **React Navigation** (@react-navigation/native) - Sistema de navegación entre pantallas
- **Expo Image** (expo-image) - Componente optimizado para manejo de imágenes con caché
- **Ionicons** (@expo/vector-icons) - Biblioteca de iconos

## Créditos y atribuciones

- Datos de Pokémon proporcionados por **PokeAPI** (https://pokeapi.co/), un proyecto de código abierto
- Nombres, imágenes y contenido relacionado son propiedad de **Nintendo**, **Game Freak** y **The Pokémon Company**
- Traducciones oficiales de Nintendo cuando están disponibles
- Imágenes oficiales de Pokémon desde el repositorio de PokeAPI

## Notas legales

Este es un proyecto personal con fines educativos y de gestión de colección. Pokémon es una marca registrada de Nintendo, Game Freak y The Pokémon Company. Esta aplicación no tiene afiliación oficial con ninguna de estas empresas y no tiene fines comerciales.

## Licencia

Proyecto de uso personal. El código está disponible para referencia y aprendizaje.

---

Desarrollado para ayudar a coleccionistas de cartas Pokémon a gestionar su colección de forma sencilla y visual.
