<template>
  <div class="learning-dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">🎯 個人最適化学習システム</h2>
      <p class="dashboard-subtitle">AIがあなたの学習データを分析して最適な学習順序を提案します</p>
    </div>

    <!-- 学習分析サマリー -->
    <div class="analytics-summary">
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-icon">💪</div>
          <div class="analytics-content">
            <h3>得意分野</h3>
            <div class="strength-tags">
              <span
                v-for="area in analytics.strengthAreas"
                :key="area"
                class="strength-tag"
              >
                {{ area }}
              </span>
              <span v-if="analytics.strengthAreas.length === 0" class="no-data">
                データ蓄積中...
              </span>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <div class="analytics-icon">🎯</div>
          <div class="analytics-content">
            <h3>推奨目標</h3>
            <div class="target-stats">
              <div class="target-item">
                <span class="target-label">WPM</span>
                <span class="target-value">{{ analytics.recommendedSpeed }}</span>
              </div>
              <div class="target-item">
                <span class="target-label">難易度</span>
                <span class="target-value">レベル{{ analytics.optimalDifficulty }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <div class="analytics-icon">📊</div>
          <div class="analytics-content">
            <h3>学習指標</h3>
            <div class="metrics">
              <div class="metric-item">
                <span class="metric-label">一貫性</span>
                <div class="metric-bar">
                  <div
                    class="metric-fill"
                    :style="{ width: `${analytics.consistencyScore * 100}%` }"
                  ></div>
                </div>
                <span class="metric-value">{{ Math.round(analytics.consistencyScore * 100) }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">定着率</span>
                <div class="metric-bar">
                  <div
                    class="metric-fill"
                    :style="{ width: `${analytics.retentionRate * 100}%` }"
                  ></div>
                </div>
                <span class="metric-value">{{ Math.round(analytics.retentionRate * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI推奨学習プラン -->
    <div class="recommendations-section">
      <h3 class="section-title">🤖 AI推奨学習プラン</h3>
      <div class="recommendations-grid">
        <div
          v-for="(rec, index) in topRecommendations"
          :key="`${rec.type}-${rec.content.id}`"
          class="recommendation-card"
          :class="`recommendation-card--${rec.type}`"
          @click="startRecommendedLearning(rec)"
        >
          <div class="recommendation-header">
            <div class="recommendation-rank">{{ index + 1 }}</div>
            <div class="recommendation-type-badge" :class="`badge--${rec.type}`">
              {{ getTypeName(rec.type) }}
            </div>
            <div class="priority-indicator" :style="{ width: `${rec.priority * 10}%` }"></div>
          </div>

          <div class="recommendation-content">
            <h4 class="recommendation-title">{{ rec.content.title }}</h4>
            <p class="recommendation-reason">{{ rec.reason }}</p>

            <div class="recommendation-targets">
              <div class="target-chip">
                <span class="target-icon">🎯</span>
                <span>正確率 {{ rec.targetAccuracy }}%</span>
              </div>
              <div class="target-chip">
                <span class="target-icon">⚡</span>
                <span>{{ rec.targetWpm }} WPM</span>
              </div>
              <div class="target-chip">
                <span class="target-icon">⏱️</span>
                <span>約{{ rec.estimatedDuration }}分</span>
              </div>
            </div>

            <!-- 成功予測 -->
            <div class="success-prediction">
              <div class="prediction-label">成功予測</div>
              <div class="prediction-bar">
                <div
                  class="prediction-fill"
                  :style="{ width: `${getPredictionScore(rec) * 100}%` }"
                ></div>
              </div>
              <div class="prediction-percentage">{{ Math.round(getPredictionScore(rec) * 100) }}%</div>
            </div>
          </div>

          <div class="recommendation-action">
            <PrimaryButton
              @click.stop="startRecommendedLearning(rec)"
              :variant="index === 0 ? 'primary' : 'secondary'"
              size="sm"
            >
              {{ index === 0 ? '🚀 最優先で開始' : '学習開始' }}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>

    <!-- 学習統計 -->
    <div class="learning-stats">
      <h3 class="section-title">📈 学習統計</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-content">
            <div class="stat-value">{{ userStore.progress.totalGames }}</div>
            <div class="stat-label">総ゲーム数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatTime(userStore.progress.totalPlayTime) }}</div>
            <div class="stat-label">総学習時間</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ userStore.progress.totalCharactersTyped.toLocaleString() }}</div>
            <div class="stat-label">総文字数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ getTotalCompletedStages() }}</div>
            <div class="stat-label">完了ステージ数</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useLearningOptimizer, type LearningRecommendation } from '@/composables/useLearningOptimizer'

// Components
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'

const router = useRouter()
const userStore = useUserStore()
const { analyzeUserPerformance, generateRecommendations, predictLearningOutcome } = useLearningOptimizer()

// Computed properties
const analytics = analyzeUserPerformance
const recommendations = generateRecommendations

const topRecommendations = computed(() => {
  return recommendations.value.slice(0, 3) // トップ3つの推奨のみ表示
})

