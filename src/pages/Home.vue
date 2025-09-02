<template>
  <div class="home">
    <div class="container">
      <!-- Page Header -->
      <PageHeader
        :title="t('home.title')"
        subtitle="あなたの英語タイピングスキルを向上させましょう"
      />

      <!-- Learning Menu -->
      <div class="learning-menu">
        <!-- Basic Typing Practice -->
        <LearningCard
          @click="goToBasicTyping"
          :title="t('home.basicTyping.title')"
          :description="t('home.basicTyping.description')"
          icon="⌨️"
          :progress="userStore.basicTypingProgress"
          :stats="{
            stages: `${userStore.progress.basicTyping.completedStages.length}/12`,
            progress: `${userStore.basicTypingProgress}%`
          }"
          variant="primary"
          class="basic-typing-card"
        >
          <template #badge>
            <ProgressBadge
              :value="userStore.basicTypingProgress"
              :label="t('home.basicTyping.progress')"
            />
          </template>
          
          <template #action>
            <SecondaryButton
              v-if="userStore.basicTypingProgress < 100"
              @click.stop="goToCurrentBasicStage"
              size="md"
            >
              {{ t('home.actions.goToStage', { stage: userStore.progress.basicTyping.currentStage }) }}
            </SecondaryButton>
            <PrimaryButton
              v-else
              @click.stop="goToBasicTyping"
              size="md"
            >
              {{ t('home.actions.review') }}
            </PrimaryButton>
          </template>
        </LearningCard>

        <!-- 英単語学習 -->
        <LearningCard
          @click="goToWordLevel"
          :title="t('home.wordLearning.title')"
          :description="t('home.wordLearning.description')"
          icon="📚"
          :progress="userStore.wordsProgress"
          :stats="{
            levels: `${userStore.progress.words.completedLevels.length}/3 ${t('home.stats.levels', { count: '' })}`.replace(' ', ''),
            progress: `${userStore.wordsProgress}%`
          }"
          variant="accent"
          class="word-learning-card"
        >
          <template #badge>
            <ProgressBadge
              :value="userStore.wordsProgress"
              :label="t('home.progressLabels.wordProgress')"
            />
          </template>
          
          <template #action>
            <PrimaryButton
              @click.stop="goToWordLevel"
              size="md"
            >
              {{ t('home.actions.learnWords') }}
            </PrimaryButton>
          </template>
        </LearningCard>

        <!-- 英語フレーズ学習 -->
        <LearningCard
          @click="goToPhraseCategory"
          :title="t('home.phraseLearning.title')"
          :description="t('home.phraseLearning.description')"
          icon="💬"
          :progress="userStore.phrasesProgress"
          :stats="{
            categories: `${userStore.progress.phrases.completedCategories.length}/6 ${t('home.stats.categories', { count: '' })}`.replace(' ', ''),
            progress: `${userStore.phrasesProgress}%`
          }"
          variant="secondary"
          class="phrase-learning-card"
        >
          <template #badge>
            <ProgressBadge
              :value="userStore.phrasesProgress"
              :label="t('home.progressLabels.phraseProgress')"
            />
          </template>
          
          <template #action>
            <PrimaryButton
              @click.stop="goToPhraseCategory"
              size="md"
            >
              {{ t('home.actions.learnPhrases') }}
            </PrimaryButton>
          </template>
        </LearningCard>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity" v-if="userStore.isAuthenticated">
        <h2 class="section-title">{{ t('home.activity.recentActivity') }}</h2>
        <div class="activity-grid">
          <StatsCard
            :title="t('home.activity.totalGames')"
            :value="userStore.progress.totalGames"
            icon="🎮"
            suffix="回"
          />
          <StatsCard
            title="総プレイ時間"
            :value="formatPlayTime(userStore.progress.totalPlayTime)"
            icon="⏱️"
            suffix=""
          />
          <StatsCard
            title="総文字数"
            :value="userStore.progress.totalCharactersTyped.toLocaleString()"
            icon="📝"
            suffix="文字"
          />
          <StatsCard
            title="今週の学習"
            :value="7"
            icon="📅"
            suffix="日"
          />
        </div>
      </div>

      <!-- Quick Start Actions -->
      <div class="quick-actions">
        <h2 class="section-title">クイックスタート</h2>
        <div class="actions-grid">
          <QuickActionCard
            @click="goToRandomBasicStage"
            title="ランダム練習"
            description="基本タイピングからランダムに選択"
            icon="🎲"
            color="var(--accent-blue)"
          />
          <QuickActionCard
            @click="goToRandomWords"
            title="英単語クイック"
            description="レベル1の単語でサクッと練習"
            icon="⚡"
            color="var(--accent-green)"
          />
          <QuickActionCard
            @click="goToSettings"
            title="設定"
            description="テーマや言語を変更"
            icon="⚙️"
            color="var(--neutral-600)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'

// Components
import PageHeader from '@/components/molecules/PageHeader.vue'
import LearningCard from '@/components/organisms/LearningCard.vue'
import ProgressBadge from '@/components/atoms/ProgressBadge.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import SecondaryButton from '@/components/atoms/SecondaryButton.vue'
import StatsCard from '@/components/molecules/StatsCard.vue'
import QuickActionCard from '@/components/molecules/QuickActionCard.vue'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

// Navigation methods
const goToBasicTyping = (): void => {
  router.push('/basic-typing')
}

const goToCurrentBasicStage = (): void => {
  const currentStage = userStore.progress.basicTyping.currentStage
  router.push(`/game/basic/${currentStage}`)
}

const goToWordLevel = (): void => {
  router.push('/words/level')
}

const goToPhraseCategory = (): void => {
  router.push('/phrases/category')
}

const goToSettings = (): void => {
  settingsStore.openSettings()
}

// Quick action methods
const goToRandomBasicStage = (): void => {
  const completedStages = userStore.progress.basicTyping.completedStages
  const availableStages = Array.from({ length: 12 }, (_, i) => i + 1)
    .filter(stage => completedStages.includes(stage))
  
  if (availableStages.length === 0) {
    // If no completed stages, go to stage 1
    router.push('/game/basic/1')
  } else {
    const randomStage = availableStages[Math.floor(Math.random() * availableStages.length)]
    router.push(`/game/basic/${randomStage}`)
  }
}

const goToRandomWords = (): void => {
  router.push('/words/1')
}

// Utility methods
const formatPlayTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}分`
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  padding: var(--space-lg) 0;
}

.learning-menu {
  margin-bottom: var(--space-2xl);
  display: grid;
  gap: var(--space-xl);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.basic-typing-card,
.english-learning-card {
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--border-color);
}

.recent-activity {
  margin-bottom: var(--space-2xl);
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.quick-actions {
  margin-bottom: var(--space-2xl);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
}

// Responsive adjustments
@media (max-width: 768px) {
  .learning-menu {
    grid-template-columns: 1fr;
  }
  
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>