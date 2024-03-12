import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    first_name: {
        type: String,
        default: ""
    },
    date_of_birth: {
        type: String,
        default: ""
    },
    phone_number: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    zip_code: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    user_type: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
});

export default model('user_data', userSchema);