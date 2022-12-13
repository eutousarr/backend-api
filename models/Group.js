const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const groupSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },        
        numero: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

groupSchema.plugin(AutoIncrement, {
    inc_field: 'numero',
    id: 'groupNum',
    start_seq: 1
})


module.exports = mongoose.model('Group', groupSchema)