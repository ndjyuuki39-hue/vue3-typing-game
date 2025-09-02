/**
 * Runtime Legacy Code Detection and Prevention System
 * Actively prevents legacy Vue patterns from being executed at runtime
 */

export class LegacyRuntimeGuard {
  private static initialized = false
  private static violations: string[] = []

  /**
   * Initialize the runtime guard system
   */
  static init(): void {
    if (this.initialized) return

    this.setupVuePrototypeProtection()
    this.setupGlobalProtection()
    this.setupConsoleMonitoring()
    
    this.initialized = true

    if (import.meta.env.DEV) {
      console.log('🛡️ Legacy Runtime Guard initialized')
    }
  }

  /**
   * Protect Vue prototype from legacy methods
   */
  private static setupVuePrototypeProtection(): void {
    // Prevent Options API methods from being called
    const legacyMethods = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeUnmount',
      'unmounted',
      'methods',
      'data',
      'computed',
      'watch',
      'props',
      'emits'
    ]

    // Monitor for Vue Options API usage
    if (typeof window !== 'undefined') {
      const globalVue = (window as Record<string, unknown>).Vue
      if (globalVue && typeof globalVue === 'object') {
        const vueObj = globalVue as Record<string, unknown>
        const originalDefineComponent = vueObj.defineComponent
        if (typeof originalDefineComponent === 'function') {
          vueObj.defineComponent = function(options: Record<string, unknown>) {
            if (options && typeof options === 'object') {
              const foundLegacy = legacyMethods.filter(method => method in options)
              if (foundLegacy.length > 0) {
                const error = `🚨 LEGACY CODE DETECTED: Options API usage found: ${foundLegacy.join(', ')}`
                LegacyRuntimeGuard.reportViolation(error)
                throw new Error(error)
              }
            }
            return originalDefineComponent.call(this, options)
          }
        }
      }
    }
  }

  /**
   * Protect global scope from legacy patterns
   */
  private static setupGlobalProtection(): void {
    if (typeof window === 'undefined') return

    // Prevent jQuery-like patterns
    Object.defineProperty(window, '$', {
      get() {
        const error = '🚨 LEGACY CODE DETECTED: jQuery-like $ usage detected'
        LegacyRuntimeGuard.reportViolation(error)
        throw new Error(error)
      },
      configurable: false
    })

    // Monitor for Vue 2 global registration patterns
    const originalDocument = document.createElement
    document.createElement = function(tagName: string, options?: ElementCreationOptions) {
      if (typeof tagName === 'string' && tagName.includes('vue-')) {
        const error = `🚨 LEGACY CODE DETECTED: Vue 2 component naming pattern: ${tagName}`
        LegacyRuntimeGuard.reportViolation(error)
        console.warn(error)
      }
      return originalDocument.call(this, tagName, options)
    }
  }

  /**
   * Monitor console for legacy patterns
   */
  private static setupConsoleMonitoring(): void {
    if (!import.meta.env.DEV) return

    const originalWarn = console.warn
    console.warn = function(...args: unknown[]) {
      const message = args.join(' ')
      
      // Check for Vue 2 migration warnings
      if (message.includes('MIGRATION') || 
          message.includes('Vue 2') ||
          message.includes('Options API') ||
          message.includes('this.$')) {
        const error = `🚨 LEGACY CODE DETECTED: Migration warning: ${message}`
        LegacyRuntimeGuard.reportViolation(error)
        throw new Error(error)
      }
      
      return originalWarn.apply(this, args)
    }
  }

  /**
   * Report a legacy code violation
   */
  private static reportViolation(violation: string): void {
    this.violations.push(violation)
    
    if (import.meta.env.DEV) {
      console.error(violation)
      console.trace('Legacy code violation stack trace:')
    }

    // In production, report to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Report to error tracking service (e.g., Sentry)
      // sentry.captureException(new Error(violation))
    }
  }

  /**
   * Get all recorded violations
   */
  static getViolations(): string[] {
    return [...this.violations]
  }

  /**
   * Clear all recorded violations
   */
  static clearViolations(): void {
    this.violations = []
  }

  /**
   * Check if any violations have been recorded
   */
  static hasViolations(): boolean {
    return this.violations.length > 0
  }

  /**
   * Validate a component definition at runtime
   */
  static validateComponent(component: Record<string, unknown>): void {
    if (!component || typeof component !== 'object') return

    const legacyPatterns = [
      'data',
      'methods',
      'computed',
      'watch',
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'beforeUnmount',
      'unmounted'
    ]

    const foundPatterns = legacyPatterns.filter(pattern => pattern in component)
    
    if (foundPatterns.length > 0) {
      const error = `🚨 LEGACY CODE DETECTED: Component contains Options API: ${foundPatterns.join(', ')}`
      this.reportViolation(error)
      throw new Error(error)
    }
  }

  /**
   * Validate that a function doesn't use 'this' context (indicating Options API)
   */
  static validateFunction(fn: Function, name?: string): void {
    const fnString = fn.toString()
    
    if (fnString.includes('this.') || fnString.includes('this[')) {
      const error = `🚨 LEGACY CODE DETECTED: Function ${name || 'anonymous'} uses 'this' context, indicating Options API usage`
      this.reportViolation(error)
      throw new Error(error)
    }
  }

  /**
   * Strict mode enforcement for development
   */
  static enforceStrictMode(): void {
    if (!import.meta.env.DEV) return

    // Monitor for use strict violations
    const originalEval = window.eval
    window.eval = function(code: string) {
      if (!code.includes('use strict')) {
        const error = '🚨 LEGACY CODE DETECTED: Code executed without strict mode'
        LegacyRuntimeGuard.reportViolation(error)
        throw new Error(error)
      }
      return originalEval.call(this, code)
    }
  }

  /**
   * Runtime type checking for function parameters
   */
  static validateTypes<T>(value: unknown, expectedType: string, paramName?: string): T {
    const actualType = typeof value
    
    if (actualType === 'undefined' && expectedType !== 'undefined') {
      const error = `🚨 LEGACY CODE DETECTED: ${paramName || 'Parameter'} is undefined, expected ${expectedType}`
      this.reportViolation(error)
      throw new Error(error)
    }
    
    if (actualType !== expectedType && expectedType !== 'unknown') {
      const error = `🚨 LEGACY CODE DETECTED: ${paramName || 'Parameter'} type mismatch. Expected ${expectedType}, got ${actualType}`
      this.reportViolation(error)
      throw new Error(error)
    }
    
    return value as T
  }

  /**
   * Monitor for legacy dependency usage
   */
  static monitorDependencies(): void {
    const legacyDependencies = [
      'vue-class-component',
      'vue-property-decorator',
      'vuex-class',
      '@vue/composition-api'
    ]

    // This would typically be used in a build process
    // For runtime, we can check if these are loaded
    legacyDependencies.forEach(dep => {
      try {
        // Check if dependency exists in modules (this is a simplified check)
        if (typeof require !== 'undefined') {
          const requireObj = require as { cache?: Record<string, unknown> }
          requireObj.cache && Object.keys(requireObj.cache).forEach(key => {
            if (key.includes(dep)) {
              const error = `🚨 LEGACY CODE DETECTED: Legacy dependency loaded: ${dep}`
              this.reportViolation(error)
              throw new Error(error)
            }
          })
        }
      } catch (e) {
        // Dependency not found, which is good
      }
    })
  }
}

// Auto-initialize in development mode
if (import.meta.env.DEV) {
  LegacyRuntimeGuard.init()
}