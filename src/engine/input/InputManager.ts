import * as THREE from 'three';

class InputManager {
  private keys: Set<string> = new Set();
  private mousePos: THREE.Vector2 = new THREE.Vector2();
  private mouseButtons: Set<number> = new Set();
  private isInitialized = false;
  
  // Stocker les références aux listeners pour pouvoir les supprimer
  private keydownHandler?: (e: KeyboardEvent) => void;
  private keyupHandler?: (e: KeyboardEvent) => void;
  private mousemoveHandler?: (e: MouseEvent) => void;
  private mousedownHandler?: (e: MouseEvent) => void;
  private mouseupHandler?: (e: MouseEvent) => void;
  private blurHandler?: () => void;

  init(): void {
    if (this.isInitialized) {
      console.warn('InputManager already initialized');
      return;
    }

    // Créer les handlers avec référence pour pouvoir les supprimer
    this.keydownHandler = (e: KeyboardEvent) => {
      // Empêcher le comportement par défaut pour certaines touches
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      this.keys.add(e.code);
    };

    this.keyupHandler = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };

    this.mousemoveHandler = (e: MouseEvent) => {
      this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this.mousedownHandler = (e: MouseEvent) => {
      this.mouseButtons.add(e.button);
    };

    this.mouseupHandler = (e: MouseEvent) => {
      this.mouseButtons.delete(e.button);
    };

    this.blurHandler = () => {
      this.keys.clear();
      this.mouseButtons.clear();
    };

    // Ajouter les listeners
    window.addEventListener('keydown', this.keydownHandler, { passive: false });
    window.addEventListener('keyup', this.keyupHandler);
    window.addEventListener('mousemove', this.mousemoveHandler);
    window.addEventListener('mousedown', this.mousedownHandler);
    window.addEventListener('mouseup', this.mouseupHandler);
    window.addEventListener('blur', this.blurHandler);

    this.isInitialized = true;
    console.log('InputManager initialized');
  }

  isPressed(key: string): boolean {
    return this.keys.has(key);
  }

  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.has(button);
  }

  getMousePosition(): THREE.Vector2 {
    return this.mousePos.clone();
  }

  getMovementVector(): THREE.Vector3 {
    const dir = new THREE.Vector3();

    if (this.isPressed('KeyW') || this.isPressed('ArrowUp')) {
      dir.z -= 1;
    }
    if (this.isPressed('KeyS') || this.isPressed('ArrowDown')) {
      dir.z += 1;
    }
    if (this.isPressed('KeyA') || this.isPressed('ArrowLeft')) {
      dir.x -= 1;
    }
    if (this.isPressed('KeyD') || this.isPressed('ArrowRight')) {
      dir.x += 1;
    }

    // Normaliser seulement si le vecteur a une longueur > 0
    // Pour éviter NaN si aucune touche n'est pressée
    if (dir.length() > 0) {
      dir.normalize();
    }
    
    return dir;
  }

  isMoving(): boolean {
    return this.getMovementVector().length() > 0;
  }

  get initialized(): boolean {
    return this.isInitialized;
  }

  cleanup(): void {
    if (!this.isInitialized) return;

    // Supprimer tous les event listeners
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
    }
    if (this.keyupHandler) {
      window.removeEventListener('keyup', this.keyupHandler);
    }
    if (this.mousemoveHandler) {
      window.removeEventListener('mousemove', this.mousemoveHandler);
    }
    if (this.mousedownHandler) {
      window.removeEventListener('mousedown', this.mousedownHandler);
    }
    if (this.mouseupHandler) {
      window.removeEventListener('mouseup', this.mouseupHandler);
    }
    if (this.blurHandler) {
      window.removeEventListener('blur', this.blurHandler);
    }

    // Nettoyer les états
    this.keys.clear();
    this.mouseButtons.clear();
    this.isInitialized = false;
    
    console.log('InputManager cleaned up');
  }
}

export const inputManager = new InputManager();

