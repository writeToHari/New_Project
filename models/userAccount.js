import { Schema, model } from 'mongoose';

const userAccountSchema = new Schema({
    account_name: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
});

export default model('users_account', userAccountSchema);