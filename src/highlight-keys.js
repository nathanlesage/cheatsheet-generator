/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        highlightKeys
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     Apart from the buildKeyMaps function,
 *                  this one is the most sophisticated
 *                  function within the framework. It takes
 *                  the generated maps from buildKeyMaps,
 *                  performs a reverse lookup of the key IDs
 *                  and applies a "highlight" class to the
 *                  key-buttons themselves, depending on which
 *                  ones are available in the specified keymap.
 *                  Afterwards, the functino also populates the
 *                  shortcut container below the keyboard.
 *
 * END HEADER
 */

import resolveKey from './resolve-key.js'

/**
 * Highlights the keys on the specified keyboard.
 * @param {Object} maps The built keys from buildKeyMaps
 */
export default function highlightKeys (maps) {
  // Retrieve the necessary values
  var platform = document.getElementById('platform-select').value
  platform = (['mac', 'darwin' ].includes(platform)) ? 'mac' : 'surface'
  var layout = document.getElementById('layout-select').value

  var keyboard = document.getElementById(platform) // .contentDocument Retrieve the SVG

  // Remove all highlights prior
  for (var key of keyboard.getElementsByClassName('key')) { key.classList.remove('highlight') }

  // Determine keyboard state
  var altKey = document.getElementById('alt-key').checked || false
  var ctrlKey = document.getElementById('control-key').checked || false
  var cmdKey = document.getElementById('command-key').checked || false
  var shiftKey = document.getElementById('shift-key').checked || false

  // Select the appropriate map
  var map
  if (altKey && ctrlKey && cmdKey && shiftKey) {
    map = maps['Cmd+Ctrl+Alt+Shift']
  } else if (altKey && ctrlKey && cmdKey) {
    map = maps['Cmd+Ctrl+Alt']
  } else if (ctrlKey && cmdKey) {
    map = maps['Cmd+Ctrl']
  } else if (ctrlKey && altKey && shiftKey && !cmdKey) {
    map = maps['Ctrl+Alt+Shift']
  } else if (ctrlKey && shiftKey && !cmdKey && !altKey) {
    map = maps['Ctrl+Alt']
  } else if (ctrlKey && altKey && !cmdKey && !shiftKey) {
    map = maps['Ctrl+Alt']
  } else if (cmdKey && altKey && shiftKey && !ctrlKey) {
    map = maps['Cmd+Alt+Shift']
  } else if (cmdKey && shiftKey && !altKey && !ctrlKey) {
    map = maps['Cmd+Shift']
  } else if (cmdKey && altKey && !ctrlKey && !shiftKey) {
    map = maps['Cmd+Alt']
  } else if (altKey && !ctrlKey && !cmdKey && !shiftKey) {
    map = maps['Alt']
  } else if (cmdKey && !ctrlKey && !altKey && !shiftKey) {
    map = maps['Cmd']
  } else if (ctrlKey && !cmdKey && !altKey && !shiftKey) {
    map = maps['Ctrl']
  } else if(!ctrlKey && !cmdKey && !altKey && !shiftKey) {
    map = maps['vanilla']
  }

  if (!map) return console.error('Invalid combination!')

  // Highlight the respective keys
  for (var cut of map) {
    var keys = cut.shortcut.toLowerCase().split('+')
    for (var k of keys) {
      // Resolve CmdOrCtrl-shortcuts
      if (k === 'cmdorctrl') k = (platform === 'mac') ? 'cmd' : 'ctrl'
      var highlight = document.querySelectorAll('#' + resolveKey(k, layout, platform))
      if (!highlight) {
        console.warn('No mapping to key ' + k + ' on layout ' + layout + ' and platform ' + platform)
        continue
      }
      // Move through all matched selectors (maximum: two for two keyboards)
      for (var h of highlight) {
        // The first rect within the ID group is always the key itself
        h.getElementsByClassName('key')[0].classList.add('highlight')
      }
    }
  }

  // Finally, list the affected shortcuts
  var list = document.createElement('ul')
  for (var cut of map) {
    var sanitizedShortcut = cut.shortcut.replace('CmdOrCtrl', (platform === 'mac') ? 'Cmd' : 'Ctrl')
    var item = document.createElement('li')
    item.innerHTML = `<strong>${sanitizedShortcut}</strong>: ${cut.description}`
    list.appendChild(item)
  }

  document.getElementById('shortcut-container').innerHTML = ''
  document.getElementById('shortcut-container').appendChild(list)
}
