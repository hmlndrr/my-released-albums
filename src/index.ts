import 'core-js/actual'
import fs from 'fs'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import * as path from 'path'

const app = express()

app.use(json())
app.use(cors())

app.get('/', async (rq, rs) => {
  try {
    const q = (rq.query.q || '')
      .toString()
      .replaceAll('..', '')
      .split('')
      .filter(c => c.charCodeAt(0) > 0)
      .join('')

    const base = path.join(__dirname, '../songs/released/', q)

    try {
      if (rq.query.q) {
        const song = await fs.readFileSync(base)
        return rs.send(song)
      }
    } catch {}

    try {
      const list = fs.readdirSync(base)
      const response = `
      <h1> Songs:  </h1>
      <ul>
      ${list
        .map(
          song => `
                <li> 
                <a href="/?q=${song}" >${song}</a>
                </li>`
        )
        .join('')}
                </ul>
                `
      return rs.send(response)
    } catch {}

    return rs.send('idk')
  } catch (e) {
    console.log(e)
    return rs.send('idk')
  }
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
