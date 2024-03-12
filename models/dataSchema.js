import { Schema, model } from 'mongoose';

const dataSchema = new Schema({
    message: {
        type: String,
        default: ""
    },
    time: {
        type: String,
        default: ""
    },
    day: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
});

export default model('time_data', dataSchema);