import React, { useState } from 'react';
import { Modal, View, ScrollView, StyleSheet, Image, Text, TouchableOpacity,StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PokemonTCGGallery from '../components/PokemonTCGGallery';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PokemonDetailModal({ pokemon, visible, onClose, collection, onUpdateCollection }) {
  if (!pokemon) return null;

  const [selectedForm, setSelectedForm] = useState(0);
  const [activeTab, setActiveTab] = useState('info');

  const hasVarieties = pokemon.varieties && pokemon.varieties.length > 1;

  const getCurrentFormData = () => {
    if (!hasVarieties) {
      return {
        types: pokemon.types,
        stats: pokemon.stats,
        abilities: pokemon.abilities,
        sprite: pokemon.sprite,
        height: pokemon.height,
        weight: pokemon.weight,
        weaknesses: pokemon.weaknesses,
        formName: 'Normal',
        description: pokemon.description,
        genus: pokemon.genus,
      };
    }

    const variety = pokemon.varieties[selectedForm];

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
      abilities: variety.abilities,
      sprite: variety.sprite,
      height: variety.height / 10,
      weight: variety.weight / 10,
      weaknesses: varietyWeaknesses,
      formName: variety.displayName,
      description: variety.description || pokemon.description,
      genus: variety.genus || pokemon.genus,
    };
  };

  const currentForm = getCurrentFormData();
  const mainType = currentForm.types[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: mainType.color }]}>
        <StatusBar barStyle="light-content" backgroundColor={mainType.color} />
        
        <View style={styles.modalContent}>
          {/* Header compacto */}
          <View style={[styles.header, { backgroundColor: mainType.color }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerNumber}>#{pokemon.id.toString().padStart(3, '0')}</Text>
              <Text style={styles.headerName}>{pokemon.name}</Text>
              <Text style={styles.headerGenus}>{currentForm.genus}</Text>
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

          {/* Pestañas */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'info' && styles.tabActive]}
              onPress={() => setActiveTab('info')}
            >
              <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
                Información
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'cards' && styles.tabActive]}
              onPress={() => setActiveTab('cards')}
            >
              <Text style={[styles.tabText, activeTab === 'cards' && styles.tabTextActive]}>
                Cartas TCG
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contenido */}
          <View style={{ flex: 1 }}>
            {activeTab === 'info' ? (
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
                {currentForm.description && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>{currentForm.description}</Text>
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
                            <Text style={styles.evolutionName}>{evo.name}</Text>
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

                {/* Habilidades */}
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
                      <Text style={styles.dataValue}>{currentForm.genus}</Text>
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

                <View style={{ height: 20 }} />
              </ScrollView>
            ) : (
              <PokemonTCGGallery 
                pokemonName={pokemon.name} 
                formName={currentForm.formName}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    paddingTop: 5,
    position: 'relative',
    minHeight: 115,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginTop: 0,
  },
  headerNumber: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
  },
  headerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  headerGenus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 3,
  },
  headerForm: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontStyle: 'italic',
  },
  headerSprite: {
    position: 'absolute',
    right: 10,
    bottom: -10,
    width: 120,
    height: 120,
  },
  formSelector: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  formSelectorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  formButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  formButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  formButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  formButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  formButtonTextActive: {
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#e74c3c',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#e74c3c',
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