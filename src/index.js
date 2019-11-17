/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Entry point
 * Maintainer:      Hendrik Erz <info@zettlr.com>
 * License:         GNU GPL v3
 *
 * Description:     Not all index files must be huge.
 *                  Why does this work? Precisely because
 *                  in Cheatsheet's constructor it'll listen
 *                  for the ready-event of the DOM to insert
 *                  the dynamics into the page. Access the
 *                  object using cheatsheet from within the
 *                  console.
 *
 * END HEADER
 */

import Cheatsheet from './cheatsheet.js'
var cheatsheet = new Cheatsheet()
