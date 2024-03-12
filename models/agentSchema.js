import { Schema, model } from 'mongoose';

const agentSchema = new Schema({
    agent_name: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
});

export default model('agent', agentSchema);