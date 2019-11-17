/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        applykeyboardLayout function
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     This function applies a keyboard
 *                  layout by looking up the corresponding
 *                  keys from the layout file and placing
 *                  them on the interactive keyboard. It
 *                  inserts textNodes into the keys.
 *
 * END HEADER
 */

import resolveKey from './resolve-key.js'

/**
 * Applies a keyboard layout unto an interactive keyboard image.
 * @param {String} objectId The object where the keyboard is located, e.g. mac.
 * @param {String} platform The wanted platform, used to retrieve the keymap, e.g. darwin.
 * @param {String} layout The keyboard layout, e.g. en-US.
 */
export default function applyKeyboardLayout (objectId, platform, layout) {
  if (!objectId) throw new Error('To apply a keyboard layout, please provide the keyboard\'s ID.')
  if (!platform) throw new Error('Please specify the platform (either darwin, linux, or win32).')
  if (!layout) throw new Error('To apply a keyboard layout, please specify the layout.')

  // Retrieve the keyboard from the DOM
  var kbd = document.getElementById(objectId) // .contentDocument

  // Get all keys present on the keyboard
  var keys = kbd.getElementsByClassName('key')

  // Now that we have all keys, iterate over them
  for (var key of keys) {
    // Get its parent, as the parent contains the key's ID
    var id = key.parentNode.getAttribute('id')
    // Also, retrieve the corresponding label node to append the text to
    var labelNode = key.parentNode.getElementsByTagName('text')[0]

    // We only apply the variable keys here
    if (id.indexOf('key') !== 0) continue
    // Retrieve the correct letter for that key by reverse-searching the layout
    var letter = resolveKey(id, layout, platform, 'id')
    if (!letter) {
      console.warn('Could not find letter for ID ' + id)
      continue
    }
    // Now create a text node and apply it to the key.
    var label = document.createTextNode(letter)
    labelNode.innerHTML = ''
    labelNode.appendChild(label)
  }
}
