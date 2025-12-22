import AsyncStorage from '@react-native-async-storage/async-storage';

const COLLECTION_KEY = '@pokemon_tcg_collection';

class StorageService {
  // Obtener toda la colección de CARTAS TCG
  async getCollection() {
    try {
      const jsonValue = await AsyncStorage.getItem(COLLECTION_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error getting collection:', error);
      return {};
    }
  }

  // Agregar CARTA TCG a la colección (por ID de carta)
  async addCard(cardId, quantity = 1) {
    try {
      const collection = await this.getCollection();
      const currentQuantity = collection[cardId] || 0;
      collection[cardId] = currentQuantity + quantity;
      
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
      return collection[cardId];
    } catch (error) {
      console.error('Error adding card:', error);
      return 0;
    }
  }

  // Quitar CARTA TCG de la colección
  async removeCard(cardId, quantity = 1) {
    try {
      const collection = await this.getCollection();
      const currentQuantity = collection[cardId] || 0;
      
      if (currentQuantity > quantity) {
        collection[cardId] = currentQuantity - quantity;
      } else {
        delete collection[cardId];
      }
      
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
      return collection[cardId] || 0;
    } catch (error) {
      console.error('Error removing card:', error);
      return 0;
    }
  }

  // Establecer cantidad específica de una carta
  async setCardQuantity(cardId, quantity) {
    try {
      const collection = await this.getCollection();
      
      if (quantity > 0) {
        collection[cardId] = quantity;
      } else {
        delete collection[cardId];
      }
      
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
      return collection[cardId] || 0;
    } catch (error) {
      console.error('Error setting card quantity:', error);
      return 0;
    }
  }

  // Obtener cantidad de una carta específica
  async getCardQuantity(cardId) {
    try {
      const collection = await this.getCollection();
      return collection[cardId] || 0;
    } catch (error) {
      console.error('Error getting card quantity:', error);
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
      const uniqueCards = Object.keys(collection).length;
      const totalCards = Object.values(collection).reduce((sum, qty) => sum + qty, 0);
      
      return {
        uniqueCards,
        totalCards
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      return { uniqueCards: 0, totalCards: 0 };
    }
  }

  async addPokemon(pokemonId, quantity = 1) {
    console.warn('addPokemon is deprecated, use addCard instead');
    return this.addCard(pokemonId, quantity);
  }

  async removePokemon(pokemonId, quantity = 1) {
    console.warn('removePokemon is deprecated, use removeCard instead');
    return this.removeCard(pokemonId, quantity);
  }

  async getPokemonQuantity(pokemonId) {
    console.warn('getPokemonQuantity is deprecated, use getCardQuantity instead');
    return this.getCardQuantity(pokemonId);
  }
}

export default new StorageService();
