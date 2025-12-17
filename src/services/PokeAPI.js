const BASE_URL = 'https://pokeapi.co/api/v2';

// Traducciones de tipos de español
const TYPE_TRANSLATIONS = {
  normal: 'Normal',
  fighting: 'Lucha',
  flying: 'Volador',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada'
};

// Colores por tipo
const TYPE_COLORS = {
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  steel: '#B8B8D0',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC'
};

const GENUS_FALLBACK_ES = {
  'Seed Pokémon': 'Pokémon Semilla',
  'Lizard Pokémon': 'Pokémon Lagartija',
  'Flame Pokémon': 'Pokémon Llama',
  'Tiny Turtle Pokémon': 'Pokémon Tortuguita',
  'Mouse Pokémon': 'Pokémon Ratón',
  'Dragon Pokémon': 'Pokémon Dragón',
  'Legendary Pokémon': 'Pokémon Legendario',
  'Mythical Pokémon': 'Pokémon Mítico',
};

const FORM_DESCRIPTIONS = {
  'wooper-paldea': {
    es: 'Vive en aguas antiguas. Su cuerpo venenoso de color marrón le protege de los depredadores. A diferencia del Wooper común, esta forma habita en tierra más tiempo.',
    en: 'It lives in ancient waters. Its poisonous brown body protects it from predators. Unlike common Wooper, this form spends more time on land.'
  },
  'tauros-paldea-combat-breed': {
    es: 'Esta raza de Tauros de Paldea es de tipo Lucha. Destaca por su musculatura robusta y naturaleza agresiva en combate.',
    en: 'This Paldean breed of Tauros is Fighting type. It stands out for its robust musculature and aggressive nature in combat.'
  },
  'tauros-paldea-blaze-breed': {
    es: 'Esta raza de Tauros de Paldea es de tipo Lucha/Fuego. Sus cuernos emiten calor intenso cuando se enfurece en batalla.',
    en: 'This Paldean breed of Tauros is Fighting/Fire type. Its horns emit intense heat when enraged in battle.'
  },
  'tauros-paldea-aqua-breed': {
    es: 'Esta raza de Tauros de Paldea es de tipo Lucha/Agua. Su cuerpo musculoso está adaptado para nadar velozmente.',
    en: 'This Paldean breed of Tauros is Fighting/Water type. Its muscular body is adapted for swift swimming.'
  },
  'raticate-totem-alola': {
    es: 'Forma Totem de Raticate Alola. Es una versión más grande y poderosa que actúa como guardián territorial. Tiene el mismo tipo Siniestro/Normal pero un tamaño imponente.',
    en: 'Totem form of Alolan Raticate. A larger, more powerful version that acts as a territorial guardian. Same Dark/Normal type but imposing size.'
  },
  'darmanitan-galar-standard': {
    es: 'Forma estándar de Darmanitan de Galar, de tipo Hielo. Vivía en regiones nevadas donde desarrolló órganos que producen energía helada. Su bola de nieve en la cabeza contiene un cerebro congelado.',
    en: 'Standard Galarian Darmanitan form, Ice type. It lived in snowy regions where it developed organs that produce freezing energy. The snowball on its head contains a frozen brain.'
  },
  'darmanitan-galar-zen': {
    es: 'Forma Zen de Darmanitan de Galar, de tipo Hielo/Fuego. Cuando entra en este estado, sus órganos de hielo y fuego trabajan al máximo. La combinación de elementos lo vuelve impredecible.',
    en: 'Zen Mode Galarian Darmanitan, Ice/Fire type. When entering this state, its ice and fire organs work at maximum. The combination of elements makes it unpredictable.'
  },
  'meowth-alola': {
    es: 'Antaño disfrutó de los lujos de la familia real de Alola, por lo que tiene un paladar muy refinado y no come cualquier cosa.',
    en: 'It once enjoyed the luxuries of Alola\'s royal family, so it has a very refined palate and doesn\'t eat just anything.'
  },
  'meowth-galar': {
    es: 'Algunas partes de su cuerpo se volvieron metálicas tras una larga convivencia con aguerrida gente del mar.',
    en: 'Some parts of its body became metallic after a long coexistence with fierce seafaring people.'
  },
  'meowth-gmax': {
    es: 'Se cree que el grabado de la gran moneda que ornamenta su frente contiene la clave para descifrar el secreto del fenómeno Dinamax.',
    en: 'It is believed that the engraving on the large coin adorning its forehead contains the key to deciphering the secret of the Dynamax phenomenon.'
  },
  'pikachu-gmax': {
    es: 'La energía del fenómeno Gigamax ha hecho que su cuerpo se expanda y que su cola pueda estirarse hasta alcanzar el cielo.',
    en: 'Gigamax energy has caused its body to expand and its tail can stretch to reach the sky.'
  },
  'machamp-gmax': {
    es: 'La energía del fenómeno Gigamax se concentra en sus brazos y le otorga una fuerza destructiva comparable a la de una bomba.',
    en: 'Gigamax energy concentrates in its arms and grants it destructive force comparable to a bomb.'
  },
  'gengar-gmax': {
    es: 'Exuda energía negativa. Se dice que su colosal boca es un portal que conduce al otro mundo.',
    en: 'It exudes negative energy. Its colossal mouth is said to be a portal leading to the other world.'
  },
  'kingler-gmax': {
    es: 'Puede pulverizar cualquier cosa con su pinza izquierda, que ha adoptado dimensiones descomunales gracias al fenómeno Gigamax.',
    en: 'It can pulverize anything with its left claw, which has adopted colossal dimensions thanks to the Gigamax phenomenon.'
  },
  'eevee-gmax': {
    es: 'Envuelve y atrapa a sus enemigos con el pelaje de su cuello que, gracias al fenómeno Gigamax, es ahora mucho más denso y esponjoso.',
    en: 'It wraps and traps its enemies with the fur on its neck which, thanks to Gigamax, is now much denser and fluffier.'
  },
  'slowbro-mega': {
    es: 'Toda la energía derivada de la megaevolución ha recaído sobre el Shellder que porta en su cola, que ha engullido casi del todo al propio Slowpoke.',
    en: 'All the energy derived from mega evolution has fallen on the Shellder on its tail, which has almost completely engulfed Slowpoke itself.'
  },
  'gengar-mega': {
    es: 'Puede pasar de una dimensión a otra y aparecer donde quiera. Una vez causó gran revuelo al mostrar tan solo una pata a través de una pared.',
    en: 'It can pass from one dimension to another and appear wherever it wants. It once caused great commotion by showing just a paw through a wall.'
  },
  'kangaskhan-mega': {
    es: 'La energía de la megaevolución hace crecer de golpe a la cría, que coordina a la perfección sus movimientos con los de su madre.',
    en: 'Mega evolution energy makes the baby grow suddenly, coordinating its movements perfectly with its mother.'
  },
  'pinsir-mega': {
    es: 'Se enorgullece de sus cuernos, con los que puede levantar a un oponente de hasta diez veces su peso y llevarlo volando sin esfuerzo.',
    en: 'It takes pride in its horns, with which it can lift an opponent up to ten times its weight and carry it flying effortlessly.'
  },
  'mewtwo-mega-x': {
    es: 'Su poder psíquico ha incrementado su masa muscular. Posee una fuerza de agarre de una tonelada y puede correr 100 m en dos segundos.',
    en: 'Its psychic power has increased its muscle mass. It has a grip strength of one ton and can run 100m in two seconds.'
  },
  'mewtwo-mega-y': {
    es: 'Aunque su cuerpo se ha encogido, el poder tan extraordinario que atesora le permite reducir a escombros un rascacielos con solo pensarlo.',
    en: 'Although its body has shrunk, the extraordinary power it holds allows it to reduce a skyscraper to rubble just by thinking about it.'
  }
};

