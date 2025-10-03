<template>
  <div class="my-phrases">
    <div class="container">
      <!-- ページヘッダー -->
      <PageHeader
        title="MYフレーズ管理"
        subtitle="お気に入りの英単語・フレーズを管理して効率的に練習しましょう"
      />

      <!-- 統計情報 -->
      <div class="stats-section">
        <div class="stats-grid">
          <StatsCard
            title="登録済み"
            :value="favoritesStore.totalCount"
            icon="⭐"
            suffix="個"
          />
          <StatsCard
            title="練習回数"
            :value="favoriteStats.totalPractices"
            icon="💪"
            suffix="回"
          />
          <StatsCard
            title="平均WPM"
            :value="favoriteStats.averageWpm"
            icon="⚡"
            suffix="WPM"
          />
          <StatsCard
            title="平均正確率"
            :value="favoriteStats.averageAccuracy"
            icon="🎯"
            suffix="%"
          />
        </div>
      </div>

      <!-- カテゴリータブ -->
      <div class="category-tabs">
        <button
          v-for="category in favoriteCategories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="['tab-button', { active: selectedCategory === category.id }]"
          :disabled="category.count === 0"
        >
          {{ category.icon }} {{ category.label }}
          <span class="count">{{ category.count }}</span>
        </button>
      </div>

      <!-- アクションボタン -->
      <div class="action-buttons" v-if="filteredItems.length > 0">
        <div class="left-actions">
          <SecondaryButton @click="selectAll" v-if="!isAllSelected">
            全て選択
          </SecondaryButton>
          <SecondaryButton @click="clearSelection" v-else>
            選択解除
          </SecondaryButton>
          <SecondaryButton 
            @click="deleteSelected" 
            :disabled="selectedItems.length === 0"
            variant="danger"
          >
            選択削除 ({{ selectedItems.length }})
          </SecondaryButton>
        </div>
        <div class="right-actions">
          <PrimaryButton 
            @click="startPractice"
            :disabled="filteredItems.length === 0"
          >
            🎮 練習開始
          </PrimaryButton>
        </div>
      </div>

      <!-- 練習設定モーダル -->
      <div v-if="showPracticeModal" class="modal-overlay" @click="showPracticeModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>練習設定</h3>
            <button @click="showPracticeModal = false" class="close-button">×</button>
          </div>
          
          <div class="modal-body">
            <div class="setting-group">
              <label>練習モード</label>
              <div class="mode-options">
                <button 
                  v-for="mode in practiceModes"
                  :key="mode.id"
                  @click="practiceConfig.mode = mode.id"
                  :class="['mode-button', { active: practiceConfig.mode === mode.id }]"
                >
                  {{ mode.label }}
                  <span class="mode-desc">{{ mode.description }}</span>
                </button>
              </div>
            </div>
            
            <div class="setting-group" v-if="practiceConfig.mode !== 'marathon'">
              <label>問題数</label>
              <div class="question-count">
                <button 
                  v-for="count in [5, 10, 20, 30]"
                  :key="count"
                  @click="practiceConfig.questionCount = count"
                  :class="['count-button', { active: practiceConfig.questionCount === count }]"
                >
                  {{ count }}問
                </button>
              </div>
            </div>
            
            <div class="setting-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="practiceConfig.smartMode"
                />
                スマートモード（苦手優先）
              </label>
            </div>
          </div>
          
          <div class="modal-footer">
            <SecondaryButton @click="showPracticeModal = false">
              キャンセル
            </SecondaryButton>
            <PrimaryButton @click="confirmPractice">
              練習開始
            </PrimaryButton>
          </div>
        </div>
      </div>

      <!-- アイテム一覧 -->
      <div class="items-section" v-if="filteredItems.length > 0">
        <div class="items-grid">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            :class="['item-card', { selected: selectedItems.includes(item.id) }]"
            @click="toggleSelection(item.id)"
          >
            <div class="item-header">
              <div class="item-type">
                <span class="type-icon">
                  {{ item.type === 'word' ? '📚' : '💬' }}
                </span>
                <span class="type-label">
                  {{ item.type === 'word' ? '英単語' : 'フレーズ' }}
                </span>
              </div>
              <div class="item-checkbox">
                <input 
                  type="checkbox" 
                  :checked="selectedItems.includes(item.id)"
                  @click.stop
                  @change="toggleSelection(item.id)"
                />
              </div>
            </div>
            
            <div class="item-content">
              <div class="english">{{ item.content.english }}</div>
              <div class="japanese">{{ item.content.japanese }}</div>
            </div>
            
            <div class="item-stats">
              <div class="stat">
                <span class="stat-label">練習</span>
                <span class="stat-value">{{ item.practiceCount }}回</span>
              </div>
              <div class="stat" v-if="item.bestWpm">
                <span class="stat-label">最高WPM</span>
                <span class="stat-value">{{ item.bestWpm }}</span>
              </div>
              <div class="stat" v-if="item.bestAccuracy">
                <span class="stat-label">最高正確率</span>
                <span class="stat-value">{{ item.bestAccuracy }}%</span>
              </div>
            </div>
            
            <div class="item-footer">
              <span class="added-date">
                {{ formatDate(item.addedAt) }}
              </span>
              <button 
                @click.stop="removeItem(item.id)"
                class="remove-button"
                title="削除"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状態 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>まだMYフレーズが登録されていません</h3>
        <p>
          英単語学習や英語フレーズ学習でクリア後に<br>
          「⭐ MYフレーズに追加」ボタンを押して登録しましょう
        </p>
        <div class="empty-actions">
          <PrimaryButton @click="$router.push('/words/level')">
            英単語学習へ
          </PrimaryButton>
          <SecondaryButton @click="$router.push('/phrases/category')">
            フレーズ学習へ
          </SecondaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import type { PracticeMode } from '@/types'

