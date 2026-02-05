import { Dimensions } from "react-native";
//import { Button } from "react-native/types_generated/index";
//import { Color } from "react-native/types_generated/Libraries/Animated/AnimatedExports";

const {width, height} = Dimensions.get('window');

export const COLORS = {
    //couleurs de base - palette monochrome elegante
    primary: '#2A2B47',   //Bleu fonce presque noir
    secondary: '#4B4968', // Bleu-gris fonce
    accent: '#5E6093', //bleu-violet moyen

    // Font monochromes
    background: '#F5F6FA', //Fond tres pale
    card: '#FFFFFF', //Blanc
    cardAlt: '#F0F2F5', //Gris tres pale

    //Etats d'humeur - tons neutres et elegants
    happy: '#65A59A', //Vert-bleu apaisant
    sad: '#6D85A8', //Bleu acier
    tired: '#9A9EB3', //Gris bleu
    angry: '#AB7C85', //Rouge-gris assourdi
    thoughtful: '#8E9B9D', //Vert-gris neutre
    excited: '#D0A97D', //Beige-dore

    //Tons neutres
    white: '#FFFFFF',
    offwhite: '#F8F9FF',
    lightGray: '#E5E9F0',
    gray: '#A9B1C1',
    darkGray: '#454759',
    darkText: "#45222D",
    black: '#21222D',

    //Tons transparents
    transparentWhite10: 'rgba(255, 255, 225, 0.1)',
    transparentWhite20: 'rgba(255, 255, 225, 0.2)',
    transparentWhite50: 'rgba(255, 255, 225, 0.5)',
    transparentWhite70: 'rgba(255, 255, 225, 0.7)',
    transparentBlack5: 'rgba(0, 0, 0, 0.05)',
    transparentBlack10: 'rgba(0, 0, 0, 0.1)',
    transparentBlack30: 'rgba(0, 0, 0, 0.3)',
    transparentPrimary5: 'rgba(42, 43, 71, 0.05)',
    transparentPrimary10: 'rgba(42, 43, 71, 0.1)',
};

export const SIZES = {
    //Dimensions globales
    base: 8,
    radius: {
        small: 8,
        medium: 12,
        large: 16,
    },

    //Typographie
    title: 24,
    subtitle: 17,
    body: 15,
    caption: 13,
    small: 11,

    //Padding
    padding: {
        small: 8,
        medium: 16,
        large: 24,
        xlarge: 32,
        xxlarge: 48,
    },

    //Dimensions d'ecran
    width,
    height,

    //Grille 
    moodCardWidth: (width - 48) / 2, // 2 cartes par ligne avec une marge de 16px   
};

export const FONTS = {
    title: {
        fontSize: SIZES.title,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.2,
    },
    titleLight: {
        fontSize: SIZES.title,
        fontWeight: '600',
        color: COLORS.white,
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: SIZES.subtitle,
        fontWeight: '600',
        color: COLORS.primary,
        letterSpacing: 0.1,
    },
    subtitleLight: {
        fontSize: SIZES.subtitle,
        fontWeight: '600',
        color: COLORS.white,
        letterSpacing: 0.1,
    },
    body: {
        fontSize: SIZES.body,
        fontWeight: '400',
        color: COLORS.darkGray,
        letterSpacing:0.1,
    },
    bodyLight: {
        fontSize: SIZES.body,
        fontWeight: '400',
        color: COLORS.gray,
    },
    caption: {
        fontSize: SIZES.caption,
        fontWeight: '400',
        color: COLORS.gray,
    },
    captionLight: {
        fontSize: SIZES.caption,
        fontWeight: '400',
        color: COLORS.transparentWhite70,
    },
    Button: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.white,
    },
};

export const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.5,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.16,
        shadowRadius: 3.5,
        elevation: 4,
    },
    large: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 5,
        elevation: 6,
    },
};

//Nouvelles humeurs avec couleurs sobres
export const MOODS = [
    {emoji: '😊', name: 'Heureux', color: COLORS.happy},
    {emoji: '😢', name: 'triste', color: COLORS.sad},
    {emoji: '😴', name: 'Fatigue', color: COLORS.tired},
    {emoji: '😡', name: 'Enerve', color: COLORS.angry},
    {emoji: '🤔', name: 'Pensif', color: COLORS.thoughtful},
    {emoji: '🥳', name: 'Excite', color: COLORS.excited},
];

export default { COLORS, SIZES, FONTS, SHADOWS, MOODS};