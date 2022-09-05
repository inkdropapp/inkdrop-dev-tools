'use babel';

const { clipboard } = require('electron')
const { logger } = require('inkdrop')

module.exports = {
  activate() {
    this.disposables = inkdrop.commands.add(document.body, {
      'dev-tools:copy-notebook-id': () => {
        const bookId = inkdrop.store.getState().bookList?.bookForContextMenu?._id
        logger.debug('Copy notebook id:', bookId)
        clipboard.writeText(bookId)
      },
      'dev-tools:copy-tag-id': (e) => {
        const target = inkdrop.contextMenu.getEventTargetElement(e)
        const tagId = target?.dataset?.tagid
        logger.debug('Copy tag id:', tagId)
        clipboard.writeText(tagId)
      },
      'dev-tools:copy-note-id': () => {
        const noteId = inkdrop.store.getState().noteListBar?.actionTargetNoteIds?.[0]
        logger.debug('Copy note id:', noteId)
        clipboard.writeText(noteId)
      }
    })
  },
  deactivate() {
    this.disposables.dispose()
  }
};
