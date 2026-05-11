import aiRetrospective from "../assets/blog/ai-retrospective.png";
import cognitiveLoadTheory from "../assets/blog/cognitive-load-theory.png";
import leavingSpotify from "../assets/blog/leaving-spotify.png";
import milimetradoSticker from "../assets/blog/milimetrado_sticker.webp";
import modelContextProtocol from "../assets/blog/model-context-protocol.svg";
import mrLinkedinsWildRide from "../assets/blog/mr-linkedins-wild-ride.png";
import phpIn2024 from "../assets/blog/php-in-2024.webp";
import stateOfBrowsers2026 from "../assets/blog/state-of-the-browsers-in-2026.webp";
import structuredJournaling from "../assets/blog/structured-journaling-for-developers.webp";
import wordpressPlatformEngineering from "../assets/blog/wordpress-platform-engineering-2026.webp";

import type { ImageMetadata } from "astro";

type BlogHeroRasterFormat = "avif" | "jpg" | "jpeg" | "png" | "webp";

type BlogHeroImage = {
  asset: ImageMetadata;
  isSvg: true;
} | {
  asset: ImageMetadata;
  fallbackFormat: BlogHeroRasterFormat;
  isSvg: false;
};

const blogHeroImages: Record<string, BlogHeroImage> = {
  "/img/blog/ai-retrospective.webp": {
    asset: aiRetrospective,
    fallbackFormat: "webp",
    isSvg: false,
  },
  "/img/blog/cognitive-load-theory.png": {
    asset: cognitiveLoadTheory,
    fallbackFormat: "png",
    isSvg: false,
  },
  "/img/blog/leaving-spotify.png": {
    asset: leavingSpotify,
    fallbackFormat: "png",
    isSvg: false,
  },
  "/img/blog/model-context-protocol.svg": {
    asset: modelContextProtocol,
    isSvg: true,
  },
  "/img/blog/mr-linkedins-wild-ride.webp": {
    asset: mrLinkedinsWildRide,
    fallbackFormat: "webp",
    isSvg: false,
  },
  "/img/blog/php-in-2024.webp": {
    asset: phpIn2024,
    fallbackFormat: "webp",
    isSvg: false,
  },
  "/img/blog/state-of-the-browsers-in-2026.webp": {
    asset: stateOfBrowsers2026,
    fallbackFormat: "webp",
    isSvg: false,
  },
  "/img/blog/structured-journaling-for-developers.webp": {
    asset: structuredJournaling,
    fallbackFormat: "webp",
    isSvg: false,
  },
  "/img/blog/wordpress-platform-engineering-2026.webp": {
    asset: wordpressPlatformEngineering,
    fallbackFormat: "webp",
    isSvg: false,
  },
  "/milimetrado_sticker.webp": {
    asset: milimetradoSticker,
    fallbackFormat: "webp",
    isSvg: false,
  },
};

export function getBlogHeroImage(path: string | undefined): BlogHeroImage | null {
  if (!path) return null;
  return blogHeroImages[path] ?? null;
}
