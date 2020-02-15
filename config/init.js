require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const fs = require('fs');
const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));

mongoose.connect(process.env.DB || 'mongodb://localhost:27017/vmss60-backend').catch(error => {
    console.log(error)
});

for (const item in items) {
    let name = items[item]['name'];
    let description = items[item]['description'];
    let image = items[item]['image'];
    let price = items[item]['price'];
    addItem(name, description, image, price)
}

function addItem(name, description, image, price) {
    Item.create({
        name: name,
        description: description,
        image: image,
        price: price
    }, (err, itemNew) => {
        if (err) throw err
        console.log(itemNew.name + ' added')
    })
}