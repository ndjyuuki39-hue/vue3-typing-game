import type { PhraseContent } from '@/stores/content'

// Shopping - 10 Stages × 10 Phrases = 100 Phrases
export const shoppingPhrases: PhraseContent[] = [
  // Stage 1: 基本的な買い物表現 (Basic Shopping - moved from daily)
  {
    id: 'shopping-001',
    english: 'I will go shopping.',
    japanese: '買い物に行きます。',
    category: 'shopping',
    situation: '買い物計画',
    difficulty: 1
  },
  {
    id: 'shopping-002',
    english: 'How much does this cost?',
    japanese: 'これはいくらですか？',
    category: 'shopping',
    situation: '価格確認',
    difficulty: 1
  },
  {
    id: 'shopping-003',
    english: 'Do you accept credit cards?',
    japanese: 'クレジットカードは使えますか？',
    category: 'shopping',
    situation: '支払い方法',
    difficulty: 1
  },
  {
    id: 'shopping-004',
    english: 'Where is the cashier?',
    japanese: 'レジはどこですか？',
    category: 'shopping',
    situation: 'レジ確認',
    difficulty: 1
  },
  {
    id: 'shopping-005',
    english: 'I need a shopping bag.',
    japanese: '買い物袋が必要です。',
    category: 'shopping',
    situation: '袋要求',
    difficulty: 1
  },
  {
    id: 'shopping-006',
    english: 'This is too expensive.',
    japanese: 'これは高すぎます。',
    category: 'shopping',
    situation: '価格不満',
    difficulty: 1
  },
  {
    id: 'shopping-007',
    english: 'Do you have this in blue?',
    japanese: 'これの青いのはありますか？',
    category: 'shopping',
    situation: '色確認',
    difficulty: 1
  },
  {
    id: 'shopping-008',
    english: 'What size do you have?',
    japanese: 'どのサイズがありますか？',
    category: 'shopping',
    situation: 'サイズ確認',
    difficulty: 1
  },
  {
    id: 'shopping-009',
    english: 'Can I try this on?',
    japanese: 'これを試着できますか？',
    category: 'shopping',
    situation: '試着要求',
    difficulty: 1
  },
  {
    id: 'shopping-010',
    english: 'I would like to buy this.',
    japanese: 'これを買いたいです。',
    category: 'shopping',
    situation: '購入意思',
    difficulty: 1
  },

  // Stage 2: 店舗・場所 (Stores & Locations)
  {
    id: 'shopping-011',
    english: 'Where is the grocery store?',
    japanese: '食料品店はどこですか？',
    category: 'shopping',
    situation: '店舗確認',
    difficulty: 1
  },
  {
    id: 'shopping-012',
    english: 'Is there a pharmacy nearby?',
    japanese: '近くに薬局はありますか？',
    category: 'shopping',
    situation: '薬局確認',
    difficulty: 1
  },
  {
    id: 'shopping-013',
    english: 'What time does the store close?',
    japanese: '店は何時に閉まりますか？',
    category: 'shopping',
    situation: '営業時間確認',
    difficulty: 1
  },
  {
    id: 'shopping-014',
    english: 'The mall is very busy.',
    japanese: 'モールはとても混んでいます。',
    category: 'shopping',
    situation: 'モール状況',
    difficulty: 1
  },
  {
    id: 'shopping-015',
    english: 'Where is the fitting room?',
    japanese: '試着室はどこですか？',
    category: 'shopping',
    situation: '試着室確認',
    difficulty: 1
  },
  {
    id: 'shopping-016',
    english: 'Do you have a department store?',
    japanese: 'デパートはありますか？',
    category: 'shopping',
    situation: 'デパート確認',
    difficulty: 1
  },
  {
    id: 'shopping-017',
    english: 'This store has good prices.',
    japanese: 'この店は値段が良いです。',
    category: 'shopping',
    situation: '店舗評価',
    difficulty: 1
  },
  {
    id: 'shopping-018',
    english: 'Where can I find shoes?',
    japanese: '靴はどこで見つけられますか？',
    category: 'shopping',
    situation: '商品場所確認',
    difficulty: 1
  },
  {
    id: 'shopping-019',
    english: 'The electronics section is upstairs.',
    japanese: '電化製品売り場は上の階です。',
    category: 'shopping',
    situation: '売り場案内',
    difficulty: 2
  },
  {
    id: 'shopping-020',
    english: 'Do you have a customer service?',
    japanese: 'カスタマーサービスはありますか？',
    category: 'shopping',
    situation: 'サービス確認',
    difficulty: 1
  },

  // Stage 3: 支払い・返品 (Payment & Returns)
  {
    id: 'shopping-021',
    english: 'Cash or credit?',
    japanese: '現金ですかクレジットですか？',
    category: 'shopping',
    situation: '支払い方法確認',
    difficulty: 1
  },
  {
    id: 'shopping-022',
    english: 'I will pay in cash.',
    japanese: '現金で支払います。',
    category: 'shopping',
    situation: '現金支払い',
    difficulty: 1
  },
  {
    id: 'shopping-023',
    english: 'Do you have change for this?',
    japanese: 'これのお釣りはありますか？',
    category: 'shopping',
    situation: '両替確認',
    difficulty: 1
  },
  {
    id: 'shopping-024',
    english: 'Keep the change.',
    japanese: 'お釣りは取っておいてください。',
    category: 'shopping',
    situation: 'お釣り辞退',
    difficulty: 1
  },
  {
    id: 'shopping-025',
    english: 'Can I return this?',
    japanese: 'これを返品できますか？',
    category: 'shopping',
    situation: '返品確認',
    difficulty: 1
  },
  {
    id: 'shopping-026',
    english: 'I have the receipt.',
    japanese: 'レシートを持っています。',
    category: 'shopping',
    situation: 'レシート確認',
    difficulty: 1
  },
  {
    id: 'shopping-027',
    english: 'Is there a warranty?',
    japanese: '保証はありますか？',
    category: 'shopping',
    situation: '保証確認',
    difficulty: 1
  },
  {
    id: 'shopping-028',
    english: 'I want to exchange this.',
    japanese: 'これを交換したいです。',
    category: 'shopping',
    situation: '交換要求',
    difficulty: 1
  },
  {
    id: 'shopping-029',
    english: 'The total is fifty dollars.',
    japanese: '合計は50ドルです。',
    category: 'shopping',
    situation: '合計金額',
    difficulty: 1
  },
  {
    id: 'shopping-030',
    english: 'Do you offer discounts?',
    japanese: '割引はありますか？',
    category: 'shopping',
    situation: '割引確認',
    difficulty: 1
  },

  // Stage 4: 衣料品・ファッション (Clothing & Fashion)
  {
    id: 'shopping-031',
    english: 'Where is the fitting room?',
    japanese: '試着室はどこですか？',
    category: 'shopping',
    situation: '試着室確認',
    difficulty: 1
  },
  {
    id: 'shopping-032',
    english: 'This does not fit me.',
    japanese: 'これは私に合いません。',
    category: 'shopping',
    situation: 'サイズ不適合',
    difficulty: 1
  },
  {
    id: 'shopping-033',
    english: 'Do you have a larger size?',
    japanese: 'もっと大きいサイズはありますか？',
    category: 'shopping',
    situation: '大きいサイズ要求',
    difficulty: 1
  },
  {
    id: 'shopping-034',
    english: 'I need a smaller size.',
    japanese: 'もっと小さいサイズが必要です。',
    category: 'shopping',
    situation: '小さいサイズ要求',
    difficulty: 1
  },
  {
    id: 'shopping-035',
    english: 'What material is this made of?',
    japanese: 'これは何の素材で作られていますか？',
    category: 'shopping',
    situation: '素材確認',
    difficulty: 2
  },
  {
    id: 'shopping-036',
    english: 'Can I return this if it does not fit?',
    japanese: 'サイズが合わなかったら返品できますか？',
    category: 'shopping',
    situation: '返品確認',
    difficulty: 2
  },
  {
    id: 'shopping-037',
    english: 'This shirt looks good on you.',
    japanese: 'このシャツはあなたに似合います。',
    category: 'shopping',
    situation: '試着評価',
    difficulty: 1
  },
  {
    id: 'shopping-038',
    english: 'Do you have this in different colors?',
    japanese: 'これの違う色はありますか？',
    category: 'shopping',
    situation: '色バリエーション確認',
    difficulty: 1
  },
  {
    id: 'shopping-039',
    english: 'Can you show me the accessories?',
    japanese: 'アクセサリーを見せてもらえますか？',
    category: 'shopping',
    situation: 'アクセサリー要求',
    difficulty: 1
  },
  {
    id: 'shopping-040',
    english: 'I am looking for formal wear.',
    japanese: 'フォーマルウェアを探しています。',
    category: 'shopping',
    situation: 'フォーマル服探索',
    difficulty: 2
  },

  // Stage 5: 電子機器・家電 (Electronics & Appliances)
  {
    id: 'shopping-041',
    english: 'Where can I buy a phone charger?',
    japanese: 'どこで携帯の充電器を買えますか？',
    category: 'shopping',
    situation: '充電器購入',
    difficulty: 1
  },
  {
    id: 'shopping-042',
    english: 'Does this come with a warranty?',
    japanese: 'これには保証がついていますか？',
    category: 'shopping',
    situation: '保証確認',
    difficulty: 1
  },
  {
    id: 'shopping-043',
    english: 'Can you demonstrate how this works?',
    japanese: 'これがどう動くか実演してもらえますか？',
    category: 'shopping',
    situation: '動作確認',
    difficulty: 2
  },
  {
    id: 'shopping-044',
    english: 'Is this compatible with my device?',
    japanese: 'これは私のデバイスと互換性がありますか？',
    category: 'shopping',
    situation: '互換性確認',
    difficulty: 2
  },
  {
    id: 'shopping-045',
    english: 'What is the battery life?',
    japanese: 'バッテリーの持続時間はどのくらいですか？',
    category: 'shopping',
    situation: 'バッテリー確認',
    difficulty: 2
  },
  {
    id: 'shopping-046',
    english: 'Do you have the latest model?',
    japanese: '最新モデルはありますか？',
    category: 'shopping',
    situation: '最新モデル確認',
    difficulty: 1
  },
  {
    id: 'shopping-047',
    english: 'Can you set this up for me?',
    japanese: 'これをセットアップしてもらえますか？',
    category: 'shopping',
    situation: 'セットアップ依頼',
    difficulty: 1
  },
  {
    id: 'shopping-048',
    english: 'What accessories are included?',
    japanese: 'どのようなアクセサリーが含まれていますか？',
    category: 'shopping',
    situation: '付属品確認',
    difficulty: 2
  },
  {
    id: 'shopping-049',
    english: 'Is there a student discount?',
    japanese: '学生割引はありますか？',
    category: 'shopping',
    situation: '学生割引確認',
    difficulty: 1
  },
  {
    id: 'shopping-050',
    english: 'Can I pay in installments?',
    japanese: '分割払いできますか？',
    category: 'shopping',
    situation: '分割払い確認',
    difficulty: 2
  },

  // Stage 6: 食品・グロッサリー (Food & Grocery)
  {
    id: 'shopping-051',
    english: 'Where is the dairy section?',
    japanese: '乳製品コーナーはどこですか？',
    category: 'shopping',
    situation: '乳製品コーナー確認',
    difficulty: 1
  },
  {
    id: 'shopping-052',
    english: 'When does this expire?',
    japanese: 'これはいつ期限切れになりますか？',
    category: 'shopping',
    situation: '賞味期限確認',
    difficulty: 1
  },
  {
    id: 'shopping-053',
    english: 'Do you have organic vegetables?',
    japanese: 'オーガニック野菜はありますか？',
    category: 'shopping',
    situation: 'オーガニック確認',
    difficulty: 1
  },
  {
    id: 'shopping-054',
    english: 'Can I get this sliced?',
    japanese: 'これをスライスしてもらえますか？',
    category: 'shopping',
    situation: 'スライス依頼',
    difficulty: 1
  },
  {
    id: 'shopping-055',
    english: 'Is this fresh?',
    japanese: 'これは新鮮ですか？',
    category: 'shopping',
    situation: '新鮮さ確認',
    difficulty: 1
  },
  {
    id: 'shopping-056',
    english: 'Do you have a bakery section?',
    japanese: 'ベーカリーコーナーはありますか？',
    category: 'shopping',
    situation: 'ベーカリー確認',
    difficulty: 1
  },
  {
    id: 'shopping-057',
    english: 'Can I sample this?',
    japanese: 'これを試食できますか？',
    category: 'shopping',
    situation: '試食要求',
    difficulty: 1
  },
  {
    id: 'shopping-058',
    english: 'Where can I find spices?',
    japanese: 'どこでスパイスを見つけられますか？',
    category: 'shopping',
    situation: 'スパイス確認',
    difficulty: 1
  },
  {
    id: 'shopping-059',
    english: 'Do you have gluten-free options?',
    japanese: 'グルテンフリーの選択肢はありますか？',
    category: 'shopping',
    situation: 'グルテンフリー確認',
    difficulty: 2
  },
  {
    id: 'shopping-060',
    english: 'I need a shopping cart.',
    japanese: 'ショッピングカートが必要です。',
    category: 'shopping',
    situation: 'カート要求',
    difficulty: 1
  },

  // Stage 7: 薬局・ヘルスケア (Pharmacy & Healthcare)
  {
    id: 'shopping-061',
    english: 'Do you have this medication?',
    japanese: 'この薬はありますか？',
    category: 'shopping',
    situation: '薬確認',
    difficulty: 1
  },
  {
    id: 'shopping-062',
    english: 'I need something for a headache.',
    japanese: '頭痛の薬が必要です。',
    category: 'shopping',
    situation: '頭痛薬要求',
    difficulty: 1
  },
  {
    id: 'shopping-063',
    english: 'Do I need a prescription for this?',
    japanese: 'これには処方箋が必要ですか？',
    category: 'shopping',
    situation: '処方箋確認',
    difficulty: 2
  },
  {
    id: 'shopping-064',
    english: 'Where can I find vitamins?',
    japanese: 'どこでビタミンを見つけられますか？',
    category: 'shopping',
    situation: 'ビタミン確認',
    difficulty: 1
  },
  {
    id: 'shopping-065',
    english: 'Do you have sunscreen?',
    japanese: '日焼け止めはありますか？',
    category: 'shopping',
    situation: '日焼け止め確認',
    difficulty: 1
  },
  {
    id: 'shopping-066',
    english: 'Can I get a blood pressure check?',
    japanese: '血圧を測ってもらえますか？',
    category: 'shopping',
    situation: '血圧測定',
    difficulty: 2
  },
  {
    id: 'shopping-067',
    english: 'I need first aid supplies.',
    japanese: '応急処置用品が必要です。',
    category: 'shopping',
    situation: '応急処置用品',
    difficulty: 1
  },
  {
    id: 'shopping-068',
    english: 'Do you have contact lens solution?',
    japanese: 'コンタクトレンズの洗浄液はありますか？',
    category: 'shopping',
    situation: 'コンタクト用品',
    difficulty: 2
  },
  {
    id: 'shopping-069',
    english: 'Where is the cosmetics section?',
    japanese: '化粧品売り場はどこですか？',
    category: 'shopping',
    situation: '化粧品売り場確認',
    difficulty: 1
  },
  {
    id: 'shopping-070',
    english: 'Can you recommend a good shampoo?',
    japanese: '良いシャンプーを推薦してもらえますか？',
    category: 'shopping',
    situation: 'シャンプー推薦',
    difficulty: 1
  },

  // Stage 8: オンライン・配送 (Online & Delivery)
  {
    id: 'shopping-071',
    english: 'Do you offer online shopping?',
    japanese: 'オンラインショッピングはありますか？',
    category: 'shopping',
    situation: 'オンライン確認',
    difficulty: 1
  },
  {
    id: 'shopping-072',
    english: 'Can you deliver this to my hotel?',
    japanese: 'これをホテルまで配送してもらえますか？',
    category: 'shopping',
    situation: 'ホテル配送',
    difficulty: 1
  },
  {
    id: 'shopping-073',
    english: 'What is the delivery charge?',
    japanese: '配送料はいくらですか？',
    category: 'shopping',
    situation: '配送料確認',
    difficulty: 1
  },
  {
    id: 'shopping-074',
    english: 'How long will delivery take?',
    japanese: '配送にどのくらいかかりますか？',
    category: 'shopping',
    situation: '配送期間確認',
    difficulty: 1
  },
  {
    id: 'shopping-075',
    english: 'Can I track my order?',
    japanese: '注文を追跡できますか？',
    category: 'shopping',
    situation: '注文追跡',
    difficulty: 1
  },
  {
    id: 'shopping-076',
    english: 'I want to cancel my order.',
    japanese: '注文をキャンセルしたいです。',
    category: 'shopping',
    situation: '注文キャンセル',
    difficulty: 1
  },
  {
    id: 'shopping-077',
    english: 'Can I change the delivery address?',
    japanese: '配送先住所を変更できますか？',
    category: 'shopping',
    situation: '住所変更',
    difficulty: 2
  },
  {
    id: 'shopping-078',
    english: 'Is same-day delivery available?',
    japanese: '当日配送は可能ですか？',
    category: 'shopping',
    situation: '当日配送確認',
    difficulty: 2
  },
  {
    id: 'shopping-079',
    english: 'Can I pick this up in store?',
    japanese: 'これを店舗で受け取れますか？',
    category: 'shopping',
    situation: '店舗受取',
    difficulty: 1
  },
  {
    id: 'shopping-080',
    english: 'I did not receive my order.',
    japanese: '注文を受け取っていません。',
    category: 'shopping',
    situation: '未受取報告',
    difficulty: 1
  },

  // Stage 9: カスタマーサービス (Customer Service)
  {
    id: 'shopping-081',
    english: 'I would like to make a complaint.',
    japanese: '苦情を申し立てたいです。',
    category: 'shopping',
    situation: '苦情申立',
    difficulty: 2
  },
  {
    id: 'shopping-082',
    english: 'This item is defective.',
    japanese: 'この商品は欠陥があります。',
    category: 'shopping',
    situation: '欠陥報告',
    difficulty: 1
  },
  {
    id: 'shopping-083',
    english: 'Can I exchange this for a different size?',
    japanese: 'これを違うサイズに交換できますか？',
    category: 'shopping',
    situation: 'サイズ交換',
    difficulty: 1
  },
  {
    id: 'shopping-084',
    english: 'I need to speak to a manager.',
    japanese: 'マネージャーと話す必要があります。',
    category: 'shopping',
    situation: 'マネージャー要求',
    difficulty: 1
  },
  {
    id: 'shopping-085',
    english: 'Can you give me a refund?',
    japanese: '返金してもらえますか？',
    category: 'shopping',
    situation: '返金要求',
    difficulty: 1
  },
  {
    id: 'shopping-086',
    english: 'What is your return policy?',
    japanese: '返品ポリシーは何ですか？',
    category: 'shopping',
    situation: '返品ポリシー確認',
    difficulty: 2
  },
  {
    id: 'shopping-087',
    english: 'I lost my receipt.',
    japanese: 'レシートをなくしました。',
    category: 'shopping',
    situation: 'レシート紛失',
    difficulty: 1
  },
  {
    id: 'shopping-088',
    english: 'Can you check if you have this in stock?',
    japanese: 'これが在庫にあるか確認してもらえますか？',
    category: 'shopping',
    situation: '在庫確認',
    difficulty: 1
  },
  {
    id: 'shopping-089',
    english: 'When will you restock this item?',
    japanese: 'いつこの商品を再入荷しますか？',
    category: 'shopping',
    situation: '再入荷確認',
    difficulty: 2
  },
  {
    id: 'shopping-090',
    english: 'Thank you for your help.',
    japanese: 'お手伝いをありがとうございます。',
    category: 'shopping',
    situation: '感謝表現',
    difficulty: 1
  },

  // Stage 10: ギフト・特別な買い物 (Gifts & Special Shopping)
  {
    id: 'shopping-091',
    english: 'I am looking for a gift.',
    japanese: 'プレゼントを探しています。',
    category: 'shopping',
    situation: 'プレゼント探索',
    difficulty: 1
  },
  {
    id: 'shopping-092',
    english: 'Can you gift wrap this?',
    japanese: 'これをギフト包装してもらえますか？',
    category: 'shopping',
    situation: 'ギフト包装',
    difficulty: 1
  },
  {
    id: 'shopping-093',
    english: 'Do you have a gift card?',
    japanese: 'ギフトカードはありますか？',
    category: 'shopping',
    situation: 'ギフトカード確認',
    difficulty: 1
  },
  {
    id: 'shopping-094',
    english: 'What would you recommend for a child?',
    japanese: '子供には何がおすすめですか？',
    category: 'shopping',
    situation: '子供向け推薦',
    difficulty: 1
  },
  {
    id: 'shopping-095',
    english: 'This is for someone special.',
    japanese: 'これは特別な人のためです。',
    category: 'shopping',
    situation: '特別な人用',
    difficulty: 1
  },
  {
    id: 'shopping-096',
    english: 'Can I include a gift message?',
    japanese: 'ギフトメッセージを入れられますか？',
    category: 'shopping',
    situation: 'ギフトメッセージ',
    difficulty: 1
  },
  {
    id: 'shopping-097',
    english: 'Is there a gift receipt?',
    japanese: 'ギフトレシートはありますか？',
    category: 'shopping',
    situation: 'ギフトレシート',
    difficulty: 1
  },
  {
    id: 'shopping-098',
    english: 'What is popular right now?',
    japanese: '今何が人気ですか？',
    category: 'shopping',
    situation: '人気商品確認',
    difficulty: 1
  },
  {
    id: 'shopping-099',
    english: 'This will make a perfect gift.',
    japanese: 'これは完璧なプレゼントになります。',
    category: 'shopping',
    situation: 'プレゼント評価',
    difficulty: 1
  },
  {
    id: 'shopping-100',
    english: 'I hope they will like it.',
    japanese: '彼らが気に入ってくれると良いのですが。',
    category: 'shopping',
    situation: 'プレゼント希望',
    difficulty: 2
  }
]