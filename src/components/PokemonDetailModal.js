//Pokemon-collection/src/components/PokemonDetailModal.js
import React, { useState } from 'react';
import { Modal, View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StorageService from '../services/StorageService';

const { width } = Dimensions.get('window');

export default function PokemonDetailModal({ pokemon, visible, onClose, collection, onUpdateCollection }) {
  if (!pokemon) return null;

  // Estado para la forma seleccionada
  const [selectedForm, setSelectedForm] = useState(0);

  // Determinar si hay formas alternativas
  const hasVarieties = pokemon.varieties && pokemon.varieties.length > 1;

  // Obtener datos de la forma actual
  const getCurrentFormData = () => {
    if (!hasVarieties) {
      // No hay formas alternativas
      return {
        types: pokemon.types,
        stats: pokemon.stats,
        abilities: pokemon.abilities,
        sprite: pokemon.sprite,
        height: pokemon.height,
        weight: pokemon.weight,
        weaknesses: pokemon.weaknesses,
        formName: 'Normal'
      };
    }

    // Obtener forma seleccionada
    const variety = pokemon.varieties[selectedForm];

    // Recalcular debilidades para esta forma
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

    const TYPE_TRANSLATIONS = {
      normal: 'Normal', fighting: 'Lucha', flying: 'Volador',
      poison: 'Veneno', ground: 'Tierra', rock: 'Roca',
      bug: 'Bicho', ghost: 'Fantasma', steel: 'Acero',
      fire: 'Fuego', water: 'Agua', grass: 'Planta',
      electric: 'Eléctrico', psychic: 'Psíquico', ice: 'Hielo',
      dragon: 'Dragón', dark: 'Siniestro', fairy: 'Hada'
    };

    const TYPE_COLORS = {
      normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
      poison: '#A040A0', ground: '#E0C068', rock: '#B8A038',
      bug: '#A8B820', ghost: '#705898', steel: '#B8B8D0',
      fire: '#F08030', water: '#6890F0', grass: '#78C850',
      electric: '#F8D030', psychic: '#F85888', ice: '#98D8D8',
      dragon: '#7038F8', dark: '#705848', fairy: '#EE99AC'
    };

    const weaknessMap = {};
    variety.types.forEach(t => {
      const typeKey = t.type.name;
      const weaknesses = typeEffectiveness[typeKey] || {};

      Object.keys(weaknesses).forEach(weakType => {
        if (!weaknessMap[weakType]) {
          weaknessMap[weakType] = 1;
        }
        weaknessMap[weakType] *= weaknesses[weakType];
      });
    });

    const varietyWeaknesses = Object.keys(weaknessMap)
      .filter(type => weaknessMap[type] > 1)
      .map(type => ({
        name: TYPE_TRANSLATIONS[type] || type,
        nameEn: type,
        color: TYPE_COLORS[type] || '#777',
        multiplier: weaknessMap[type]
      }));

    // Traducir nombres de stats
    const translateStat = (statName) => {
      const translations = {
        hp: 'PS', attack: 'Ataque', defense: 'Defensa',
        'special-attack': 'At. Esp.', 'special-defense': 'Def. Esp.',
        speed: 'Velocidad'
      };
      return translations[statName] || statName;
    };

    return {
      types: variety.types.map(t => ({
        name: TYPE_TRANSLATIONS[t.type.name] || t.type.name,
        nameEn: t.type.name,
        color: TYPE_COLORS[t.type.name] || '#777'
      })),
      stats: variety.stats.map(s => ({
        name: translateStat(s.stat.name),
        value: s.base_stat
      })),
      abilities: pokemon.abilities,
      sprite: variety.sprite,
      height: variety.height / 10,
      weight: variety.weight / 10,
      weaknesses: varietyWeaknesses,
      formName: variety.displayName
    };
  };

  const currentForm = getCurrentFormData();
  const quantity = collection[pokemon.id] || 0;
  const mainType = currentForm.types[0];

  const handleAdd = async () => {
    await StorageService.addPokemon(pokemon.id);
    onUpdateCollection();
  };

  const handleRemove = async () => {
    await StorageService.removePokemon(pokemon.id);
    onUpdateCollection();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { borderTopColor: mainType.color }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: mainType.color }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerNumber}>#{pokemon.id.toString().padStart(3, '0')}</Text>
              <Text style={styles.headerName}>{pokemon.name}</Text>
              <Text style={styles.headerGenus}>{pokemon.genus}</Text>
              {hasVarieties && (
                <Text style={styles.headerForm}>Forma: {currentForm.formName}</Text>
              )}
            </View>

            <Image source={{ uri: currentForm.sprite }} style={styles.headerSprite} />
          </View>

          {/* Selector de formas */}
          {hasVarieties && (
            <View style={styles.formSelector}>
              <Text style={styles.formSelectorTitle}>Formas disponibles:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.formButtonsContainer}
              >
                {pokemon.varieties.map((variety, index) => (
                  <TouchableOpacity
                    key={variety.id}
                    style={[
                      styles.formButton,
                      selectedForm === index && styles.formButtonActive
                    ]}
                    onPress={() => setSelectedForm(index)}
                  >
                    <Text style={[
                      styles.formButtonText,
                      selectedForm === index && styles.formButtonTextActive
                    ]}>
                      {variety.displayName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <ScrollView style={styles.scrollContent}>
            {/* Tipos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipos</Text>
              <View style={styles.typesRow}>
                {currentForm.types.map((type, index) => (
                  <View
                    key={index}
                    style={[styles.typeBadge, { backgroundColor: type.color }]}
                  >
                    <Text style={styles.typeBadgeText}>{type.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Descripción */}
            {pokemon.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{pokemon.description}</Text>
              </View>
            )}

            {/* Medidas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Características</Text>
              <View style={styles.characteristicsRow}>
                <View style={styles.characteristic}>
                  <Ionicons name="resize" size={24} color={mainType.color} />
                  <Text style={styles.characteristicLabel}>Altura</Text>
                  <Text style={styles.characteristicValue}>{currentForm.height} m</Text>
                </View>
                <View style={styles.characteristicDivider} />
                <View style={styles.characteristic}>
                  <Ionicons name="barbell" size={24} color={mainType.color} />
                  <Text style={styles.characteristicLabel}>Peso</Text>
                  <Text style={styles.characteristicValue}>{currentForm.weight} kg</Text>
                </View>
              </View>
            </View>

            {/* Estadísticas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estadísticas Base</Text>
              {currentForm.stats.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statName}>{stat.name}</Text>
                  <View style={styles.statBarContainer}>
                    <View
                      style={[
                        styles.statBar,
                        {
                          width: `${(stat.value / 255) * 100}%`,
                          backgroundColor: mainType.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
              ))}
            </View>

            {/* Cadena de evolución */}
            {pokemon.evolutionChain && pokemon.evolutionChain.length > 1 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Evoluciones</Text>
                <View style={styles.evolutionChain}>
                  {pokemon.evolutionChain.map((evo, index) => (
                    <React.Fragment key={evo.id}>
                      <View style={styles.evolutionItem}>
                        <Text style={styles.evolutionName}>
                          {evo.name}
                        </Text>
                        <Text style={styles.evolutionId}>
                          #{evo.id.toString().padStart(3, '0')}
                        </Text>
                      </View>
                      {index < pokemon.evolutionChain.length - 1 && (
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color="#999"
                          style={styles.evolutionArrow}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            )}

            {/* Habilidades CON DESCRIPCIÓN */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Habilidades</Text>
              {currentForm.abilities.map((ability, index) => (
                <View key={index} style={styles.abilityCard}>
                  <View style={styles.abilityHeader}>
                    <Text style={styles.abilityName}>{ability.name}</Text>
                    {ability.isHidden && (
                      <View style={styles.hiddenBadge}>
                        <Text style={styles.hiddenText}>Oculta</Text>
                      </View>
                    )}
                  </View>
                  {ability.description && (
                    <Text style={styles.abilityDescription}>{ability.description}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Debilidades */}
            {currentForm.weaknesses && currentForm.weaknesses.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Debilidades</Text>
                <View style={styles.weaknessesRow}>
                  {currentForm.weaknesses.map((weakness, index) => (
                    <View
                      key={index}
                      style={[styles.weaknessChip, { backgroundColor: weakness.color }]}
                    >
                      <Text style={styles.weaknessText}>{weakness.name}</Text>
                      {weakness.multiplier > 2 && (
                        <Text style={styles.weaknessMultiplier}>×{weakness.multiplier}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Datos de especie */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Datos de Especie</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Especie</Text>
                  <Text style={styles.dataValue}>{pokemon.genus}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Color</Text>
                  <Text style={styles.dataValue}>{pokemon.color}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Generación</Text>
                  <Text style={styles.dataValue}>{pokemon.generation}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Ratio de captura</Text>
                  <Text style={styles.dataValue}>{pokemon.captureRate}</Text>
                </View>
              </View>
            </View>

            {/* Crianza */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Crianza</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Grupos huevo</Text>
                  <Text style={styles.dataValue}>{pokemon.eggGroups.join(', ')}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Género</Text>
                  <Text style={styles.dataValue}>{pokemon.gender}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Pasos para eclosión</Text>
                  <Text style={styles.dataValue}>{pokemon.hatchCounter} ciclos ({pokemon.hatchCounter * 256} pasos)</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Exp. en nivel 100</Text>
                  <Text style={styles.dataValue}>{pokemon.growthRate}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Amistad base</Text>
                  <Text style={styles.dataValue}>{pokemon.baseHappiness}</Text>
                </View>
              </View>
            </View>

            {/* Cantidad en colección */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>En tu colección</Text>
              <View style={styles.collectionControls}>
                <TouchableOpacity
                  style={[styles.collectionButton, { backgroundColor: '#e74c3c' }]}
                  onPress={handleRemove}
                  disabled={quantity === 0}
                >
                  <Ionicons name="remove" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.collectionQuantity}>
                  <Text style={styles.collectionQuantityText}>{quantity}</Text>
                  <Text style={styles.collectionQuantityLabel}>cartas</Text>
                </View>

                <TouchableOpacity
                  style={[styles.collectionButton, { backgroundColor: mainType.color }]}
                  onPress={handleAdd}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
    borderTopWidth: 5,
  },
  header: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'relative',
    minHeight: 180,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  headerInfo: {
    marginTop: 10,
  },
  headerNumber: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
  },
  headerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  headerGenus: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  headerForm: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 3,
    fontStyle: 'italic',
  },
  headerSprite: {
    position: 'absolute',
    right: 10,
    bottom: -20,
    width: 150,
    height: 150,
  },
  formSelector: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  formSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  formButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  formButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  formButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  formButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  formButtonTextActive: {
    color: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  characteristicsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
  },
  characteristic: {
    flex: 1,
    alignItems: 'center',
  },
  characteristicDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
  },
  characteristicLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  characteristicValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 3,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statName: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  evolutionChain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 15,
  },
  evolutionItem: {
    alignItems: 'center',
  },
  evolutionName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  evolutionId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  evolutionArrow: {
    marginHorizontal: 10,
  },
  collectionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
  },
  collectionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  collectionQuantity: {
    marginHorizontal: 30,
    alignItems: 'center',
  },
  collectionQuantityText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  collectionQuantityLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  abilityCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  abilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  abilityName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  hiddenBadge: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hiddenText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  abilityDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginTop: 5,
  },
  weaknessesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weaknessChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weaknessText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  weaknessMultiplier: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  dataGrid: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
  },
  dataItem: {
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});
