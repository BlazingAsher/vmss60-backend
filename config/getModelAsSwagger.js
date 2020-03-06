const mongoose = require('mongoose');
const m2s = require('mongoose-to-swagger');
const Item = require('../models/Item');

console.log(m2s(Item))