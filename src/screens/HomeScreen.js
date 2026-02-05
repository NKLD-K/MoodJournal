import { Animated, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { COLORS, FONTS, MOODS, SHADOWS, SIZES } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
    const [todayMood, setTodayMood] = useState(null);
    const [totalEntries, setTodayEntries] = useState(0);
    const [fadeAnim] = useState(new Animated.Value(0))
    const [translateYAnim] = useState(new Animated.Value(15))

useEffect(() => {
    Animated.parallel([
        Animated.timing(fadeAnim,{
            toValue: 1,
            duration:500,
            useNativeDriver: true
        }),

        Animated.timing(translateYAnim,{
            toValue: 0,
            duration:450,
            useNativeDriver: true
        })
    ]).start()

}, [])

useFocusEffect(
    useCallback(()=>{
        loadTodayMood()
        loadTotalEntries()
        return () => {}
    }, [])
)

const loadTodayMood = async() => {
    try {
        const today = new Date().toDateString();
        const entries = await AsyncStorage.getItem("moodEntries")
        if(entries){
            const parseEntries = JSON.parse(entries)
            const todayEntry = parseEntries.find(entry => new Date(entry.date).toDateString() == today)
            if(todayEntry){
                setTodayMood(todayEntry)
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement: ",error)
    }
}
const loadTotalEntries = async () =>{
    try {
        const entries = await AsyncStorage.getItem("moodEntries")
        if(entries){
            const parseEntries = JSON.parse(entries)
            setTodayEntries(parseEntries.length)
        }
    } catch (error) {
        console.error("Erreur lors du chargement: ",error)
    }
}

const selectMood = (mood) =>{
    navigation.navigate('AddMood',{selectedMood : mood})
    //navigation.navigate('AddMood',{selectedMood : mood})
}


  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle={"dark-content"} backgroundColor={COLORS.background}/>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
            <Animated.View
                style={[styles.Header,
                    {opacity: fadeAnim, transform: [{translateY: translateYAnim}]}
                ]}
            >
                <View style={styles.titleContainer} >
                    <Text style={styles.title} >MoodJournal</Text>
                </View>
                <Text style={styles.subtitle}>Comment vous sentez-vous aujoud'hui ?</Text>
            </Animated.View>
                {
                    todayMood ? (
                        <Animated.View
                        style={[styles.todayMoodCard, SHADOWS.medium, {opacity: fadeAnim,transform:[{translateY: translateYAnim}]}]}
                        >
                            <View style={[styles.todayMoodContent, {backgroundColor: todayMood.mood.color}]}>
                                <View style={styles.todayMoodHeader}>
                                    <Text style={styles.todayMoodTitle}>Aujourd'hui</Text>
                                    <View>
                                        <Text>{todayMood.mood.emoji}</Text>
                                    </View>
                                </View>
                                <Text>{todayMood.mood.name}</Text>
                                {todayMood.note && (
                                    <View style={styles.noteContainer}>
                                        <Text style={styles.todayMoodNote}
                                        numberOfLines={2}
                                        >{todayMood.note}</Text>
                                    </View>
                                )}
                            </View>
                        </Animated.View>
                    ) : (
                        null
                    )
                }
                <Text style={styles.sectionTitle}>Selectionnez votre humeur</Text>
                <View style={styles.moodsGrid}>
                {
                    MOODS?.map((mood, index) =>{
                        const delayedFadeAnim = new Animated.Value(0);
                        const delayedTranslateYAnim = new Animated.Value(20)

                         Animated.parallel([
                            Animated.timing(delayedFadeAnim,{
                                toValue: 1,
                                duration: 400,
                                delay: index * 70,
                                useNativeDriver: true
                            }),
                            Animated.timing(delayedTranslateYAnim,{
                                toValue: 0,
                                duration: 400,
                                delay: index * 70,
                                useNativeDriver: true
                            }),
                         ]).start();

                         return (
                            <Animated.View
                                key={index}
                                style={{ 
                                    opacity: delayedFadeAnim,
                                    transform: [{translateY: delayedTranslateYAnim}]
                                 }}
                            >
                                <TouchableOpacity
                                    style={[styles.moodCard, SHADOWS.small]}
                                    onPress={() => selectMood(mood)}
                                    activeOpacity={0.7}
                                >
                                <View style={[styles.moodCardContent, {backgroundColor:COLORS.card}]} >
                                    <View style={[styles.moodEmojiCircle, {backgroundColor: mood.color + '20'}]}>
                                        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                    </View>
                                    <Text style={styles.moodName}>{mood.name}</Text>
                                </View>

                                </TouchableOpacity>

                            </Animated.View>
                         )
                    })
                }
                </View>
                <View style={styles.bottomSection}>
                    <View style={[styles.statsCard, SHADOWS.small]}>
                        <Feather name='bar-chart-2' color={COLORS.accent}/>
                        <View style={styles.statTextContainer}>
                            <Text style={styles.statNumber}>{totalEntries}</Text>
                            <Text style={styles.statLabel}>Entree totales</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.historyButton, SHADOWS.small]}
                    onPress={()=> navigation.navigate("History")}
                    >
                        <View style={styles.historyButtonContent}>
                            <Feather name='clock' size={18} color={COLORS.white} style={styles.buttonIcon}/>
                            <Text style={styles.historyButtonText}>Voir l'historique</Text>
                        </View>
                    </TouchableOpacity>
                </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: SIZES.padding.large,
        paddingBottom: SIZES.padding.xlarge,
    },
    Header: {
        paddingHorizontal: SIZES.padding.large,
        marginBottom: SIZES.padding.large,
    },
    titleContainer: {
        marginBottom: SIZES.padding.small,
    },
    title: {
        ...FONTS.title,
        color: COLORS.primary,
        letterSpacing: 0.5,
    },
    subtitle: {
        ...FONTS.body,
        color: COLORS.darkGray,
        marginTop: SIZES.padding.small / 2,
    },
    sectionTitle: {
    ...FONTS.subtitle,
    color: COLORS.primary,
    marginTop: SIZES.padding.large,
    marginBottom: SIZES.padding.medium,
    paddingHorizontal: SIZES.padding.large,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding.large,
  },
  moodCard: {
    width: SIZES.moodCardWidth,
    marginBottom: SIZES.padding.medium,
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
  },
  moodCardContent: {
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 0.9,
  },
  moodEmojiCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding.medium,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodName: {
    ...FONTS.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    fontWeight: '500',
  },
  todayMoodCard: {
    marginHorizontal: SIZES.padding.large,
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
    marginBottom: SIZES.padding.large,
    backgroundColor: COLORS.white,
  },
  todayMoodContent: {
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.large,
  },
  todayMoodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding.medium,
  },
  moodEmojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayMoodTitle: {
    ...FONTS.body,
    color: COLORS.darkText,
    fontWeight: '500',
  },
  todayMoodName: {
    ...FONTS.subtitle,
    color: COLORS.darkText,
    fontWeight: '700',
    marginBottom: SIZES.padding.medium,
  },
  noteContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: SIZES.radius.small,
    padding: SIZES.padding.medium,
  },
  todayMoodNote: {
    ...FONTS.caption,
    color: COLORS.darkText,
  },
  todayMoodEmoji: {
    fontSize: 24,
  },
  bottomSection: {
    paddingHorizontal: SIZES.padding.large,
    marginTop: SIZES.padding.large,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.large,
    marginBottom: SIZES.padding.large,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTextContainer: {
    marginLeft: SIZES.padding.medium,
  },
  statNumber: {
    ...FONTS.subtitle,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.gray,
  },
  historyButton: {
    borderRadius: SIZES.radius.medium,
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
  },
  historyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding.medium,
    borderRadius: SIZES.radius.medium,
  },
  buttonIcon: {
    marginRight: 8,
  },
  historyButtonText: {
    ...FONTS.button,
  },
})