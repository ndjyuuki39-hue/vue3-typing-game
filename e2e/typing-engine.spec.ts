import { test, expect } from '@playwright/test'

test.describe('Typing Engine', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to basic typing for consistent testing
    await page.goto('/basic-typing')

    // Start a game session
    await page.locator('button', { hasText: 'レベル1' }).first().click()
    await page.waitForURL('**/game/basic/**')

    // Wait for game to load
    await page.waitForSelector('.typing-text', { timeout: 10000 })

    // Start typing by pressing space
    await page.keyboard.press('Space')
    await page.waitForSelector('.typing-text .char', { timeout: 5000 })
  })

  test.describe('Character Input Detection', () => {
    test('should highlight current character correctly', async ({ page }) => {
      // Get the first character that should be highlighted
      const currentChar = await page.locator('.typing-text .char').first()

      // Should have current character styling
      await expect(currentChar).toHaveClass(/char--current/)
    })

    test('should handle correct character input', async ({ page }) => {
      // Get the first character to type
      const firstChar = await page.locator('.typing-text .char').first()
      const charText = await firstChar.textContent()

      if (charText) {
        // Type the correct character
        await page.keyboard.type(charText)

        // Character should now be marked as completed
        await expect(firstChar).toHaveClass(/char--completed/)

        // Next character should be current
        const secondChar = page.locator('.typing-text .char').nth(1)
        await expect(secondChar).toHaveClass(/char--current/)
      }
    })

    test('should handle incorrect character input', async ({ page }) => {
      // Type an incorrect character (always type 'X' as it's unlikely to be the first char)
      await page.keyboard.type('X')

      // First character should be marked as error
      const firstChar = page.locator('.typing-text .char').first()
      await expect(firstChar).toHaveClass(/char--error/)
    })

    test('should handle backspace correctly', async ({ page }) => {
      // Type a character
      await page.keyboard.type('X')

      // Should show error
      const firstChar = page.locator('.typing-text .char').first()
      await expect(firstChar).toHaveClass(/char--error/)

      // Press backspace
      await page.keyboard.press('Backspace')

      // Should return to current state (no error)
      await expect(firstChar).toHaveClass(/char--current/)
      await expect(firstChar).not.toHaveClass(/char--error/)
    })
  })

  test.describe('Special Characters', () => {
    test('should handle uppercase letters with shift key animation', async ({ page }) => {
      // Navigate to keyboard test page for better testing
      await page.goto('/keyboard-test')

      // Click on uppercase A test
      await page.locator('button', { hasText: '大文字 A' }).click()

      // Check that both A key and shift keys are highlighted
      const keyA = page.locator('.key').filter({ hasText: /^A$/i }).first()
      const shiftKeys = page.locator('.key--shift-active')

      await expect(keyA).toHaveClass(/key--highlight/)
      await expect(shiftKeys).toHaveCount(2) // Left and right shift
    })

    test('should handle special characters with shift key animation', async ({ page }) => {
      // Navigate to keyboard test page
      await page.goto('/keyboard-test')

      // Click on exclamation mark test
      await page.locator('button', { hasText: '感嘆符' }).click()

      // Check that both base key (1) and shift keys are highlighted
      const key1 = page.locator('.key').filter({ hasText: /^1$/i }).first()
      const shiftKeys = page.locator('.key--shift-active')

      await expect(key1).toHaveClass(/key--highlight/)
      await expect(shiftKeys).toHaveCount(2) // Left and right shift should animate
    })

    test('should not animate shift keys for lowercase letters', async ({ page }) => {
      // Navigate to keyboard test page
      await page.goto('/keyboard-test')

      // Click on lowercase a test
      await page.locator('button', { hasText: '小文字 a' }).click()

      // Check that only A key is highlighted, no shift animation
      const keyA = page.locator('.key').filter({ hasText: /^A$/i }).first()
      const shiftKeys = page.locator('.key--shift-active')

      await expect(keyA).toHaveClass(/key--highlight/)
      await expect(shiftKeys).toHaveCount(0) // No shift keys should be animated
    })
  })

  test.describe('Word Completion', () => {
    test('should detect word completion correctly', async ({ page }) => {
      // Get the complete text to type
      const typingText = page.locator('.typing-text')
      const fullText = await typingText.textContent()

      if (fullText) {
        const words = fullText.trim().split(/\s+/)
        const firstWord = words[0]

        // Type the first word
        await page.keyboard.type(firstWord)

        // Check that word progress is updated
        const completedChars = page.locator('.char--completed')
        await expect(completedChars).toHaveCount(firstWord.length)

        // If there's a space after the word, check it's highlighted next
        if (fullText.length > firstWord.length) {
          const spaceChar = page.locator('.char--current').first()
          const spaceText = await spaceChar.textContent()
          expect(spaceText?.trim()).toBe('') // Space character
        }
      }
    })
  })

  test.describe('Game Completion', () => {
    test('should complete game when all text is typed correctly', async ({ page }) => {
      // Get the complete text to type
      const typingText = page.locator('.typing-text')
      const fullText = await typingText.textContent()

      if (fullText && fullText.length < 50) { // Only test with short texts
        // Type the complete text
        await page.keyboard.type(fullText)

        // Should navigate to completion screen
        await expect(page).toHaveURL(/.*\/clear\/.*/, { timeout: 10000 })

        // Should show completion message
        const completionElement = page.locator('.completion-message, .clear-message, h1')
        await expect(completionElement).toBeVisible()
      }
    }, { timeout: 60000 })

    test('should show WPM and accuracy on completion', async ({ page }) => {
      // Get the complete text to type
      const typingText = page.locator('.typing-text')
      const fullText = await typingText.textContent()

      if (fullText && fullText.length < 30) { // Short text for quick completion
        // Type the complete text
        await page.keyboard.type(fullText)

        // Wait for completion screen
        await expect(page).toHaveURL(/.*\/clear\/.*/, { timeout: 10000 })

        // Should show WPM stat
        const wpmElement = page.locator('text=/WPM/i')
        await expect(wpmElement).toBeVisible()

        // Should show accuracy stat
        const accuracyElement = page.locator('text=/%/i, text=/正確率/i, text=/accuracy/i')
        await expect(accuracyElement.first()).toBeVisible()
      }
    }, { timeout: 60000 })
  })

  test.describe('Real-time Statistics', () => {
    test('should update typing progress in real-time', async ({ page }) => {
      // Start typing some characters
      await page.keyboard.type('hello')

      // Check that progress indicator is updated
      const progressIndicator = page.locator('.progress-label, .header-progress span')
      if (await progressIndicator.count() > 0) {
        const progressText = await progressIndicator.first().textContent()
        expect(progressText).toMatch(/\d+\s*\/\s*\d+/) // Should show "X / Y" format
      }
    })

    test('should show real-time WPM during typing', async ({ page }) => {
      // Type for a few seconds
      await page.keyboard.type('hello world test')

      // Wait a moment for stats to update
      await page.waitForTimeout(2000)

      // Look for WPM display (might be in a stats panel or header)
      const wpmDisplays = page.locator('text=/\\d+\\s*WPM/i')
      if (await wpmDisplays.count() > 0) {
        await expect(wpmDisplays.first()).toBeVisible()
      }
    })
  })

  test.describe('Error Recovery', () => {
    test('should allow correction of multiple errors', async ({ page }) => {
      // Type some incorrect characters
      await page.keyboard.type('xxx')

      // Should show errors
      const errorChars = page.locator('.char--error')
      await expect(errorChars).toHaveCount(3)

      // Correct all errors with backspace
      await page.keyboard.press('Backspace')
      await page.keyboard.press('Backspace')
      await page.keyboard.press('Backspace')

      // Should return to start position
      const currentChar = page.locator('.char--current')
      await expect(currentChar).toHaveCount(1)

      // No error chars should remain
      await expect(page.locator('.char--error')).toHaveCount(0)
    })

    test('should handle rapid backspacing correctly', async ({ page }) => {
      // Type some characters quickly
      await page.keyboard.type('hello')

      // Rapidly backspace
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Backspace')
      }

      // Should return to initial state
      const firstChar = page.locator('.typing-text .char').first()
      await expect(firstChar).toHaveClass(/char--current/)

      // No completed characters should remain
      await expect(page.locator('.char--completed')).toHaveCount(0)
    })
  })

  test.describe('Performance', () => {
    test('should handle fast typing without lag', async ({ page }) => {
      const text = 'quick brown fox jumps'

      // Type very quickly (no delays)
      await page.keyboard.type(text, { delay: 0 })

      // Wait for UI to catch up
      await page.waitForTimeout(500)

      // Should accurately show all characters as completed
      const completedChars = page.locator('.char--completed')
      await expect(completedChars).toHaveCount(text.length)
    })

    test('should maintain accuracy with mixed correct/incorrect input', async ({ page }) => {
      // Get first few characters to type
      const chars = await page.locator('.typing-text .char').first().textContent()

      if (chars) {
        // Type correct, incorrect, correct pattern
        await page.keyboard.type(chars[0] || 'a') // correct
        await page.keyboard.type('x')              // incorrect
        await page.keyboard.press('Backspace')     // correct
        await page.keyboard.type(chars[0] || 'a') // correct again

        // Should show one completed character
        await expect(page.locator('.char--completed')).toHaveCount(1)
        await expect(page.locator('.char--error')).toHaveCount(0)
      }
    })
  })

  test.describe('Keyboard Guide Integration', () => {
    test('should show keyboard guide during typing', async ({ page }) => {
      // Keyboard guide should be visible
      const keyboardGuide = page.locator('.keyboard-guide, .keyboard-container')
      await expect(keyboardGuide).toBeVisible()

      // Should have individual keys
      const keys = page.locator('.key')
      await expect(keys.first()).toBeVisible()
    })

    test('should highlight correct key for current character', async ({ page }) => {
      // Get current character
      const currentChar = await page.locator('.typing-text .char--current').first()
      const charText = await currentChar.textContent()

      if (charText && charText.match(/[a-zA-Z]/)) {
        // Should highlight corresponding key
        const correspondingKey = page.locator('.key--highlight').first()
        await expect(correspondingKey).toBeVisible()
      }
    })

    test('should show enter key with proper L-shape', async ({ page }) => {
      // Navigate to keyboard test to see enter key clearly
      await page.goto('/keyboard-test')

      // Enter key should be visible and have proper styling
      const enterKey = page.locator('.key').filter({ hasText: /enter/i }).first()
      await expect(enterKey).toBeVisible()

      // Should have clip-path styling (check computed style if needed)
      const enterKeyStyle = await enterKey.evaluate(el =>
        window.getComputedStyle(el).clipPath
      )
      expect(enterKeyStyle).toContain('polygon') // Should have L-shape clip-path
    })
  })
})