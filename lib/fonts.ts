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

export const fontVariables = [
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
