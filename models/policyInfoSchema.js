import { Schema, model } from 'mongoose';

const policyInfoSchema = new Schema({
    policy_number: {
        type: String,
        default: ""
    },
    policy_start_Date: {
        type: Date,
        default: ""
    },
    policy_end_Date: {
        type: Date,
        default: ""
    },
    policy_category: {
        type: Schema.Types.ObjectId,
        ref: 'policy_category'
    },
    collection_id: {
        type: String,
        default: ""
    },
    company_collection_id: {
        type: Schema.Types.ObjectId,
        ref: 'policy_carrier'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    timestamps: true,
});

export default model('policy_info', policyInfoSchema);