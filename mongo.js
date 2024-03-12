const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://gabe:${password}@cluster0.xdlnqfc.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: name,
  number: number,
})

if (!name && !number) {
  Contact.find().then(result => {
    console.log(result)
    mongoose.connection.close()
  })

} else {
  contact.save().then(result => {
    console.log(`added ${name} number: ${number} to the phonebook`)
    mongoose.connection.close()
  })
}

