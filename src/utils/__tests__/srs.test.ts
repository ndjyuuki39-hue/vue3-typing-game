import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SRSManager, type SRSCard, type ReviewResult, type ReviewQuality } from '../srs'

describe('SRS Manager', () => {
  let mockDate: Date

  beforeEach(() => {
    // Fixed date for consistent testing
    mockDate = new Date('2024-01-01T12:00:00.000Z')
    vi.setSystemTime(mockDate)
  })

  describe('Card Creation', () => {
    it('should create a new SRS card with correct initial values', () => {
      const card = SRSManager.createCard('test-word', 'word')

      expect(card.id).toBe('test-word')
      expect(card.contentType).toBe('word')

      // SRS initial values
      expect(card.easeFactor).toBe(2.5)
      expect(card.interval).toBe(1)
      expect(card.repetitions).toBe(0)
      expect(card.lastReviewed).toBe(null)
      expect(card.nextReviewDate).toEqual(mockDate)

      // Statistics initial values
      expect(card.totalReviews).toBe(0)
      expect(card.totalCorrect).toBe(0)
      expect(card.averageResponseTime).toBe(0)
      expect(card.streak).toBe(0)
      expect(card.maxStreak).toBe(0)

      // Performance initial values
      expect(card.lastAccuracy).toBe(0)
      expect(card.lastWPM).toBe(0)
      expect(card.difficultyLevel).toBe(3)

      // Metadata
      expect(card.createdAt).toEqual(mockDate)
      expect(card.updatedAt).toEqual(mockDate)
      expect(card.isNew).toBe(true)
    })

    it('should create different content types correctly', () => {
      const wordCard = SRSManager.createCard('word-1', 'word')
      const phraseCard = SRSManager.createCard('phrase-1', 'phrase')
      const coreCard = SRSManager.createCard('core-1', 'core')

      expect(wordCard.contentType).toBe('word')
      expect(phraseCard.contentType).toBe('phrase')
      expect(coreCard.contentType).toBe('core')
    })
  })

  describe('SuperMemo SM-2 Algorithm', () => {
    let initialCard: SRSCard

    beforeEach(() => {
      initialCard = SRSManager.createCard('test', 'word')
    })

    describe('First Review', () => {
      it('should handle perfect first review (quality 5)', () => {
        const result: ReviewResult = {
          quality: 5,
          responseTime: 2000,
          accuracy: 1.0,
          wpm: 50
        }

        const updatedCard = SRSManager.updateCard(initialCard, result)

        expect(updatedCard.repetitions).toBe(1)
        expect(updatedCard.interval).toBe(1) // First review interval is always 1 day
        expect(updatedCard.easeFactor).toBeGreaterThan(2.5) // Should increase for quality 5
        expect(updatedCard.totalReviews).toBe(1)
        expect(updatedCard.totalCorrect).toBe(1)
        expect(updatedCard.streak).toBe(1)
        expect(updatedCard.maxStreak).toBe(1)
        expect(updatedCard.isNew).toBe(false)
      })

      it('should handle failed first review (quality 1)', () => {
        const result: ReviewResult = {
          quality: 1,
          responseTime: 5000,
          accuracy: 0.5,
          wpm: 20
        }

        const updatedCard = SRSManager.updateCard(initialCard, result)

        expect(updatedCard.repetitions).toBe(0) // Reset on failure
        expect(updatedCard.interval).toBe(1) // Retry tomorrow
        expect(updatedCard.easeFactor).toBeLessThan(2.5) // Should decrease for quality 1
        expect(updatedCard.totalReviews).toBe(1)
        expect(updatedCard.totalCorrect).toBe(0) // Failed
        expect(updatedCard.streak).toBe(0)
        expect(updatedCard.maxStreak).toBe(0)
      })
    })

    describe('Second Review', () => {
      it('should set 6-day interval for successful second review', () => {
        const firstResult: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }
        const cardAfterFirst = SRSManager.updateCard(initialCard, firstResult)

        const secondResult: ReviewResult = { quality: 4, responseTime: 1800, accuracy: 0.95, wpm: 45 }
        const cardAfterSecond = SRSManager.updateCard(cardAfterFirst, secondResult)

        expect(cardAfterSecond.repetitions).toBe(2)
        expect(cardAfterSecond.interval).toBe(6) // Second review interval is always 6 days
        expect(cardAfterSecond.streak).toBe(2)
        expect(cardAfterSecond.maxStreak).toBe(2)
      })
    })

    describe('Subsequent Reviews', () => {
      it('should use ease factor for third and later reviews', () => {
        // First review
        const firstResult: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }
        const cardAfterFirst = SRSManager.updateCard(initialCard, firstResult)

        // Second review
        const secondResult: ReviewResult = { quality: 4, responseTime: 1800, accuracy: 0.95, wpm: 45 }
        const cardAfterSecond = SRSManager.updateCard(cardAfterFirst, secondResult)

        // Third review
        const thirdResult: ReviewResult = { quality: 4, responseTime: 1600, accuracy: 0.98, wpm: 50 }
        const cardAfterThird = SRSManager.updateCard(cardAfterSecond, thirdResult)

        expect(cardAfterThird.repetitions).toBe(3)
        expect(cardAfterThird.interval).toBeGreaterThan(6) // Should be interval * easeFactor
        expect(Math.round(cardAfterThird.interval)).toBeCloseTo(6 * cardAfterThird.easeFactor, 0)
      })

      it('should reset interval on failure after multiple successes', () => {
        // Build up some success
        let card = initialCard
        for (let i = 0; i < 5; i++) {
          const result: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }
          card = SRSManager.updateCard(card, result)
        }

        expect(card.repetitions).toBeGreaterThan(0)
        expect(card.interval).toBeGreaterThan(1)
        expect(card.streak).toBe(5)

        // Now fail
        const failResult: ReviewResult = { quality: 2, responseTime: 8000, accuracy: 0.3, wpm: 15 }
        const failedCard = SRSManager.updateCard(card, failResult)

        expect(failedCard.repetitions).toBe(0) // Reset
        expect(failedCard.interval).toBe(1) // Back to 1 day
        expect(failedCard.streak).toBe(0) // Streak broken
        expect(failedCard.maxStreak).toBe(5) // Max streak preserved
      })
    })

    describe('Ease Factor Adjustment', () => {
      it('should increase ease factor for high quality (5)', () => {
        const result: ReviewResult = { quality: 5, responseTime: 1000, accuracy: 1.0, wpm: 60 }
        const updatedCard = SRSManager.updateCard(initialCard, result)

        expect(updatedCard.easeFactor).toBeGreaterThan(initialCard.easeFactor)
        expect(updatedCard.easeFactor).toBeCloseTo(2.6, 1) // 2.5 + 0.1 = 2.6
      })

      it('should decrease ease factor for low quality (1)', () => {
        const result: ReviewResult = { quality: 1, responseTime: 5000, accuracy: 0.2, wpm: 10 }
        const updatedCard = SRSManager.updateCard(initialCard, result)

        expect(updatedCard.easeFactor).toBeLessThan(initialCard.easeFactor)
        expect(updatedCard.easeFactor).toBeCloseTo(2.18, 2) // Complex calculation
      })

      it('should maintain minimum ease factor of 1.3', () => {
        let card = initialCard
        // Repeatedly fail to drive ease factor down
        for (let i = 0; i < 10; i++) {
          const result: ReviewResult = { quality: 1, responseTime: 5000, accuracy: 0.1, wpm: 5 }
          card = SRSManager.updateCard(card, result)
        }

        expect(card.easeFactor).toBe(1.3) // Should not go below minimum
      })

      it('should slightly adjust ease factor for quality 3', () => {
        const result: ReviewResult = { quality: 3, responseTime: 3000, accuracy: 0.7, wpm: 30 }
        const updatedCard = SRSManager.updateCard(initialCard, result)

        expect(Math.abs(updatedCard.easeFactor - initialCard.easeFactor)).toBeLessThan(0.1)
        expect(updatedCard.easeFactor).toBeCloseTo(2.36, 2) // Slight decrease
      })
    })
  })

  describe('Next Review Date Calculation', () => {
    it('should set correct next review date', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }

      const updatedCard = SRSManager.updateCard(card, result)

      // Should be 1 day later (interval = 1 for first review)
      const expectedDate = new Date(mockDate.getTime() + 24 * 60 * 60 * 1000)
      expect(updatedCard.nextReviewDate).toEqual(expectedDate)
    })

    it('should calculate correct date for longer intervals', () => {
      let card = SRSManager.createCard('test', 'word')

      // First review
      const firstResult: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }
      card = SRSManager.updateCard(card, firstResult)

      // Second review (interval should be 6)
      const secondResult: ReviewResult = { quality: 4, responseTime: 1800, accuracy: 0.95, wpm: 45 }
      card = SRSManager.updateCard(card, secondResult)

      // Should be 6 days later
      const expectedDate = new Date(mockDate.getTime() + 6 * 24 * 60 * 60 * 1000)
      expect(card.nextReviewDate).toEqual(expectedDate)
    })
  })

  describe('Statistics Tracking', () => {
    it('should track average response time correctly', () => {
      let card = SRSManager.createCard('test', 'word')

      // First review: 2000ms
      const firstResult: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }
      card = SRSManager.updateCard(card, firstResult)
      expect(card.averageResponseTime).toBe(2000)

      // Second review: 3000ms, average should be 2500ms
      const secondResult: ReviewResult = { quality: 4, responseTime: 3000, accuracy: 0.95, wpm: 45 }
      card = SRSManager.updateCard(card, secondResult)
      expect(card.averageResponseTime).toBe(2500)

      // Third review: 1000ms, average should be 2000ms
      const thirdResult: ReviewResult = { quality: 4, responseTime: 1000, accuracy: 0.98, wpm: 50 }
      card = SRSManager.updateCard(card, thirdResult)
      expect(card.averageResponseTime).toBeCloseTo(2000, 0)
    })

    it('should track review counts correctly', () => {
      let card = SRSManager.createCard('test', 'word')

      expect(card.totalReviews).toBe(0)
      expect(card.totalCorrect).toBe(0)

      // Correct review
      const correctResult: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }
      card = SRSManager.updateCard(card, correctResult)
      expect(card.totalReviews).toBe(1)
      expect(card.totalCorrect).toBe(1)

      // Incorrect review
      const incorrectResult: ReviewResult = { quality: 2, responseTime: 3000, accuracy: 0.5, wpm: 20 }
      card = SRSManager.updateCard(card, incorrectResult)
      expect(card.totalReviews).toBe(2)
      expect(card.totalCorrect).toBe(1) // Still 1, since this was incorrect
    })

    it('should update performance metrics correctly', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 4, responseTime: 2500, accuracy: 0.85, wpm: 42 }

      const updatedCard = SRSManager.updateCard(card, result)

      expect(updatedCard.lastAccuracy).toBe(0.85)
      expect(updatedCard.lastWPM).toBe(42)
      expect(updatedCard.updatedAt).toEqual(mockDate)
    })
  })

  describe('Streak Management', () => {
    it('should maintain streak for passing reviews', () => {
      let card = SRSManager.createCard('test', 'word')

      // Quality 3 and above should maintain streak
      const passingQualities = [3, 4, 5]

      passingQualities.forEach((quality, index) => {
        const result: ReviewResult = { quality: quality as ReviewQuality, responseTime: 2000, accuracy: 0.8, wpm: 30 }
        card = SRSManager.updateCard(card, result)
        expect(card.streak).toBe(index + 1)
        expect(card.maxStreak).toBe(index + 1)
      })
    })

    it('should break streak for failing reviews', () => {
      let card = SRSManager.createCard('test', 'word')

      // Build up streak
      for (let i = 0; i < 5; i++) {
        const result: ReviewResult = { quality: 4, responseTime: 2000, accuracy: 0.9, wpm: 40 }
        card = SRSManager.updateCard(card, result)
      }

      expect(card.streak).toBe(5)
      expect(card.maxStreak).toBe(5)

      // Fail (quality < 3)
      const failResult: ReviewResult = { quality: 2, responseTime: 4000, accuracy: 0.4, wpm: 15 }
      card = SRSManager.updateCard(card, failResult)

      expect(card.streak).toBe(0) // Broken
      expect(card.maxStreak).toBe(5) // Preserved
    })
  })

  describe('Quality Thresholds', () => {
    it('should treat quality 3 as passing', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 3, responseTime: 2000, accuracy: 0.7, wpm: 30 }

      const updatedCard = SRSManager.updateCard(card, result)

      expect(updatedCard.totalCorrect).toBe(1) // Should count as correct
      expect(updatedCard.streak).toBe(1) // Should continue streak
      expect(updatedCard.repetitions).toBe(1) // Should advance repetitions
    })

    it('should treat quality 2 as failing', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 2, responseTime: 3000, accuracy: 0.5, wpm: 20 }

      const updatedCard = SRSManager.updateCard(card, result)

      expect(updatedCard.totalCorrect).toBe(0) // Should not count as correct
      expect(updatedCard.streak).toBe(0) // Should not continue streak
      expect(updatedCard.repetitions).toBe(0) // Should reset repetitions
      expect(updatedCard.interval).toBe(1) // Should reset interval
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large response times', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 4, responseTime: 60000, accuracy: 0.9, wpm: 40 }

      const updatedCard = SRSManager.updateCard(card, result)

      expect(updatedCard.averageResponseTime).toBe(60000)
      expect(Number.isFinite(updatedCard.averageResponseTime)).toBe(true)
    })

    it('should handle zero response time', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 4, responseTime: 0, accuracy: 0.9, wpm: 40 }

      const updatedCard = SRSManager.updateCard(card, result)

      expect(updatedCard.averageResponseTime).toBe(0)
    })

    it('should handle perfect accuracy', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 5, responseTime: 1000, accuracy: 1.0, wpm: 60 }

      const updatedCard = SRSManager.updateCard(card, result)

      expect(updatedCard.lastAccuracy).toBe(1.0)
    })

    it('should handle zero accuracy', () => {
      const card = SRSManager.createCard('test', 'word')
      const result: ReviewResult = { quality: 1, responseTime: 5000, accuracy: 0.0, wpm: 5 }

      const updatedCard = SRSManager.updateCard(card, result)

      expect(updatedCard.lastAccuracy).toBe(0.0)
    })
  })
})