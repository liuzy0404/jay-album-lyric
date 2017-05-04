import fs from 'fs'
import readline from 'readline'
import { albumApi } from './albumApi'
import { getSongListByAlbumId } from './request'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let albumChooselist = ""
for (let album of albumApi) {
  albumChooselist += '[' + album['id'] + ']' + ' - ' + album['album_name'] + '\n'
}
albumChooselist += 'You want to get album : '

const albumKey = []
for (let album of albumApi) {
  albumKey.push(album['id'])
}

const checkAlbumId = (id) => {
  id = Number(id)
  if (!Number.isInteger(id) || albumKey.indexOf(id) < 0) return false
  return true
}

const fsExistsSync = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false
  }
  return true
}

rl.question(albumChooselist, (id) => {
  const fn = (id) => {
    if (!checkAlbumId(id)) {
      // rechoose
      rl.question('Choose a correct album: ', (input) => {
        fn(input)
      })
    } else {
      // fetch
      let albumName, albumId
      for (let album of albumApi) {
        if (album['id'] == id) {
          albumName = album['album_name']
          albumId = album['album_id']
        }
      }
      !fsExistsSync(albumName) && fs.mkdirSync(albumName)
      // begin request
      console.log('Waiting \u{1F603}')
      getSongListByAlbumId(albumId, albumName, rl)
    }
  }
  fn(id)
})