class PokeAPI {
  constructor() {
    this.translationCache = {};
  }

  cleanText(text) {
    if (!text) return '';
    // Decodificar caracteres especiales
    return text
      .replace(/\n/g, ' ')
      .replace(/\f/g, ' ')
      .trim();
  }

  translateToSpanish(text) {
    if (!text) return '';

    // Diccionario de traducciones comunes de Pokémon
    const translations = {
      // Categorías comunes
      'Mouse Pokémon': 'Pokémon Ratón',
      'Lizard Pokémon': 'Pokémon Lagartija',
      'Flame Pokémon': 'Pokémon Llama',
      'Tiny Turtle Pokémon': 'Pokémon Tortuguita',
      'Turtle Pokémon': 'Pokémon Tortuga',
      'Shellfish Pokémon': 'Pokémon Marisco',
      'Worm Pokémon': 'Pokémon Gusano',
      'Cocoon Pokémon': 'Pokémon Capullo',
      'Butterfly Pokémon': 'Pokémon Mariposa',
      'Hairy Bug Pokémon': 'Pokémon Oruga',
      'Poison Bee Pokémon': 'Pokémon Abeja Venenosa',
      'Tiny Bird Pokémon': 'Pokémon Pajarito',
      'Bird Pokémon': 'Pokémon Pájaro',
      'Snake Pokémon': 'Pokémon Serpiente',
      'Cobra Pokémon': 'Pokémon Cobra',
      'Poison Pin Pokémon': 'Pokémon Pin Veneno',
      'Drill Pokémon': 'Pokémon Taladro',
      'Fairy Pokémon': 'Pokémon Hada',
      'Fox Pokémon': 'Pokémon Zorro',
      'Balloon Pokémon': 'Pokémon Globo',
      'Bat Pokémon': 'Pokémon Murciélago',
      'Weed Pokémon': 'Pokémon Hierbajo',
      'Flower Pokémon': 'Pokémon Flor',
      'Mushroom Pokémon': 'Pokémon Hongo',
      'Insect Pokémon': 'Pokémon Insecto',
      'Poison Moth Pokémon': 'Pokémon Polilla Venenosa',
      'Mole Pokémon': 'Pokémon Topo',
      'Scratch Cat Pokémon': 'Pokémon Gato Araña',
      'Classy Cat Pokémon': 'Pokémon Gato Elegante',
      'Duck Pokémon': 'Pokémon Pato',
      'Pig Pokémon': 'Pokémon Cerdo',
      'Pig Monkey Pokémon': 'Pokémon Cerdo Mono',
      'Puppy Pokémon': 'Pokémon Cachorro',
      'Legendary Pokémon': 'Pokémon Legendario',
      'Tadpole Pokémon': 'Pokémon Renacuajo',
      'Psi Pokémon': 'Pokémon Psi',
      'Superpower Pokémon': 'Pokémon Superpoder',
      'Flycatcher Pokémon': 'Pokémon Atrapamoscas',
      'Jellyfish Pokémon': 'Pokémon Medusa',
      'Rock Pokémon': 'Pokémon Roca',
      'Megaton Pokémon': 'Pokémon Megatón',
      'Fire Horse Pokémon': 'Pokémon Caballo de Fuego',
      'Dopey Pokémon': 'Pokémon Atontado',
      'Hermit Crab Pokémon': 'Pokémon Cangrejo Ermitaño',
      'Magnet Pokémon': 'Pokémon Imán',
      'Wild Duck Pokémon': 'Pokémon Pato Salvaje',
      'Twin Bird Pokémon': 'Pokémon Pájaro Doble',
      'Sea Lion Pokémon': 'Pokémon León Marino',
      'Sludge Pokémon': 'Pokémon Lodo',
      'Bivalve Pokémon': 'Pokémon Bivalvo',
      'Gas Pokémon': 'Pokémon Gas',
      'Shadow Pokémon': 'Pokémon Sombra',
      'Rock Snake Pokémon': 'Pokémon Serpiente Roca',
      'Hypnosis Pokémon': 'Pokémon Hipnosis',
      'River Crab Pokémon': 'Pokémon Cangrejo de Río',
      'Pincer Pokémon': 'Pokémon Pinza',
      'Ball Pokémon': 'Pokémon Bola',
      'Egg Pokémon': 'Pokémon Huevo',
      'Coconut Pokémon': 'Pokémon Coco',
      'Lonely Pokémon': 'Pokémon Solitario',
      'Bone Keeper Pokémon': 'Pokémon Guardahuesos',
      'Kicking Pokémon': 'Pokémon Patada',
      'Punching Pokémon': 'Pokémon Puñetazo',
      'Licking Pokémon': 'Pokémon Lengua',
      'Poison Gas Pokémon': 'Pokémon Gas Venenoso',
      'Spikes Pokémon': 'Pokémon Pincho',
      'Vine Pokémon': 'Pokémon Enredadera',
      'Parent Pokémon': 'Pokémon Padre',
      'Dragon Pokémon': 'Pokémon Dragón',
      'Goldfish Pokémon': 'Pokémon Pez Dorado',
      'Starshape Pokémon': 'Pokémon Estrella',
      'Mysterious Pokémon': 'Pokémon Misterioso',
      'Barrier Pokémon': 'Pokémon Barrera',
      'Mantis Pokémon': 'Pokémon Mantis',
      'Humanshape Pokémon': 'Pokémon Humanoide',
      'Electric Pokémon': 'Pokémon Eléctrico',
      'Spitfire Pokémon': 'Pokémon Escupefuego',
      'Stag Beetle Pokémon': 'Pokémon Ciervo Volante',
      'Wild Bull Pokémon': 'Pokémon Toro Salvaje',
      'Fish Pokémon': 'Pokémon Pez',
      'Atrocious Pokémon': 'Pokémon Atroz',
      'Transport Pokémon': 'Pokémon Transporte',
      'Transform Pokémon': 'Pokémon Transformación',
      'Evolution Pokémon': 'Pokémon Evolución',
      'Bubble Jet Pokémon': 'Pokémon Burbuja',
      'Lightning Pokémon': 'Pokémon Relámpago',
      'Virtual Pokémon': 'Pokémon Virtual',
      'Spiral Pokémon': 'Pokémon Espiral',
      'Fossil Pokémon': 'Pokémon Fósil',
      'Sleeping Pokémon': 'Pokémon Dormir',
      'Freeze Pokémon': 'Pokémon Congelado',
      'Genetic Pokémon': 'Pokémon Genético',
      'New Species Pokémon': 'Pokémon Nueva Especie',

      // Para generaciones nuevas, traducciones básicas
      'Storm Petrel Pokémon': 'Pokémon Paíño',
      'Stormy Petrel Pokémon': 'Pokémon Paíño',
      'Frigatebird Pokémon': 'Pokémon Fragata',

      // Palabras clave para traducción automática básica
      'Pokémon': 'Pokémon',
    };

    // Buscar traducción exacta
    if (translations[text]) {
      return translations[text];
    }

    // Traducir palabras comunes
    const wordTranslations = {
      'Mouse': 'Ratón',
      'Cat': 'Gato',
      'Dog': 'Perro',
      'Bird': 'Pájaro',
      'Fish': 'Pez',
      'Dragon': 'Dragón',
      'Snake': 'Serpiente',
      'Bug': 'Bicho',
      'Tiny': 'Pequeño',
      'Fire': 'Fuego',
      'Water': 'Agua',
      'Electric': 'Eléctrico',
      'Grass': 'Planta',
      'Rock': 'Roca',
      'Ground': 'Tierra',
      'Ice': 'Hielo',
      'Fighting': 'Lucha',
      'Poison': 'Veneno',
      'Flying': 'Volador',
      'Psychic': 'Psíquico',
      'Dark': 'Siniestro',
      'Steel': 'Acero',
      'Fairy': 'Hada',
      'Normal': 'Normal',
      'Ghost': 'Fantasma',
      'Legendary': 'Legendario',
      'Mythical': 'Mítico',
    };

    // Si no está en el diccionario, hacer traducción básica de palabras clave
    let translated = text;

    if (!text.includes('Pokémon')) {
      Object.keys(wordTranslations).forEach(eng => {
        const regex = new RegExp(eng, 'gi');
        translated = translated.replace(regex, wordTranslations[eng]);
      });
    }

    return translated;
  }

