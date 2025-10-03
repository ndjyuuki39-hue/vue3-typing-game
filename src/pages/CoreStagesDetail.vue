<template>
  <div class="core-stages-detail">
    <div class="container">
      <!-- Page Header -->
      <PageHeader
        title="コア構文マスター - セクション選択"
        subtitle="13のセクションから学習したいテーマを選択してください"
        show-back-button
        @back="goBack"
      />

      <!-- Section Info -->
      <div class="section-info">
        <div class="section-icon">📚</div>
        <h2>コア構文マスター</h2>
        <p>基本文型から実用表現まで、段階的に英語構文を習得</p>
        <div class="section-stats">
          <span>総フレーズ数: 260個</span>
          <span>進捗: {{ completedStages }}/{{ categoryStages.length }} セクション</span>
        </div>

        <!-- SRSベースのランダム学習ボタン -->
        <div v-if="completedStages > 0" class="practice-buttons">
          <PrimaryButton @click="showSRSModal = true" variant="accent" size="lg">
            🧠 ランダム学習
          </PrimaryButton>
        </div>
      </div>

      <!-- Stage Grid -->
      <div class="stages-grid">
        <div
          v-for="stage in categoryStages"
          :key="stage.id"
          class="stage-card"
          :class="{
            'stage-card--locked': !isStageUnlocked(stage.id),
            'stage-card--completed': isStageCompleted(stage.id),
            'stage-card--current': isCurrentStage(stage.id)
          }"
          @click="goToStage(stage.id)"
        >
          <div class="stage-header">
            <div class="stage-number" :class="{ 'stage-number--new': stage.id > 10 }">{{ stage.id }}</div>
            <div v-if="stage.id > 10" class="new-badge">NEW!</div>
            <div class="stage-status">
              <div v-if="isStageCompleted(stage.id)" class="status-icon completed">✓</div>
              <div v-else-if="!isStageUnlocked(stage.id)" class="status-icon locked">🔒</div>
              <div v-else class="status-icon available">▶️</div>
            </div>
          </div>

          <div class="stage-content">
            <h3 class="stage-title">{{ stage.title }}</h3>
            <p class="stage-description">{{ stage.description }}</p>

            <div class="stage-stats">
              <div class="stat-item">
                <span class="stat-label">フレーズ数</span>
                <span class="stat-value">{{ stage.phrasesCount }}個</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">難易度</span>
                <span class="stat-value">{{ stage.difficulty }}</span>
              </div>
            </div>
          </div>

          <div class="stage-footer" v-if="isStageCompleted(stage.id)">
            <div class="stage-performance">
              <div class="performance-stat">
                <span class="performance-label">ベストWPM</span>
                <span class="performance-value">{{ getStageStats(stage.id).bestWPM || '-' }}</span>
              </div>
              <div class="performance-stat">
                <span class="performance-label">正確率</span>
                <span class="performance-value">{{ getStageStats(stage.id).accuracy || '-' }}%</span>
              </div>
            </div>
          </div>

          <div class="stage-action">
            <PrimaryButton
              v-if="isStageUnlocked(stage.id)"
              @click.stop="goToStage(stage.id)"
              :variant="isStageCompleted(stage.id) ? 'secondary' : 'primary'"
              size="sm"
            >
              {{ isStageCompleted(stage.id) ? '復習する' : '学習開始' }}
            </PrimaryButton>
            <SecondaryButton
              v-else
              disabled
              size="sm"
            >
              🔒 ロック中
            </SecondaryButton>
          </div>
        </div>
      </div>

      <!-- Progress Summary -->
      <div class="progress-summary">
        <ProgressCard
          title="セクション進捗"
          :current="completedStages"
          :total="categoryStages.length"
          :percentage="categoryProgress"
        />
      </div>
    </div>

    <!-- SRS Game Modal -->
    <SRSGameModal
      v-if="showSRSModal"
      type="core"
      @close="showSRSModal = false"
      @startGame="startSRSGame"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { useUserStore } from '@/stores/user'
import { useSRSStore } from '@/stores/srs'

// Components
import PageHeader from '@/components/molecules/PageHeader.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import SecondaryButton from '@/components/atoms/SecondaryButton.vue'
import ProgressCard from '@/components/molecules/ProgressCard.vue'
import SRSGameModal from '@/components/organisms/SRSGameModal.vue'

// No props needed - show all 13 stages directly

const router = useRouter()
const contentStore = useContentStore()
const userStore = useUserStore()
const srsStore = useSRSStore()

// SRS機能
const showSRSModal = ref(false)

// All 13 stages data - use learningMetadata from content store

// All 13 stages directly
const categoryStages = computed(() => {
  // Generate all 13 stages
  return Array.from({ length: 13 }, (_, index) => {
    const stageNum = index + 1
    const stageInfo = getStageInfo(stageNum)
    return {
      id: stageNum,
      title: stageInfo.title,
      description: stageInfo.description,
      difficulty: stageInfo.difficulty,
      phrasesCount: 20
    }
  })
})

