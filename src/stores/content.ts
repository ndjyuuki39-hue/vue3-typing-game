import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { level1Words } from '@/data/words/level1'
import { level2Words } from '@/data/words/level2'
import { level3Words } from '@/data/words/level3'
import { dailyPhrases } from '@/data/phrases/daily'
import { businessPhrases } from '@/data/phrases/business'
import { travelPhrases } from '@/data/phrases/travel'
import { shoppingPhrases } from '@/data/phrases/shopping'
import { restaurantPhrases } from '@/data/phrases/restaurant'
import { emergencyPhrases } from '@/data/phrases/emergency'
// Core phrases - new organized structure
import { core1Phrases } from '@/data/phrases/core/core1'
import { core2Phrases } from '@/data/phrases/core/core2'
import { core3Phrases } from '@/data/phrases/core/core3'
import { core4Phrases } from '@/data/phrases/core/core4'
import { core5Phrases } from '@/data/phrases/core/core5'
import { core6Phrases } from '@/data/phrases/core/core6'
import { core7Phrases } from '@/data/phrases/core/core7'
import { core8Phrases } from '@/data/phrases/core/core8'
import { core9Phrases } from '@/data/phrases/core/core9'
import { core10Phrases } from '@/data/phrases/core/core10'
import { core11Phrases } from '@/data/phrases/core/core11'
import { core12Phrases } from '@/data/phrases/core/core12'
import { core13Phrases } from '@/data/phrases/core/core13'

// Basic Typing Content
export interface BasicStageContent {
  stage: number
  title: string
  description: string
  targetKeys: string[]
  practiceText: string[]
  targetWpm: number
  targetAccuracy: number
  requiredPhrases: number // このステージのクリアに必要なフレーズ数
}

// Word Content
export interface WordContent {
  id: string
  english: string
  japanese: string
  phonetic?: string
  difficulty: 1 | 2 | 3
  category: string[]
}

// Phrase Content
export interface PhraseContent {
  id: string
  english: string
  japanese: string
  category: 'daily' | 'business' | 'travel' | 'shopping' | 'restaurant' | 'emergency' | 'core' |
    'core1' | 'core2' | 'core3' | 'core4' | 'core5' | 'core6' | 'core7' | 'core8' | 'core9' | 'core10' | 'core11' | 'core12' | 'core13'
  situation: string
  difficulty: 1 | 2 | 3
}