  async translateText(text, fromLang = 'auto', toLang = 'es') {
    if (!text) return '';

    // Revisar caché primero
    const cacheKey = `${fromLang}-${toLang}-${text}`;
    if (this.translationCache[cacheKey]) {
      return this.translationCache[cacheKey];
    }

    try {
      // API de Google Translate directo (sin paquete)
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();

      const translated = data[0][0][0] || text;

      // Guardar en caché
      this.translationCache[cacheKey] = translated;
      return translated;

    } catch (error) {
      // Guardar en caché para no reintentar
      this.translationCache[cacheKey] = text;
      return text;
    }
  }

  // Obtener lista de Pokémon
  async getPokemonList(limit = 100, offset = 0) {
    try {
      const pokemonDetails = [];

      // Calcular el rango de IDs a cargar
      const startId = offset + 1;
      const endId = Math.min(offset + limit, 1025); // Máximo 1025 Pokémon

      // Cargar cada Pokémon por su ID directamente
      const promises = [];
      for (let id = startId; id <= endId; id++) {
        promises.push(
          this.getPokemonDetails(`${BASE_URL}/pokemon/${id}`)
            .catch(error => {
              console.error(`Error loading Pokemon ${id}:`, error);
              return null;
            })
        );
      }

      const results = await Promise.all(promises);

      // Filtrar nulls
      return results.filter(p => p !== null);
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      return [];
    }
  }

