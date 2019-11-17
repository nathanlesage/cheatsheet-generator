/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Build script for generating a cheatsheet
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     This file is run when the "build" script
 *                  is executed from Yarn or NPM. It builds
 *                  a standalone HTML file using the assets
 *                  and the config.yml in the root directory.
 *
 * END HEADER
 */

const YAML = require('yaml')
const fs = require('fs').promises
const path = require('path')
const sanitizeFilename = require('sanitize-filename')

async function runBuild () {
  // At this point, we can be sure that webpack has had a run, so our index.js resides in "intermediary".
  // Read in the config and parse it
  let config = await fs.readFile(path.resolve(__dirname, '../config.yml'), 'utf8')
  config = YAML.parse(config)

  // Then read in all additional files that we need
  let template = await fs.readFile(path.resolve(__dirname, '../assets/template.htm'), 'utf8')
  let style = await fs.readFile(path.resolve(__dirname, '../assets/app.css'), 'utf8')
  let keyboard_mac = await fs.readFile(path.resolve(__dirname, '../assets/mac-kbd.svg'), 'utf8')
  let keyboard_surface = await fs.readFile(path.resolve(__dirname, '../assets/surface-kbd.svg'), 'utf8')
  let script = await fs.readFile(path.resolve(__dirname, '../intermediary/index.js'), 'utf8')

  // Read and parse the layout map for nicer formatted names
  let layoutMap = await fs.readFile(path.resolve(__dirname, '../layouts/layout_map.yml'), 'utf8')
  layoutMap = YAML.parse(layoutMap)
  let layoutNames = []
  for (let i in layoutMap) {
    layoutNames.push({ 'bcp47': i, 'long': layoutMap[i] })
  }

  // Afterwards correctly map the layout names
  layoutNames = layoutNames.map(e => `<option value="${e.bcp47}">${e.long}</option>`).join('\n')

  // Now, read in all available keyboard layouts for both platforms
  let layouts = {}
  for (let filename of await fs.readdir(path.resolve(__dirname, '../layouts'))) {
    if (filename === 'layout_map.yml') continue // Don't accidentally parse the map
    let file = await fs.readFile(path.resolve(__dirname, '../layouts', filename), 'utf8')
    file = YAML.parse(file)
    let keys = filename.split('.') // key[0] is the platform, key[1] is the layout
    if (!layouts.hasOwnProperty(keys[0])) layouts[keys[0]] = {}
    layouts[keys[0]][keys[1]] = file
  }

  // Finish by writing out the resulting file
  try {
    await fs.stat(path.resolve(__dirname, '../dist'))
  } catch (err) {
    await fs.mkdir(path.resolve(__dirname, '../dist'))
  }

  // Replace all those pesky variables
  template = template.replace(/\$style\$/g, '<style>\n' + style + '\n</style>')
  template = template.replace(/\$title\$/g, config.title)
  template = template.replace(/\$keyboard_mac\$/g, keyboard_mac)
  template = template.replace(/\$keyboard_surface\$/g, keyboard_surface)
  template = template.replace(/\$layout_options\$/g, layoutNames)
  template = template.replace(/\$script\$/g, `<script>${script}</script>`)
  template = template.replace(/\$data\$/g, `<script>var shortcuts = ${JSON.stringify(config.shortcuts)}\nvar keymaps = ${JSON.stringify(layouts)}</script>`)

  await fs.writeFile(path.resolve(__dirname, '../dist/', sanitizeFilename(config.title) + '.htm'), template)
}

// Call the build function
runBuild().then(() => {
  console.log('Build complete.')
}).catch((err) => {
  console.error(err)
  console.error('Build unsuccessful!')
})
