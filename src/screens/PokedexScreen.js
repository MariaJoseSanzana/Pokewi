//src/components/PokedexScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, Modal, ScrollView, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import PokeAPI from '../services/PokeAPI';
import StorageService from '../services/StorageService';
import PokemonDetailModal from '../components/PokemonDetailModal';

export default function PokedexScreen() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;
  const MAX_POKEMON = 1025;
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [collection, setCollection] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);


  const types = [
    { name: 'Todos', color: '#666' },
    { name: 'Normal', color: '#A8A878' },
    { name: 'Lucha', color: '#C03028' },
    { name: 'Volador', color: '#A890F0' },
    { name: 'Veneno', color: '#A040A0' },
    { name: 'Tierra', color: '#E0C068' },
    { name: 'Roca', color: '#B8A038' },
    { name: 'Bicho', color: '#A8B820' },
    { name: 'Fantasma', color: '#705898' },
    { name: 'Acero', color: '#B8B8D0' },
    { name: 'Fuego', color: '#F08030' },
    { name: 'Agua', color: '#6890F0' },
    { name: 'Planta', color: '#78C850' },
    { name: 'Eléctrico', color: '#F8D030' },
    { name: 'Psíquico', color: '#F85888' },
    { name: 'Hielo', color: '#98D8D8' },
    { name: 'Dragón', color: '#7038F8' },
    { name: 'Siniestro', color: '#705848' },
    { name: 'Hada', color: '#EE99AC' }
  ];

  useEffect(() => {
    loadPokemon();
    loadCollection();
  }, []);

  useEffect(() => {
    filterPokemon();
  }, [searchText, selectedType, pokemon]);

  const loadPokemon = async (isLoadingMore = false) => {
    if (isLoadingMore) {
      if (!hasMore || loadingMore) return;
      setLoadingMore(true);
    } else {
      setLoading(true);
      setOffset(0);
    }

    try {
      const currentOffset = isLoadingMore ? offset : 0;
      const data = await PokeAPI.getPokemonList(LIMIT, currentOffset);

      // ELIMINAR DUPLICADOS DE FORMA DEFINITIVA
      const uniqueMap = new Map(
        [...pokemon, ...data].map(p => [p.id, p])
      );
      const uniquePokemon = Array.from(uniqueMap.values());

      setPokemon(uniquePokemon);

      if (!searchText && !selectedType) {
        setFilteredPokemon(uniquePokemon);
      }

      const newOffset = currentOffset + LIMIT;
      setOffset(newOffset);
      setHasMore(newOffset < MAX_POKEMON);

    } catch (error) {
      console.error('Error loading Pokemon:', error);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPokemon([]);
    setFilteredPokemon([]);
    setOffset(0);
    setHasMore(true);
    await loadPokemon(false);
    await loadCollection();
    setRefreshing(false);
  };

  const loadCollection = async () => {
    const col = await StorageService.getCollection();
    setCollection(col);
  };

  const filterPokemon = () => {
    let filtered = [...pokemon];

    // Filtrar por búsqueda
    if (searchText) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.id.toString().includes(searchText)
      );
    }

    // Filtrar por tipo
    if (selectedType && selectedType !== 'Todos') {
      filtered = filtered.filter(p =>
        p.types.some(t => t.name === selectedType)
      );
    }

    setFilteredPokemon(filtered);
  };

  const handleAddToCollection = async (pokemonId) => {
    await StorageService.addPokemon(pokemonId);
    await loadCollection();
  };

  const renderPokemonCard = ({ item }) => {
    const quantity = collection[item.id] || 0;
    const mainType = item.types[0];

    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: mainType.color }]}
        onPress={async () => {

          // Cargar Pokémon con TODAS sus formas
          const fullPokemon = await PokeAPI.getPokemonDetails(
            `https://pokeapi.co/api/v2/pokemon/${item.id}`,
            true // ← Cargar todas las formas
          );

          if (!fullPokemon) {
            setSelectedPokemon(item);
            return;
          }

          // Traducir genus y description
          let translatedPokemon = { ...fullPokemon };

          if (fullPokemon.genus) {
            translatedPokemon.genus = await PokeAPI.translateText(fullPokemon.genus, 'auto', 'es');
          }

          if (fullPokemon.description) {
            translatedPokemon.description = await PokeAPI.translateText(fullPokemon.description, 'auto', 'es');
          }

          // Traducir descripciones de habilidades
          if (fullPokemon.abilities && fullPokemon.abilities.length > 0) {
            const translatedAbilities = await Promise.all(
              fullPokemon.abilities.map(async (ability) => {
                if (ability.needsTranslation && ability.description) {
                  const translatedDesc = await PokeAPI.translateText(ability.description, 'auto', 'es');
                  return {
                    ...ability,
                    description: translatedDesc
                  };
                }
                return ability;
              })
            );
            translatedPokemon.abilities = translatedAbilities;
          }
          //Traducir descripciones y habilidades de CADA forma regional
          if (fullPokemon.varieties && fullPokemon.varieties.length > 0) {
            const translatedVarieties = await Promise.all(
              fullPokemon.varieties.map(async (variety) => {
                let translatedVariety = { ...variety };

                // Traducir descripción de esta forma
                if (variety.description) {
                  translatedVariety.description = await PokeAPI.translateText(variety.description, 'auto', 'es');
                }

                // Traducir genus de esta forma
                if (variety.genus) {
                  translatedVariety.genus = await PokeAPI.translateText(variety.genus, 'auto', 'es');
                }

                // Traducir habilidades de esta forma
                if (variety.abilities && variety.abilities.length > 0) {
                  const translatedFormAbilities = await Promise.all(
                    variety.abilities.map(async (ability) => {
                      if (ability.needsTranslation && ability.description) {
                        const translatedDesc = await PokeAPI.translateText(ability.description, 'auto', 'es');
                        return {
                          ...ability,
                          description: translatedDesc
                        };
                      }
                      return ability;
                    })
                  );
                  translatedVariety.abilities = translatedFormAbilities;
                }

                return translatedVariety;
              })
            );
            translatedPokemon.varieties = translatedVarieties;
          }

          setSelectedPokemon(translatedPokemon);
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.pokemonId}>#{item.id.toString().padStart(3, '0')}</Text>
          {quantity > 0 && (
            <View style={[styles.badge, { backgroundColor: mainType.color }]}>
              <Text style={styles.badgeText}>{quantity}</Text>
            </View>
          )}
        </View>

        <Image
          source={{ uri: item.sprite }}
          style={styles.sprite}
          cachePolicy="disk"
          contentFit="contain"
        />

        <Text style={styles.pokemonName}>{item.name}</Text>

        <View style={styles.typesContainer}>
          {item.types.map((type, index) => (
            <View
              key={index}
              style={[styles.typeChip, { backgroundColor: type.color }]}
            >
              <Text style={styles.typeText}>{type.name}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: mainType.color }]}
          onPress={(e) => {
            e.stopPropagation();
            handleAddToCollection(item.id);
          }}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Cargando Pokédex...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Filtros de tipo */}
      {showFilters && (
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >

            {types.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterChip,
                  selectedType === type.name && styles.filterChipActive,
                  selectedType === type.name && { backgroundColor: type.color, borderColor: type.color }
                ]}
                onPress={() => setSelectedType(type.name === 'Todos' ? null : type.name)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedType === type.name && styles.filterChipTextActive
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Lista de Pokémon */}
      <FlatList
        data={filteredPokemon}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => `pokemon-${item.id}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e74c3c']}
            tintColor="#e74c3c"
          />
        }
        onEndReached={() => {
          // Solo cargar más si NO hay filtros activos
          if (!searchText && !selectedType && hasMore && !loadingMore) {
            loadPokemon(true);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#e74c3c" />
              <Text style={styles.loadingMoreText}>Cargando más Pokémon...</Text>
            </View>
          ) : null
        }
      />

      {/* Modal de detalles */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          visible={!!selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          collection={collection}
          onUpdateCollection={loadCollection}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  filterButton: {
    padding: 5,
  },
  filtersContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },

  filtersContent: {
    paddingVertical: 5,
    paddingRight: 10,
    alignItems: 'center',
  },

  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
  },
  filterChipActive: {
    borderWidth: 2,
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 5,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  pokemonId: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sprite: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 5,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  filtersWrapper: {
    height: 54,
    marginHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  loadingMore: {
    padding: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
