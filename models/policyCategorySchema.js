import { Schema, model } from 'mongoose';

const policyCategorySchema = new Schema({
    category_name: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
});

export default model('policy_category', policyCategorySchema);