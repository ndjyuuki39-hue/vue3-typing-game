<template>
  <div class="core-substages-page">
    <div class="page-header-wrapper">
      <PageHeader :title="`${stageTitle} - ユニット選択`" :showBack="true" />
    </div>

    <div class="content-container">
      <div class="stage-info">
        <div class="stage-icon">📝</div>
        <h2>{{ stageTitle }}</h2>
        <p>{{ stageDescription }}</p>
        <div class="stage-stats">
          <span>総フレーズ数: {{ totalPhrases }}個</span>
          <span>ユニット数: {{ totalUnits }}個</span>
        </div>
      </div>

      <div class="substage-grid">
        <div
          v-for="substage in substages"
          :key="substage.id"
          class="substage-card"
          :class="{
            'substage-card--locked': !isSubstageUnlocked(substage.id),
            'substage-card--completed': isSubstageCompleted(substage.id),
            'substage-card--current': isCurrentSubstage(substage.id)
          }"
          @click="handleSubstageClick(substage)"
        >
          <div class="substage-header">
            <div class="substage-letter">{{ substage.number }}</div>
            <div class="substage-status">
              <CheckIcon v-if="isSubstageCompleted(substage.id)" class="status-icon completed" />
              <LockIcon v-else-if="!isSubstageUnlocked(substage.id)" class="status-icon locked" />
              <PlayIcon v-else class="status-icon available" />
            </div>
          </div>

          <div class="substage-content">
            <h3 class="substage-title">ユニット {{ substage.number }}</h3>
            <p class="substage-description">{{ substage.phraseRange }}</p>

            <div class="substage-progress">
              <ProgressBar
                :value="getSubstageProgress(substage.id)"
                :showLabel="true"
                size="sm"
              />
            </div>
          </div>

          <div class="substage-footer">
            <div class="substage-stats">
              <div class="stat">
                <span class="stat-label">ベストWPM</span>
                <span class="stat-value">{{ getSubstageStats(substage.id).bestWPM || '-' }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">正確率</span>
                <span class="stat-value">{{ getSubstageStats(substage.id).accuracy || '-' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useContentStore } from '@/stores/content'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import LockIcon from '@/components/atoms/LockIcon.vue'
import PlayIcon from '@/components/atoms/PlayIcon.vue'

interface CoreSubstage {
  id: string
  number: string
  title: string
  phraseRange: string
  startPhrase: number
  endPhrase: number
}

// Removed unused i18n import
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const contentStore = useContentStore()

// URLパラメータからステージIDを取得
const stageId = computed(() => parseInt(String(route.params['stage'])) || 1)

// ステージ情報
const stageTitle = computed(() => `セクション ${stageId.value}`)
const stageDescription = computed(() => {
  // Use stage info from CoreStagesDetail's getStageInfo logic
  const stageInfoMap: Record<number, { title: string; description: string }> = {
    1: { title: '基本パターン', description: 'I am, You are, This is など' },
    2: { title: '疑問文', description: 'What, Where, How などの基本疑問文' },
    3: { title: '過去形', description: 'was, were, did などの過去形表現' },
    4: { title: '現在完了', description: 'have/has + 過去分詞の表現' },
    5: { title: '未来形', description: 'will, be going to などの未来表現' },
    6: { title: '助動詞', description: 'can, could, should などの助動詞' },
    7: { title: '受動態', description: 'be + 過去分詞の受動的な表現' },
    8: { title: '関係代名詞', description: 'who, which, that などの関係代名詞' },
    9: { title: '分詞構文', description: '現在分詞・過去分詞を使った構文' },
    10: { title: '比較表現', description: '比較級・最上級の表現' },
    11: { title: '句動詞', description: 'get up, look for などの句動詞' },
    12: { title: '会話ストラテジー', description: '実際の会話で使える表現' },
    13: { title: '慣用表現', description: 'イディオムや熟語表現' }
  }
  const stageInfo = stageInfoMap[stageId.value]
  return stageInfo?.description || `ステージ ${stageId.value} の学習内容`
})

// このステージのフレーズ数を取得（固定値に変更）
const totalPhrases = computed(() => {
  // 各ステージに20フレーズが含まれることを前提としたシンプルな管理
  return 20
})

// ユニット設定（シンプルな固定構成）
const substages = computed((): CoreSubstage[] => {
  const phrasesPerUnit = 10
  const unitCount = Math.ceil(totalPhrases.value / phrasesPerUnit)

  return Array.from({ length: unitCount }, (_, i) => {
    const unitNumber = i + 1
    const startPhrase = i * phrasesPerUnit + 1
    const endPhrase = Math.min((i + 1) * phrasesPerUnit, totalPhrases.value)

    return {
      id: String(unitNumber),
      number: String(unitNumber),
      title: `ユニット ${unitNumber}`,
      phraseRange: `フレーズ ${startPhrase}-${endPhrase}`,
      startPhrase,
      endPhrase
    }
  })
})

// 総ユニット数
const totalUnits = computed(() => substages.value.length)

// 進捗管理
const getProgressKey = (substageId: string) => `core_stage_${stageId.value}_${substageId}`

const isSubstageUnlocked = (substageId: string): boolean => {
  // 最初のユニットは常にアンロック
  if (substageId === '1') return true

  // 前のユニットが完了している場合のみアンロック
  const prevUnitId = String(parseInt(substageId) - 1)
  const coreProgress = userStore.progress?.core as Record<string, any>
  const prevUnitKey = getProgressKey(prevUnitId)
  return coreProgress?.['completed']?.includes(prevUnitKey) || false
}

const isSubstageCompleted = (substageId: string): boolean => {
  const coreProgress = userStore.progress?.core as Record<string, any>
  const key = getProgressKey(substageId)
  return coreProgress?.['completed']?.includes(key) || false
}

const isCurrentSubstage = (substageId: string): boolean => {
  if (!isSubstageUnlocked(substageId)) return false
  if (isSubstageCompleted(substageId)) return false

  // 前のユニットがすべて完了していて、このユニットが未完了の場合は現在のユニット
  const unitNum = parseInt(substageId)
  for (let i = 1; i < unitNum; i++) {
    if (!isSubstageCompleted(String(i))) return false
  }
  return true
}

const getSubstageProgress = (substageId: string): number => {
  if (isSubstageCompleted(substageId)) return 100

  const coreProgress = userStore.progress?.core as Record<string, any>
  const key = getProgressKey(substageId)
  if (coreProgress?.['current'] === key) return 50

  return 0
}

const getSubstageStats = (substageId: string) => {
  const coreProgress = userStore.progress?.core as Record<string, any>
  const key = getProgressKey(substageId)

  return {
    bestWPM: coreProgress?.['stageBestWpm']?.[key] || 0,
    accuracy: coreProgress?.['stageBestAccuracy']?.[key] || 0
  }
}

const handleSubstageClick = (substage: CoreSubstage) => {
  if (!isSubstageUnlocked(substage.id)) {
    return
  }

  // ゲーム画面へ遷移（コアサブステージモード）
  router.push(`/core-substages/game/${stageId.value}/${substage.id}`)
}

onMounted(() => {
  contentStore.initializePhrasesContent()
})
</script>

<style lang="scss" scoped>
.core-substages-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.stage-info {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  text-align: center;

  .stage-icon {
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

  .stage-stats {
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
}

.substage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.substage-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover:not(.substage-card--locked) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-purple);
  }

  &--completed {
    border-color: var(--accent-green);
    background: linear-gradient(135deg,
      var(--bg-secondary) 0%,
      rgba(var(--accent-green-rgb), 0.05) 100%);
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

.substage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.substage-letter {
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
}

.status-icon {
  width: 20px;
  height: 20px;

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

.substage-content {
  margin-bottom: var(--spacing-md);
}

.substage-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.substage-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.substage-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.substage-stats {
  display: flex;
  justify-content: space-around;
}

.stat {
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
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--text-primary);
}

@keyframes pulse {
  0%, 100% {
    border-color: var(--accent-purple);
  }
  50% {
    border-color: var(--accent-pink);
  }
}

.page-header-wrapper {
  .page-header {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--space-md);
  }
}

@media (max-width: 768px) {
  .substage-grid {
    grid-template-columns: 1fr;
  }
}
</style>