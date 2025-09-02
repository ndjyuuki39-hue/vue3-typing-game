// Basic Typing Content
export interface BasicStageContent {
  stage: number
  title: string
  description: string
  targetKeys: string[]
  practiceText: string[]
  targetWpm: number
  targetAccuracy: number
  requiredPhrases: number
}

// Word Content for English vocabulary learning
export interface WordContent {
  id: string
  english: string
  japanese: string
  difficulty: number
  category: string[]
}

// Phrase Content for English conversation learning
export interface PhraseContent {
  id: string
  english: string
  japanese: string
  category: string
  situation: string
  difficulty: number
}