import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PokeAPI from '../services/PokeAPI';
import StorageService from '../services/StorageService';
import PokemonDetailModal from '../components/PokemonDetailModal';

export default function CollectionScreen() {
  const [collection, setCollection] = useState({});
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [stats, setStats] = useState({ uniquePokemon: 0, totalCards: 0 });

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    setLoading(true);
    const col = await StorageService.getCollection();
    const collectionStats = await StorageService.getCollectionStats();
    
    setCollection(col);
    setStats(collectionStats);

    // Cargar datos de cada Pokémon en la colección
    const pokemonIds = Object.keys(col);
    if (pokemonIds.length > 0) {
      const pokemonPromises = pokemonIds.map(async (id) => {
        const pokemon = await PokeAPI.searchPokemon(id);
        return { ...pokemon, quantity: col[id] };
      });
      
      const data = await Promise.all(pokemonPromises);
      setPokemonData(data.filter(p => p !== null));
    } else {
      setPokemonData([]);
    }
    
    setLoading(false);
  };

  const handleRemoveFromCollection = async (pokemonId) => {
    await StorageService.removePokemon(pokemonId);
    await loadCollection();
  };

  const handleAddToCollection = async (pokemonId) => {
    await StorageService.addPokemon(pokemonId);
    await loadCollection();
  };

  const renderCollectionCard = ({ item }) => {
    const mainType = item.types[0];

    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: mainType.color }]}
        onPress={() => setSelectedPokemon(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.pokemonId}>#{item.id.toString().padStart(3, '0')}</Text>
          <View style={[styles.quantityBadge, { backgroundColor: mainType.color }]}>
            <Text style={styles.quantityText}>x{item.quantity}</Text>
          </View>
        </View>
        
        <Image source={{ uri: item.sprite }} style={styles.sprite} />
        
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

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: '#e74c3c' }]}
            onPress={(e) => {
              e.stopPropagation();
              handleRemoveFromCollection(item.id);
            }}
          >
            <Ionicons name="remove" size={18} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.controlQuantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: mainType.color }]}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCollection(item.id);
            }}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Cargando colección...</Text>
      </View>
    );
  }

  if (pokemonData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="albums-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Colección vacía</Text>
        <Text style={styles.emptyText}>
          Agrega Pokémon desde la Pokédex para comenzar tu colección
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.uniquePokemon}</Text>
          <Text style={styles.statLabel}>Pokémon únicos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.totalCards}</Text>
          <Text style={styles.statLabel}>Cartas totales</Text>
        </View>
      </View>

      {/* Lista de colección */}
      <FlatList
        data={pokemonData}
        renderItem={renderCollectionCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
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
  quantityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 10,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  controlQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
});
