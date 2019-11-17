/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        displayKeyboard function
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     This function simply toggles
 *                  the .hidden helper class for
 *                  both keyboards on demand.
 *
 * END HEADER
 */

/**
 * Toggles the keyboard visibility state.
 * @param {String} platform Either darwin or something else.
 */
export default function displayKeyboard (platform) {
  var keyboards = document.getElementsByClassName('keyboard')
  for (let keyboard of keyboards) {
    keyboard.classList.add('hidden')
  }

  if (platform === 'darwin') {
    document.getElementById('mac').classList.remove('hidden')
  } else { // win32 also means linux
    document.getElementById('surface').classList.remove('hidden')
  }
}
