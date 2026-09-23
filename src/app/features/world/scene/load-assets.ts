import { AnimationClip, Group, LoadingManager, Object3D, TextureLoader, SRGBColorSpace } from 'three';
import { DeckTextures } from '../model/deck-textures';
import { prepareAsset } from './prepare-asset';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';

/**
 * Carga de modelos glTF reales (CC0, en `public/models/`). Un solo `LoadingManager` para saber
 * cuándo está todo listo. Los props se clonan al colocarlos: el mismo modelo, muchas veces.
 */

export interface LoadedCharacter {
  readonly model: Group;
  readonly clips: readonly AnimationClip[];
}

export interface AssetLibrary {
  readonly deck: DeckTextures;
  readonly developer: LoadedCharacter;
  readonly dog: LoadedCharacter;
  readonly props: ReadonlyMap<string, Object3D>;
}

export const CYBER_PROPS = [
  'Platform_4x4', 'Platform_4x2', 'Platform_2x2', 'Platform_4x1', 'Support_Long', 'Support_Short',
  'Rail_Long', 'Light_Street_1', 'Light_Street_2', 'Light_Square', 'Antenna_1', 'Antenna_2',
  'Cable_Long', 'Cable_Small', 'Pipe_1', 'AC', 'AC_Side', 'AC_Stacked', 'Computer', 'Computer_Large',
  'TV_1', 'TV_2', 'TV_3', 'Sign_Small_3', 'Door', 'Lootbox_Base', 'Pickup_Tank', 'Pickup_Health',
  'Collectible_Board', 'Collectible_Gear', 'Turret_Teleporter', 'Tank', 'Lever_Base', 'Drone', 'Drone_2',
  'Turret_Gun_Base', 'Turret_GunDouble_Base', 'Robot_Cube',
];

export function loadAssets(onProgress?: (ratio: number) => void): Promise<AssetLibrary> {
  const manager = new LoadingManager();
  manager.onProgress = (_url, loaded, total) => onProgress?.(loaded / total);
  const loader = new GLTFLoader(manager);
  const textureLoader = new TextureLoader(manager);
  const deck = Promise.all(['library-slate-v1.png', 'deck-nor_gl.jpg', 'deck-rough.jpg'].map(name => textureLoader.loadAsync(`textures/world/${name}`)))
    .then(([color, normal, roughness]): DeckTextures => {
      color.colorSpace = SRGBColorSpace;
      [color, normal, roughness].forEach(texture => { texture.anisotropy = 4; });
      return { color, normal, roughness };
    });

  const character = (url: string) =>
    loader.loadAsync(url).then((gltf): LoadedCharacter => ({ model: prepareAsset(gltf.scene), clips: gltf.animations }));

  const developer = character('models/character/developer.glb');
  const dog = character('models/animals/dog.glb');
  const props = Promise.all(
    CYBER_PROPS.map((name) =>
      loader.loadAsync(`models/cyber/${name}.glb`).then((gltf) => [name, prepareAsset(gltf.scene)] as const),
    ),
  ).then((entries) => new Map(entries));

  return Promise.all([developer, dog, props, deck]).then(([dev, pet, library, deck]) => ({
    deck,
    developer: dev,
    dog: pet,
    props: library,
  }));
}

/** Copia independiente de un prop, lista para colocar. */
export function placeProp(library: AssetLibrary, name: string): Object3D {
  const source = library.props.get(name);
  if (!source) {
    throw new Error(`Modelo no cargado: ${name}`);
  }
  return source.clone(true);
}

/** Prop con esqueleto (robots del kit): `Object3D.clone` no duplica los huesos y queda invisible. */
export function placeSkinnedProp(library: AssetLibrary, name: string): Object3D {
  const source = library.props.get(name);
  if (!source) {
    throw new Error(`Modelo no cargado: ${name}`);
  }
  return cloneSkinned(source);
}

/** Copia de un personaje con esqueleto: `Object3D.clone` no duplica los huesos, `SkeletonUtils` sí. */
export function cloneCharacter(character: LoadedCharacter): Group {
  return cloneSkinned(character.model) as Group;
}
