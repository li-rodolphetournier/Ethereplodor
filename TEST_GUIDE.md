# Guide de Test - Sprint 2

## 🚀 Démarrage

Le serveur de développement devrait être accessible sur `http://localhost:5173` (ou un autre port si 5173 est occupé).

## 🎮 Contrôles

- **WASD** ou **Flèches directionnelles** : Déplacer le joueur (capsule bleue)
- **Clic gauche** : Attaquer les ennemis à proximité (portée de 2.5 unités)

## 🎯 Fonctionnalités à Tester

### 1. Déplacement
- ✅ Le joueur se déplace avec WASD
- ✅ La caméra suit le joueur en vue isométrique
- ✅ Le joueur entre en collision avec les obstacles (cubes rouge et vert)

### 2. Spawn d'Ennemis
- ✅ Les ennemis apparaissent automatiquement autour de vous
- ✅ Maximum 20 ennemis simultanés
- ✅ Spawn toutes les 3 secondes environ
- ✅ 3 types d'ennemis :
  - **Rouge** : Basic (HP: 50, Vitesse: 2)
  - **Orange** : Fast (HP: 30, Vitesse: 4)
  - **Violet** : Tank (HP: 100, Vitesse: 1.5)

### 3. IA Ennemis
- ✅ Les ennemis patrouillent autour de leur point de spawn
- ✅ Ils vous détectent à 8 unités de distance
- ✅ Ils vous poursuivent quand détectés
- ✅ Ils vous attaquent à 2 unités de distance
- ✅ Cooldown d'attaque de 1.5 secondes

### 4. Combat
- ✅ Clic gauche pour attaquer
- ✅ Portée d'attaque : 2.5 unités
- ✅ Cooldown d'attaque : 0.5 secondes
- ✅ Les ennemis perdent des HP quand attaqués
- ✅ Les ennemis vous attaquent et vous font perdre des HP
- ✅ Barres de vie visibles au-dessus des ennemis

### 5. UI
- ✅ Barre de vie du joueur (en haut à gauche)
- ✅ État d'animation affiché
- ✅ Position du joueur (debug)
- ✅ Statistiques de combat (en bas à gauche)
- ✅ Instructions de contrôle

### 6. Mort
- ✅ Les ennemis meurent quand HP = 0 (animation de chute)
- ✅ Le joueur peut mourir (HP = 0)
- ✅ Message "VOUS ÊTES MORT!" affiché

## 🐛 Problèmes Potentiels

Si vous rencontrez des problèmes :

1. **Les ennemis ne spawnent pas** : Attendez quelques secondes, le spawn est progressif
2. **Performance faible** : Réduisez le nombre max d'ennemis dans `SpawnSystem.ts` (ligne `maxEnemies`)
3. **Les collisions ne fonctionnent pas** : Vérifiez que Rapier est bien initialisé
4. **Les attaques ne fonctionnent pas** : Assurez-vous d'être assez proche (2.5 unités)

## 📊 Performance Attendue

- **60 FPS** avec ~10-15 ennemis
- **45-60 FPS** avec 20 ennemis
- Si performance faible, réduire `maxEnemies` à 10-15

## ✅ Checklist de Test

- [ ] Le joueur se déplace correctement
- [ ] La caméra suit le joueur
- [ ] Les ennemis spawnent automatiquement
- [ ] Les ennemis patrouillent
- [ ] Les ennemis me poursuivent
- [ ] Les ennemis m'attaquent
- [ ] Je peux attaquer les ennemis
- [ ] Les barres de vie s'affichent
- [ ] Les ennemis meurent quand HP = 0
- [ ] Je peux mourir si je prends trop de dégâts
- [ ] Performance acceptable (45+ FPS)

## 🎨 Améliorations Futures (Sprint 3+)

- Système de créatures capturables
- Évolution des créatures
- Loot et équipement
- Effets visuels de combat (particules, animations)
- Sons et musique

