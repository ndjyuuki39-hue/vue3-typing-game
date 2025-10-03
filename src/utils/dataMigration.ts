import { trpc } from '@/api/trpc'

/**
 * LocalStorageから バックエンドへデータを移行
 */
export const migrateLocalDataToBackend = async () => {
  try {
    console.log('🔄 データ移行開始...')

    // 1. 進捗データの移行
    const progressData = localStorage.getItem('userProgress')
    if (progressData) {
      const progress = JSON.parse(progressData)
      console.log('📦 進捗データ:', Object.keys(progress).length, '件')

      for (const [contentId, data] of Object.entries(progress) as Array<[string, any]>) {
        try {
          await trpc.progress.createSession.mutate({
            contentType: data.contentType || 'word',
            contentId: contentId,
            wpm: data.bestWpm || 0,
            accuracy: (data.bestAccuracy || 0) / 100,
            durationSeconds: data.totalTime || 0,
            errorCount: 0,
            completed: data.completed || false
          })
          console.log('✅ 進捗移行:', contentId)
        } catch (error) {
          console.error('❌ 進捗移行失敗:', contentId, error)
        }
      }
    }

    // 2. SRSカードデータの移行
    const srsData = localStorage.getItem('srsCards')
    if (srsData) {
      const srsCards = JSON.parse(srsData)
      console.log('📦 SRSカード:', Object.keys(srsCards).length, '件')

      for (const [contentId, card] of Object.entries(srsCards) as Array<[string, any]>) {
        try {
          // カード作成（既存の場合は取得）
          await trpc.srs.getOrCreateCard.mutate({
            contentId: contentId,
            contentType: card.contentType || 'word'
          })

          // 既に復習履歴がある場合は復習記録
          if (card.totalReviews > 0) {
            const quality = card.correctReviews / card.totalReviews >= 0.8 ? 5 : 3
            await trpc.srs.recordReview.mutate({
              cardId: contentId,
              quality,
              responseTime: card.averageResponseTime || 3000,
              accuracy: (card.lastAccuracy || 100) / 100,
              wpm: 0
            })
          }

          console.log('✅ SRSカード移行:', contentId)
        } catch (error) {
          console.error('❌ SRSカード移行失敗:', contentId, error)
        }
      }
    }

    // 3. お気に入りデータの移行（将来の実装）
    const favoritesData = localStorage.getItem('favorites')
    if (favoritesData) {
      console.log('📦 お気に入り: (未実装)')
    }

    // 4. 移行完了後、LocalStorageをクリア
    const shouldClearLocal = confirm(
      '✅ データ移行が完了しました！\n\nLocalStorageの古いデータを削除しますか？\n（削除しても、バックエンドにデータは保存済みです）'
    )

    if (shouldClearLocal) {
      localStorage.removeItem('userProgress')
      localStorage.removeItem('srsCards')
      localStorage.removeItem('favorites')
      localStorage.setItem('dataMigrated', 'true')
      console.log('🗑️ LocalStorageクリア完了')
    }

    return {
      success: true,
      message: 'データ移行完了！'
    }
  } catch (error) {
    console.error('❌ データ移行エラー:', error)
    return {
      success: false,
      message: 'データ移行に失敗しました',
      error
    }
  }
}

/**
 * 移行が必要かチェック
 */
export const needsMigration = (): boolean => {
  // 既に移行済みの場合はfalse
  if (localStorage.getItem('dataMigrated') === 'true') {
    return false
  }

  // 進捗データまたはSRSデータがある場合はtrue
  const hasProgress = localStorage.getItem('userProgress')
  const hasSRS = localStorage.getItem('srsCards')

  return !!(hasProgress || hasSRS)
}
