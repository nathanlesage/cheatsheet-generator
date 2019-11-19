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
  var kbd = document.getElementById(objectId)

  // Get all keys present on the keyboard
  var keys = kbd.getElementsByClassName('key')

  // Now that we have all keys, iterate over them
  for (var key of keys) {
    // Get its parent, as the parent contains the key's ID
    var id = key.parentNode.getAttribute('id')

    // We only apply the variable keys here
    if (id.indexOf('key') !== 0) continue
    // Retrieve the correct letter for that key by reverse-searching the layout
    var labels = resolveKey(id, layout, platform, 'id')
    if (labels.length === 0) {
      console.warn('Could not find letter for ID ' + id)
      continue
    }

    // Before we touch anything on this key, get rid of all previous labels
    for (var i = 1; i < 4; i++) { // Why a loop? There are keys w/o layer2 and 3
      var node = key.parentNode.getElementsByClassName('layer' + i + '-key-label')
      if (node.length > 0) node[0].innerHTML = ''
    }

    for (let label of labels) {
      if (label.layer === 'layer4') continue // Layer4 is fixed for all layouts
      // Then, retrieve the label node (there's only one layer1/2/3 label per key)
      var labelNode = key.parentNode.getElementsByClassName(label.layer + '-key-label')[0]
      // Create a text node and add it to the key.
      var text = document.createTextNode(label.key)
      labelNode.innerHTML = ''
      labelNode.appendChild(text)
    }
  }
}
