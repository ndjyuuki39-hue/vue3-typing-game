import type { PhraseContent } from '@/stores/content'

// Business - 10 Stages × 10 Phrases = 100 Phrases
export const businessPhrases: PhraseContent[] = [
  // Stage 1: 基本的なビジネス表現 (Basic Business - moved from daily)
  {
    id: 'business-001',
    english: 'I go to work.',
    japanese: '仕事に行きます。',
    category: 'business',
    situation: '通勤',
    difficulty: 1
  },
  {
    id: 'business-002',
    english: 'Could we schedule a meeting?',
    japanese: '会議を設定できますでしょうか？',
    category: 'business',
    situation: '会議の設定',
    difficulty: 2
  },
  {
    id: 'business-003',
    english: 'I would like to discuss this project.',
    japanese: 'このプロジェクトについて話し合いたいです。',
    category: 'business',
    situation: 'プロジェクト相談',
    difficulty: 2
  },
  {
    id: 'business-004',
    english: 'What time does the office open?',
    japanese: 'オフィスは何時に開きますか？',
    category: 'business',
    situation: '営業時間確認',
    difficulty: 1
  },
  {
    id: 'business-005',
    english: 'I have a meeting at three.',
    japanese: '3時に会議があります。',
    category: 'business',
    situation: '会議予定',
    difficulty: 1
  },
  {
    id: 'business-006',
    english: 'Can you send me the report?',
    japanese: 'レポートを送ってもらえますか？',
    category: 'business',
    situation: 'レポート依頼',
    difficulty: 1
  },
  {
    id: 'business-007',
    english: 'The deadline is next week.',
    japanese: '締切は来週です。',
    category: 'business',
    situation: '締切確認',
    difficulty: 1
  },
  {
    id: 'business-008',
    english: 'I need to make a phone call.',
    japanese: '電話をかける必要があります。',
    category: 'business',
    situation: '電話連絡',
    difficulty: 1
  },
  {
    id: 'business-009',
    english: 'Let me check my calendar.',
    japanese: 'スケジュールを確認します。',
    category: 'business',
    situation: 'スケジュール確認',
    difficulty: 1
  },
  {
    id: 'business-010',
    english: 'I am running late for work.',
    japanese: '仕事に遅刻しそうです。',
    category: 'business',
    situation: '遅刻',
    difficulty: 1
  },

  // Stage 2: 会議・プレゼンテーション (Meetings & Presentations)
  {
    id: 'business-011',
    english: 'Good morning, everyone.',
    japanese: 'おはようございます、皆さん。',
    category: 'business',
    situation: '会議挨拶',
    difficulty: 1
  },
  {
    id: 'business-012',
    english: 'Let me introduce myself.',
    japanese: '自己紹介をさせてください。',
    category: 'business',
    situation: '自己紹介',
    difficulty: 1
  },
  {
    id: 'business-013',
    english: 'May I have your attention?',
    japanese: 'ご注目いただけますか？',
    category: 'business',
    situation: '注意喚起',
    difficulty: 2
  },
  {
    id: 'business-014',
    english: 'Let us start the meeting.',
    japanese: '会議を始めましょう。',
    category: 'business',
    situation: '会議開始',
    difficulty: 1
  },
  {
    id: 'business-015',
    english: 'What is your opinion?',
    japanese: 'あなたの意見は何ですか？',
    category: 'business',
    situation: '意見確認',
    difficulty: 1
  },
  {
    id: 'business-016',
    english: 'I agree with your proposal.',
    japanese: 'あなたの提案に賛成です。',
    category: 'business',
    situation: '提案同意',
    difficulty: 1
  },
  {
    id: 'business-017',
    english: 'Could you repeat that?',
    japanese: 'それを繰り返してもらえますか？',
    category: 'business',
    situation: '聞き返し',
    difficulty: 1
  },
  {
    id: 'business-018',
    english: 'Let me think about it.',
    japanese: 'それについて考えさせてください。',
    category: 'business',
    situation: '検討要請',
    difficulty: 1
  },
  {
    id: 'business-019',
    english: 'The presentation went well.',
    japanese: 'プレゼンテーションはうまくいきました。',
    category: 'business',
    situation: 'プレゼン評価',
    difficulty: 1
  },
  {
    id: 'business-020',
    english: 'We need to discuss this further.',
    japanese: 'これをさらに話し合う必要があります。',
    category: 'business',
    situation: '追加議論',
    difficulty: 2
  },

  // Stage 3: Email・連絡 (Email & Communication)
  {
    id: 'business-021',
    english: 'I will send you an email.',
    japanese: 'メールをお送りします。',
    category: 'business',
    situation: 'メール送信',
    difficulty: 1
  },
  {
    id: 'business-022',
    english: 'Did you receive my message?',
    japanese: '私のメッセージを受け取りましたか？',
    category: 'business',
    situation: 'メッセージ確認',
    difficulty: 1
  },
  {
    id: 'business-023',
    english: 'Please reply as soon as possible.',
    japanese: 'できるだけ早く返信してください。',
    category: 'business',
    situation: '返信要求',
    difficulty: 2
  },
  {
    id: 'business-024',
    english: 'I will call you back.',
    japanese: '折り返し電話します。',
    category: 'business',
    situation: '折り返し電話',
    difficulty: 1
  },
  {
    id: 'business-025',
    english: 'Can you hold on a moment?',
    japanese: 'ちょっとお待ちいただけますか？',
    category: 'business',
    situation: '電話保留',
    difficulty: 1
  },
  {
    id: 'business-026',
    english: 'Let me transfer your call.',
    japanese: 'お電話を転送いたします。',
    category: 'business',
    situation: '電話転送',
    difficulty: 2
  },
  {
    id: 'business-027',
    english: 'I am sorry, he is in a meeting.',
    japanese: 'すみません、彼は会議中です。',
    category: 'business',
    situation: '不在説明',
    difficulty: 1
  },
  {
    id: 'business-028',
    english: 'Can I take a message?',
    japanese: '伝言をお受けしましょうか？',
    category: 'business',
    situation: '伝言受付',
    difficulty: 1
  },
  {
    id: 'business-029',
    english: 'Please confirm the appointment.',
    japanese: '約束を確認してください。',
    category: 'business',
    situation: '約束確認',
    difficulty: 1
  },
  {
    id: 'business-030',
    english: 'Thank you for your cooperation.',
    japanese: 'ご協力ありがとうございます。',
    category: 'business',
    situation: '協力感謝',
    difficulty: 1
  },

  // Stage 4: プロジェクト管理 (Project Management)
  {
    id: 'business-031',
    english: 'We need to meet the deadline.',
    japanese: '締切に間に合わせる必要があります。',
    category: 'business',
    situation: '締切管理',
    difficulty: 2
  },
  {
    id: 'business-032',
    english: 'Can you update the progress?',
    japanese: '進捗を更新してもらえますか？',
    category: 'business',
    situation: '進捗更新',
    difficulty: 1
  },
  {
    id: 'business-033',
    english: 'The budget has been approved.',
    japanese: '予算が承認されました。',
    category: 'business',
    situation: '予算承認',
    difficulty: 2
  },
  {
    id: 'business-034',
    english: 'We are behind schedule.',
    japanese: 'スケジュールが遅れています。',
    category: 'business',
    situation: '遅延報告',
    difficulty: 1
  },
  {
    id: 'business-035',
    english: 'This is a high priority task.',
    japanese: 'これは優先度の高いタスクです。',
    category: 'business',
    situation: '優先度確認',
    difficulty: 2
  },
  {
    id: 'business-036',
    english: 'Let me delegate this task.',
    japanese: 'このタスクを委任します。',
    category: 'business',
    situation: 'タスク委任',
    difficulty: 2
  },
  {
    id: 'business-037',
    english: 'We achieved our goals.',
    japanese: '目標を達成しました。',
    category: 'business',
    situation: '目標達成',
    difficulty: 1
  },
  {
    id: 'business-038',
    english: 'The project is on track.',
    japanese: 'プロジェクトは順調です。',
    category: 'business',
    situation: '順調報告',
    difficulty: 1
  },
  {
    id: 'business-039',
    english: 'We need more resources.',
    japanese: 'もっとリソースが必要です。',
    category: 'business',
    situation: 'リソース要求',
    difficulty: 1
  },
  {
    id: 'business-040',
    english: 'Can you review this document?',
    japanese: 'この書類をレビューしてもらえますか？',
    category: 'business',
    situation: 'レビュー依頼',
    difficulty: 1
  },

  // Stage 5: 顧客対応 (Customer Service)
  {
    id: 'business-041',
    english: 'How may I help you today?',
    japanese: '本日はどのようなご用件でしょうか？',
    category: 'business',
    situation: '顧客対応',
    difficulty: 1
  },
  {
    id: 'business-042',
    english: 'Thank you for your patience.',
    japanese: 'お待ちいただきありがとうございます。',
    category: 'business',
    situation: '待機感謝',
    difficulty: 1
  },
  {
    id: 'business-043',
    english: 'I understand your concern.',
    japanese: 'ご心配は理解できます。',
    category: 'business',
    situation: '顧客理解',
    difficulty: 1
  },
  {
    id: 'business-044',
    english: 'We value your feedback.',
    japanese: 'フィードバックを大切にしています。',
    category: 'business',
    situation: 'フィードバック歓迎',
    difficulty: 2
  },
  {
    id: 'business-045',
    english: 'Let me look into that for you.',
    japanese: '調べさせていただきます。',
    category: 'business',
    situation: '調査申し出',
    difficulty: 1
  },
  {
    id: 'business-046',
    english: 'We apologize for the inconvenience.',
    japanese: 'ご不便をおかけして申し訳ありません。',
    category: 'business',
    situation: 'お詫び',
    difficulty: 2
  },
  {
    id: 'business-047',
    english: 'Your satisfaction is our priority.',
    japanese: 'お客様の満足が私たちの優先事項です。',
    category: 'business',
    situation: '顧客優先',
    difficulty: 2
  },
  {
    id: 'business-048',
    english: 'Can I get your contact information?',
    japanese: 'ご連絡先を教えていただけますか？',
    category: 'business',
    situation: '連絡先確認',
    difficulty: 1
  },
  {
    id: 'business-049',
    english: 'We will resolve this issue.',
    japanese: 'この問題を解決します。',
    category: 'business',
    situation: '問題解決約束',
    difficulty: 1
  },
  {
    id: 'business-050',
    english: 'Thank you for choosing our service.',
    japanese: '私たちのサービスをお選びいただきありがとうございます。',
    category: 'business',
    situation: 'サービス選択感謝',
    difficulty: 2
  },

  // Stage 6: 交渉・契約 (Negotiation & Contracts)
  {
    id: 'business-051',
    english: 'Let us negotiate the terms.',
    japanese: '条件を交渉しましょう。',
    category: 'business',
    situation: '条件交渉',
    difficulty: 2
  },
  {
    id: 'business-052',
    english: 'What is your best offer?',
    japanese: '最良のオファーは何ですか？',
    category: 'business',
    situation: 'オファー確認',
    difficulty: 1
  },
  {
    id: 'business-053',
    english: 'Can we get a discount?',
    japanese: '割引はありますか？',
    category: 'business',
    situation: '割引交渉',
    difficulty: 1
  },
  {
    id: 'business-054',
    english: 'The contract expires next month.',
    japanese: '契約は来月期限切れです。',
    category: 'business',
    situation: '契約期限',
    difficulty: 2
  },
  {
    id: 'business-055',
    english: 'We need to sign the agreement.',
    japanese: '合意書に署名する必要があります。',
    category: 'business',
    situation: '署名要求',
    difficulty: 2
  },
  {
    id: 'business-056',
    english: 'These are our terms and conditions.',
    japanese: 'これらが私たちの条件です。',
    category: 'business',
    situation: '条件提示',
    difficulty: 2
  },
  {
    id: 'business-057',
    english: 'Can we extend the contract?',
    japanese: '契約を延長できますか？',
    category: 'business',
    situation: '契約延長',
    difficulty: 1
  },
  {
    id: 'business-058',
    english: 'We reached a mutual agreement.',
    japanese: '相互合意に達しました。',
    category: 'business',
    situation: '合意達成',
    difficulty: 2
  },
  {
    id: 'business-059',
    english: 'Please review the contract carefully.',
    japanese: '契約書を慎重に確認してください。',
    category: 'business',
    situation: '契約確認依頼',
    difficulty: 2
  },
  {
    id: 'business-060',
    english: 'This deal is beneficial for both parties.',
    japanese: 'この取引は両者にとって有益です。',
    category: 'business',
    situation: '相互利益',
    difficulty: 3
  },

  // Stage 7: 売上・財務 (Sales & Finance)
  {
    id: 'business-061',
    english: 'Sales have increased this quarter.',
    japanese: '今四半期の売上が増加しました。',
    category: 'business',
    situation: '売上増加',
    difficulty: 2
  },
  {
    id: 'business-062',
    english: 'We need to reduce costs.',
    japanese: 'コストを削減する必要があります。',
    category: 'business',
    situation: 'コスト削減',
    difficulty: 1
  },
  {
    id: 'business-063',
    english: 'The profit margin is improving.',
    japanese: '利益率が改善しています。',
    category: 'business',
    situation: '利益率改善',
    difficulty: 2
  },
  {
    id: 'business-064',
    english: 'Can you prepare the invoice?',
    japanese: '請求書を準備してもらえますか？',
    category: 'business',
    situation: '請求書準備',
    difficulty: 1
  },
  {
    id: 'business-065',
    english: 'Payment is due by the end of month.',
    japanese: '支払い期限は月末です。',
    category: 'business',
    situation: '支払い期限',
    difficulty: 2
  },
  {
    id: 'business-066',
    english: 'We exceeded our sales target.',
    japanese: '売上目標を超えました。',
    category: 'business',
    situation: '目標超過',
    difficulty: 2
  },
  {
    id: 'business-067',
    english: 'The revenue is growing steadily.',
    japanese: '収益は着実に成長しています。',
    category: 'business',
    situation: '収益成長',
    difficulty: 2
  },
  {
    id: 'business-068',
    english: 'We need to analyze the expenses.',
    japanese: '経費を分析する必要があります。',
    category: 'business',
    situation: '経費分析',
    difficulty: 2
  },
  {
    id: 'business-069',
    english: 'The budget is tight this year.',
    japanese: '今年の予算は厳しいです。',
    category: 'business',
    situation: '予算逼迫',
    difficulty: 1
  },
  {
    id: 'business-070',
    english: 'Can we invest in new equipment?',
    japanese: '新しい設備に投資できますか？',
    category: 'business',
    situation: '設備投資',
    difficulty: 2
  },

  // Stage 8: チームワーク (Teamwork & Collaboration)
  {
    id: 'business-071',
    english: 'Let us work together on this.',
    japanese: 'これについて一緒に取り組みましょう。',
    category: 'business',
    situation: '協力提案',
    difficulty: 1
  },
  {
    id: 'business-072',
    english: 'Great teamwork everyone!',
    japanese: '皆さん、素晴らしいチームワークです！',
    category: 'business',
    situation: 'チーム賞賛',
    difficulty: 1
  },
  {
    id: 'business-073',
    english: 'Can you assist your colleague?',
    japanese: '同僚を手伝ってもらえますか？',
    category: 'business',
    situation: '協力依頼',
    difficulty: 1
  },
  {
    id: 'business-074',
    english: 'We need to coordinate our efforts.',
    japanese: '私たちの努力を調整する必要があります。',
    category: 'business',
    situation: '努力調整',
    difficulty: 2
  },
  {
    id: 'business-075',
    english: 'Communication is key to success.',
    japanese: 'コミュニケーションが成功の鍵です。',
    category: 'business',
    situation: 'コミュニケーション重要性',
    difficulty: 2
  },
  {
    id: 'business-076',
    english: 'Everyone contributed to the success.',
    japanese: '全員が成功に貢献しました。',
    category: 'business',
    situation: '全員貢献',
    difficulty: 2
  },
  {
    id: 'business-077',
    english: 'Let me share my expertise.',
    japanese: '私の専門知識を共有させてください。',
    category: 'business',
    situation: '知識共有',
    difficulty: 2
  },
  {
    id: 'business-078',
    english: 'We should brainstorm ideas.',
    japanese: 'アイデアをブレインストーミングすべきです。',
    category: 'business',
    situation: 'ブレスト提案',
    difficulty: 2
  },
  {
    id: 'business-079',
    english: 'Your input is valuable.',
    japanese: 'あなたの意見は貴重です。',
    category: 'business',
    situation: '意見評価',
    difficulty: 1
  },
  {
    id: 'business-080',
    english: 'We make a great team.',
    japanese: '私たちは素晴らしいチームです。',
    category: 'business',
    situation: 'チーム評価',
    difficulty: 1
  },

  // Stage 9: 人事・採用 (HR & Recruitment)
  {
    id: 'business-081',
    english: 'We are hiring new staff.',
    japanese: '新しいスタッフを採用しています。',
    category: 'business',
    situation: '採用活動',
    difficulty: 1
  },
  {
    id: 'business-082',
    english: 'Can you schedule an interview?',
    japanese: '面接を設定してもらえますか？',
    category: 'business',
    situation: '面接設定',
    difficulty: 1
  },
  {
    id: 'business-083',
    english: 'Welcome to our company.',
    japanese: '私たちの会社へようこそ。',
    category: 'business',
    situation: '入社歓迎',
    difficulty: 1
  },
  {
    id: 'business-084',
    english: 'The training starts next week.',
    japanese: '研修は来週始まります。',
    category: 'business',
    situation: '研修開始',
    difficulty: 1
  },
  {
    id: 'business-085',
    english: 'Your performance has been excellent.',
    japanese: 'あなたのパフォーマンスは優秀でした。',
    category: 'business',
    situation: 'パフォーマンス評価',
    difficulty: 2
  },
  {
    id: 'business-086',
    english: 'We offer competitive benefits.',
    japanese: '競争力のある福利厚生を提供しています。',
    category: 'business',
    situation: '福利厚生',
    difficulty: 2
  },
  {
    id: 'business-087',
    english: 'Can I request time off?',
    japanese: '休暇を申請できますか？',
    category: 'business',
    situation: '休暇申請',
    difficulty: 1
  },
  {
    id: 'business-088',
    english: 'The promotion was well-deserved.',
    japanese: '昇進は当然のことでした。',
    category: 'business',
    situation: '昇進評価',
    difficulty: 2
  },
  {
    id: 'business-089',
    english: 'We need to fill this position.',
    japanese: 'このポジションを埋める必要があります。',
    category: 'business',
    situation: 'ポジション充足',
    difficulty: 2
  },
  {
    id: 'business-090',
    english: 'Your skills match our requirements.',
    japanese: 'あなたのスキルは私たちの要求に合っています。',
    category: 'business',
    situation: 'スキルマッチ',
    difficulty: 2
  },

  // Stage 10: 戦略・経営 (Strategy & Management)
  {
    id: 'business-091',
    english: 'We need a new strategy.',
    japanese: '新しい戦略が必要です。',
    category: 'business',
    situation: '戦略立案',
    difficulty: 1
  },
  {
    id: 'business-092',
    english: 'The market is changing rapidly.',
    japanese: '市場は急速に変化しています。',
    category: 'business',
    situation: '市場変化',
    difficulty: 2
  },
  {
    id: 'business-093',
    english: 'We should expand our business.',
    japanese: '事業を拡大すべきです。',
    category: 'business',
    situation: '事業拡大',
    difficulty: 1
  },
  {
    id: 'business-094',
    english: 'Innovation drives our growth.',
    japanese: 'イノベーションが成長を促進します。',
    category: 'business',
    situation: 'イノベーション',
    difficulty: 2
  },
  {
    id: 'business-095',
    english: 'Let us analyze our competitors.',
    japanese: '競合他社を分析しましょう。',
    category: 'business',
    situation: '競合分析',
    difficulty: 2
  },
  {
    id: 'business-096',
    english: 'Quality is our top priority.',
    japanese: '品質が最優先事項です。',
    category: 'business',
    situation: '品質優先',
    difficulty: 1
  },
  {
    id: 'business-097',
    english: 'We are leading the industry.',
    japanese: '私たちは業界をリードしています。',
    category: 'business',
    situation: '業界リード',
    difficulty: 2
  },
  {
    id: 'business-098',
    english: 'Sustainability is important to us.',
    japanese: '持続可能性は私たちにとって重要です。',
    category: 'business',
    situation: '持続可能性',
    difficulty: 2
  },
  {
    id: 'business-099',
    english: 'The decision was unanimous.',
    japanese: '決定は全会一致でした。',
    category: 'business',
    situation: '全会一致',
    difficulty: 2
  },
  {
    id: 'business-100',
    english: 'Success requires dedication.',
    japanese: '成功には献身が必要です。',
    category: 'business',
    situation: '成功要因',
    difficulty: 1
  }
]