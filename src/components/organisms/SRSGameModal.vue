<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">🧠 最適化練習 (SRS)</h2>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>

      <div class="modal-body">
        <!-- SRS統計情報 -->
        <div class="srs-stats">
          <div class="stat-card due">
            <div class="stat-icon">⏰</div>
            <div class="stat-content">
              <span class="stat-number">{{ dueCardsCount }}</span>
              <span class="stat-label">復習期限</span>
            </div>
          </div>

          <div class="stat-card new">
            <div class="stat-icon">✨</div>
            <div class="stat-content">
              <span class="stat-number">{{ newCardsCount }}</span>
              <span class="stat-label">新規学習</span>
            </div>
          </div>

          <div class="stat-card learning">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <span class="stat-number">{{ learningCardsCount }}</span>
              <span class="stat-label">学習中</span>
            </div>
          </div>

          <div class="stat-card mature">
            <div class="stat-icon">🎓</div>
            <div class="stat-content">
              <span class="stat-number">{{ matureCardsCount }}</span>
              <span class="stat-label">習得済み</span>
            </div>
          </div>
        </div>

        <!-- 学習設定 -->
        <div class="setting-group">
          <label class="setting-label">問題数</label>
          <div class="question-count-options">
            <button
              v-for="count in questionCountOptions"
              :key="count"
              @click="selectedQuestionCount = count"
              :class="['count-option', { active: selectedQuestionCount === count }]"
            >
              {{ count }}問
            </button>
          </div>
        </div>

        <!-- 復習・新規比率設定 -->
        <div class="setting-group">
          <label class="setting-label">復習・新規比率</label>
          <div class="ratio-slider">
            <span class="ratio-label">復習中心</span>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.1"
              v-model="reviewRatio"
              class="ratio-input"
            />
            <span class="ratio-label">バランス</span>
          </div>
          <div class="ratio-display">
            復習: {{ Math.round(reviewRatio * 100) }}% / 新規: {{ Math.round((1 - reviewRatio) * 100) }}%
          </div>
        </div>

        <!-- SRSモード選択 -->
        <div class="setting-group">
          <label class="setting-label">学習モード</label>
          <div class="mode-options">
            <button
              v-for="mode in modeOptions"
              :key="mode.value"
              @click="selectedMode = mode.value"
              :class="['mode-option', { active: selectedMode === mode.value }]"
            >
              {{ mode.icon }} {{ mode.label }}
            </button>
          </div>
          <p class="mode-description">{{ getModeDescription }}</p>
        </div>

        <!-- 予測学習セット -->
        <div class="setting-group">
          <label class="setting-label">この設定での出題予定</label>
          <div class="prediction-cards">
            <div class="prediction-item">
              <span class="prediction-icon">🔄</span>
              <span class="prediction-text">復習: {{ predictedReviews }}問</span>
            </div>
            <div class="prediction-item">
              <span class="prediction-icon">✨</span>
              <span class="prediction-text">新規: {{ predictedNews }}問</span>
            </div>
            <div class="prediction-item">
              <span class="prediction-icon">⏱️</span>
              <span class="prediction-text">推定時間: {{ estimatedTime }}分</span>
            </div>
          </div>
        </div>

        <!-- 今日の学習統計 -->
        <div class="today-stats" v-if="todayStats.reviewsCompleted > 0 || todayStats.newCardsLearned > 0">
          <h3>📊 今日の学習</h3>
          <div class="today-summary">
            <span>復習完了: {{ todayStats.reviewsCompleted }}問</span>
            <span>新規学習: {{ todayStats.newCardsLearned }}問</span>
            <span>平均正確率: {{ Math.round(todayStats.averageAccuracy * 100) }}%</span>
          </div>
        </div>
      </div>

      <!-- アクション -->
      <div class="modal-actions">
        <SecondaryButton @click="closeModal" class="cancel-btn">
          キャンセル
        </SecondaryButton>
        <PrimaryButton
          @click="startSRSGame"
          class="start-btn"
          :disabled="!canStartGame"
        >
          最適化練習を開始 ({{ selectedQuestionCount }}問)
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useSRSStore } from '@/stores/srs'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import SecondaryButton from '@/components/atoms/SecondaryButton.vue'