const getStageInfo = (stage: number) => {
  const stageInfoMap: Record<number, { title: string; description: string; difficulty: string }> = {
    1: { title: '基本パターン', description: 'I am, You are, This is など', difficulty: '入門' },
    2: { title: '疑問文', description: 'What, Where, How などの基本疑問文', difficulty: '入門' },
    3: { title: '依頼・要求', description: 'Can you, Could you, Please など', difficulty: '初級' },
    4: { title: '時制表現', description: '現在・過去・未来時制の使い分け', difficulty: '初級' },
    5: { title: '助動詞', description: 'can, will, should, must など', difficulty: '初級' },
    6: { title: '条件文', description: 'if, unless, when などの条件表現', difficulty: '中級' },
    7: { title: '受動態', description: 'be動詞 + 過去分詞の構文', difficulty: '中級' },
    8: { title: '関係代名詞', description: 'who, which, that などの関係詞', difficulty: '中級' },
    9: { title: '分詞構文', description: '現在分詞・過去分詞を使った表現', difficulty: '上級' },
    10: { title: '比較表現', description: '比較級・最上級の様々な表現', difficulty: '上級' },
    11: { title: '句動詞マスター', description: 'get up, turn on, look for など', difficulty: '初級' },
    12: { title: '会話ストラテジー', description: 'Actually, By the way など', difficulty: '中級' },
    13: { title: '慣用表現・イディオム', description: "It's a piece of cake など", difficulty: '中級' }
  }
  return stageInfoMap[stage] || { title: 'ステージ', description: '', difficulty: '初級' }
}

// Stage progress management - all stages unlocked at section level
const isStageUnlocked = (_stage: number): boolean => {
  return true // All 13 stages are unlocked at section level
}

const isStageCompleted = (stage: number): boolean => {
  // ユニット1・2両方が完了している場合のみステージ完了
  const coreProgress = userStore.progress?.core as Record<string, any>
  const unit1Key = `core_stage_${stage}_1`
  const unit2Key = `core_stage_${stage}_2`

  return (coreProgress?.['completed']?.includes(unit1Key) || false) &&
         (coreProgress?.['completed']?.includes(unit2Key) || false)
}


const completedStages = computed(() => {
  return categoryStages.value.filter(stage => isStageCompleted(stage.id)).length
})

const categoryProgress = computed(() => {
  if (categoryStages.value.length === 0) return 0
  return Math.round((completedStages.value / categoryStages.value.length) * 100)
})

const isCurrentStage = (stage: number): boolean => {
  return userStore.progress.core.currentStage === stage
}

const getStageStats = (stageId: number) => {
  return {
    bestWPM: userStore.progress.core.bestWpm[stageId] || null,
    accuracy: userStore.progress.core.bestAccuracy[stageId] || null
  }
}

// Navigation
const goBack = (): void => {
  router.push('/home')
}

const goToStage = (stage: number): void => {
  if (isStageUnlocked(stage)) {
    // 新しいサブステージ選択画面に遷移
    router.push(`/core-stages/stage/${stage}/substages`)
  }
}

// SRS機能
const startSRSGame = (config: { type: string; questionCount: number; reviewRatio: number; mode: string; studySet: unknown[] }) => {
  router.push({
    name: 'RandomCoreGame',
    params: {
      stage: 'all'
    },
    query: {
      srs: 'true',
      mode: config.mode,
      count: config.questionCount.toString(),
      contentType: 'core'
    }
  })
  showSRSModal.value = false
}

onMounted(() => {
  // Initialize content if needed
  if (contentStore.phrases.length === 0) {
    contentStore.initializeContent()
  }

  // コア構文のフレーズをSRSに追加
  const corePhrasesAll = contentStore.getCorePhrasesEnhanced
  srsStore.initializeContentCards(corePhrasesAll, 'core')
})
</script>

<style lang="scss" scoped>
.core-stages-detail {
  min-height: 100vh;
  padding: var(--spacing-lg) 0;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.stage-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;

  &:hover:not(.stage-card--locked) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-purple);
  }

  &--completed {
    border-color: var(--accent-green);
    background: linear-gradient(135deg,
      var(--bg-secondary) 0%,
      rgba(34, 197, 94, 0.05) 100%);
  }

  &--current {
    border-color: var(--accent-purple);
    animation: pulse 2s infinite;
  }

  &--locked {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.stage-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: 700;
  color: white;

  &--new {
    background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
    position: relative;
    animation: shine 2s infinite;
  }
}

.new-badge {
  background: var(--accent-green);
  color: white;
  font-size: var(--text-xs);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  position: absolute;
  top: -8px;
  right: -8px;
  animation: bounce 1s infinite;
}

@keyframes shine {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.status-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);

  &.completed {
    color: var(--accent-green);
  }

  &.locked {
    color: var(--text-tertiary);
  }

  &.available {
    color: var(--accent-purple);
  }
}

.stage-content {
  margin-bottom: var(--spacing-lg);
}

.stage-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.stage-description {
  font-size: var(--text-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.stage-stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.stage-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  margin-bottom: var(--spacing-lg);
}

.stage-performance {
  display: flex;
  justify-content: space-between;
}

.performance-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.performance-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.performance-value {
  display: block;
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--text-primary);
}

.stage-action {
  display: flex;
  justify-content: center;
}

.progress-summary {
  margin-top: var(--spacing-2xl);
  display: flex;
  justify-content: center;
}

.new-badge {
  background: var(--accent-green);
  color: white;
  font-size: var(--text-xs);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  position: absolute;
  top: -8px;
  right: -8px;
  animation: bounce 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    border-color: var(--accent-purple);
  }
  50% {
    border-color: var(--accent-pink);
  }
}

// Responsive design
@media (max-width: 768px) {
  .stages-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 var(--spacing-md);
  }
}

.section-info {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  text-align: center;

  .section-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
  }

  h2 {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }

  p {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
  }

  .section-stats {
    display: flex;
    justify-content: center;
    gap: var(--spacing-2xl);
    font-size: var(--text-md);
    color: var(--text-tertiary);

    span {
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
    }
  }

  .practice-buttons {
    margin-top: var(--spacing-lg);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    flex-wrap: wrap;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }
}
</style>