'use babel';
import { CompositeDisposable, Disposable } from 'event-kit'
import { watch } from 'chokidar'

export class ThemeHotReloader {
  getThemePackages() {
    return inkdrop.packages.getActivePackages().filter(p => p.getType() === 'theme')
  }

  watchThemePackage(pack) {
    const watcher = watch(pack.path, {
      ignoreInitial: true
    })
      .on('all', (event, path) => {
        if (path.endsWith('.css')) {
          console.log('Reloading stylesheets:', pack.name)
          pack.reloadStylesheets()
        }
      })

    return new Disposable(() => {
      watcher.close()
    })
  }

  watchThemes() {
    console.log('Start watching themes...')
    this.unwatchThemes()
    this.disposables = new CompositeDisposable()

    this.getThemePackages().forEach(pkg => {
      this.disposables.add(this.watchThemePackage(pkg))
    })
  }

  unwatchThemes() {
    if (this.disposables) this.disposables.dispose()
    this.disposables = null
    console.log('Stopped watching themes')
  }
}
