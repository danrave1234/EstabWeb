import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Source_Sans_3,
  DM_Sans,
  Libre_Baskerville,
  Nunito,
  Luckiest_Guy,
  Bebas_Neue,
  Archivo,
  Lora,
  Source_Serif_4,
  Cormorant_Garamond,
  Open_Sans,
  Space_Grotesk,
  Plus_Jakarta_Sans,
  Instrument_Serif,
  Poppins,
  Manrope,
} from "next/font/google";

export const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const playfair = Playfair_Display({ variable: "--font-playfair-display", subsets: ["latin"] });
export const sourceSans = Source_Sans_3({ variable: "--font-source-sans-3", subsets: ["latin"] });
export const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
export const libreBaskerville = Libre_Baskerville({ variable: "--font-libre-baskerville", weight: "400", subsets: ["latin"] });
export const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
export const luckiestGuy = Luckiest_Guy({ variable: "--font-luckiest-guy", weight: "400", subsets: ["latin"] });
export const bebasNeue = Bebas_Neue({ variable: "--font-bebas-neue", weight: "400", subsets: ["latin"] });
export const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
export const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
export const sourceSerif = Source_Serif_4({ variable: "--font-source-serif-4", subsets: ["latin"] });
export const cormorant = Cormorant_Garamond({ variable: "--font-cormorant-garamond", weight: "400", subsets: ["latin"] });
export const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"] });
export const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
export const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta-sans", subsets: ["latin"] });
export const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", weight: "400", subsets: ["latin"] });
export const poppins = Poppins({ variable: "--font-poppins", weight: ["400", "500", "600", "700"], subsets: ["latin"] });
export const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const allFontVariables = [
  geistSans.variable,
  geistMono.variable,
  playfair.variable,
  sourceSans.variable,
  dmSans.variable,
  libreBaskerville.variable,
  nunito.variable,
  luckiestGuy.variable,
  bebasNeue.variable,
  archivo.variable,
  lora.variable,
  sourceSerif.variable,
  cormorant.variable,
  openSans.variable,
  spaceGrotesk.variable,
  plusJakarta.variable,
  instrumentSerif.variable,
  poppins.variable,
  manrope.variable,
].join(" ");

export function getFontVariables(theme: string, typographyStyle?: string): string {
  if (typographyStyle) {
    switch (typographyStyle) {
      case "elegant":
        return `${sourceSans.variable} ${playfair.variable}`;
      case "modern":
        return `${plusJakarta.variable} ${plusJakarta.variable}`;
      case "bold":
        return `${spaceGrotesk.variable} ${instrumentSerif.variable}`;
      case "technical":
        return `${spaceGrotesk.variable} ${spaceGrotesk.variable}`;
      case "clinical":
        return `${geistSans.variable} ${sourceSerif.variable}`;
      case "playful":
        return `${nunito.variable} ${nunito.variable}`;
      case "traditional":
        return `${sourceSans.variable} ${libreBaskerville.variable}`;
      case "lucky":
        return `${luckiestGuy.variable} ${luckiestGuy.variable}`;
      case "display":
        return `${bebasNeue.variable} ${bebasNeue.variable}`;
    }
  }

  switch (theme) {
    case "partner":
    case "clinical-gold":
    case "beige-dark-grey":
    case "classic-blue-turquoise-gold":
    case "dark-royal-blue-gold":
      return `${sourceSans.variable} ${playfair.variable}`;
    case "justice":
    case "red-crimson":
    case "red-black":
    case "bright-red-white":
      return `${dmSans.variable} ${libreBaskerville.variable}`;
    case "modern":
    case "blue-shades-white":
    case "navy-electric-blue":
    case "navy-electric":
      return `${geistSans.variable} ${geistSans.variable}`;
    case "frost-fire":
    case "white-lime":
      return `${nunito.variable} ${nunito.variable}`;
    case "reliable":
    case "dark-grey-yellowgreen":
      return `${archivo.variable} ${archivo.variable}`;
    case "eco-clean":
      return `${dmSans.variable} ${lora.variable}`;
    case "surgeon":
      return `${sourceSans.variable} ${sourceSerif.variable}`;
    case "wellness":
    case "pastel-purple-neutral":
    case "white-purple":
      return `${nunito.variable} ${cormorant.variable}`;
    case "holistic":
    case "dark-green-ivory-yellow":
      return `${openSans.variable} ${lora.variable}`;
    case "cyan-ocean":
    case "dark-pink-white":
    case "white-blue-grey":
    case "blue-shades-white-red-violet":
      return `${geistSans.variable} ${sourceSerif.variable}`;
    case "orange-amber":
      return `${plusJakarta.variable} ${lora.variable}`;
    case "blue-mint":
      return `${geistSans.variable} ${lora.variable}`;
    case "nebula":
      return `${spaceGrotesk.variable} ${spaceGrotesk.variable}`;
    case "flow":
    case "bright-green-hot-pink":
    case "gradient-white-dark-blue":
      return `${plusJakarta.variable} ${plusJakarta.variable}`;
    case "estabweb":
      return `${manrope.variable} ${poppins.variable}`;
    case "mono":
      return `${geistSans.variable} ${instrumentSerif.variable}`;
    default:
      return `${geistSans.variable} ${playfair.variable}`;
  }
}
