const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const matiereSchema = new mongoose.Schema(
    { 
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Group'
        },
        category: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },       
        numero: {type: Number},
        designation: {
            type: String,
            required: true
        },
        valdatedBy: {
            type: String,
            default: 'null'
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

matiereSchema.plugin(AutoIncrement, {
    inc_field: 'numero',
    id: 'matiere_seq',
    start_seq: 1,
    reference_fields: ['group', 'category']
})

module.exports = mongoose.model('Matiere', matiereSchema)