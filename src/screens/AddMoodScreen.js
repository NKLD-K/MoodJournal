import { Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS, SHADOWS, SIZES } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddMoodScreen = ({route, navigation}) => {
    const {selectedMood} = route.params;
    const [note, setNote] = useState("");
    const [isLoading, setisLoading] = useState(false);
      const [fadeAnim] = useState(new Animated.Value(0))
      const [slideAnim] = useState(new Animated.Value(40))

      useEffect(() => {
          Animated.parallel([
              Animated.timing(fadeAnim,{
                  toValue: 1,
                  duration:500,
                  useNativeDriver: true
              }),
      
              Animated.timing(slideAnim,{
                  toValue: 0,
                  duration:450,
                  useNativeDriver: true
              })
          ]).start()
      
      }, [])


  const saveMoodEntry = async() => {
    if(isLoading) return;

    setisLoading(true)
    try {
      const newEntry = {
          id: Date.now().toString(),
          mood: selectedMood,
          note:note.trim(),
          date: new Date().toISOString()
      }

      const existingEntries = await AsyncStorage.getItem('moodEntries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];

      const today = new Date().toDateString();
      const existingTodayIndex =entries.findIndex(entry => new Date(entry.date).toDateString() == today)

      if(existingTodayIndex !==-1){
        entries[existingTodayIndex] = newEntry
      }else{
        entries.unshift(newEntry)
      }
      await AsyncStorage.setItem('moodEntries', JSON.stringify(entries))

      Alert.alert('Succes!', 'Votre humeur a ete enregistre.',
        [{text: "ok", onPress: () => navigation.goBack()}]
      )
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde: ", error)
      Alert.alert("Erreur", 'Impossible de sauvegarder votre humeur')
    } finally{
        setisLoading(false)
    }
  }   

  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle={"dark-content"}/>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? 'padding' : 'height'}
        style={[styles.keyboardView,{backgroundColor: COLORS.background}]}
      >
        <View style={styles.content}>
          <Animated.View
            style={
                {opacity: fadeAnim, transform: [{translateY: slideAnim}]}
            }
          >
              <TouchableOpacity 
              style={styles.backButton}
              onPress={()=> navigation.goBack()}
              activeOpacity={0.7}
              >
                <Feather name='arrow-left' size={20} color={COLORS.primary}/>
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
          </Animated.View>

          <Animated.View
              style={[
                styles.moodDisplay, {
                  opacity:fadeAnim, transform: [{translateY: slideAnim}]
                }
              ]}
          >
            <View style={[styles.moodCard, SHADOWS.medium]}>
                <View style={[styles.moodCardContent, {backgroundColor:selectedMood.color}]}>
                    <View style={styles.moodEmojiContainer}>
                      <Text style={styles.selectedEmoji}>{selectedMood.emoji}</Text>
                    </View>
                    <Text style={styles.selectedMoodName}>{selectedMood.name}</Text>
                </View>
            </View>

          </Animated.View>

          <Animated.View
            style={[styles.inputContainer, {opacity: fadeAnim, transform:[{translateY:slideAnim}]}]}
          >
            <Text style={styles.inputLabel}>
              <Feather name='edit-3' size={16} color={COLORS.primary} style={styles.inputIcon}/>
              Que s'est-il passe aujourd'hui ?
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder='Partagez vos pensees...'
                placeholderTextColor={COLORS.gray}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={5}
                textAlignVertical='top'
              />
            </View>
          </Animated.View>

          <Animated.View
              style={[{opacity: fadeAnim, transform:[{translateY: slideAnim}]}]}
          >
              <TouchableOpacity
                  style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                  onPress={saveMoodEntry}
                  disabled={isLoading}
                  activeOpacity={0.8}
              >
                <View style={styles.saveButtonContent}>
                <Feather name='check' size={16} color={COLORS.white} style={styles.buttonIcon }/>
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </Text>
                </View>
              </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
      
    </SafeAreaView>
  )
}

export default AddMoodScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: SIZES.padding.large,
        paddingHorizontal: SIZES.padding.large,
        paddingBottom: SIZES.padding.large,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.padding.xlarge,
        paddingVertical: SIZES.padding.small,
        paddingHorizontal: SIZES.padding.small,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: SIZES.radius.medium,
        marginTop: 30
    },
    backButtonText: {
        color: COLORS.darkText,
        fontWeight: '500',
        marginLeft: 6,
    },
    moodDisplay: {
        alignItems: 'center',
        marginBottom: SIZES.padding.xlarge,
    },
    moodCard: {
        borderRadius: SIZES.radius.medium,
        overflow: 'hidden',
        width: '100%',
    },
    moodCardContent: {
        padding: SIZES.padding.large,
        alignItems: 'center',
        borderRadius: SIZES.radius.medium,
    },
    moodEmojiContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 40,
        marginBottom: SIZES.padding.medium,
        ...SHADOWS.small,
    },
    selectedEmoji: {
        fontSize: 46,
    },
    selectedMoodName: {
        ...FONTS.h3,
        color: 'white',
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: SIZES.padding.xlarge,
    },
    inputLabel: {
        ...FONTS.body,
        color: COLORS.darkText,
        marginBottom: SIZES.padding.medium,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        marginRight: 8,
    },
    textInputContainer: {
        borderRadius: SIZES.radius.medium,
        overflow: 'hidden',
        ...SHADOWS.small,
    },
    textInput: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius.medium,
        padding: SIZES.padding.large,
        color: COLORS.darkText,
        fontSize: SIZES.body,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    saveButton: {
        borderRadius: SIZES.radius.medium,
        overflow: 'hidden',
        backgroundColor: COLORS.primary,
        ...SHADOWS.small,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.padding.medium,
        borderRadius: SIZES.radius.medium,
    },
    buttonIcon: {
        marginRight: 8,
    },
    saveButtonText: {
        ...FONTS.button,
        color: COLORS.white,
        fontWeight: '600',
    },
});