// Methods
const getPredictionScore = (recommendation: LearningRecommendation): number => {
  return predictLearningOutcome(recommendation.type, recommendation.targetWpm)
}

const getTypeName = (type: string): string => {
  const typeNames: Record<string, string> = {
    basic: '基本タイピング',
    words: '英単語',
    phrases: '英語フレーズ',
    core: 'コア構文'
  }
  return typeNames[type] || type
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}分`
}

const getTotalCompletedStages = (): number => {
  const progress = userStore.progress
  return progress.basicTyping.completedStages.length +
         progress.words.completedLevels.length +
         progress.phrases.completedCategories.length +
         progress.core.completedStages.length
}

const startRecommendedLearning = (recommendation: LearningRecommendation): void => {
  switch (recommendation.type) {
    case 'basic':
      router.push(`/game/basic/${recommendation.content.id}`)
      break
    case 'words':
      router.push(`/words/${recommendation.content.id}`)
      break
    case 'phrases':
      router.push(`/phrases/${recommendation.content.id}`)
      break
    case 'core':
      router.push(`/core-stages/stage/${recommendation.content.id}`)
      break
  }
}
</script>

<style lang="scss" scoped>
.learning-dashboard {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  border: 2px solid var(--border-color);
}

.dashboard-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);

  .dashboard-title {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }

  .dashboard-subtitle {
    font-size: var(--text-md);
    color: var(--text-secondary);
    margin: 0;
  }
}

.analytics-summary {
  margin-bottom: var(--spacing-2xl);
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.analytics-card {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  .analytics-icon {
    font-size: 32px;
    flex-shrink: 0;
  }

  .analytics-content {
    flex: 1;

    h3 {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-sm) 0;
    }
  }
}

.strength-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);

  .strength-tag {
    background: var(--accent-green);
    color: white;
    padding: 2px var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .no-data {
    color: var(--text-tertiary);
    font-style: italic;
    font-size: var(--text-sm);
  }
}

.target-stats {
  display: flex;
  gap: var(--spacing-md);

  .target-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .target-label {
      font-size: var(--text-xs);
      color: var(--text-tertiary);
      margin-bottom: var(--spacing-xs);
    }

    .target-value {
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--accent-purple);
    }
  }
}

.metrics {
  .metric-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);

    .metric-label {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      width: 50px;
      flex-shrink: 0;
    }

    .metric-bar {
      flex: 1;
      height: 6px;
      background: var(--border-color);
      border-radius: var(--radius-full);
      overflow: hidden;

      .metric-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink));
        transition: width var(--transition-base);
      }
    }

    .metric-value {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
      width: 35px;
      text-align: right;
    }
  }
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-color);
}

.recommendations-section {
  margin-bottom: var(--spacing-2xl);
}

.recommendations-grid {
  display: grid;
  gap: var(--spacing-lg);
}

.recommendation-card {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-purple);
  }

  &--basic {
    border-left: 4px solid var(--accent-blue);
  }

  &--words {
    border-left: 4px solid var(--accent-green);
  }

  &--phrases {
    border-left: 4px solid var(--accent-purple);
  }

  &--core {
    border-left: 4px solid var(--accent-pink);
  }
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);

  .recommendation-rank {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-md);
    font-weight: 700;
    color: white;
  }

  .recommendation-type-badge {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-weight: 600;
    color: white;

    &.badge--basic { background: var(--accent-blue); }
    &.badge--words { background: var(--accent-green); }
    &.badge--phrases { background: var(--accent-purple); }
    &.badge--core { background: var(--accent-pink); }
  }

  .priority-indicator {
    flex: 1;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink));
    border-radius: var(--radius-full);
    margin-left: auto;
    max-width: 100px;
  }
}

.recommendation-content {
  margin-bottom: var(--spacing-lg);

  .recommendation-title {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .recommendation-reason {
    font-size: var(--text-md);
    color: var(--text-secondary);
    margin: 0 0 var(--spacing-md) 0;
  }
}

.recommendation-targets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);

  .target-chip {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--text-sm);
    color: var(--text-secondary);

    .target-icon {
      font-size: var(--text-sm);
    }
  }
}

.success-prediction {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  .prediction-label {
    font-size: var(--text-sm);
    color: var(--text-tertiary);
    width: 60px;
    flex-shrink: 0;
  }

  .prediction-bar {
    flex: 1;
    height: 6px;
    background: var(--border-color);
    border-radius: var(--radius-full);
    overflow: hidden;

    .prediction-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-green), var(--accent-blue));
      transition: width var(--transition-base);
    }
  }

  .prediction-percentage {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    width: 40px;
    text-align: right;
  }
}

.learning-stats {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }

  .stat-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);

    .stat-icon {
      font-size: 28px;
      flex-shrink: 0;
    }

    .stat-content {
      .stat-value {
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: var(--text-sm);
        color: var(--text-tertiary);
        margin: 0;
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .recommendation-header {
    flex-wrap: wrap;
  }

  .target-stats {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>