  // Obtener detalles de un Pokémon específico
  async getPokemonDetails(url, loadAllForms = false) {
    try {
      const response = await fetch(url);
      const pokemon = await response.json();

      // Obtener especies para nombre en español
      const speciesResponse = await fetch(pokemon.species.url);
      const speciesData = await speciesResponse.json();

      // Obtener todas las formas/variantes si se solicita
      let varieties = [];
      if (loadAllForms && speciesData.varieties && speciesData.varieties.length > 1) {
        const varietiesData = await Promise.all(
          speciesData.varieties.map(async (variety) => {
            try {
              const varietyResponse = await fetch(variety.pokemon.url);
              const varietyData = await varietyResponse.json();

              const formName = variety.pokemon.name.toLowerCase();

              // Detectar tipo de forma
              let formType = 'other';
              let displayName = '';

              if (formName.includes('-alola')) {
                formType = 'alola';
                displayName = 'Alola';
              } else if (formName.includes('-galar')) {
                formType = 'galar';
                displayName = 'Galar';
              } else if (formName.includes('-hisui')) {
                formType = 'hisui';
                displayName = 'Hisui';
              } else if (formName.includes('-paldea')) {
                formType = 'paldea';
                displayName = 'Paldea';
              } else if (variety.is_default) {
                formType = 'normal';
                displayName = 'Normal';
              } else if (formName.includes('-mega')) {
                formType = 'mega';
                displayName = formName.includes('-mega-x') ? 'Mega X' :
                  formName.includes('-mega-y') ? 'Mega Y' : 'Mega';
              } else if (formName.includes('-primal')) {
                formType = 'primal';
                displayName = 'Primigenio';
              } else if (formName.includes('-gigantamax') || formName.includes('-gmax')) {
                formType = 'gigantamax';
                displayName = 'Gigamax';
              } else {
                // Ignorar formas cosméticas
                return null;
              }

              // Verificar que tenga sprite
              const sprite = varietyData.sprites.other['official-artwork']?.front_default ||
                varietyData.sprites.front_default;

              if (!sprite) {
                return null;
              }

              //Obtener descripción específica de esta forma
              let formDescription = '';
              let formGenus = '';

              // Para formas regionales y especiales, buscar sus flavor texts
              if (formType === 'alola' || formType === 'galar' || formType === 'hisui' || formType === 'paldea' || formType === 'mega' || formType === 'gigantamax' || formType === 'primal') {

                //Verificar si tenemos descripción manual
                if (FORM_DESCRIPTIONS[formName]) {
                  formDescription = FORM_DESCRIPTIONS[formName].es || FORM_DESCRIPTIONS[formName].en;
                } else {
                  // Si no hay manual, intentar cargar de la API
                  try {
                    const formSpeciesResponse = await fetch(varietyData.species.url);
                    const formSpeciesData = await formSpeciesResponse.json();

                    // Mapeo de formas a versiones de juegos donde aparecen
                    const formGameVersions = {
                      'alola': ['ultra-sun', 'ultra-moon', 'sun', 'moon'],
                      'galar': ['sword', 'shield'],
                      'hisui': ['legends-arceus'],
                      'paldea': ['scarlet', 'violet'],
                      'mega': ['omega-ruby', 'alpha-sapphire', 'x', 'y'],
                      'gigantamax': ['sword', 'shield'],
                      'primal': ['omega-ruby', 'alpha-sapphire']
                    };

                    const relevantVersions = formGameVersions[formType] || [];

                    // Buscar flavor text en español de las versiones correctas
                    let spanishFormFlavor = null;
                    let englishFormFlavor = null;

                    // Primero intentar español en versiones específicas
                    for (const version of relevantVersions) {
                      const found = formSpeciesData.flavor_text_entries.find(entry =>
                        entry.language.name === 'es' && entry.version.name === version
                      );
                      if (found) {
                        spanishFormFlavor = found;
                        break;
                      }
                    }

                    // Si no hay español, buscar inglés en versiones específicas
                    if (!spanishFormFlavor) {
                      for (const version of relevantVersions) {
                        const found = formSpeciesData.flavor_text_entries.find(entry =>
                          entry.language.name === 'en' && entry.version.name === version
                        );
                        if (found) {
                          englishFormFlavor = found;
                          break;
                        }
                      }
                    }

                    // Si no encontramos descripción específica de versión, tomar cualquiera en español
                    if (!spanishFormFlavor && !englishFormFlavor) {
                      const spanishEntries = formSpeciesData.flavor_text_entries
                        .filter(f => f.language.name === 'es');

                      if (spanishEntries.length > 0) {
                        spanishFormFlavor = spanishEntries[spanishEntries.length - 1];
                      }

                      if (!spanishFormFlavor) {
                        const englishEntries = formSpeciesData.flavor_text_entries
                          .filter(f => f.language.name === 'en');
                        if (englishEntries.length > 0) {
                          englishFormFlavor = englishEntries[englishEntries.length - 1];
                        }
                      }
                    }

                    if (spanishFormFlavor) {
                      formDescription = this.cleanText(spanishFormFlavor.flavor_text);
                    } else if (englishFormFlavor) {
                      formDescription = this.cleanText(englishFormFlavor.flavor_text);
                    } else {
                      // Descripción genérica
                      const regionNames = {
                        'alola': 'Alola',
                        'galar': 'Galar',
                        'hisui': 'Hisui',
                        'paldea': 'Paldea',
                        'mega': 'Megaevolución',
                        'gigantamax': 'Gigamax',
                        'primal': 'Regresión Primigenia'
                      };
                      formDescription = `Forma de ${regionNames[formType]}. Presenta características únicas y poder aumentado.`;
                    }

                    // Buscar genus
                    const spanishGenus = formSpeciesData.genera.find(g => g.language.name === 'es');
                    const englishGenus = formSpeciesData.genera.find(g => g.language.name === 'en');

                    if (spanishGenus) {
                      formGenus = this.cleanText(spanishGenus.genus);
                    } else if (englishGenus) {
                      formGenus = this.cleanText(englishGenus.genus);
                    }

                  } catch (error) {
                  }
                }
              }

              // Obtener habilidades específicas de esta forma
              const formAbilitiesPromises = varietyData.abilities.map(async (a) => {
                const abilityResponse = await fetch(a.ability.url);
                const abilityData = await abilityResponse.json();
                const spanishAbility = abilityData.names.find(n => n.language.name === 'es');

                const spanishEffect = abilityData.effect_entries.find(e => e.language.name === 'es');
                const englishEffect = abilityData.effect_entries.find(e => e.language.name === 'en');

                let description = '';
                if (spanishEffect) {
                  description = spanishEffect.short_effect || spanishEffect.effect;
                } else if (englishEffect) {
                  description = englishEffect.short_effect || englishEffect.effect;
                }

                return {
                  name: spanishAbility ? this.cleanText(spanishAbility.name) : a.ability.name,
                  isHidden: a.is_hidden,
                  description: this.cleanText(description),
                  needsTranslation: !spanishEffect
                };
              });

              let formAbilities = await Promise.all(formAbilitiesPromises);

              // Filtrar duplicados de habilidades
              if (formAbilities && formAbilities.length > 0) {
                const abilityMap = new Map();
                formAbilities.forEach(ability => {
                  const existing = abilityMap.get(ability.name);
                  if (!existing) {
                    abilityMap.set(ability.name, ability);
                  } else if (formAbilities.length === 1) {
                    abilityMap.set(ability.name, { ...ability, isHidden: false });
                  } else {
                    if (!existing.isHidden) {
                      abilityMap.set(ability.name, existing);
                    }
                  }
                });
                formAbilities = Array.from(abilityMap.values());
              }

              return {
                id: varietyData.id,
                name: variety.pokemon.name,
                formType: formType,
                displayName: displayName,
                isDefault: variety.is_default,
                types: varietyData.types,
                stats: varietyData.stats,
                abilities: formAbilities,
                sprite: sprite,
                height: varietyData.height,
                weight: varietyData.weight,
                description: formDescription,
                genus: formGenus,
                color: null
              };
            } catch (error) {
              console.error(`Error loading variety ${variety.pokemon.name}:`, error);
              return null;
            }
          })
        );

        // Filtrar nulls
        varieties = varietiesData.filter(v => v !== null);

        // Si solo quedó la forma normal, no mostrar selector
        if (varieties.length <= 1) {
          varieties = [];
        }
      }
      // Buscar nombre en español
      const spanishName = speciesData.names.find(n => n.language.name === 'es');
      const spanishGenus = speciesData.genera.find(g => g.language.name === 'es');
      const spanishFlavorTexts = speciesData.flavor_text_entries
        .filter(f => f.language.name === 'es');

      const spanishFlavorText = spanishFlavorTexts.length
        ? spanishFlavorTexts[spanishFlavorTexts.length - 1]
        : null;

      // Si no hay texto en español, buscar en inglés como fallback
      const englishGenus = speciesData.genera.find(g => g.language.name === 'en');
      const englishFlavorText = speciesData.flavor_text_entries.find(
        f => f.language.name === 'en'
      );

      // Traducir genus si no está en español - GUARDAR EN INGLÉS, TRADUCIR AL ABRIR
      let finalGenus = '';
      if (spanishGenus) {
        finalGenus = this.cleanText(spanishGenus.genus);
      } else if (englishGenus) {
        const cleanedGenus = this.cleanText(englishGenus.genus);

        if (GENUS_FALLBACK_ES[cleanedGenus]) {
          finalGenus = GENUS_FALLBACK_ES[cleanedGenus];
        } else {
          const dictResult = this.translateToSpanish(cleanedGenus);
          finalGenus = dictResult;
        }
      } else {
        finalGenus = 'Pokémon Desconocido';
      }

      // Descripción - GUARDAR EN INGLÉS, TRADUCIR AL ABRIR
      let finalDescription = '';
      if (spanishFlavorText) {
        finalDescription = this.cleanText(spanishFlavorText.flavor_text);
      } else if (englishFlavorText) {
        finalDescription = this.cleanText(englishFlavorText.flavor_text);
      } else {
        finalDescription = 'Sin descripción disponible';
      }

      // Obtener cadena de evolución
      let evolutionChain = [];
      if (speciesData.evolution_chain) {
        evolutionChain = await this.getEvolutionChain(speciesData.evolution_chain.url);
      }

      // Obtener habilidades en español CON DESCRIPCIONES
      const abilitiesPromises = pokemon.abilities.map(async (a) => {
        const abilityResponse = await fetch(a.ability.url);
        const abilityData = await abilityResponse.json();
        const spanishAbility = abilityData.names.find(n => n.language.name === 'es');

        const spanishEffect = abilityData.effect_entries.find(e => e.language.name === 'es');
        const englishEffect = abilityData.effect_entries.find(e => e.language.name === 'en');

        let description = '';
        if (spanishEffect) {
          description = spanishEffect.short_effect || spanishEffect.effect;
        } else if (englishEffect) {
          description = englishEffect.short_effect || englishEffect.effect;
        }

        return {
          name: spanishAbility ? this.cleanText(spanishAbility.name) : a.ability.name,
          isHidden: a.is_hidden,
          description: this.cleanText(description),
          needsTranslation: !spanishEffect
        };
      });

      let abilities = await Promise.all(abilitiesPromises);

      // Filtrar duplicados y corregir habilidades ocultas
      if (abilities && abilities.length > 0) {
        const abilityMap = new Map();

        abilities.forEach(ability => {
          const existing = abilityMap.get(ability.name);

          if (!existing) {
            abilityMap.set(ability.name, ability);
          } else if (abilities.length === 1) {
            abilityMap.set(ability.name, { ...ability, isHidden: false });
          } else {
            if (!existing.isHidden) {
              abilityMap.set(ability.name, existing);
            }
          }
        });

        abilities = Array.from(abilityMap.values());
      } else {
        abilities = [];
      }

      // Calcular debilidades basadas en los tipos del Pokémon
      const calculateWeaknesses = (types) => {
        const typeEffectiveness = {
          normal: { fighting: 2 },
          fighting: { flying: 2, psychic: 2, fairy: 2 },
          flying: { rock: 2, electric: 2, ice: 2 },
          poison: { ground: 2, psychic: 2 },
          ground: { water: 2, grass: 2, ice: 2 },
          rock: { fighting: 2, ground: 2, steel: 2, water: 2, grass: 2 },
          bug: { flying: 2, rock: 2, fire: 2 },
          ghost: { ghost: 2, dark: 2 },
          steel: { fighting: 2, ground: 2, fire: 2 },
          fire: { ground: 2, rock: 2, water: 2 },
          water: { grass: 2, electric: 2 },
          grass: { flying: 2, poison: 2, bug: 2, fire: 2, ice: 2 },
          electric: { ground: 2 },
          psychic: { bug: 2, ghost: 2, dark: 2 },
          ice: { fighting: 2, rock: 2, steel: 2, fire: 2 },
          dragon: { ice: 2, dragon: 2, fairy: 2 },
          dark: { fighting: 2, bug: 2, fairy: 2 },
          fairy: { poison: 2, steel: 2 }
        };

        const weaknessMap = {};

        types.forEach(type => {
          const typeKey = type.nameEn;
          const weaknesses = typeEffectiveness[typeKey] || {};

          Object.keys(weaknesses).forEach(weakType => {
            if (!weaknessMap[weakType]) {
              weaknessMap[weakType] = 1;
            }
            weaknessMap[weakType] *= weaknesses[weakType];
          });
        });

        const weaknesses = Object.keys(weaknessMap)
          .filter(type => weaknessMap[type] > 1)
          .map(type => ({
            name: TYPE_TRANSLATIONS[type] || type,
            nameEn: type,
            color: TYPE_COLORS[type] || '#777',
            multiplier: weaknessMap[type]
          }));

        return weaknesses;
      };

      const weaknesses = calculateWeaknesses(pokemon.types.map(t => ({
        nameEn: t.type.name
      })));

      const colorTranslations = {
        black: 'Negro', blue: 'Azul', brown: 'Marrón', gray: 'Gris',
        green: 'Verde', pink: 'Rosa', purple: 'Púrpura', red: 'Rojo',
        white: 'Blanco', yellow: 'Amarillo'
      };

      const genderRate = speciesData.gender_rate;
      let gender = 'Sin género';
      if (genderRate === -1) {
        gender = 'Sin género';
      } else {
        const femalePercent = (genderRate / 8) * 100;
        const malePercent = 100 - femalePercent;
        gender = `♂ ${malePercent}% / ♀ ${femalePercent}%`;
      }

      const eggGroupsPromises = speciesData.egg_groups.map(async (eg) => {
        const egResponse = await fetch(eg.url);
        const egData = await egResponse.json();
        const spanishEG = egData.names.find(n => n.language.name === 'es');
        return spanishEG ? spanishEG.name : eg.name;
      });
      const eggGroups = await Promise.all(eggGroupsPromises);

      const genNumber = speciesData.generation.url.split('/').filter(Boolean).pop();
      const generationNames = {
        '1': 'Primera', '2': 'Segunda', '3': 'Tercera', '4': 'Cuarta',
        '5': 'Quinta', '6': 'Sexta', '7': 'Séptima', '8': 'Octava', '9': 'Novena'
      };

      return {
        id: pokemon.id,
        name: spanishName ? spanishName.name : pokemon.name,
        nameEn: pokemon.name,
        genus: finalGenus,
        description: finalDescription,
        types: pokemon.types.map(t => ({
          name: TYPE_TRANSLATIONS[t.type.name] || t.type.name,
          nameEn: t.type.name,
          color: TYPE_COLORS[t.type.name] || '#777'
        })),
        sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        height: pokemon.height / 10,
        weight: pokemon.weight / 10,
        stats: pokemon.stats.map(s => ({
          name: this.translateStat(s.stat.name),
          value: s.base_stat
        })),
        abilities: abilities,
        weaknesses: weaknesses,
        evolutionChain: evolutionChain,
        varieties: varieties,
        captureRate: speciesData.capture_rate,
        baseHappiness: speciesData.base_happiness,
        growthRate: this.translateGrowthRate(speciesData.growth_rate.name),
        eggGroups: eggGroups,
        gender: gender,
        hatchCounter: speciesData.hatch_counter,
        color: colorTranslations[speciesData.color.name] || speciesData.color.name,
        generation: generationNames[genNumber] || `Gen ${genNumber}`,
        isLegendary: speciesData.is_legendary,
        isMythical: speciesData.is_mythical
      };
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      return null;
    }
  }

