let chokidarPromise = null
function loadChokidar() {
  if (!chokidarPromise) chokidarPromise = import('chokidar')
  return chokidarPromise
}

function shouldIgnore(path, stats) {
  if (/[/\\](node_modules|\.git)([/\\]|$)/.test(path)) return true
  return stats?.isFile() === true && !path.endsWith('.css')
}

class ThemeHotReloader {
  getThemePackages() {
    return inkdrop.packages.getActivePackages().filter(p => p.getType() === 'theme')
  }

  async watchThemePackage(pack) {
    const { watch } = await loadChokidar()
    return watch(pack.path, {
      ignoreInitial: true,
      ignored: shouldIgnore
    }).on('all', (_event, path) => {
      if (path.endsWith('.css')) {
        console.log('Reloading stylesheets:', pack.name)
        pack.reloadStylesheets()
      }
    })
  }

  async watchThemes() {
    console.log('Start watching themes...')
    await this.unwatchThemes()
    const watchers = []
    this.watchers = watchers

    for (const pkg of this.getThemePackages()) {
      // Bail out if unwatchThemes() ran while we were awaiting chokidar.
      if (this.watchers !== watchers) break
      watchers.push(await this.watchThemePackage(pkg))
    }
  }

  async unwatchThemes() {
    const watchers = this.watchers
    this.watchers = null
    if (watchers) await Promise.all(watchers.map(w => w.close()))
    console.log('Stopped watching themes')
  }
}

module.exports = { ThemeHotReloader }