// Components
import PageHeader from '@/components/molecules/PageHeader.vue'
import StatsCard from '@/components/molecules/StatsCard.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import SecondaryButton from '@/components/atoms/SecondaryButton.vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()

// State
const selectedCategory = ref<string>('word-level1')
const selectedItems = ref<string[]>([])
const showPracticeModal = ref<boolean>(false)
const practiceConfig = ref({
  mode: 'quick' as PracticeMode,
  questionCount: 10,
  smartMode: false
})

// Computed
const favoriteCategories = computed(() => {
  return favoritesStore.favoriteCategories.filter(cat => cat.count > 0)
})

const favoriteStats = computed(() => favoritesStore.favoriteStats)

const filteredItems = computed(() => {
  return favoritesStore.favoriteCategories
    .find(cat => cat.id === selectedCategory.value)?.items || []
})

const isAllSelected = computed(() => {
  return filteredItems.value.length > 0 && 
         selectedItems.value.length === filteredItems.value.length
})

const practiceModes = [
  { 
    id: 'quick', 
    label: 'クイック', 
    description: '短時間で手軽に' 
  },
  { 
    id: 'normal', 
    label: 'ノーマル', 
    description: 'しっかり練習' 
  },
  { 
    id: 'long', 
    label: 'ロング', 
    description: 'じっくり学習' 
  },
  { 
    id: 'marathon', 
    label: 'マラソン', 
    description: '全問チャレンジ' 
  }
]

// Methods
const toggleSelection = (itemId: string) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

const selectAll = () => {
  selectedItems.value = filteredItems.value.map(item => item.id)
}

const clearSelection = () => {
  selectedItems.value = []
}

const deleteSelected = () => {
  if (confirm(`${selectedItems.value.length}個のアイテムを削除しますか？`)) {
    favoritesStore.removeMultiple(selectedItems.value)
    selectedItems.value = []
  }
}

const removeItem = (itemId: string) => {
  if (confirm('このアイテムを削除しますか？')) {
    favoritesStore.removeFromFavorites(itemId)
  }
}

const startPractice = () => {
  if (filteredItems.value.length === 0) return
  showPracticeModal.value = true
}

const confirmPractice = () => {
  // Set practice config
  favoritesStore.setPracticeConfig({
    mode: practiceConfig.value.mode,
    questionCount: practiceConfig.value.questionCount,
    categories: [selectedCategory.value],
    smartMode: practiceConfig.value.smartMode
  })
  
  showPracticeModal.value = false
  // Navigate to practice page
  router.push('/my-phrases/practice')
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric'
  })
}

// Initialize
onMounted(() => {
  // Set first available category as selected
  const availableCategories = favoriteCategories.value
  if (availableCategories.length > 0) {
    selectedCategory.value = availableCategories[0].id
  }
})
</script>

<style lang="scss" scoped>
.my-phrases {
  min-height: 100vh;
  padding: var(--space-lg) 0;
}

.stats-section {
  margin-bottom: var(--space-2xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  &:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--border-hover);
  }
  
  &.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .count {
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
  }
  
  &.active .count {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  gap: var(--space-md);
}

.left-actions, .right-actions {
  display: flex;
  gap: var(--space-md);
}

.items-section {
  margin-bottom: var(--space-2xl);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.item-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &.selected {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 1px var(--accent-blue);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.item-type {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  .type-icon {
    font-size: var(--text-lg);
  }
  
  .type-label {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }
}

.item-content {
  margin-bottom: var(--space-lg);
  
  .english {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
  }
  
  .japanese {
    font-size: var(--text-md);
    color: var(--text-secondary);
    line-height: 1.5;
  }
}

.item-stats {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-label {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      margin-bottom: var(--space-xs);
    }
    
    .stat-value {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-color);
  
  .added-date {
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }
  
  .remove-button {
    background: none;
    border: none;
    font-size: var(--text-md);
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    transition: background var(--transition-normal);
    
    &:hover {
      background: var(--bg-hover);
    }
  }
}

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: var(--text-2xl);
    cursor: pointer;
    padding: var(--space-xs);
    color: var(--text-secondary);
    
    &:hover {
      color: var(--text-primary);
    }
  }
}

.modal-body {
  padding: var(--space-xl);
}

.setting-group {
  margin-bottom: var(--space-xl);
  
  label {
    display: block;
    font-size: var(--text-md);
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }
}

.mode-options {
  display: grid;
  gap: var(--space-sm);
}

.mode-button {
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--border-hover);
  }
  
  &.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
  }
  
  .mode-desc {
    display: block;
    font-size: var(--text-sm);
    opacity: 0.8;
    margin-top: var(--space-xs);
  }
}

.question-count {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.count-button {
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--border-hover);
  }
  
  &.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
  }
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  
  input[type="checkbox"] {
    margin: 0;
  }
}

.modal-footer {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  padding: var(--space-xl);
  border-top: 1px solid var(--border-color);
}

.empty-state {
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--space-xl);
  }
  
  h3 {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }
  
  p {
    font-size: var(--text-md);
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--space-2xl);
  }
  
  .empty-actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
  }
}

// Responsive
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }
  
  .left-actions, .right-actions {
    justify-content: center;
  }
  
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .category-tabs {
    justify-content: center;
  }
  
  .tab-button {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .item-stats {
    gap: var(--space-md);
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .mode-options {
    grid-template-columns: 1fr;
  }
  
  .question-count {
    justify-content: center;
  }
  
  .modal-content {
    width: 95%;
    margin: var(--space-md);
  }
}
</style>