const { CompositeDisposable, Disposable } = require('event-kit')

let chokidarPromise = null
function loadChokidar() {
  if (!chokidarPromise) chokidarPromise = import('chokidar')
  return chokidarPromise
}

class ThemeHotReloader {
  getThemePackages() {
    return inkdrop.packages.getActivePackages().filter(p => p.getType() === 'theme')
  }

  async watchThemePackage(pack) {
    const { watch } = await loadChokidar()
    const watcher = watch(pack.path, {
      ignoreInitial: true
    }).on('all', (event, path) => {
      if (path.endsWith('.css')) {
        console.log('Reloading stylesheets:', pack.name)
        pack.reloadStylesheets()
      }
    })

    return new Disposable(() => {
      watcher.close()
    })
  }

  async watchThemes() {
    console.log('Start watching themes...')
    this.unwatchThemes()
    const disposables = new CompositeDisposable()
    this.disposables = disposables

    for (const pkg of this.getThemePackages()) {
      // Bail out if unwatchThemes() ran while we were awaiting chokidar.
      if (this.disposables !== disposables) break
      disposables.add(await this.watchThemePackage(pkg))
    }
  }

  unwatchThemes() {
    if (this.disposables) this.disposables.dispose()
    this.disposables = null
    console.log('Stopped watching themes')
  }
}

module.exports = { ThemeHotReloader }
