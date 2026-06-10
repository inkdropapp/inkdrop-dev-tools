const { logger } = require('inkdrop')

module.exports = {
  activate(env) {
    this.disposables = inkdrop.commands.add(document.body, {
      'dev-tools:copy-notebook-id': () => {
        const bookId = inkdrop.store.getState().bookList?.bookForContextMenu?._id
        logger.debug('Copy notebook id:', bookId)
        env.clipboard.writeText(bookId)
      },
      'dev-tools:copy-tag-id': e => {
        const tagIdForContextMenu = inkdrop.store.getState().tagList?.tagForContextMenu?._id
        const target = inkdrop.contextMenu.getEventTargetElement(e)
        const tagId = target?.dataset?.tagid || tagIdForContextMenu
        logger.debug('Copy tag id:', tagId)
        env.clipboard.writeText(tagId)
      },
      'dev-tools:copy-note-id': () => {
        const noteId = inkdrop.store.getState().noteListBar?.actionTargetNoteIds?.[0]
        logger.debug('Copy note id:', noteId)
        env.clipboard.writeText(noteId)
      },
      'dev-tools:watch-themes': () => {
        const { ThemeHotReloader } = require('./hot-reloading-themes')
        if (!this.hotReloader) this.hotReloader = new ThemeHotReloader()
        this.hotReloader.watchThemes()
        inkdrop.notifications.addInfo('Watching themes...', {
          dismissable: true,
          detail: 'When any file changes are detected, it will reload immediately.'
        })
      },
      'dev-tools:unwatch-themes': () => {
        this.hotReloader?.unwatchThemes()
        inkdrop.notifications.addInfo('Stopped watching themes', {
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
