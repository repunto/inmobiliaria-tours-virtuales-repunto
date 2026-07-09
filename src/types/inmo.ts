export interface AutoRotateSettings {
  enabled: boolean;
  speed?: number; // Velocidad de rotación
  idleDelay?: number; // Tiempo de inactividad antes de girar (ms)
}

export interface AudioSettings {
  ambientEnabled: boolean;
  ambientVolume?: number; // Volumen por defecto de 0.0 a 1.0
}

export interface InmoSettings {
  initialSceneId: string;
  defaultTransitionDuration?: number; // Duración de transición en ms
  autoRotate?: AutoRotateSettings;
  audio?: AudioSettings;
}

export type HotspotType = 'navigation' | 'info' | 'video' | 'link' | 'action';

export interface HotspotStyle {
  icon?: string; // Nombre del icono de lucide (ej: "arrow-up", "info", "play")
  color?: string; // Color hexadecimal (ej: "#d4af37")
  pulse?: boolean; // Efecto de pulsación animada
}

export interface Hotspot {
  id: string;
  type: HotspotType;
  yaw: number; // Posición horizontal [-180, 180]
  pitch: number; // Posición vertical [-90, 90]
  title: string;
  description?: string;
  targetSceneId?: string; // Requerido para tipo 'navigation'
  mediaUrl?: string; // Requerido para tipo 'info' (imagen) o 'video' (vídeo)
  contentUrl?: string; // Requerido para tipo 'link'
  style?: HotspotStyle;
}

export interface SceneAudio {
  url: string;
  loop?: boolean;
  spatial?: boolean; // Si el audio es posicional en 3D
}

export interface InitialView {
  yaw: number;
  pitch: number;
  fov: number; // Zoom inicial
}

export interface Limits {
  pitchMin?: number;
  pitchMax?: number;
  fovMin?: number;
  fovMax?: number;
}

export type SceneType = 'panorama' | '3d-model';

export interface Scene {
  id: string;
  name: string;
  type: SceneType;
  panoramaUrl?: string; // Requerido si type es 'panorama'
  modelUrl?: string; // Requerido si type es '3d-model' (ruta a .glb)
  initialView: InitialView;
  limits?: Limits;
  audio?: SceneAudio;
  hotspots?: Hotspot[];
}

export interface RoomCoord {
  sceneId: string;
  coords: { x: number; y: number };
  name: string;
}

export interface FloorPlan {
  imageUrl: string;
  rooms: RoomCoord[];
}

export interface InmoData {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  author?: string;
  createdAt?: string;
  price?: number;
  currency?: string;
  location?: string;
  address?: string; // Dirección exacta de la propiedad
  mapsUrl?: string; // URL de Google Maps/Street View o Earth
  area?: number;
  rooms?: number;
  baths?: number;
  parking?: number;
  settings: InmoSettings;
  scenes: Scene[];
  floorPlan?: FloorPlan;
}
