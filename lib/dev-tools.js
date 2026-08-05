module.exports = {
  activate(env) {
    this.disposables = env.commands.add(document.body, {
      'dev-tools:watch-themes': () => {
        const { ThemeHotReloader } = require('./hot-reloading-themes')
        if (!this.hotReloader) this.hotReloader = new ThemeHotReloader()
        this.hotReloader.watchThemes()
        env.notifications.addInfo('Watching themes...', {
          dismissable: true,
          detail: 'When any file changes are detected, it will reload immediately.'
        })
      },
      'dev-tools:unwatch-themes': () => {
        this.hotReloader?.unwatchThemes()
        env.notifications.addInfo('Stopped watching themes', {
          dismissable: true
        })
      }
    })
  },
  async deactivate() {
    this.disposables.dispose()
    await this.hotReloader?.unwatchThemes()
  }
}
