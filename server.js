require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
  try{
      const short_url = await ShortUrl.findOne({short: req.params.shortUrl })

      if(short_url == null) return res.sendStatus(404)
  
      short_url.clicks++
      short_url.save()
  
      res.redirect(short_url.full)
  } catch (err) {
      console.log(err)
  }
})

app.listen(process.env.PORT || 3000);