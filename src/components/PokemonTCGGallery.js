import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Animated, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import TCGdexService from '../services/TcgdexService';
import StorageService from '../services/StorageService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PokemonTCGGallery = ({ pokemonName, formName = 'Normal' }) => {
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [collection, setCollection] = useState({});
  const [zoomed, setZoomed] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState('Todas');

  // Tipos de cartas disponibles
  const [availableCardTypes, setAvailableCardTypes] = useState(['Todas']);

  // Animated values
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Mapeo de nombres de formas entre Pokédex y TCG en ESPAÑOL
  const FORM_NAME_MAPPING = {
    Alola: 'de alola',
    Galar: 'de galar',
    Paldea: 'de paldea',
    Hisui: 'de hisui',
    Gigamax: 'gigamax',
    Gigantamax: 'gigantamax',
  };

  const REGIONAL_FORMS = [
    'alola', 'de alola',
    'galar', 'de galar',
    'paldea', 'de paldea',
    'hisui', 'de hisui',
    'gigantamax', 'gmax', 'gigamax'
  ];


  const isMega = (name) =>
    name.includes('mega') || name.startsWith('m ');

  const isMegaX = (name) =>
    isMega(name) && /\b[x]\b/.test(name);

  const isMegaY = (name) =>
    isMega(name) && /\b[y]\b/.test(name);


  useEffect(() => {
    loadCards();
    loadCollection();
  }, [pokemonName, formName]);

  useEffect(() => {
    // Aplicar filtro de tipo de carta cuando cambia
    filterByCardType();
  }, [selectedCardType, allCards]);

  const loadCards = async () => {
    setLoading(true);

    try {
      const tcgCards = await TCGdexService.searchCardsByName(pokemonName);

      // 🔹 Filtrar según forma
      const filteredCards = tcgCards.filter(card => {
        const name = card.name.toLowerCase();

        if (formName === 'Mega X') return isMegaX(name);
        if (formName === 'Mega Y') return isMegaY(name);
        if (formName === 'Mega') return isMega(name) && !isMegaX(name) && !isMegaY(name);

        if (formName === 'Normal') {
          const hasSpecialForm = REGIONAL_FORMS.some(form => name.includes(form)) || isMega(name);
          return !hasSpecialForm;
        }

        const tcgFormName = FORM_NAME_MAPPING[formName];
        if (tcgFormName) return name.includes(tcgFormName);

        return true; // fallback
      });

      const limitedCards = filteredCards.slice(0, 200);

      // 🔹 Cargar detalles completos en paralelo
      const detailedCards = await Promise.all(
        limitedCards.map(async (card) => {
          try {
            const details = await TCGdexService.getCardDetails(card.id);
            return details || card;
          } catch (error) {
            console.error(`Error cargando carta ${card.id}:`, error);
            return card;
          }
        })
      );

      // 🔹 Detectar tipos de cartas disponibles
      const types = new Set(['Todas']);
      detailedCards.forEach(card => {
        const cardType = detectCardType(card);
        if (cardType) types.add(cardType);
      });

      // 🔹 Actualizar estados
      setAllCards(detailedCards);
      setCards(detailedCards);
      setAvailableCardTypes(Array.from(types));
      setSelectedCardType('Todas');

    } catch (error) {
      console.error('Error cargando cartas:', error);
      setAllCards([]);
      setCards([]);
      setAvailableCardTypes(['Todas']);
      setSelectedCardType('Todas');
    } finally {
      setLoading(false);
    }
  };

  const detectCardType = (card) => {
    const name = card.name || '';
    const stage = card.stage || '';

    // Detectar tipos especiales primero (por nombre)
    if (name.includes('VMAX')) return 'VMAX';
    if (name.includes('VSTAR')) return 'VSTAR';
    if (name.includes('V') && !name.includes('VMAX') && !name.includes('VSTAR')) return 'V';
    if (name.includes('GX')) return 'GX';
    if (name.includes('EX') || name.includes('ex')) return 'EX';
    if (name.includes('BREAK')) return 'BREAK';
    if (name.includes('Radiante') || name.includes('Radiant')) return 'Radiante';

    // Detectar por stage
    if (stage) {
      const stageLower = stage.toLowerCase().replace(/\s+/g, '');

      // Básica
      if (stageLower === 'basic' ||
        stageLower === 'básico' ||
        stageLower === 'basico') {
        return 'Básica';
      }

      // Fase 1
      if (stageLower === 'stage1' ||
        stageLower === 'fase1' ||
        stageLower === 'evolution1' ||
        stageLower === 'evolución1') {
        return 'Fase 1';
      }

      // Fase 2
      if (stageLower === 'stage2' ||
        stageLower === 'fase2' ||
        stageLower === 'evolution2' ||
        stageLower === 'evolución2') {
        return 'Fase 2';
      }
    }

    return null;
  };

  const filterByCardType = () => {
    if (selectedCardType === 'Todas') {
      setCards(allCards);
    } else {
      const filtered = allCards.filter(card => {
        const cardType = detectCardType(card);
        return cardType === selectedCardType;
      });
      setCards(filtered);
    }
  };

  const loadCollection = async () => {
    const col = await StorageService.getCollection();
    setCollection(col);
  };

  const handleAddCard = async (cardId) => {
    await StorageService.addCard(cardId);
    await loadCollection();
  };

  const handleRemoveCard = async (cardId) => {
    await StorageService.removeCard(cardId);
    await loadCollection();
  };

  const resetZoom = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setZoomed(false);
    });
  };

  const activateZoom = () => {
    setZoomed(true);
    Animated.timing(scale, {
      toValue: 2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeCardDetail = () => {
    setSelectedCard(null);
    setZoomed(false);
    translateX.setValue(0);
    translateY.setValue(0);
    scale.setValue(1);
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (zoomed) {
        resetZoom();
      } else {
        activateZoom();
      }
    });

  const savedTranslateX = useRef(0);
  const savedTranslateY = useRef(0);

  const pan = Gesture.Pan()
    .enabled(zoomed)
    .onStart(() => {
      savedTranslateX.current = translateX._value;
      savedTranslateY.current = translateY._value;
    })
    .onUpdate((event) => {
      if (zoomed) {
        translateX.setValue(savedTranslateX.current + event.translationX);
        translateY.setValue(savedTranslateY.current + event.translationY);
      }
    });

  const composedGesture = Gesture.Race(doubleTap, pan);

  const renderCard = ({ item }) => {
    const imageUrl = TCGdexService.getCardImageUrl(item, 'high', 'webp');
    const quantity = collection[item.id] || 0;
    const cardType = detectCardType(item);

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.cardImageContainer}
          onPress={() => {
            setSelectedCard(item);
            setZoomed(false);
            translateX.setValue(0);
            translateY.setValue(0);
            scale.setValue(1);
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="contain"
          />

          {quantity > 0 && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityBadgeText}>{quantity}</Text>
            </View>
          )}

          {/* Badge de tipo de carta */}
          {cardType && (
            <View style={styles.cardTypeBadge}>
              <Text style={styles.cardTypeBadgeText}>{cardType}</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.cardName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.cardSet} numberOfLines={1}>
          {item.set?.name || 'Sin set'}
        </Text>
        {item.rarity && (
          <Text style={styles.cardRarity} numberOfLines={1}>
            {item.rarity}
          </Text>
        )}

        <View style={styles.cardControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.removeButton]}
            onPress={() => handleRemoveCard(item.id)}
            disabled={quantity === 0}
          >
            <Ionicons name="remove" size={16} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.controlQuantity}>{quantity}</Text>

          <TouchableOpacity
            style={[styles.controlButton, styles.addButton]}
            onPress={() => handleAddCard(item.id)}
          >
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="albums-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>
        No se encontraron cartas {selectedCardType !== 'Todas' ? `${selectedCardType} ` : ''}
        de {pokemonName} {formName !== 'Normal' ? `(${formName})` : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Cargando cartas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con info */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Cartas TCG {formName !== 'Normal' ? `- ${formName}` : ''}
        </Text>
        <Text style={styles.subtitle}>
          {cards.length} carta{cards.length !== 1 ? 's' : ''}
          {selectedCardType !== 'Todas' ? ` (${selectedCardType})` : ''}
        </Text>
      </View>

      {/* Filtro de tipos de carta */}
      {availableCardTypes.length > 1 && (
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {availableCardTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  selectedCardType === type && styles.filterChipActive
                ]}
                onPress={() => setSelectedCardType(type)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCardType === type && styles.filterChipTextActive
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal de pantalla completa */}
      <Modal
        visible={selectedCard !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCardDetail}
      >
        {selectedCard && (
          <GestureHandlerRootView style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCardDetail}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              <GestureDetector gesture={composedGesture}>
                <Animated.View
                  style={[
                    styles.animatedImageWrapper,
                    {
                      transform: [
                        { translateX: translateX },
                        { translateY: translateY },
                        { scale: scale }
                      ]
                    }
                  ]}
                >
                  <Image
                    source={{ uri: TCGdexService.getCardImageUrl(selectedCard, 'high', 'webp') }}
                    style={styles.fullscreenImage}
                    resizeMode="contain"
                  />
                </Animated.View>
              </GestureDetector>

              <View style={styles.floatingHintContainer}>
                {!zoomed ? (
                  <Text style={styles.floatingHint}>
                    Doble tap para zoom 2x
                  </Text>
                ) : (
                  <Text style={styles.floatingHint}>
                    Arrastra para moverte • Doble tap para salir
                  </Text>
                )}
              </View>
            </View>

            {!zoomed && (
              <View style={styles.controlsOverlay}>
                <View style={styles.infoSection}>
                  <Text style={styles.cardInfoName} numberOfLines={1}>
                    {selectedCard.name}
                  </Text>
                  <Text style={styles.cardInfoSet} numberOfLines={1}>
                    {selectedCard.set?.name}
                  </Text>
                </View>

                <View style={styles.modalControls}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.removeButton]}
                    onPress={() => handleRemoveCard(selectedCard.id)}
                  >
                    <Ionicons name="remove" size={20} color="#fff" />
                  </TouchableOpacity>

                  <Text style={styles.modalQuantityText}>
                    {collection[selectedCard.id] || 0}
                  </Text>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.addButton]}
                    onPress={() => handleAddCard(selectedCard.id)}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </GestureHandlerRootView>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterScrollContent: {
    paddingHorizontal: 15,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '46%',
  },
  cardImageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  quantityBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  quantityBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTypeBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(39, 174, 96, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  cardTypeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
    textAlign: 'center',
    minHeight: 36,
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
  cardControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.85,
  },
  floatingHintContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingHint: {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    fontSize: 12,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoSection: {
    flex: 1,
    marginRight: 15,
  },
  cardInfoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardInfoSet: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 2,
  },
  modalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  modalQuantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 35,
    textAlign: 'center',
  },
});

export default PokemonTCGGallery;