export interface SRSGameModalProps {
  type: 'words' | 'phrases' | 'core'
  level?: number
  category?: string
}

const props = defineProps<SRSGameModalProps>()

const emit = defineEmits<{
  close: []
  startGame: [config: {
    type: string
    questionCount: number
    reviewRatio: number
    mode: string
    studySet: unknown[]
  }]
}>()

const srsStore = useSRSStore()

// Settings
const selectedQuestionCount = ref(20)
const reviewRatio = ref(0.7)
const selectedMode = ref('optimal')

const questionCountOptions = [10, 20, 30, 50]

const modeOptions = [
  {
    value: 'optimal',
    icon: '🎯',
    label: '最適化',
    description: 'SRSアルゴリズムが最適なタイミングで出題'
  },
  {
    value: 'review-focused',
    icon: '🔄',
    label: '復習重視',
    description: '期限切れの復習を優先的に出題'
  },
  {
    value: 'new-focused',
    icon: '✨',
    label: '新規重視',
    description: '未学習の内容を多めに出題'
  },
  {
    value: 'weak-points',
    icon: '💪',
    label: '弱点克服',
    description: '苦手な項目を重点的に出題'
  }
]

// Type conversion helper
const getContentType = computed((): 'word' | 'phrase' | 'core' => {
  const typeMap: Record<string, 'word' | 'phrase' | 'core'> = {
    'words': 'word',
    'phrases': 'phrase',
    'core': 'core'
  }
  return typeMap[props.type] || 'word'
})

// Computed stats
const srsCards = computed(() => {
  return srsStore.getCardsByType(getContentType.value)
})

const dueCardsCount = computed(() => {
  return srsStore.dueCards.filter(card => card.contentType === getContentType.value).length
})

const newCardsCount = computed(() => {
  return srsStore.newCards.filter(card => card.contentType === getContentType.value).length
})

const learningCardsCount = computed(() => {
  return srsCards.value.filter(card => !card.isNew && card.interval < 21).length
})

const matureCardsCount = computed(() => {
  return srsCards.value.filter(card => card.interval >= 21).length
})

const todayStats = computed(() => srsStore.todayStats)

// Predictions
const predictedSet = computed(() => {
  return srsStore.generateStudySet(selectedQuestionCount.value)
})

const predictedReviews = computed(() => {
  const filtered = predictedSet.value.reviews.filter(card => card.contentType === getContentType.value)
  return Math.min(filtered.length, Math.floor(selectedQuestionCount.value * reviewRatio.value))
})

const predictedNews = computed(() => {
  const filtered = predictedSet.value.news.filter(card => card.contentType === getContentType.value)
  return Math.min(filtered.length, selectedQuestionCount.value - predictedReviews.value)
})

const estimatedTime = computed(() => {
  // 1問あたり平均30秒と仮定
  return Math.round((selectedQuestionCount.value * 0.5))
})

const getModeDescription = computed(() => {
  return modeOptions.find(mode => mode.value === selectedMode.value)?.description || ''
})

const canStartGame = computed(() => {
  return (dueCardsCount.value > 0 || newCardsCount.value > 0) && selectedQuestionCount.value > 0
})

// Actions
const closeModal = (): void => {
  emit('close')
}

const startSRSGame = (): void => {
  const studySet = generateStudySet()

  emit('startGame', {
    type: props.type,
    questionCount: selectedQuestionCount.value,
    reviewRatio: reviewRatio.value,
    mode: selectedMode.value,
    studySet
  })
}

