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
  if (key === 'alt' && sanitisedPlatform === 'surface') return 'alt-left'
  if (key === 'alt' && sanitisedPlatform === 'mac') return 'option-left'
  if (key === 'option') return 'option-left'
  if (key === 'cmd') return 'command-left'
  if (key === 'shift') return 'shift-left'
  if (key === 'ctrl') return 'control'
  if (key === 'esc') return 'escape'
  if (key === 'delete' && sanitisedPlatform === 'mac') return 'backspace'
  if (specialKeys.includes(key)) return key // Easy way out


  // Whenever a user uses words instead of the characters
  if (key === 'comma') key = ','
  if (key === 'plus') key = '+'
  if (key === 'minus') key = '-'


  // Now we got the correct layout. Search for the thing!
  for (var id in map) {
    if (searchBy === 'key' && map[id].toLowerCase() === key) return id
    if (searchBy === 'id' && id.toLowerCase() === key) return map[id]
  }
}