export const useContentStore = defineStore('content', () => {
  // State
  const basicStages = ref<BasicStageContent[]>([])
  const words = ref<WordContent[]>([])
  const phrases = ref<PhraseContent[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Computed
  const getBasicStageByNumber = computed(() => {
    return (stage: number) => basicStages.value.find(s => s.stage === stage)
  })

  const getWordsByLevel = computed(() => {
    return (level: 1 | 2 | 3) => words.value.filter(word => word.difficulty === level)
  })

  const getPhrasesByCategory = computed(() => {
    return (category: string) => phrases.value.filter(phrase => phrase.category === category)
  })

  const availableCategories = computed(() => {
    return Array.from(new Set(phrases.value.map(phrase => phrase.category)))
  })

  // Enhanced core syntax management
  const getCorePhrasesEnhanced = computed(() => {
    return phrases.value.filter(phrase => phrase.category === 'core')
  })

  const getCoreStageCount = computed(() => {
    return 13
  })

  const getCorePhrasesbyStage = computed(() => {
    return (stage: number) => {
      const targetCategory = `core${stage}`
      return phrases.value.filter(phrase => phrase.category === targetCategory)
    }
  })

  // ユニット用の関数（10フレーズずつ）
  const getCorePhrasesbySubstage = computed(() => {
    return (stage: number, substage: '1' | '2') => {
      const targetCategory = `core${stage}`
      const stageData = phrases.value.filter(phrase => phrase.category === targetCategory)

      // Each stage has 20 phrases, split into 2 units of 10 each
      if (substage === '1') {
        return stageData.slice(0, 10)
      } else {
        return stageData.slice(10, 20)
      }
    }
  })


  // Actions
  const initializeBasicContent = (): void => {
    basicStages.value = [
      {
        stage: 1,
        title: 'ホームポジション',
        description: 'ASDF JKL;の基本姿勢を覚えよう',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        practiceText: [
          'asdf jkl;',
          'fff jjj',
          'ddd kkk',
          'sss lll',
          'aaa ;;;',
          'fd sa jk l;',
          'as df jk l;',
          'fad fad fad',
          'jal jal jal',
          'ask ask ask'
        ],
        targetWpm: 10,
        targetAccuracy: 90,
        requiredPhrases: 10
      },
      {
        stage: 2,
        title: '上段キー練習',
        description: 'QWER UIOP の練習',
        targetKeys: ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'],
        practiceText: [
          'qwer uiop',
          'qqq www',
          'eee rrr',
          'uuu iii',
          'ooo ppp',
          'qw er ui op',
          'que pro wait',
          'we ui er op',
          'quote power user',
          'quiet upper wire'
        ],
        targetWpm: 15,
        targetAccuracy: 85,
        requiredPhrases: 10
      },
      {
        stage: 3,
        title: '下段キー練習', 
        description: 'ZXCV NM,. の練習',
        targetKeys: ['z', 'x', 'c', 'v', 'n', 'm', ',', '.'],
        practiceText: [
          'zxcv nm,.',
          'zzz xxx',
          'ccc vvv',
          'nnn mmm',
          ',,, ...',
          'zx cv nm ,.',
          'zen mix can',
          'box van name',
          'zoom next come',
          'move zone calm'
        ],
        targetWpm: 15,
        targetAccuracy: 85,
        requiredPhrases: 10
      },
      {
        stage: 4,
        title: '数字キー練習',
        description: '1234567890 の練習',
        targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        practiceText: [
          '1234567890',
          '111 222',
          '333 444',
          '555 666',
          '777 888',
          '999 000',
          '12 34 56 78 90',
          '13 24 57 68 90'
        ],
        targetWpm: 20,
        targetAccuracy: 90,
        requiredPhrases: 8  // 数字キー練習
      },
      {
        stage: 5,
        title: '基本単語練習',
        description: '簡単な英単語でタイピング練習',
        targetKeys: ['all letters'],
        practiceText: [
          'cat dog run jump',
          'the and for you',
          'can see look go',
          'big red new old',
          'yes no good bad',
          'this that here there',
          'we are all happy',
          'sun moon star sky'
        ],
        targetWpm: 25,
        targetAccuracy: 88,
        requiredPhrases: 8  // 基本単語練習
      },
      {
        stage: 6,
        title: 'スペースキー練習',
        description: '単語間のスペースを正確に',
        targetKeys: ['space'],
        practiceText: [
          'I am a student',
          'You are my friend',
          'We can do it',
          'This is great',
          'Let me try again',
          'Good job well done',
          'See you next time',
          'Have a nice day'
        ],
        targetWpm: 30,
        targetAccuracy: 90,
        requiredPhrases: 8  // スペースキー練習
      },
      {
        stage: 7,
        title: '記号キー練習',
        description: '! ? , . : ; の練習',
        targetKeys: ['!', '?', ',', '.', ':', ';'],
        practiceText: [
          'Hello, world!',
          'How are you?',
          'Good morning.',
          'Yes, I can.',
          'What time is it?',
          'See you later!'
        ],
        targetWpm: 30,
        targetAccuracy: 88,
        requiredPhrases: 6  // 記号キー練習
      },
      {
        stage: 8,
        title: '長文練習(1)',
        description: '短い文章でスムーズに',
        targetKeys: ['all'],
        practiceText: [
          'I like to read books in the morning.',
          'The weather is very nice today.',
          'Can you help me with this problem?',
          'We are going to the park tomorrow.',
          'She plays tennis every weekend.',
          'My favorite color is blue and green.'
        ],
        targetWpm: 35,
        targetAccuracy: 90,
        requiredPhrases: 6  // 長文練習(1)
      },
      {
        stage: 9,
        title: '長文練習(2)', 
        description: '複数文で流れるように',
        targetKeys: ['all'],
        practiceText: [
          'Good morning. How are you today? I am fine, thank you.',
          'The sun is shining. It is a beautiful day. Let us go outside.',
          'I have a meeting at ten. Can we talk later? Yes, of course.',
          'Do you like pizza? I love it. We should order some tonight.',
          'What is your name? My name is John. Nice to meet you.'
        ],
        targetWpm: 40,
        targetAccuracy: 88,
        requiredPhrases: 5  // 長文練習(2)
      },
      {
        stage: 10,
        title: '応用練習(1)',
        description: '様々な文型パターン',
        targetKeys: ['all'],
        practiceText: [
          'If you study hard, you will pass the test.',
          'Although it was raining, we went to the beach.',
          'The book that I bought yesterday is very interesting.',
          'She told me that she would come to the party.'
        ],
        targetWpm: 45,
        targetAccuracy: 90,
        requiredPhrases: 4  // 応用練習(1)
      },
      {
        stage: 11,
        title: '応用練習(2)',
        description: '複雑な文章構造',
        targetKeys: ['all'],
        practiceText: [
          'The company, which was founded in 1995, has grown rapidly.',
          'Before we make a decision, we should consider all options.',
          'The project that we have been working on is almost finished.',
          'After the meeting, we will discuss the next steps.'
        ],
        targetWpm: 50,
        targetAccuracy: 88,
        requiredPhrases: 4  // 応用練習(2)
      },
      {
        stage: 12,
        title: 'マスター級',
        description: '実践的な長文タイピング',
        targetKeys: ['all'],
        practiceText: [
          'Technology has revolutionized the way we communicate, work, and live our daily lives.',
          'Learning a new language requires dedication, practice, and patience, but the rewards are immense.',
          'The importance of environmental conservation cannot be overstated in our modern world.',
          'Success in any field depends on continuous learning and the ability to adapt to change.'
        ],
        targetWpm: 55,
        targetAccuracy: 90,
        requiredPhrases: 3  // マスター級
      }
    ]
  }

  const initializeWordsContent = (): void => {
    // 外部ファイルから英単語データを統合
    words.value = [
      ...level1Words,
      ...level2Words,
      ...level3Words
    ]
  }

  const initializePhrasesContent = (): void => {
    phrases.value = [
      // Load all phrase categories from external files
      ...dailyPhrases,
      ...businessPhrases,
      ...travelPhrases,
      ...shoppingPhrases,
      ...restaurantPhrases,
      ...emergencyPhrases,
      // Core phrases - organized by stage
      ...core1Phrases,
      ...core2Phrases,
      ...core3Phrases,
      ...core4Phrases,
      ...core5Phrases,
      ...core6Phrases,
      ...core7Phrases,
      ...core8Phrases,
      ...core9Phrases,
      ...core10Phrases,
      ...core11Phrases,
      ...core12Phrases,
      ...core13Phrases
    ]
  }

  const initializeContent = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      initializeBasicContent()
      initializeWordsContent()
      initializePhrasesContent()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize content'
    } finally {
      isLoading.value = false
    }
  }

  // Initialize content on store creation
  initializeContent()

  return {
    // State
    basicStages,
    words,
    phrases,
    isLoading,
    error,

    // Computed
    getBasicStageByNumber,
    getWordsByLevel,
    getPhrasesByCategory,
    availableCategories,

    // Enhanced Core System
    getCorePhrasesEnhanced,
    getCoreStageCount,
    getCorePhrasesbyStage,
    getCorePhrasesbySubstage,

    // Actions
    initializeContent,
    initializeBasicContent,
    initializeWordsContent,
    initializePhrasesContent
  }
})