const generateStudySet = () => {
  const allCards = srsCards.value
  const dueCards = srsStore.dueCards.filter(card => card.contentType === getContentType.value)
  const newCards = srsStore.newCards.filter(card => card.contentType === getContentType.value)

  let selectedCards: unknown[] = []

  switch (selectedMode.value) {
    case 'optimal':
      const optimalSet = srsStore.generateStudySet(selectedQuestionCount.value)
      selectedCards = [
        ...optimalSet.reviews.filter(card => card.contentType === getContentType.value),
        ...optimalSet.news.filter(card => card.contentType === getContentType.value)
      ]
      break

    case 'review-focused':
      selectedCards = [
        ...dueCards.slice(0, selectedQuestionCount.value * 0.9),
        ...newCards.slice(0, selectedQuestionCount.value * 0.1)
      ]
      break

    case 'new-focused':
      selectedCards = [
        ...newCards.slice(0, selectedQuestionCount.value * 0.8),
        ...dueCards.slice(0, selectedQuestionCount.value * 0.2)
      ]
      break

    case 'weak-points':
      const weakCards = allCards
        .filter(card => card.totalReviews > 0)
        .sort((a, b) => {
          const failureRateA = 1 - (a.totalCorrect / a.totalReviews)
          const failureRateB = 1 - (b.totalCorrect / b.totalReviews)
          return failureRateB - failureRateA
        })
      selectedCards = weakCards.slice(0, selectedQuestionCount.value)
      break

    default:
      selectedCards = allCards.slice(0, selectedQuestionCount.value)
  }

  return selectedCards.slice(0, selectedQuestionCount.value)
}

// Initialize on mount
onMounted(() => {
  // SRS統計を更新
  // 必要に応じて初期化処理
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);

  .modal-title {
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);

    &:hover {
      color: var(--text-primary);
    }
  }
}

.modal-body {
  padding: var(--spacing-xl);
}

// SRS統計カード
.srs-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  border: 2px solid var(--border-color);
  transition: all var(--transition-base);

  &.due {
    border-color: var(--accent-orange);
    &:hover { transform: translateY(-2px); }
  }

  &.new {
    border-color: var(--accent-blue);
    &:hover { transform: translateY(-2px); }
  }

  &.learning {
    border-color: var(--accent-purple);
    &:hover { transform: translateY(-2px); }
  }

  &.mature {
    border-color: var(--accent-green);
    &:hover { transform: translateY(-2px); }
  }

  .stat-icon {
    font-size: 24px;
    margin-bottom: var(--spacing-sm);
  }

  .stat-number {
    display: block;
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--text-primary);
  }

  .stat-label {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-top: var(--spacing-xs);
  }
}

// 設定グループ
.setting-group {
  margin-bottom: var(--spacing-xl);

  .setting-label {
    display: block;
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }
}

// 問題数オプション
.question-count-options {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.count-option {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--accent-purple);
  }

  &.active {
    border-color: var(--accent-purple);
    background: var(--accent-purple);
    color: white;
  }
}

// 比率スライダー
.ratio-slider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);

  .ratio-label {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    min-width: 80px;
  }

  .ratio-input {
    flex: 1;
    height: 6px;
    background: var(--border-color);
    border-radius: var(--radius-sm);
    outline: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      background: var(--accent-purple);
      border-radius: 50%;
      cursor: pointer;
    }
  }
}

.ratio-display {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
}

// モードオプション
.mode-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.mode-option {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;

  &:hover {
    border-color: var(--accent-blue);
  }

  &.active {
    border-color: var(--accent-blue);
    background: var(--accent-blue);
    color: white;
  }
}

.mode-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  margin: 0;
}

// 予測カード
.prediction-cards {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.prediction-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-sm);

  .prediction-icon {
    font-size: 16px;
  }

  .prediction-text {
    color: var(--text-primary);
    font-weight: 500;
  }
}

// 今日の統計
.today-stats {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-xl);

  h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .today-summary {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    font-size: var(--text-sm);
    color: var(--text-secondary);

    span {
      background: var(--bg-primary);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
    }
  }
}

// アクション
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-top: 1px solid var(--border-color);

  .start-btn {
    min-width: 200px;
  }
}

// レスポンシブ
@media (max-width: 768px) {
  .modal-content {
    margin: var(--spacing-md);
    max-height: calc(100vh - 2 * var(--spacing-md));
  }

  .srs-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .mode-options {
    grid-template-columns: 1fr;
  }

  .prediction-cards {
    flex-direction: column;
  }

  .today-summary {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>