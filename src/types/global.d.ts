// Global type declarations for the Vue 3 English Typing Game

declare global {
  // Environment variables
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_VERSION: string
    readonly VITE_API_BASE_URL: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly MODE: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  // Web Speech API types (not fully supported in TypeScript by default)
  interface SpeechSynthesisUtterance {
    text: string
    lang: string
    volume: number
    rate: number
    pitch: number
    voice: SpeechSynthesisVoice | null
    onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
    onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
    onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => void) | null
    onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
    onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
    onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
    onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
  }

  interface SpeechSynthesisVoice {
    readonly voiceURI: string
    readonly name: string
    readonly lang: string
    readonly localService: boolean
    readonly default: boolean
  }

  interface SpeechSynthesis {
    readonly pending: boolean
    readonly speaking: boolean
    readonly paused: boolean
    speak(utterance: SpeechSynthesisUtterance): void
    cancel(): void
    pause(): void
    resume(): void
    getVoices(): SpeechSynthesisVoice[]
  }

  interface SpeechSynthesisEvent extends Event {
    readonly utterance: SpeechSynthesisUtterance
    readonly charIndex: number
    readonly charLength: number
    readonly elapsedTime: number
    readonly name: string
  }

  interface SpeechSynthesisErrorEvent extends SpeechSynthesisEvent {
    readonly error: 'audio-busy' | 'audio-hardware' | 'canceled' | 'interrupted' | 'invalid-argument' | 'language-not-supported' | 'language-unavailable' | 'network' | 'not-allowed' | 'synthesis-failed' | 'synthesis-unavailable' | 'text-too-long' | 'voice-unavailable'
  }

  const speechSynthesis: SpeechSynthesis

  // PWA Installation API
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed'
      platform: string
    }>
    prompt(): Promise<void>
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }

  // Vibration API
  interface Navigator {
    vibrate?(pattern: number | number[]): boolean
  }

  // Performance API extensions
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }

  // ResizeObserver API
  interface ResizeObserverEntry {
    readonly target: Element
    readonly contentRect: DOMRectReadOnly
    readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>
    readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
    readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
  }

  interface ResizeObserverSize {
    readonly inlineSize: number
    readonly blockSize: number
  }

  interface ResizeObserver {
    observe(target: Element, options?: ResizeObserverOptions): void
    unobserve(target: Element): void
    disconnect(): void
  }

  interface ResizeObserverOptions {
    box?: 'content-box' | 'border-box' | 'device-pixel-content-box'
  }

  declare const ResizeObserver: {
    prototype: ResizeObserver
    new(callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void): ResizeObserver
  }
}

// Module declarations for file imports
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.json' {
  const value: Record<string, any>
  export default value
}

// Vue Router meta type augmentation
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    hideHeader?: boolean
    requiresAuth?: boolean
    unitType?: 'words' | 'phrases'
  }
}

// Pinia store type augmentation
declare module 'pinia' {
  export interface DefineStoreOptionsInPlugin<Id, S, G, A> {
    debounce?: Partial<Record<keyof A, number>>
  }
}

export {}