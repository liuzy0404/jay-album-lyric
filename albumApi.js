/*
 * liuzy <mostic1122@gmail.com>
 * MIT Licensed
 */

import fs from 'fs'
const albumApi = JSON.parse(fs.readFileSync('./album.json', 'utf8'))
export { albumApi }