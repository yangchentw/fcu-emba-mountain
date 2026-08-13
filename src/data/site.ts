export const site = { name: '逢甲大學 EMBA 峰鷹登山協會', description: '以登山、安全、保育與情誼，連結逢甲 EMBA 愛山夥伴。', url: 'https://mountain.fcuemba.org' } as const;
export const externalLinks = { facebook: 'https://www.facebook.com/groups/fcuembamountain', recruitment: 'https://forms.gle/x8v66LxiV8ZvPxAi7' } as const;
export const pages = [{ href: '/about/', label: '關於峰鷹' }, { href: '/legacy/', label: '組織與傳承' }, { href: '/activities/', label: '活動與社群' }, { href: '/join/', label: '加入協會' }] as const;
export const leadership = [
  { term: '創會', president: '109 文創 張忠益', secretaryGeneral: '107 經甲 楊子承' },
  { term: '第一屆', president: '107 經甲 楊子承', secretaryGeneral: '101 經甲 陳恩佳' },
  { term: '第二屆', president: '112 高階 白暐輝', secretaryGeneral: '111 經甲 余建擇' },
  { term: '第三屆', president: '101 經甲 陳恩佳', secretaryGeneral: '114 經甲 陳宇慶' },
] as const;
