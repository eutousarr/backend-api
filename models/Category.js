const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const categorySchema = new mongoose.Schema(
    {       
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }, 
        numero: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true 
        },
        completed: {
            type: Boolean,
            default: false
        },
        validedBy: {
            type: String,
            required: true,
            default: 'Personne'
        }, 
    },
    {
        timestamps: true
    }
)

categorySchema.plugin(AutoIncrement, {
    inc_field: 'code',
    id: 'codeNums',
    start_seq: 110
})

module.exports = mongoose.model('Category', categorySchema)