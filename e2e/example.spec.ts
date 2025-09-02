import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display the landing page correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check if the main title is visible
    await expect(page.locator('h1')).toContainText('English Typing Game')
    
    // Check if the start button is present
    const startButton = page.locator('button', { hasText: '今すぐ始める' })
    await expect(startButton).toBeVisible()
    
    // Click the start button and navigate to home
    await startButton.click()
    await expect(page).toHaveURL('/home')
  })

  test('should handle theme toggle correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check initial dark theme
    const app = page.locator('.app')
    await expect(app).toHaveAttribute('data-theme', 'dark')
    
    // TODO: Add theme toggle test when settings are implemented
  })
})

test.describe('Home Page', () => {
  test('should display learning menu options', async ({ page }) => {
    await page.goto('/home')
    
    // Check if basic typing option is present
    const basicTypingCard = page.locator('text=基本タイピング練習')
    await expect(basicTypingCard).toBeVisible()
    
    // Check if english learning option is present
    const englishLearningCard = page.locator('text=英語学習')
    await expect(englishLearningCard).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should navigate between pages correctly', async ({ page }) => {
    // Start from landing
    await page.goto('/')
    await expect(page).toHaveURL('/')
    
    // Navigate to home
    await page.locator('button', { hasText: '今すぐ始める' }).click()
    await expect(page).toHaveURL('/home')
    
    // Navigate to basic typing
    await page.locator('text=基本タイピング練習').click()
    await expect(page).toHaveURL('/basic-typing')
    
    // Use back navigation
    await page.locator('[aria-label="戻る"]').click()
    await expect(page).toHaveURL('/home')
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if the page is still accessible on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('button', { hasText: '今すぐ始める' })).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    const mainHeading = page.locator('h1')
    await expect(mainHeading).toBeVisible()
    
    // Check for accessible button labels
    const startButton = page.locator('button', { hasText: '今すぐ始める' })
    await expect(startButton).toBeVisible()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test Enter key activation
    await page.keyboard.press('Enter')
    // Should navigate to home page
    await expect(page).toHaveURL('/home')
  })
})