import { Schema, model } from 'mongoose';

const policyCarrierSchema = new Schema({
    company_name: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
});

export default model('policy_carrier', policyCarrierSchema);