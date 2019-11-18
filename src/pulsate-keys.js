/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        pulsateKeys function, which makes the keyboard keys fancy.
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     Basically tries to guess all keys that need to
 *                  be pressed for a shortcut to work, and, if it
 *                  has them, applies the "pulse" class to them.
 *
 * END HEADER
 */

import resolveKey from './resolve-key.js'

export default function pulsateKeys (shortcut, layout, platform) {
  // First, retrieve all keys to highlight.
  shortcut = shortcut.toLowerCase().split('+')
  var sanitizedPlatform = (platform === 'darwin') ? 'mac' : 'surface'

  // Resolve Cmd/Ctrl
  for (var i in shortcut) {
    if (shortcut[i] === 'cmdorctrl') {
      shortcut[i] = (platform === 'darwin') ? 'cmd' : 'ctrl'
      break
    }
  }

  // Now resolve all the keys -- including potential layer keys
  var keysToPulsate = []
  for (var key of shortcut) {
    if (!keysToPulsate.includes(key)) {
      var resolvedKey = resolveKey(key, layout, platform)
      if (resolvedKey.length !== 1) {
        console.warn('Resolved multiple keys for key ' + key + ' on layout ' + layout + ' and platform ' + platform)
        continue
      }
      resolvedKey = resolvedKey[0]

      switch (resolvedKey.layer) {
        case 'layer2':
          if (!keysToPulsate.includes('shift-left')) keysToPulsate.push('shift-left')
          break
        case 'layer3':
          var keyToAdd = (platform === 'darwin') ? 'option-left' : 'alt-left'
          if (!keysToPulsate.includes(keyToAdd)) keysToPulsate.push(keyToAdd)
          break
      }
      keysToPulsate.push(resolvedKey.key)
    }
  }

  // Now pulsate!
  var kbd = document.getElementById(sanitizedPlatform) // Retrieve the correct keyboard
  keysToPulsate = keysToPulsate.map(function (e) { return '#' + e })
  for (var key of kbd.querySelectorAll(keysToPulsate.join(', '))) {
    if (platform === 'darwin' && key.getAttribute('id') === 'enter') {
      // A so-called Extrawurst for the Return key
      key.getElementsByTagName('path')[0].classList.add('pulse')
    } else {
      key.getElementsByTagName('rect')[0].classList.add('pulse')
    }
  }
}
