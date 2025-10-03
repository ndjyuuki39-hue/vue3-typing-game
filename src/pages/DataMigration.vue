<template>
  <div class="migration-page">
    <div class="migration-container">
      <h1>データ移行</h1>

      <div v-if="!migrating && !completed" class="migration-info">
        <p>LocalStorageに保存された学習データをバックエンドに移行します。</p>

        <div class="data-summary">
          <h3>移行対象データ:</h3>
          <ul>
            <li v-if="hasProgress">✅ 学習進捗データ</li>
            <li v-if="hasSRS">✅ SRSカードデータ</li>
            <li v-if="!hasProgress && !hasSRS">⚠️ 移行するデータがありません</li>
          </ul>
        </div>

        <div class="migration-actions">
          <button
            @click="startMigration"
            :disabled="!hasProgress && !hasSRS"
            class="btn-primary"
          >
            移行を開始
          </button>

          <button @click="skip" class="btn-secondary">
            スキップ
          </button>
        </div>
      </div>

      <div v-else-if="migrating" class="migration-progress">
        <div class="spinner"></div>
        <p>データを移行中...</p>
      </div>

      <div v-else class="migration-complete">
        <div class="success-icon">✅</div>
        <h2>移行完了！</h2>
        <p>{{ result }}</p>

        <button @click="goHome" class="btn-primary">
          ホームに戻る
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { migrateLocalDataToBackend, needsMigration } from '@/utils/dataMigration'

const router = useRouter()

const migrating = ref(false)
const completed = ref(false)
const result = ref('')

const hasProgress = computed(() => !!localStorage.getItem('userProgress'))
const hasSRS = computed(() => !!localStorage.getItem('srsCards'))

const startMigration = async () => {
  migrating.value = true

  try {
    const response = await migrateLocalDataToBackend()

    if (response.success) {
      result.value = response.message
      completed.value = true
    } else {
      result.value = '移行に失敗しました: ' + response.message
      completed.value = true
    }
  } catch (error) {
    result.value = '移行中にエラーが発生しました'
    completed.value = true
  } finally {
    migrating.value = false
  }
}

const skip = () => {
  localStorage.setItem('dataMigrationSkipped', 'true')
  router.push('/home')
}

const goHome = () => {
  router.push('/home')
}

onMounted(() => {
  // 移行不要の場合はホームへリダイレクト
  if (!needsMigration()) {
    router.push('/home')
  }
})
</script>

<style scoped lang="scss">
.migration-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.migration-container {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  h2 {
    text-align: center;
    color: #667eea;
    margin-bottom: 1rem;
  }

  h3 {
    color: #555;
    margin-bottom: 1rem;
  }
}

.migration-info {
  p {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
}

.data-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 0.5rem 0;
      color: #555;
    }
  }
}

.migration-actions {
  display: flex;
  gap: 1rem;

  button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &.btn-primary {
      background: #667eea;
      color: white;

      &:hover:not(:disabled) {
        background: #5568d3;
        transform: translateY(-2px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &.btn-secondary {
      background: #e0e0e0;
      color: #666;

      &:hover {
        background: #d0d0d0;
      }
    }
  }
}

.migration-progress {
  text-align: center;
  padding: 3rem 0;

  .spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto 1.5rem;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.migration-complete {
  text-align: center;
  padding: 2rem 0;

  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }

  button {
    padding: 1rem 2rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
