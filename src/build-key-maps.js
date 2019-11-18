/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Builds the keymaps from the objects in memory
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     This file is being called with a shortcuts
 *                  object that is generated from the config.yml.
 *                  It creates a maps-object that contains the
 *                  different layers a keyboard can have, e.g.
 *                  "vanilla" (no control key pressed), "Cmd" or
 *                  "Cmd+Alt".
 *
 * END HEADER
 */

/**
 * Generates useable keymaps from the shortcuts in memory.
 * @param {Object} shortcuts The shortcuts from memory to create the keymaps from.
 */
export default function buildKeyMaps (shortcuts) {
  // Highlight the given platform keys
  var platform = document.getElementById('platform-select').value

  var allKeys = []
  var maps = {
    'vanilla': [], // Without any control key
    'Ctrl': [],
    'Cmd': [],
    'Alt': [],
    'Shift': [],
    'Cmd+Alt': [],
    'Cmd+Shift': [],
    'Cmd+Alt+Shift': [],
    'Ctrl+Alt': [],
    'Ctrl+Shift': [],
    'Ctrl+Alt+Shift': [],
    'Cmd+Ctrl': [],
    'Cmd+Ctrl+Alt': [],
    'Cmd+Ctrl+Alt+Shift': []
  }

  // Retrieve both crossplatform keys and the platform-specific ones.
  for (var cut in shortcuts.crossplatform) {
    allKeys.push({ 'shortcut': cut, 'description': shortcuts.crossplatform[cut] })
  }
  for (var cut in shortcuts[platform]) {
    allKeys.push({ 'shortcut': cut, 'description': shortcuts[platform][cut] })
  }

  // parse shortcuts
  for (var cut of allKeys) {
    var keys = cut.shortcut.toLowerCase().split('+')
    var altKey = keys.includes('alt') || keys.includes('option')
    var ctrlKey = keys.includes('ctrl') || (keys.includes('cmdorctrl') && platform !== 'darwin')
    var cmdKey = (keys.includes('cmd') || keys.includes('cmdorctrl')) && platform === 'darwin'
    var shiftKey = keys.includes('shift')

    // Sole/rogue command keys may be used with the mouse, so push it to the vanilla
    // map.
    if (keys.length === 1 && [ 'ctrl', 'alt', 'cmd', 'shift', 'option' ].includes(keys[0])) {
      maps['vanilla'].push(cut)
      continue
    }

    // Now sort into the correct keymap
    if (altKey && ctrlKey && cmdKey && shiftKey) {
      maps['Cmd+Ctrl+Alt+Shift'].push(cut)
    } else if (altKey && ctrlKey && cmdKey && !shiftKey) {
      maps['Cmd+Ctrl+Alt'].push(cut)
    } else if (ctrlKey && cmdKey && !altKey && !shiftKey) {
      maps['Cmd+Ctrl'].push(cut)
    } else if (ctrlKey && altKey && shiftKey && !cmdKey) {
      maps['Ctrl+Alt+Shift'].push(cut)
    } else if (ctrlKey && !shiftKey && !cmdKey && altKey) {
      maps['Ctrl+Alt'].push(cut)
    } else if (ctrlKey && altKey && !cmdKey && !shiftKey) {
      maps['Ctrl+Alt'].push(cut)
    } else if (ctrlKey && shiftKey && !cmdKey && !altKey) {
      maps['Ctrl+Shift'].push(cut)
    } else if (cmdKey && altKey && shiftKey && !ctrlKey) {
      maps['Cmd+Alt+Shift'].push(cut)
    } else if (cmdKey && shiftKey && !altKey && !ctrlKey) {
      maps['Cmd+Shift'].push(cut)
    } else if (cmdKey && altKey && !ctrlKey && !shiftKey) {
      maps['Cmd+Alt'].push(cut)
    } else if (altKey && !ctrlKey && !cmdKey && !shiftKey) {
      maps['Alt'].push(cut)
    } else if (cmdKey && !ctrlKey && !altKey && !shiftKey) {
      maps['Cmd'].push(cut)
    } else if (ctrlKey && !cmdKey && !altKey && !shiftKey) {
      maps['Ctrl'].push(cut)
    } else if (shiftKey && !cmdKey && !altKey && !ctrlKey) {
      maps['Shift'].push(cut)
    } else {
      maps['vanilla'].push(cut)
    }
  }

  return maps // Return the parsed map
}
