module.exports = {
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pages: {
    '*': ['common'],
    '/': ['home'],
  },
  loadLocaleFrom: (lang, ns) =>
    import(`./locales/${lang}/${ns}.json`).then((m) => m.default),
}