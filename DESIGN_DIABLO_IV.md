# 🎨 Améliorations Design Style Diablo IV

## Références
- [Diablo IV - Xbox](https://www.xbox.com/fr-fr/games/diablo-iv)
- [Vidéo Gameplay](https://www.youtube.com/watch?v=CbqQpmFpDbQ)

## Caractéristiques Visuelles Diablo IV

### 1. **Éclairage Dramatique**
- **Contraste élevé** : Zones très sombres avec lumières ponctuelles
- **Ombres profondes** : Shadow maps haute résolution (4096x4096)
- **Lumières directionnelles multiples** : Soleil + Lune + Feux
- **Lumières d'ambiance rougeâtres** : Effet infernal/feu
- **Exposition réduite** : Tone mapping à 0.7 pour ambiance sombre

### 2. **Palette de Couleurs**
- **Dominantes** : Noirs (#1a1a1a), Marrons sombres (#2a2a1a), Rouges sombres (#8b0000)
- **Accents** : Or/Ambre (#8b7355) pour UI et objets importants
- **Couleurs chaudes** : Rouges/Oranges pour feu et danger
- **Couleurs froides** : Bleus sombres pour lune et magie

### 3. **Atmosphère**
- **Brouillard dense** : Fog très sombre (#1a1a1a) avec portée réduite (20-60)
- **Ciel sombre** : Turbidité élevée (15), rayleigh faible (0.3)
- **Post-processing** : ACES Filmic tone mapping avec exposition réduite
- **Environnement** : Preset "night" de Drei

### 4. **Effets Visuels**
- **Particules** : Système de particules pour flammes, fumées, énergie
- **Animations de mort** : Rotation et chute dramatiques
- **Auras pulsantes** : Effets lumineux qui pulsent
- **Sang/Projections** : Effets de sang lors des attaques

### 5. **Matériaux**
- **Roughness élevée** : 0.9-0.98 pour aspect mat
- **Metalness faible** : 0.1-0.3 sauf pour métaux
- **Émissivité** : Légère lueur sur certains objets
- **Couleurs sombres** : Pas de couleurs vives

## Améliorations Implémentées

### ✅ Éclairage
- [x] Ambiance réduite à 0.15 (très sombre)
- [x] Lumière directionnelle principale avec ombres 4096x4096
- [x] Lumières d'ambiance rougeâtres (feu/infernal)
- [x] Lumière froide (lune) pour contraste
- [x] Exposition réduite à 0.7

### ✅ Post-Processing
- [x] Composant PostProcessing pour configuration renderer
- [x] Tone mapping ACES Filmic
- [x] Gamma factor ajusté
- [x] Environnement "night" activé

### ✅ Brouillard
- [x] Fog très sombre (#1a1a1a)
- [x] Portée réduite (20-60) pour effet dramatique

### ✅ Ciel
- [x] Turbidité élevée (15)
- [x] Rayleigh faible (0.3)
- [x] Configuration pour ciel sombre

### ✅ Particules
- [x] Système de particules générique
- [x] Particules d'énergie pour ennemis en attaque
- [x] Support pour flammes, fumées, etc.

### ✅ Animations
- [x] Animation de mort améliorée (rotation + scale)
- [x] Animation d'attaque plus dramatique
- [x] Auras pulsantes pour ennemis

### ✅ Environnement
- [x] Sol très sombre (#2a2a1a)
- [x] Matériaux avec roughness élevée
- [x] Émissivité subtile

## Prochaines Améliorations à Faire

### 🔄 À Implémenter

1. **Effets de Sang**
   - [ ] Système de projection de sang lors des attaques
   - [ ] Particules de sang qui tombent
   - [ ] Taches de sang sur le sol

2. **Particules Améliorées**
   - [ ] Flammes pour torches (déjà fait partiellement)
   - [ ] Fumée pour environnement
   - [ ] Particules de magie/énergie
   - [ ] Particules de poussière

3. **Matériaux Plus Détaillés**
   - [ ] Textures normales pour relief
   - [ ] Textures de rugosité
   - [ ] Variations de matériaux par type

4. **Effets de Combat**
   - [ ] Trails d'arme lors des attaques
   - [ ] Éclairs/étincelles sur impact
   - [ ] Screen shake sur coups critiques
   - [ ] Effets de ralentissement

5. **Amélioration Visuelle Ennemis**
   - [ ] Plus de détails géométriques
   - [ ] Animations de marche améliorées
   - [ ] Effets de respiration/agitation
   - [ ] Variations de taille/forme

6. **Amélioration Visuelle Joueur**
   - [ ] Cape/cheveux animés
   - [ ] Effets de pas (poussière)
   - [ ] Aura selon l'état
   - [ ] Effets de compétences

7. **Environnement Plus Détaillé**
   - [ ] Ruines et structures
   - [ ] Détails architecturaux
   - [ ] Variations de terrain
   - [ ] Décors destructibles

8. **Effets Atmosphériques**
   - [ ] Pluie/Brouillard dynamique
   - [ ] Volumetric fog
   - [ ] Rayons de lumière (god rays)
   - [ ] Particules flottantes

## Code Exemple - Style Diablo IV

### Éclairage Dramatique
```typescript
// Ambiance très sombre
<ambientLight intensity={0.15} color="#1a1a2e" />

// Lumière principale avec ombres profondes
<directionalLight
  position={[15, 20, 10]}
  intensity={1.2}
  castShadow
  shadow-mapSize-width={4096}
  shadow-mapSize-height={4096}
  color="#8b7355"
/>

// Lumières d'ambiance rougeâtres
<pointLight
  position={[0, 3, 0]}
  intensity={0.5}
  color="#8b0000"
  distance={25}
/>
```

### Matériaux Sombres
```typescript
<meshStandardMaterial
  color="#2a2a1a"
  roughness={0.98}
  metalness={0.02}
  emissive="#1a1a0a"
  emissiveIntensity={0.05}
/>
```

### Post-Processing
```typescript
gl.toneMapping = THREE.ACESFilmicToneMapping;
gl.toneMappingExposure = 0.7; // Sombre
gl.gammaFactor = 2.2;
```

## Notes de Design

- **Principe** : "Moins c'est plus" - Ambiance sombre avec accents lumineux
- **Contraste** : Zones très sombres avec lumières ponctuelles dramatiques
- **Couleurs** : Palette limitée, dominée par les tons sombres
- **Détails** : Focus sur les effets et l'atmosphère plutôt que la complexité géométrique

