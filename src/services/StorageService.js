import AsyncStorage from '@react-native-async-storage/async-storage';

const COLLECTION_KEY = '@pokemon_collection';

class StorageService {
  // Obtener toda la colección
  async getCollection() {
    try {
      const jsonValue = await AsyncStorage.getItem(COLLECTION_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error getting collection:', error);
      return {};
    }
  }

  // Agregar Pokémon a la colección
  async addPokemon(pokemonId, quantity = 1) {
    try {
      const collection = await this.getCollection();
      const currentQuantity = collection[pokemonId] || 0;
      collection[pokemonId] = currentQuantity + quantity;
      
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
      return collection[pokemonId];
    } catch (error) {
      console.error('Error adding Pokemon:', error);
      return 0;
    }
  }

  // Quitar Pokémon de la colección
  async removePokemon(pokemonId, quantity = 1) {
    try {
      const collection = await this.getCollection();
      const currentQuantity = collection[pokemonId] || 0;
      
      if (currentQuantity > quantity) {
        collection[pokemonId] = currentQuantity - quantity;
      } else {
        delete collection[pokemonId];
      }
      
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
      return collection[pokemonId] || 0;
    } catch (error) {
      console.error('Error removing Pokemon:', error);
      return 0;
    }
  }

  // Establecer cantidad específica
  async setPokemonQuantity(pokemonId, quantity) {
    try {
      const collection = await this.getCollection();
      
      if (quantity > 0) {
        collection[pokemonId] = quantity;
      } else {
        delete collection[pokemonId];
      }
      
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
      return collection[pokemonId] || 0;
    } catch (error) {
      console.error('Error setting Pokemon quantity:', error);
      return 0;
    }
  }

  // Obtener cantidad de un Pokémon específico
  async getPokemonQuantity(pokemonId) {
    try {
      const collection = await this.getCollection();
      return collection[pokemonId] || 0;
    } catch (error) {
      console.error('Error getting Pokemon quantity:', error);
      return 0;
    }
  }

  // Limpiar toda la colección
  async clearCollection() {
    try {
      await AsyncStorage.removeItem(COLLECTION_KEY);
    } catch (error) {
      console.error('Error clearing collection:', error);
    }
  }

  // Obtener estadísticas de la colección
  async getCollectionStats() {
    try {
      const collection = await this.getCollection();
      const uniquePokemon = Object.keys(collection).length;
      const totalCards = Object.values(collection).reduce((sum, qty) => sum + qty, 0);
      
      return {
        uniquePokemon,
        totalCards
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      return { uniquePokemon: 0, totalCards: 0 };
    }
  }
}

export default new StorageService();
