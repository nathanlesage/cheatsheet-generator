/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        The Cheatsheet class, which controls the page.
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     At boot, one object of this class will be
 *                  instantiated, which controls the page. That
 *                  means, it will listen to changes to the
 *                  controls and update the page adequately.
 *
 * END HEADER
 */

import applyKeyboardLayout from './apply-keyboard-layout.js'
import displayKeyboard from './display-keyboard.js'
import buildKeyMaps from './build-key-maps.js'
import highlightKeys from './highlight-keys.js'

export default class Cheatsheet {
  constructor () {
    this._previousPlatform = 'darwin'

    // Load after everything has been loaded
    window.addEventListener('load', () => {
      this.stateChange() // Initialise

      // Attach event listeners
      document.getElementById('alt-key').onchange = this.stateChange.bind(this)
      document.getElementById('control-key').onchange = this.stateChange.bind(this)
      document.getElementById('command-key').onchange = this.stateChange.bind(this)
      document.getElementById('shift-key').onchange = this.stateChange.bind(this)
      document.getElementById('platform-select').onchange = this.stateChange.bind(this)
      document.getElementById('layout-select').onchange = this.stateChange.bind(this)
    })
  }

  /**
   * Executes everytime there's a state change in the controls.
   * @param {Event} event The event from the DOM update
   */
  stateChange (event) {
    var layout = document.getElementById('layout-select').value
    var platform = document.getElementById('platform-select').value
    var sanitizedPlatform = (platform === 'darwin') ? 'mac' : 'surface'
    if (!this._previousPlatform) this._previousPlatform = platform

    // If the platform is not darwin, unselect
    // the Cmd key and select the Ctrl key
    var ctrlKey = document.getElementById('control-key')
    var cmdKey = document.getElementById('command-key')
    if (platform !== this._previousPlatform && platform !== 'darwin' && cmdKey.checked) {
      cmdKey.checked = false
      ctrlKey.checked = true
    } else if (platform !== this._previousPlatform && platform === 'darwin' && ctrlKey.checked) {
      cmdKey.checked = true
      ctrlKey.checked = false
    }

    // Deactivate all options not available in the keymap layouts
    var availableLayouts = Object.keys(keymaps[sanitizedPlatform])
    for (var option of document.getElementById('layout-select').options) {
      if (!availableLayouts.includes(option.value)) {
        option.disabled = true
      } else {
        option.disabled = false
      }
    }

    // Make sure we got a sane layout
    if (!keymaps[sanitizedPlatform][layout]) {
      document.getElementById('layout-select').value = availableLayouts[0]
      layout = document.getElementById('layout-select').value
    }

    if (platform !== this._previousPlatform) this._previousPlatform = platform

    // Make sure the cmdKey is not checked when we're not on darwin
    if (platform !== 'darwin' && cmdKey.checked) {
      cmdKey.checked = false
    }

    // First, apply the correct layout to both keyboards.
    applyKeyboardLayout((platform === 'darwin') ? 'mac' : 'surface', platform, layout)
    // applyKeyboardLayout('surface', 'win32', layout)

    // Then, only show the relevant keyboard
    displayKeyboard(platform)

    // Then, build the keymaps and highlight the keys
    var maps = buildKeyMaps(shortcuts)
    highlightKeys(maps)
  }
}
