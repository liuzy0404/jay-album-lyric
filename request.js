import http from 'http'
import fs from 'fs'
import crypto from './Crypto'
import querystring from 'querystring'

const getLyricById = function (songId, songName, albumName) {
  let text = JSON.stringify({ id: songId, lv: 1 })
  let postBody = querystring.stringify(crypto.aesRsaEncrypt(text))

  let options = {
    hostname: 'music.163.com',
    port: 80,
    path: '/weapi/song/lyric?csrf_token=',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postBody)
    }
  }

  let req = http.request(options, (res) => {
    //console.log(`STATUS: ${res.statusCode}`);
    //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8')
    let lyricContent = ''
    res.on('data', (chunk) => lyricContent += chunk)
    res.on('end', () => {
      let lyric = JSON.parse(lyricContent)['lrc']['lyric']
      lyric = lyric.replace(/\[.*\]/g, '')
      fs.writeFile(albumName + '/' + songName + '.txt', lyric, (err) => {
        if (err) console.log(`err: ${err}`)
        console.log(`${songName} \u{2705}`)
      })
    });
  })
  req.write(postBody)
  req.end()
}

const getSongListByAlbumId = (albumId, albumName, rl) => {
  let api = "http://music.163.com/album?id=" + albumId; // jay album
  http.get(api, (res) => {
    res.setEncoding('utf8')
    let lyric = ""
    res.on('data', (chunk) => lyric += chunk)
    res.on('end', () => {
      let reg = /<textarea\s+style="display:none;">(.*)<\/textarea>/, matched, songList;
      matched = lyric.match(reg)
      if (matched && matched.length > 0) songList = matched[1]
      songList = JSON.parse(songList)

      for (let song of songList) {
        getLyricById(song['id'], song['name'], albumName)
      }
      rl.close()
    })
  })
}

export { getSongListByAlbumId }