const mongoose = require('mongoose')

const OrgSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    featuredImage: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false
    },
    mission: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Org = mongoose.model('Org', OrgSchema)
module.exports = Org