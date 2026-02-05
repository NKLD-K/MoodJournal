import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, FONTS, SHADOWS, MOODS } from '../theme';
import { Feather } from '@expo/vector-icons';

export default function HistoryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    loadEntries();
    
    // Animation de démarrage
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('moodEntries');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (entryId) => {
    Alert.alert(
      'Supprimer l\'entrée',
      'Êtes-vous sûr de vouloir supprimer cette entrée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedEntries = entries.filter(entry => entry.id !== entryId);
              await AsyncStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
              setEntries(updatedEntries);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer l\'entrée.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const renderEntry = ({ item, index }) => {
    // Animation décalée pour chaque carte
    const itemFadeAnim = new Animated.Value(0);
    const itemTranslateYAnim = new Animated.Value(20);
    
    Animated.parallel([
      Animated.timing(itemFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true
      }),
      Animated.timing(itemTranslateYAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true
      })
    ]).start();
    
    return (
      <Animated.View 
        style={[
          styles.entryCard, 
          { 
            opacity: itemFadeAnim, 
            transform: [{ translateY: itemTranslateYAnim }],
          }
        ]}
      >
        <View style={[styles.moodColorIndicator, {backgroundColor: item.mood.color[0]}]} />
        <View style={styles.entryCardInner}>
          <View style={styles.entryHeader}>
            <View style={styles.entryMood}>
              <View style={[styles.emojiContainer, { backgroundColor: item.mood.color[0] + '30' }]}>
                <Text style={styles.entryEmoji}>{item.mood.emoji}</Text>
              </View>
              <View>
                <Text style={styles.entryMoodName}>{item.mood.name}</Text>
                <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteEntry(item.id)}
            >
              <Feather name="trash-2" size={16} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>
          
          {item.note ? (
            <View style={styles.noteContainer}>
              <Text style={styles.entryNote}>{item.note}</Text>
            </View>
          ) : (
            <View style={styles.noteContainer}>
              <Text style={styles.entryNoNote}>Aucune note</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>Historique</Text>
          
          {/* Bouton invisible pour l'équilibre visuel */}
          <View style={styles.placeholderIcon}></View>
        </View>
      </Animated.View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : entries.length === 0 ? (
        <Animated.View 
          style={[styles.emptyContainer, { 
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }] 
          }]}
        >
          <View style={styles.emptyIconContainer}>
            <Feather name="calendar" size={34} color={COLORS.gray} />
          </View>
          <Text style={styles.emptyText}>Aucune entrée</Text>
          <Text style={styles.emptySubtext}>Commencez à suivre votre humeur quotidienne dès aujourd'hui.</Text>
          
          <TouchableOpacity 
            style={styles.addFirstButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <View style={styles.addFirstButtonContent}>
              <Feather name="plus" size={16} color={COLORS.white} style={styles.buttonIcon} />
              <Text style={styles.addFirstText}>Ajouter une humeur</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SIZES.padding.large,
    paddingHorizontal: SIZES.padding.large,
    paddingBottom: SIZES.padding.medium,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: SIZES.padding.small,
    borderRadius: SIZES.radius.medium,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop:30
  },
  placeholderIcon: {
    width: 40,  // Pour l'équilibre visuel
  },
  title: {
    ...FONTS.h2,
    color: COLORS.darkText,
    textAlign: 'center',
    marginTop:30
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.body,
    color: COLORS.darkText,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.xlarge,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding.large,
    ...SHADOWS.small,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: SIZES.padding.medium,
  },
  emptySubtext: {
    ...FONTS.body,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.padding.xlarge,
  },
  addFirstButton: {
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  addFirstButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding.medium,
    paddingHorizontal: SIZES.padding.large,
  },
  buttonIcon: {
    marginRight: SIZES.padding.small,
  },
  addFirstText: {
    ...FONTS.button,
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding.large,
    paddingTop: SIZES.padding.medium,
    paddingBottom: SIZES.padding.xlarge,
  },
  entryCard: {
    marginBottom: SIZES.padding.medium,
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    ...SHADOWS.medium,
  },
  moodColorIndicator: {
    width: 8,
    height: '100%',
  },
  entryCardInner: {
    flex: 1,
    padding: SIZES.padding.large,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding.medium,
  },
  entryMood: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding.medium,
  },
  entryEmoji: {
    fontSize: 22,
  },
  entryMoodName: {
    ...FONTS.h3,
    color: COLORS.darkText,
    marginBottom: 2,
  },
  deleteButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: SIZES.radius.small,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryDate: {
    ...FONTS.caption,
    color: COLORS.darkText,
  },
  noteContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    marginTop: SIZES.padding.small,
  },
  entryNote: {
    ...FONTS.body,
    color: COLORS.darkText,
    lineHeight: 22,
  },
  entryNoNote: {
    ...FONTS.body,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});