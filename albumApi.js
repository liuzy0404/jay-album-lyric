import fs from 'fs'
const albumApi = JSON.parse(fs.readFileSync('./album.json', 'utf8'))
export { albumApi }