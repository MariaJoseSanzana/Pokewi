import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Text, ActivityIndicator, } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import StorageService from '../services/StorageService';
import TCGdexService from '../services/TcgdexService';

export default function CollectionScreen() {
  const [collection, setCollection] = useState({});
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [stats, setStats] = useState({ uniqueCards: 0, totalCards: 0 });

  useFocusEffect(
    useCallback(() => {
      loadCollection();
    }, [])
  );

  const loadCollection = async () => {
    setLoading(true);
    const col = await StorageService.getCollection();
    const collectionStats = await StorageService.getCollectionStats();

    setCollection(col);
    setStats(collectionStats);

    // Cargar datos de cada carta en la colección
    const cardIds = Object.keys(col);
    if (cardIds.length > 0) {
      const cardsPromises = cardIds.map(async (cardId) => {
        const cardDetails = await TCGdexService.getCardDetails(cardId);
        return cardDetails ? { ...cardDetails, quantity: col[cardId] } : null;
      });

      const data = await Promise.all(cardsPromises);
      setCardsData(data.filter(c => c !== null));
    } else {
      setCardsData([]);
    }

    setLoading(false);
  };

  const handleRemoveCard = async (cardId) => {
    await StorageService.removeCard(cardId);
    await loadCollection();
  };

  const handleAddCard = async (cardId) => {
    await StorageService.addCard(cardId);
    await loadCollection();
  };

  const renderCollectionCard = ({ item }) => {
    const imageUrl = TCGdexService.getCardImageUrl(item, 'high', 'webp');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedCard(item)}
      >
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>x{item.quantity}</Text>
        </View>

        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          resizeMode="contain"
        />

        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>

        <Text style={styles.cardSet} numberOfLines={1}>
          {item.set?.name || 'Sin set'}
        </Text>

        {item.rarity && (
          <Text style={styles.cardRarity} numberOfLines={1}>
            {item.rarity}
          </Text>
        )}

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.removeButton]}
            onPress={(e) => {
              e.stopPropagation();
              handleRemoveCard(item.id);
            }}
          >
            <Ionicons name="remove" size={16} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.controlQuantity}>{item.quantity}</Text>

          <TouchableOpacity
            style={[styles.controlButton, styles.addButton]}
            onPress={(e) => {
              e.stopPropagation();
              handleAddCard(item.id);
            }}
          >
            <Ionicons name="add" size={16} color="#fff" />
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

  if (cardsData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="albums-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Colección vacía</Text>
        <Text style={styles.emptyText}>
          Agrega cartas TCG desde la Pokédex para comenzar tu colección
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Estadísticas */}
      {!selectedCard && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.uniqueCards}</Text>
            <Text style={styles.statLabel}>Cartas únicas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalCards}</Text>
            <Text style={styles.statLabel}>Cartas totales</Text>
          </View>
        </View>
      )}


      {/* Lista de cartas en colección */}
      <FlatList
        data={cardsData}
        renderItem={renderCollectionCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={!selectedCard}
      />

      {/* Modal de detalle de carta */}
      {selectedCard && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedCard(null)}
        >
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: TCGdexService.getCardImageUrl(selectedCard, 'high', 'webp') }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalCardName}>{selectedCard.name}</Text>
            <Text style={styles.modalCardSet}>{selectedCard.set?.name}</Text>
            {selectedCard.rarity && (
              <Text style={styles.modalCardRarity}>{selectedCard.rarity}</Text>
            )}
            {selectedCard.hp && (
              <Text style={styles.modalCardHP}>HP: {selectedCard.hp}</Text>
            )}

            <View style={styles.modalControls}>
              <TouchableOpacity
                style={[styles.modalButton, styles.removeButton]}
                onPress={() => {
                  handleRemoveCard(selectedCard.id);
                }}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.modalQuantityContainer}>
                <Text style={styles.modalQuantityText}>
                  {collection[selectedCard.id] || 0}
                </Text>
                <Text style={styles.modalQuantityLabel}>en colección</Text>
              </View>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => {
                  handleAddCard(selectedCard.id);
                }}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '46%',
    position: 'relative',
  },
  quantityBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
    textAlign: 'center',
  },
  cardSet: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
    textAlign: 'center',
  },
  cardRarity: {
    fontSize: 10,
    color: '#e74c3c',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  addButton: {
    backgroundColor: '#27ae60',
  },
  controlQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    minWidth: 30,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    maxWidth: '90%',
    maxHeight: '90%',
  },
  modalImage: {
    width: 300,
    height: 420,
    borderRadius: 10,
  },
  modalCardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    textAlign: 'center',
  },
  modalCardSet: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  modalCardRarity: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 5,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCardHP: {
    fontSize: 16,
    color: '#27ae60',
    marginTop: 2,
    fontWeight: 'bold',
  },
  modalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
    gap: 15,
  },
  modalButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  modalQuantityContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  modalQuantityText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalQuantityLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
});
