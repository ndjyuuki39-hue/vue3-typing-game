<template>
  <div class="landing">
    <!-- Hero Section -->
    <section class="landing-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            {{ t('landing.title') }}
          </h1>
          <p class="hero-subtitle">
            {{ t('landing.subtitle') }}
          </p>
          <p class="hero-description">
            {{ t('landing.description') }}
          </p>
          
          <!-- Features Grid -->
          <div class="features-grid">
            <FeatureCard
              icon="🎯"
              :title="t('landing.features.basic')"
              description="ホームポジションから実践まで段階的に習得"
            />
            <FeatureCard
              icon="📚"
              :title="t('landing.features.words')"
              description="基礎から応用まで600単語で語彙力向上"
            />
            <FeatureCard
              icon="💬"
              :title="t('landing.features.phrases')"
              description="日常・ビジネス・旅行で使える実践フレーズ"
            />
          </div>
          
          <!-- CTA Button -->
          <PrimaryButton
            @click="startGame"
            size="xl"
            class="hero-cta"
          >
            {{ t('landing.startButton') }}
          </PrimaryButton>
        </div>
      </div>
    </section>

    <!-- Service Features Section -->
    <section class="service-features">
      <div class="container">
        <div class="features-list">
          <ServiceFeature
            icon="⌨️"
            title="指ガイド付きキーボード"
            description="色分けされた指ガイドで正しいタイピングフォームを習得"
          />
          <ServiceFeature
            icon="🎨"
            title="大人な近未来デザイン"
            description="ダークモード標準の洗練されたUIで集中して学習"
          />
          <ServiceFeature
            icon="📱"
            title="PWA対応"
            description="スマホ・タブレット・PCでいつでもどこでも学習可能"
          />
          <ServiceFeature
            icon="🔊"
            title="音声再生機能"
            description="ネイティブ発音で正しい英語の音を学習"
          />
          <ServiceFeature
            icon="📊"
            title="進捗管理"
            description="WPM・正確性・達成率を詳細に記録・分析"
          />
          <ServiceFeature
            icon="🌐"
            title="日英バイリンガル"
            description="日本語・英語の言語切替でグローバル対応"
          />
        </div>
      </div>
    </section>

    <!-- Pricing Preview Section (Future) -->
    <section class="pricing-preview">
      <div class="container">
        <h2 class="section-title">今後の料金プラン（予定）</h2>
        <div class="pricing-grid">
          <PricingCard
            title="無料プラン"
            price="¥0"
            :features="[
              '基本タイピング練習（12段階）',
              '英単語学習（レベル1のみ）',
              '進捗記録',
              '広告表示あり'
            ]"
            current
          />
          <PricingCard
            title="プレミアム"
            price="¥980"
            period="/月"
            :features="[
              '全機能無制限アクセス',
              '英単語学習（全3レベル）',
              '英語フレーズ学習（全6カテゴリー）',
              '詳細統計・分析',
              '広告なし',
              'オフライン機能'
            ]"
            highlight
          />
          <PricingCard
            title="エンタープライズ"
            price="お問い合わせ"
            :features="[
              'カスタマイズ可能なコンテンツ',
              '企業向け管理機能',
              '学習レポート出力',
              '専用サポート',
              'SSO連携'
            ]"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

// Components
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import FeatureCard from '@/components/molecules/FeatureCard.vue'
import ServiceFeature from '@/components/molecules/ServiceFeature.vue'
import PricingCard from '@/components/molecules/PricingCard.vue'

const router = useRouter()
const { t } = useI18n()

const startGame = (): void => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
.landing {
  min-height: 100vh;
  background: var(--bg-primary);
}

// Hero Section
.landing-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl) 0;
  background: linear-gradient(
    135deg, 
    var(--primary-dark) 0%, 
    var(--primary-blue) 100%
  );
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 30% 20%,
      rgba(6, 182, 212, 0.1) 0%,
      transparent 50%
    );
  }
}

.hero-content {
  text-align: center;
  max-width: 800px;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  background: linear-gradient(135deg, #ffffff 0%, var(--primary-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--text-xl);
  color: var(--accent-cyan);
  margin-bottom: var(--space-lg);
  font-weight: 500;
}

.hero-description {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-2xl);
  line-height: 1.8;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.hero-cta {
  transform: translateY(0);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

// Service Features Section
.service-features {
  padding: var(--space-2xl) 0;
  background: var(--bg-secondary);
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

// Pricing Section
.pricing-preview {
  padding: var(--space-2xl) 0;
  background: var(--bg-primary);
}

.section-title {
  text-align: center;
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
  font-weight: 600;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  max-width: 1000px;
  margin: 0 auto;
}

// Responsive Design
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-2xl);
  }
  
  .hero-subtitle {
    font-size: var(--text-lg);
  }
  
  .hero-description {
    font-size: var(--text-base);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>