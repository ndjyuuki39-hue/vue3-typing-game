import type { PhraseContent } from '@/stores/content'

// Emergency - 10 Stages × 10 Phrases = 100 Phrases
export const emergencyPhrases: PhraseContent[] = [
  // Stage 1: 基本的な緊急表現 (Basic Emergency)
  {
    id: 'emergency-001',
    english: 'I need help, please.',
    japanese: '助けが必要です。',
    category: 'emergency',
    situation: '緊急時',
    difficulty: 1
  },
  {
    id: 'emergency-002',
    english: 'Please call the police.',
    japanese: '警察を呼んでください。',
    category: 'emergency',
    situation: '警察',
    difficulty: 2
  },
  {
    id: 'emergency-003',
    english: 'Call an ambulance!',
    japanese: '救急車を呼んでください！',
    category: 'emergency',
    situation: '救急車',
    difficulty: 1
  },
  {
    id: 'emergency-004',
    english: 'There is a fire!',
    japanese: '火事です！',
    category: 'emergency',
    situation: '火災',
    difficulty: 1
  },
  {
    id: 'emergency-005',
    english: 'Someone is hurt.',
    japanese: '誰かが怪我をしています。',
    category: 'emergency',
    situation: '怪我',
    difficulty: 1
  },
  {
    id: 'emergency-006',
    english: 'I am lost.',
    japanese: '道に迷いました。',
    category: 'emergency',
    situation: '道迷い',
    difficulty: 1
  },
  {
    id: 'emergency-007',
    english: 'Where is the hospital?',
    japanese: '病院はどこですか？',
    category: 'emergency',
    situation: '病院確認',
    difficulty: 1
  },
  {
    id: 'emergency-008',
    english: 'This is an emergency.',
    japanese: 'これは緊急事態です。',
    category: 'emergency',
    situation: '緊急事態',
    difficulty: 1
  },
  {
    id: 'emergency-009',
    english: 'Please help me.',
    japanese: '助けてください。',
    category: 'emergency',
    situation: '助け要請',
    difficulty: 1
  },
  {
    id: 'emergency-010',
    english: 'I do not feel well.',
    japanese: '体調が悪いです。',
    category: 'emergency',
    situation: '体調不良',
    difficulty: 1
  },

  // Stage 2: 医療・病院 (Medical & Hospital)
  {
    id: 'emergency-011',
    english: 'I have a headache.',
    japanese: '頭痛がします。',
    category: 'emergency',
    situation: '頭痛',
    difficulty: 1
  },
  {
    id: 'emergency-012',
    english: 'My stomach hurts.',
    japanese: 'お腹が痛いです。',
    category: 'emergency',
    situation: '腹痛',
    difficulty: 1
  },
  {
    id: 'emergency-013',
    english: 'I think I broke my leg.',
    japanese: '足を骨折したと思います。',
    category: 'emergency',
    situation: '骨折',
    difficulty: 2
  },
  {
    id: 'emergency-014',
    english: 'I am allergic to this.',
    japanese: 'これにアレルギーがあります。',
    category: 'emergency',
    situation: 'アレルギー',
    difficulty: 1
  },
  {
    id: 'emergency-015',
    english: 'I need a doctor.',
    japanese: '医者が必要です。',
    category: 'emergency',
    situation: '医者要請',
    difficulty: 1
  },
  {
    id: 'emergency-016',
    english: 'Where is the pharmacy?',
    japanese: '薬局はどこですか？',
    category: 'emergency',
    situation: '薬局確認',
    difficulty: 1
  },
  {
    id: 'emergency-017',
    english: 'I have insurance.',
    japanese: '保険に加入しています。',
    category: 'emergency',
    situation: '保険確認',
    difficulty: 1
  },
  {
    id: 'emergency-018',
    english: 'Can you call my family?',
    japanese: '家族に電話してもらえますか？',
    category: 'emergency',
    situation: '家族連絡',
    difficulty: 1
  },
  {
    id: 'emergency-019',
    english: 'I need medicine.',
    japanese: '薬が必要です。',
    category: 'emergency',
    situation: '薬要求',
    difficulty: 1
  },
  {
    id: 'emergency-020',
    english: 'The pain is getting worse.',
    japanese: '痛みがひどくなっています。',
    category: 'emergency',
    situation: '痛み悪化',
    difficulty: 2
  },

  // Stage 3: 事故・犯罪 (Accidents & Crime)
  {
    id: 'emergency-021',
    english: 'There was an accident.',
    japanese: '事故がありました。',
    category: 'emergency',
    situation: '事故報告',
    difficulty: 1
  },
  {
    id: 'emergency-022',
    english: 'Someone stole my wallet.',
    japanese: '誰かが私の財布を盗みました。',
    category: 'emergency',
    situation: '盗難',
    difficulty: 1
  },
  {
    id: 'emergency-023',
    english: 'I lost my passport.',
    japanese: 'パスポートをなくしました。',
    category: 'emergency',
    situation: 'パスポート紛失',
    difficulty: 1
  },
  {
    id: 'emergency-024',
    english: 'My car broke down.',
    japanese: '車が故障しました。',
    category: 'emergency',
    situation: '車故障',
    difficulty: 1
  },
  {
    id: 'emergency-025',
    english: 'I need to report a crime.',
    japanese: '犯罪を報告する必要があります。',
    category: 'emergency',
    situation: '犯罪報告',
    difficulty: 2
  },
  {
    id: 'emergency-026',
    english: 'Can you tow my car?',
    japanese: '車をけん引してもらえますか？',
    category: 'emergency',
    situation: 'けん引依頼',
    difficulty: 2
  },
  {
    id: 'emergency-027',
    english: 'I witnessed an accident.',
    japanese: '事故を目撃しました。',
    category: 'emergency',
    situation: '事故目撃',
    difficulty: 2
  },
  {
    id: 'emergency-028',
    english: 'The building is on fire.',
    japanese: '建物が火事です。',
    category: 'emergency',
    situation: '建物火災',
    difficulty: 1
  },
  {
    id: 'emergency-029',
    english: 'Everyone needs to evacuate.',
    japanese: '全員避難する必要があります。',
    category: 'emergency',
    situation: '避難',
    difficulty: 2
  },
  {
    id: 'emergency-030',
    english: 'Is everyone safe?',
    japanese: '皆さん安全ですか？',
    category: 'emergency',
    situation: '安全確認',
    difficulty: 1
  },

  // Stage 4: 症状説明 (Describing Symptoms)
  {
    id: 'emergency-031',
    english: 'I have a fever.',
    japanese: '熱があります。',
    category: 'emergency',
    situation: '発熱',
    difficulty: 1
  },
  {
    id: 'emergency-032',
    english: 'I cannot breathe well.',
    japanese: 'うまく呼吸ができません。',
    category: 'emergency',
    situation: '呼吸困難',
    difficulty: 2
  },
  {
    id: 'emergency-033',
    english: 'I feel dizzy.',
    japanese: 'めまいがします。',
    category: 'emergency',
    situation: 'めまい',
    difficulty: 1
  },
  {
    id: 'emergency-034',
    english: 'My chest hurts.',
    japanese: '胸が痛いです。',
    category: 'emergency',
    situation: '胸痛',
    difficulty: 1
  },
  {
    id: 'emergency-035',
    english: 'I have been vomiting.',
    japanese: '吐いています。',
    category: 'emergency',
    situation: '嘔吐',
    difficulty: 2
  },
  {
    id: 'emergency-036',
    english: 'I cannot move my arm.',
    japanese: '腕が動かせません。',
    category: 'emergency',
    situation: '運動障害',
    difficulty: 1
  },
  {
    id: 'emergency-037',
    english: 'I have a severe pain.',
    japanese: 'ひどい痛みがあります。',
    category: 'emergency',
    situation: '激痛',
    difficulty: 1
  },
  {
    id: 'emergency-038',
    english: 'I am bleeding.',
    japanese: '出血しています。',
    category: 'emergency',
    situation: '出血',
    difficulty: 1
  },
  {
    id: 'emergency-039',
    english: 'I feel very weak.',
    japanese: 'とても弱っています。',
    category: 'emergency',
    situation: '衰弱',
    difficulty: 1
  },
  {
    id: 'emergency-040',
    english: 'I have been sick for three days.',
    japanese: '3日間体調が悪いです。',
    category: 'emergency',
    situation: '体調不良継続',
    difficulty: 2
  },

  // Stage 5: 緊急連絡 (Emergency Contacts)
  {
    id: 'emergency-041',
    english: 'What is the emergency number?',
    japanese: '緊急番号は何番ですか？',
    category: 'emergency',
    situation: '緊急番号確認',
    difficulty: 1
  },
  {
    id: 'emergency-042',
    english: 'Please contact my embassy.',
    japanese: '大使館に連絡してください。',
    category: 'emergency',
    situation: '大使館連絡',
    difficulty: 2
  },
  {
    id: 'emergency-043',
    english: 'I need to call my insurance company.',
    japanese: '保険会社に電話する必要があります。',
    category: 'emergency',
    situation: '保険会社連絡',
    difficulty: 2
  },
  {
    id: 'emergency-044',
    english: 'Can you help me make a phone call?',
    japanese: '電話をかけるのを手伝ってもらえますか？',
    category: 'emergency',
    situation: '電話支援',
    difficulty: 1
  },
  {
    id: 'emergency-045',
    english: 'My phone number is...',
    japanese: '私の電話番号は...です。',
    category: 'emergency',
    situation: '電話番号伝達',
    difficulty: 1
  },
  {
    id: 'emergency-046',
    english: 'Please tell them it is urgent.',
    japanese: '緊急だと伝えてください。',
    category: 'emergency',
    situation: '緊急性伝達',
    difficulty: 1
  },
  {
    id: 'emergency-047',
    english: 'I do not speak the language well.',
    japanese: '言葉がよく話せません。',
    category: 'emergency',
    situation: '言語問題',
    difficulty: 1
  },
  {
    id: 'emergency-048',
    english: 'Is there an interpreter?',
    japanese: '通訳はいますか？',
    category: 'emergency',
    situation: '通訳要請',
    difficulty: 1
  },
  {
    id: 'emergency-049',
    english: 'Please write it down.',
    japanese: '書いてください。',
    category: 'emergency',
    situation: '筆記依頼',
    difficulty: 1
  },
  {
    id: 'emergency-050',
    english: 'Can you speak slowly?',
    japanese: 'ゆっくり話してもらえますか？',
    category: 'emergency',
    situation: 'ゆっくり話す依頼',
    difficulty: 1
  },

  // Stage 6: 天災・災害 (Natural Disasters)
  {
    id: 'emergency-051',
    english: 'There is an earthquake!',
    japanese: '地震です！',
    category: 'emergency',
    situation: '地震',
    difficulty: 1
  },
  {
    id: 'emergency-052',
    english: 'Where is the emergency exit?',
    japanese: '非常口はどこですか？',
    category: 'emergency',
    situation: '非常口確認',
    difficulty: 1
  },
  {
    id: 'emergency-053',
    english: 'We need to evacuate now.',
    japanese: '今すぐ避難する必要があります。',
    category: 'emergency',
    situation: '避難指示',
    difficulty: 2
  },
  {
    id: 'emergency-054',
    english: 'Is it safe here?',
    japanese: 'ここは安全ですか？',
    category: 'emergency',
    situation: '安全確認',
    difficulty: 1
  },
  {
    id: 'emergency-055',
    english: 'Where is the shelter?',
    japanese: '避難所はどこですか？',
    category: 'emergency',
    situation: '避難所確認',
    difficulty: 1
  },
  {
    id: 'emergency-056',
    english: 'The power is out.',
    japanese: '停電しています。',
    category: 'emergency',
    situation: '停電',
    difficulty: 1
  },
  {
    id: 'emergency-057',
    english: 'There is flooding.',
    japanese: '洪水が起きています。',
    category: 'emergency',
    situation: '洪水',
    difficulty: 1
  },
  {
    id: 'emergency-058',
    english: 'Stay calm and follow me.',
    japanese: '落ち着いて私について来てください。',
    category: 'emergency',
    situation: '誘導',
    difficulty: 1
  },
  {
    id: 'emergency-059',
    english: 'Do not use the elevator.',
    japanese: 'エレベーターを使わないでください。',
    category: 'emergency',
    situation: 'エレベーター禁止',
    difficulty: 1
  },
  {
    id: 'emergency-060',
    english: 'Get under the table.',
    japanese: 'テーブルの下に入ってください。',
    category: 'emergency',
    situation: '地震対応',
    difficulty: 1
  },

  // Stage 7: 応急処置 (First Aid)
  {
    id: 'emergency-061',
    english: 'Apply pressure to stop bleeding.',
    japanese: '出血を止めるために圧迫してください。',
    category: 'emergency',
    situation: '止血指示',
    difficulty: 2
  },
  {
    id: 'emergency-062',
    english: 'Do not move the injured person.',
    japanese: '負傷者を動かさないでください。',
    category: 'emergency',
    situation: '負傷者対応',
    difficulty: 2
  },
  {
    id: 'emergency-063',
    english: 'Is there a first aid kit?',
    japanese: '救急箱はありますか？',
    category: 'emergency',
    situation: '救急箱確認',
    difficulty: 1
  },
  {
    id: 'emergency-064',
    english: 'Keep the person warm.',
    japanese: 'その人を暖かくしてください。',
    category: 'emergency',
    situation: '保温指示',
    difficulty: 1
  },
  {
    id: 'emergency-065',
    english: 'Can you check for breathing?',
    japanese: '呼吸を確認してもらえますか？',
    category: 'emergency',
    situation: '呼吸確認',
    difficulty: 2
  },
  {
    id: 'emergency-066',
    english: 'Elevate the injured leg.',
    japanese: '負傷した足を高くしてください。',
    category: 'emergency',
    situation: '足の処置',
    difficulty: 2
  },
  {
    id: 'emergency-067',
    english: 'Put ice on the injury.',
    japanese: '負傷部位に氷を当ててください。',
    category: 'emergency',
    situation: 'アイシング',
    difficulty: 1
  },
  {
    id: 'emergency-068',
    english: 'The person is unconscious.',
    japanese: 'その人は意識がありません。',
    category: 'emergency',
    situation: '意識不明',
    difficulty: 1
  },
  {
    id: 'emergency-069',
    english: 'Check for a pulse.',
    japanese: '脈を確認してください。',
    category: 'emergency',
    situation: '脈拍確認',
    difficulty: 1
  },
  {
    id: 'emergency-070',
    english: 'Give them water if conscious.',
    japanese: '意識があれば水を与えてください。',
    category: 'emergency',
    situation: '水分補給',
    difficulty: 2
  },

  // Stage 8: 警察・法的問題 (Police & Legal Issues)
  {
    id: 'emergency-071',
    english: 'I want to file a police report.',
    japanese: '警察に届け出をしたいです。',
    category: 'emergency',
    situation: '警察届出',
    difficulty: 2
  },
  {
    id: 'emergency-072',
    english: 'I was robbed.',
    japanese: '強盗に遭いました。',
    category: 'emergency',
    situation: '強盗被害',
    difficulty: 1
  },
  {
    id: 'emergency-073',
    english: 'Someone attacked me.',
    japanese: '誰かに襲われました。',
    category: 'emergency',
    situation: '暴行被害',
    difficulty: 1
  },
  {
    id: 'emergency-074',
    english: 'I need a lawyer.',
    japanese: '弁護士が必要です。',
    category: 'emergency',
    situation: '弁護士要請',
    difficulty: 1
  },
  {
    id: 'emergency-075',
    english: 'This is not my fault.',
    japanese: 'これは私のせいではありません。',
    category: 'emergency',
    situation: '責任否定',
    difficulty: 1
  },
  {
    id: 'emergency-076',
    english: 'I have the right to remain silent.',
    japanese: '黙秘権があります。',
    category: 'emergency',
    situation: '黙秘権',
    difficulty: 3
  },
  {
    id: 'emergency-077',
    english: 'Can I see your identification?',
    japanese: '身分証明書を見せてもらえますか？',
    category: 'emergency',
    situation: '身分確認',
    difficulty: 2
  },
  {
    id: 'emergency-078',
    english: 'I want to contact my consulate.',
    japanese: '領事館に連絡したいです。',
    category: 'emergency',
    situation: '領事館連絡',
    difficulty: 2
  },
  {
    id: 'emergency-079',
    english: 'Where is the police station?',
    japanese: '警察署はどこですか？',
    category: 'emergency',
    situation: '警察署確認',
    difficulty: 1
  },
  {
    id: 'emergency-080',
    english: 'I need a copy of the report.',
    japanese: 'レポートのコピーが必要です。',
    category: 'emergency',
    situation: 'レポート要求',
    difficulty: 1
  },

  // Stage 9: 紛失・トラブル (Lost Items & Troubles)
  {
    id: 'emergency-081',
    english: 'I lost my credit card.',
    japanese: 'クレジットカードをなくしました。',
    category: 'emergency',
    situation: 'カード紛失',
    difficulty: 1
  },
  {
    id: 'emergency-082',
    english: 'My luggage is missing.',
    japanese: '荷物が見つかりません。',
    category: 'emergency',
    situation: '荷物紛失',
    difficulty: 1
  },
  {
    id: 'emergency-083',
    english: 'I left my bag on the train.',
    japanese: '電車にバッグを忘れました。',
    category: 'emergency',
    situation: '忘れ物',
    difficulty: 1
  },
  {
    id: 'emergency-084',
    english: 'Can you cancel my card?',
    japanese: 'カードをキャンセルしてもらえますか？',
    category: 'emergency',
    situation: 'カードキャンセル',
    difficulty: 1
  },
  {
    id: 'emergency-085',
    english: 'I need a replacement passport.',
    japanese: 'パスポートの再発行が必要です。',
    category: 'emergency',
    situation: 'パスポート再発行',
    difficulty: 2
  },
  {
    id: 'emergency-086',
    english: 'Where is the lost and found?',
    japanese: '遺失物取扱所はどこですか？',
    category: 'emergency',
    situation: '遺失物確認',
    difficulty: 1
  },
  {
    id: 'emergency-087',
    english: 'I am locked out of my room.',
    japanese: '部屋から締め出されました。',
    category: 'emergency',
    situation: '締め出し',
    difficulty: 1
  },
  {
    id: 'emergency-088',
    english: 'My phone was stolen.',
    japanese: '携帯電話が盗まれました。',
    category: 'emergency',
    situation: '携帯盗難',
    difficulty: 1
  },
  {
    id: 'emergency-089',
    english: 'I need emergency cash.',
    japanese: '緊急でお金が必要です。',
    category: 'emergency',
    situation: '緊急資金',
    difficulty: 1
  },
  {
    id: 'emergency-090',
    english: 'Can you help me find it?',
    japanese: '探すのを手伝ってもらえますか？',
    category: 'emergency',
    situation: '捜索依頼',
    difficulty: 1
  },

  // Stage 10: 緊急時の指示・確認 (Emergency Instructions & Confirmations)
  {
    id: 'emergency-091',
    english: 'Follow the emergency procedures.',
    japanese: '緊急手順に従ってください。',
    category: 'emergency',
    situation: '緊急手順',
    difficulty: 2
  },
  {
    id: 'emergency-092',
    english: 'Wait here for assistance.',
    japanese: 'ここで助けを待ってください。',
    category: 'emergency',
    situation: '待機指示',
    difficulty: 1
  },
  {
    id: 'emergency-093',
    english: 'Help is on the way.',
    japanese: '助けが向かっています。',
    category: 'emergency',
    situation: '救助連絡',
    difficulty: 1
  },
  {
    id: 'emergency-094',
    english: 'Stay together as a group.',
    japanese: 'グループで一緒にいてください。',
    category: 'emergency',
    situation: 'グループ行動',
    difficulty: 1
  },
  {
    id: 'emergency-095',
    english: 'Count everyone in your party.',
    japanese: 'グループの全員を数えてください。',
    category: 'emergency',
    situation: '人数確認',
    difficulty: 2
  },
  {
    id: 'emergency-096',
    english: 'Move away from the danger.',
    japanese: '危険から離れてください。',
    category: 'emergency',
    situation: '危険回避',
    difficulty: 1
  },
  {
    id: 'emergency-097',
    english: 'Keep your hands visible.',
    japanese: '手を見えるところに置いてください。',
    category: 'emergency',
    situation: '手の位置',
    difficulty: 2
  },
  {
    id: 'emergency-098',
    english: 'Do not panic.',
    japanese: 'パニックにならないでください。',
    category: 'emergency',
    situation: 'パニック防止',
    difficulty: 1
  },
  {
    id: 'emergency-099',
    english: 'Listen for announcements.',
    japanese: 'アナウンスを聞いてください。',
    category: 'emergency',
    situation: 'アナウンス確認',
    difficulty: 1
  },
  {
    id: 'emergency-100',
    english: 'Everything will be okay.',
    japanese: 'すべて大丈夫になります。',
    category: 'emergency',
    situation: '安心の言葉',
    difficulty: 1
  }
]