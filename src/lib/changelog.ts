// Product changelog / roadmap — the source for /changelog and the "product update
// posts" evidence. Bilingual content (EN/TR); newest first.

export type ChangeStatus = 'shipped' | 'in-progress' | 'planned';
export type Locale = 'en' | 'tr';

type Bi = { en: string; tr: string };
type BiList = { en: string[]; tr: string[] };

type RawEntry = { date: string; title: Bi; status: ChangeStatus; items: BiList };

// Resolved shape consumed by the UI.
export type ChangeEntry = {
  date: string;
  title: string;
  status: ChangeStatus;
  items: string[];
};

const RAW: RawEntry[] = [
  {
    date: '2026-07-08',
    title: {
      en: 'UX polish from user testing',
      tr: 'Kullanıcı testinden gelen iyileştirmeler',
    },
    status: 'shipped',
    items: {
      en: [
        'Reliable one-tap sharing (X / Telegram / WhatsApp open correctly).',
        'Minimum contribution set to 0.25 XLM; no maximum.',
        'Global slide-in navigation menu with a language switcher.',
        'Weekly-active-wallets bar chart on Metrics and Analytics.',
        'Full Turkish/English translation across the app.',
      ],
      tr: [
        'Güvenilir tek-dokunuş paylaşım (X / Telegram / WhatsApp doğru açılıyor).',
        'Minimum katkı 0.25 XLM; maksimum yok.',
        'Dil seçicili genel kayan navigasyon menüsü.',
        'Metrikler ve Analitik’te haftalık aktif cüzdan grafiği.',
        'Uygulama genelinde tam Türkçe/İngilizce çeviri.',
      ],
    },
  },
  {
    date: '2026-07-07',
    title: {
      en: 'Founder Belt — growth foundation',
      tr: 'Founder Belt — büyüme temeli',
    },
    status: 'shipped',
    items: {
      en: [
        'First-party, privacy-light analytics — no third-party trackers.',
        'Live build-in-public metrics board and monthly growth report.',
        'Acquisition funnel + weekly cohorts.',
        'SEO: sitemap, robots, and dynamic social share cards.',
      ],
      tr: [
        'Birinci-taraf, gizliliğe duyarlı analitik — üçüncü taraf takipçi yok.',
        'Halka açık canlı metrik panosu ve aylık büyüme raporu.',
        'Kazanım hunisi + haftalık cohort’lar.',
        'SEO: sitemap, robots ve dinamik sosyal paylaşım kartları.',
      ],
    },
  },
  {
    date: '2026-07-07',
    title: {
      en: 'Growth, retention & trust tooling',
      tr: 'Büyüme, sadakat ve güven araçları',
    },
    status: 'shipped',
    items: {
      en: [
        'Creator dashboard: post updates, share, and grow your backers.',
        'Personal dashboard: your contributions, campaigns, and follows.',
        'Referral links, embeddable widgets, and email capture + weekly digest.',
        'Comments, transparency badges, creator verification, and a testimonial wall.',
        'Installable app (PWA) and a testnet free-try funnel.',
      ],
      tr: [
        'Oluşturucu paneli: güncelleme yayınla, paylaş, destekçilerini artır.',
        'Kişisel pano: katkıların, kampanyaların ve takip ettiklerin.',
        'Referral linkleri, gömülebilir widget’lar, e-posta yakalama + haftalık bülten.',
        'Yorumlar, şeffaflık rozetleri, oluşturucu doğrulama ve yorum duvarı.',
        'Kurulabilir uygulama (PWA) ve testnet ücretsiz-deneme hunisi.',
      ],
    },
  },
  {
    date: '2026-07-06',
    title: {
      en: 'Black Belt — mainnet launch',
      tr: 'Black Belt — mainnet lansmanı',
    },
    status: 'shipped',
    items: {
      en: [
        'Deployed to Stellar mainnet with native XLM milestone escrow.',
        'On-chain proof board, security review, user guide, and launch marketing.',
      ],
      tr: [
        'Yerel XLM milestone escrow ile Stellar mainnet’e deploy edildi.',
        'Zincir üstü kanıt panosu, güvenlik incelemesi, kullanıcı rehberi ve lansman pazarlaması.',
      ],
    },
  },
  {
    date: '2026-08-01',
    title: {
      en: 'On the roadmap',
      tr: 'Yol haritasında',
    },
    status: 'planned',
    items: {
      en: [
        'Web-push notifications for milestone and update alerts.',
        'Creator payout analytics and backer cohort retention.',
        'Deeper localization and more wallet options.',
      ],
      tr: [
        'Milestone ve güncelleme uyarıları için web-push bildirimleri.',
        'Oluşturucu ödeme analitiği ve destekçi cohort sadakati.',
        'Daha derin yerelleştirme ve daha fazla cüzdan seçeneği.',
      ],
    },
  },
];

export function localizedChangelog(locale: Locale = 'en'): ChangeEntry[] {
  return RAW.map((e) => ({
    date: e.date,
    title: e.title[locale],
    status: e.status,
    items: e.items[locale],
  }));
}

// Back-compat default (EN) used by tests and any non-localized call site.
export const CHANGELOG: ChangeEntry[] = localizedChangelog('en');

export function sortedChangelog(entries: ChangeEntry[] = CHANGELOG): ChangeEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}
