// src/services/TCGdexService.js
const TCGDEX_BASE_URL = 'https://api.tcgdex.net/v2/es';

class TCGdexService {
  // Buscar cartas de un Pokémon por nombre
  async searchCardsByName(pokemonName) {
    try {
      
      const response = await fetch(`${TCGDEX_BASE_URL}/cards`);
      const allCards = await response.json();
      
      // Filtrar cartas que contengan el nombre del Pokémon
      const filteredCards = allCards.filter(card => {
        const cardName = card.name.toLowerCase();
        const searchName = pokemonName.toLowerCase();
        return cardName.includes(searchName);
      });

      return filteredCards;
    } catch (error) {
      console.error('Error buscando cartas:', error);
      return [];
    }
  }

  // Obtener detalles completos de una carta específica
  async getCardDetails(cardId) {
    try {
      const response = await fetch(`${TCGDEX_BASE_URL}/cards/${cardId}`);
      const card = await response.json();
      return card;
    } catch (error) {
      console.error('Error obteniendo detalles de carta:', error);
      return null;
    }
  }

  // Buscar cartas VMAX de un Pokémon
  async searchVMAXCards(pokemonName) {
    try {
      const allCards = await this.searchCardsByName(pokemonName);
      
      const vmaxCards = allCards.filter(card => 
        card.stage === 'VMAX' || 
        (card.rarity && card.rarity.includes('VMAX'))
      );

      return vmaxCards;
    } catch (error) {
      console.error('Error buscando cartas VMAX:', error);
      return [];
    }
  }

  // Buscar cartas por tipo de rareza
  async searchCardsByRarity(pokemonName, rarity) {
    try {
      const allCards = await this.searchCardsByName(pokemonName);
      
      const rarityCards = allCards.filter(card => 
        card.rarity && card.rarity.toLowerCase().includes(rarity.toLowerCase())
      );

      return rarityCards;
    } catch (error) {
      console.error('Error buscando por rareza:', error);
      return [];
    }
  }

  // Obtener URL de imagen de carta
  getCardImageUrl(card, quality = 'high', format = 'webp') {
    if (!card || !card.image) return null;
    return `${card.image}/${quality}.${format}`;
  }

  // Buscar cartas por set/expansión
  async getSetCards(setId) {
    try {
      const response = await fetch(`${TCGDEX_BASE_URL}/sets/${setId}`);
      const set = await response.json();
      return set;
    } catch (error) {
      console.error('Error obteniendo set:', error);
      return null;
    }
  }

  // Obtener todas las series disponibles
  async getAllSeries() {
    try {
      const response = await fetch(`${TCGDEX_BASE_URL}/series`);
      const series = await response.json();
      return series;
    } catch (error) {
      console.error('Error obteniendo series:', error);
      return [];
    }
  }

  // Buscar cartas especiales (ex, V, VSTAR, etc.)
  async searchSpecialCards(pokemonName, types = ['VMAX', 'V', 'ex', 'VSTAR', 'GX']) {
    try {
      const allCards = await this.searchCardsByName(pokemonName);
      
      const specialCards = allCards.filter(card => {
        const cardName = card.name.toUpperCase();
        return types.some(type => cardName.includes(type.toUpperCase()));
      });

      return specialCards;
    } catch (error) {
      console.error('Error buscando cartas especiales:', error);
      return [];
    }
  }
}

export default new TCGdexService();