  // Traducir growth rate
  translateGrowthRate(growthRate) {
    const translations = {
      'slow': 'Lento (1.250.000)',
      'medium': 'Medio (1.000.000)',
      'fast': 'Rápido (800.000)',
      'medium-slow': 'Medio-Lento (1.059.860)',
      'slow-then-very-fast': 'Lento-Rápido (600.000)',
      'fast-then-very-slow': 'Rápido-Lento (1.640.000)'
    };
    return translations[growthRate] || growthRate;
  }

  // Obtener cadena de evolución
  async getEvolutionChain(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      const chain = [];
      let current = data.chain;

      while (current) {
        const id = current.species.url.split('/').filter(Boolean).pop();
        chain.push({
          id: parseInt(id),
          name: current.species.name
        });
        current = current.evolves_to[0];
      }

      return chain;
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
      return [];
    }
  }

  // Traducir nombres de estadísticas
  translateStat(statName) {
    const translations = {
      hp: 'PS',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'At. Esp.',
      'special-defense': 'Def. Esp.',
      speed: 'Velocidad'
    };
    return translations[statName] || statName;
  }

  // Buscar Pokémon por nombre o ID
  async searchPokemon(query) {
    try {
      const url = `${BASE_URL}/pokemon/${query.toLowerCase()}`;
      return await this.getPokemonDetails(url);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      return null;
    }
  }
}

export default new PokeAPI();