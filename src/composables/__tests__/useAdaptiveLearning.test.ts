import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAdaptiveLearning, type PerformanceData, type AdaptiveLearningConfig } from '../useAdaptiveLearning'

// Mock the user store
vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    currentUser: { id: 'test-user' },
    getUserLevel: vi.fn().mockReturnValue(1),
    updateUserStats: vi.fn()
  })
}))

describe('useAdaptiveLearning', () => {
  let adaptiveLearning: ReturnType<typeof useAdaptiveLearning>

  beforeEach(() => {
    vi.clearAllMocks()
    adaptiveLearning = useAdaptiveLearning()
  })

  describe('Initial Configuration', () => {
    it('should initialize with default config values', () => {
      const config = adaptiveLearning.config.value

      expect(config.difficultyAdjustmentRate).toBe(0.15)
      expect(config.performanceWindow).toBe(10)
      expect(config.minAccuracy).toBe(75)
      expect(config.targetAccuracy).toBe(85)
      expect(config.maxAccuracy).toBe(95)
      expect(config.wpmGrowthRate).toBe(0.08)
    })

    it('should initialize learning state with default values', () => {
      const state = adaptiveLearning.learningState.value

      expect(state.currentDifficulty).toBe(1.0)
      expect(state.adaptiveWpmTarget).toBe(20) // Default beginner target
      expect(state.adaptiveAccuracyTarget).toBe(85)
      expect(state.performanceHistory).toEqual([])
      expect(state.learningMomentum).toBe(0)
      expect(state.confidenceLevel).toBe(0.5)
      expect(state.strugglingAreas).toEqual([])
      expect(state.masteredAreas).toEqual([])
    })
  })

  describe('Performance Data Recording', () => {
    it('should record performance data correctly', () => {
      const performanceData: PerformanceData = {
        timestamp: Date.now(),
        wpm: 35,
        accuracy: 88,
        completionTime: 45000,
        contentType: 'words',
        contentId: 'level-1-stage-1',
        errorPatterns: ['th', 'er'],
        retryCount: 0
      }

      adaptiveLearning.recordPerformance(performanceData)

      const history = adaptiveLearning.learningState.value.performanceHistory
      expect(history).toHaveLength(1)
      expect(history[0]).toEqual(performanceData)
    })

    it('should maintain performance window size', () => {
      const config = adaptiveLearning.config.value
      const windowSize = config.performanceWindow

      // Add more data than window size
      for (let i = 0; i < windowSize + 5; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: 30 + i,
          accuracy: 85,
          completionTime: 30000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: [],
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      }

      const history = adaptiveLearning.learningState.value.performanceHistory
      expect(history).toHaveLength(windowSize)
      // Should keep the most recent entries
      expect(history[0].contentId).toBe(`test-${windowSize - 1 + 5}`) // Most recent
    })
  })

  describe('Difficulty Recommendation', () => {
    it('should recommend increase for high performance', () => {
      // Add several high-performance entries
      for (let i = 0; i < 5; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: 50, // High WPM
          accuracy: 95, // High accuracy
          completionTime: 20000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: [],
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      }

      const recommendation = adaptiveLearning.getDifficultyRecommendation()

      expect(recommendation.adjustment).toBe('increase')
      expect(recommendation.level).toBeGreaterThan(1.0)
      expect(recommendation.confidence).toBeGreaterThan(0.7)
    })

    it('should recommend decrease for low performance', () => {
      // Add several low-performance entries
      for (let i = 0; i < 5; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: 15, // Low WPM
          accuracy: 70, // Low accuracy
          completionTime: 60000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: ['th', 'er', 'ing', 'tion'],
          retryCount: 2 // Multiple retries
        }
        adaptiveLearning.recordPerformance(data)
      }

      const recommendation = adaptiveLearning.getDifficultyRecommendation()

      expect(recommendation.adjustment).toBe('decrease')
      expect(recommendation.level).toBeLessThan(1.0)
      expect(recommendation.confidence).toBeGreaterThan(0.6)
    })

    it('should recommend maintain for balanced performance', () => {
      // Add entries with target-level performance
      for (let i = 0; i < 5; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: 25, // Around target
          accuracy: 85, // At target
          completionTime: 35000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: ['th'],
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      }

      const recommendation = adaptiveLearning.getDifficultyRecommendation()

      expect(recommendation.adjustment).toBe('maintain')
      expect(Math.abs(recommendation.level - 1.0)).toBeLessThan(0.1)
    })
  })

  describe('Learning Momentum Calculation', () => {
    it('should calculate positive momentum for improving performance', () => {
      // Add performance data showing improvement trend
      const baselines = [20, 25, 30, 35, 40] // Increasing WPM
      baselines.forEach((wpm, i) => {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 10000,
          wpm,
          accuracy: 80 + i * 2, // Also improving accuracy
          completionTime: 40000 - i * 2000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: [],
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      })

      adaptiveLearning.updateLearningState()

      expect(adaptiveLearning.learningState.value.learningMomentum).toBeGreaterThan(0)
    })

    it('should calculate negative momentum for declining performance', () => {
      // Add performance data showing decline trend
      const baselines = [40, 35, 30, 25, 20] // Decreasing WPM
      baselines.forEach((wpm, i) => {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 10000,
          wpm,
          accuracy: 90 - i * 3, // Also declining accuracy
          completionTime: 30000 + i * 5000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: ['th', 'er', 'ing'],
          retryCount: i // Increasing retry count
        }
        adaptiveLearning.recordPerformance(data)
      })

      adaptiveLearning.updateLearningState()

      expect(adaptiveLearning.learningState.value.learningMomentum).toBeLessThan(0)
    })
  })

  describe('Confidence Level Assessment', () => {
    it('should increase confidence with consistent high performance', () => {
      // Add consistent high performance data
      for (let i = 0; i < 8; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 5000,
          wpm: 45,
          accuracy: 92,
          completionTime: 25000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: [],
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      }

      adaptiveLearning.updateLearningState()

      expect(adaptiveLearning.learningState.value.confidenceLevel).toBeGreaterThan(0.7)
    })

    it('should decrease confidence with inconsistent performance', () => {
      // Add inconsistent performance data
      const performances = [
        { wpm: 50, accuracy: 95 },
        { wpm: 20, accuracy: 70 },
        { wpm: 45, accuracy: 90 },
        { wpm: 15, accuracy: 65 },
        { wpm: 40, accuracy: 88 }
      ]

      performances.forEach((perf, i) => {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 5000,
          wpm: perf.wpm,
          accuracy: perf.accuracy,
          completionTime: 35000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: perf.accuracy < 80 ? ['th', 'er'] : [],
          retryCount: perf.accuracy < 80 ? 1 : 0
        }
        adaptiveLearning.recordPerformance(data)
      })

      adaptiveLearning.updateLearningState()

      expect(adaptiveLearning.learningState.value.confidenceLevel).toBeLessThan(0.6)
    })
  })

  describe('Error Pattern Analysis', () => {
    it('should identify struggling areas from error patterns', () => {
      // Add data with consistent error patterns
      const commonErrors = ['th', 'er', 'ing']
      for (let i = 0; i < 6; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: 25,
          accuracy: 78,
          completionTime: 40000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: commonErrors,
          retryCount: 1
        }
        adaptiveLearning.recordPerformance(data)
      }

      adaptiveLearning.updateLearningState()

      const strugglingAreas = adaptiveLearning.learningState.value.strugglingAreas
      expect(strugglingAreas).toEqual(expect.arrayContaining(commonErrors))
    })

    it('should identify mastered areas with consistent success', () => {
      // Add data with no errors in specific patterns
      for (let i = 0; i < 6; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: 40,
          accuracy: 95,
          completionTime: 25000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: [], // No errors
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      }

      adaptiveLearning.updateLearningState()

      const masteredAreas = adaptiveLearning.learningState.value.masteredAreas
      expect(masteredAreas).toContain('basic-typing') // Should identify as mastered
    })
  })

  describe('Adaptive Target Adjustment', () => {
    it('should adjust WPM target based on performance', () => {
      const initialWpmTarget = adaptiveLearning.learningState.value.adaptiveWpmTarget

      // Add high performance data
      for (let i = 0; i < 5; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: initialWpmTarget + 15, // Exceeding target
          accuracy: 90,
          completionTime: 20000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: [],
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      }

      adaptiveLearning.updateLearningState()

      const newWpmTarget = adaptiveLearning.learningState.value.adaptiveWpmTarget
      expect(newWpmTarget).toBeGreaterThan(initialWpmTarget)
    })

    it('should adjust accuracy target based on consistency', () => {
      const initialAccuracyTarget = adaptiveLearning.learningState.value.adaptiveAccuracyTarget

      // Add consistently high accuracy data
      for (let i = 0; i < 6; i++) {
        const data: PerformanceData = {
          timestamp: Date.now() + i * 1000,
          wpm: 30,
          accuracy: 96, // Consistently high
          completionTime: 30000,
          contentType: 'words',
          contentId: `test-${i}`,
          errorPatterns: [],
          retryCount: 0
        }
        adaptiveLearning.recordPerformance(data)
      }

      adaptiveLearning.updateLearningState()

      const newAccuracyTarget = adaptiveLearning.learningState.value.adaptiveAccuracyTarget
      expect(newAccuracyTarget).toBeGreaterThanOrEqual(initialAccuracyTarget)
    })
  })

  describe('Personalized Recommendations', () => {
    it('should provide content recommendations based on performance', () => {
      // Add performance data showing strength in words but weakness in phrases
      const wordData: PerformanceData = {
        timestamp: Date.now(),
        wpm: 45,
        accuracy: 92,
        completionTime: 20000,
        contentType: 'words',
        contentId: 'words-level-2',
        errorPatterns: [],
        retryCount: 0
      }

      const phraseData: PerformanceData = {
        timestamp: Date.now() + 1000,
        wpm: 25,
        accuracy: 75,
        completionTime: 50000,
        contentType: 'phrases',
        contentId: 'phrases-daily',
        errorPatterns: ['the', 'and', 'for'],
        retryCount: 2
      }

      adaptiveLearning.recordPerformance(wordData)
      adaptiveLearning.recordPerformance(phraseData)

      const recommendations = adaptiveLearning.getPersonalizedRecommendations()

      expect(recommendations).toBeDefined()
      expect(recommendations.focus).toContain('phrases') // Should focus on weak area
      expect(recommendations.difficulty).toBeLessThan(2) // Should recommend easier phrases
    })
  })

  describe('Configuration Updates', () => {
    it('should allow configuration updates', () => {
      const newConfig: Partial<AdaptiveLearningConfig> = {
        targetAccuracy: 90,
        difficultyAdjustmentRate: 0.2
      }

      adaptiveLearning.updateConfig(newConfig)

      expect(adaptiveLearning.config.value.targetAccuracy).toBe(90)
      expect(adaptiveLearning.config.value.difficultyAdjustmentRate).toBe(0.2)
      // Other values should remain unchanged
      expect(adaptiveLearning.config.value.minAccuracy).toBe(75)
    })

    it('should validate configuration bounds', () => {
      const invalidConfig: Partial<AdaptiveLearningConfig> = {
        targetAccuracy: 105, // Invalid - over 100%
        difficultyAdjustmentRate: -0.1 // Invalid - negative
      }

      expect(() => {
        adaptiveLearning.updateConfig(invalidConfig)
      }).toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty performance history', () => {
      const recommendation = adaptiveLearning.getDifficultyRecommendation()

      expect(recommendation.adjustment).toBe('maintain')
      expect(recommendation.confidence).toBeLessThan(0.5) // Low confidence with no data
    })

    it('should handle single performance entry', () => {
      const data: PerformanceData = {
        timestamp: Date.now(),
        wpm: 30,
        accuracy: 85,
        completionTime: 35000,
        contentType: 'words',
        contentId: 'test',
        errorPatterns: [],
        retryCount: 0
      }

      adaptiveLearning.recordPerformance(data)
      const recommendation = adaptiveLearning.getDifficultyRecommendation()

      expect(recommendation).toBeDefined()
      expect(recommendation.confidence).toBeLessThan(0.7) // Lower confidence with limited data
    })

    it('should handle extreme performance values', () => {
      const extremeData: PerformanceData = {
        timestamp: Date.now(),
        wpm: 200, // Unrealistically high
        accuracy: 100,
        completionTime: 1000,
        contentType: 'words',
        contentId: 'test',
        errorPatterns: [],
        retryCount: 0
      }

      expect(() => {
        adaptiveLearning.recordPerformance(extremeData)
      }).not.toThrow() // Should handle gracefully

      adaptiveLearning.updateLearningState()
      const state = adaptiveLearning.learningState.value

      expect(state.adaptiveWpmTarget).toBeLessThan(100) // Should not set unrealistic targets
    })
  })
})