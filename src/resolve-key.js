/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        resolveKey
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     This utility function performs
 *                  lookups in the specified keyboard
 *                  layout. You can either search for
 *                  layout's default keys (W, 4, Ctrl, etc.)
 *                  or perform a reverse lookup to find out
 *                  which key hides behind the ID "key1-1"
 *                  in the specified layout.
 *
 * END HEADER
 */

/**
 *
 * @param {String} key The key to search for.
 * @param {String} layout The keyboard layout, e.g. 'en-US'
 * @param {String} platform The platform (darwin, win32, or linux)
 * @param {String} searchBy Optional. Used to reverse search for the IDs (set to 'id')
 */
export default function resolveKey (key, layout, platform, searchBy = 'key') {
  if (!keymaps) throw new Error('Please make sure to include keymaps.js!')
  if (![ 'linux', 'darwin', 'win32', 'mac', 'surface' ].includes(platform)) throw new Error('Invalid platform: ' + platform)

  var sanitisedPlatform = ([ 'darwin', 'mac' ].includes(platform)) ? 'mac' : 'surface'
  key = key.toLowerCase() // Make sure to be case-insensitive
  var map = keymaps[sanitisedPlatform]
  if (!map.hasOwnProperty(layout)) {console.log(keymaps, map, sanitisedPlatform, platform); throw new Error('Could not find layout: ' + layout)}
  map = map[layout]

  var specialKeys = [
    'escape',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
    'special', 'delete', // Both the same, only one on Mac, one on Surface
    'backspace', 'tab', 'enter',
    'caps-lock', 'shift-left', 'shift-right',
    'fn', 'control', 'command-left', 'command-right',
    'option-left', 'option-right', 'space',
    'arrow-left', 'arrow-up', 'arrow-down', 'arrow-right',
    'windows', 'alt-left', 'alt-right', 'menu'
  ]

  // Return sane defaults for some of the optional keys
  if (key === 'alt' && sanitisedPlatform === 'surface') return [{ 'key': 'alt-left', 'layer': 'layer1' }]
  if (key === 'alt' && sanitisedPlatform === 'mac') return [{ 'key': 'option-left', 'layer': 'layer1' }]
  if (key === 'option') return [{ 'key': 'option-left', 'layer': 'layer1' }]
  if (key === 'cmd') return [{ 'key': 'command-left', 'layer': 'layer1' }]
  if (key === 'shift') return [{ 'key': 'shift-left', 'layer': 'layer1' }]
  if (key === 'ctrl') return [{ 'key': 'control', 'layer': 'layer1' }]
  if (key === 'esc') return [{ 'key': 'escape', 'layer': 'layer1' }]
  if (key === 'delete' && sanitisedPlatform === 'mac') return [{ 'key': 'backspace', 'layer': 'layer1' }]
  if (specialKeys.includes(key)) return [{ 'key': key, 'layer': 'layer1' }] // Easy way out


  // Whenever a user uses words instead of the characters
  if (key === 'comma') key = ','
  if (key === 'plus') key = '+'
  if (key === 'minus') key = '-'


  // Now we got the correct layout. Search for the thing!
  let ret = [] // Collect all potential keys
  for (var layer in map) {
    for (var id in map[layer]) { // Search through all three layers
      if (searchBy === 'key' && map[layer][id].toLowerCase() === key) {
        // The caller has searched for a key, and we found it.
        // Now we need to determine the layer on which it is, and
        // add both to the return
        ret.push({ 'key': id, 'layer': layer })
        // return id
      }

      if (searchBy === 'id' && id.toLowerCase() === key) {
        // The caller wanted to reverse an ID mapping, so
        // we could potentially come up with up to three
        // keys in three layers. This will be used, e.g.,
        // for the applyKeyboardLayout function.
        ret.push({ 'key': map[layer][id], 'layer': layer })
        // return map[id]
      }
    }
  }

  // After we've collected our up-to-three choices, return them.
  return ret
}
