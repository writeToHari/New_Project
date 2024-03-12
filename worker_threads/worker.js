import pkg from 'worker_threads'
import mongoDBpkg from 'mongoose';
import dotenv from "dotenv"
import { database } from '../config/index.js';
import userSchema from '../models/userSchema.js'
import userAccountSchema from "../models/userAccount.js"
import agentSchema from "../models/agentSchema.js"
import policyCategorySchema from "../models/policyCategorySchema.js"
import policyCarrierSchema from "../models/policyCarrierSchema.js"
import policyInfoSchema from "../models/policyInfoSchema.js"
const { parentPort } = pkg
const { set, connect, connection } = mongoDBpkg;
dotenv.config()


parentPort.on("message", incoming => {
    const { status, data } = incoming;

    if (status === "connect") {
        set('debug', true);
        set('runValidators', true);
        connect(database.path, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const conSuccess = connection

        conSuccess.once('open', async () => {
            console.log('Database connected2:', database.path)
            parentPort.postMessage({ status: "established" })

        })

        conSuccess.on('error', err => {
            console.error('connection error:', err)
        })
    }

    if (status === 'save') {
        saveData(data)
    }

})

async function saveData(data) {

    for (let i = 0; i < data.length; i++) {

        let prepareUserData = {
            "first_name": data[i]['firstname'] ? data[i]['firstname'] : "",
            "date_of_birth": data[i]['dob'] ? data[i]['dob'] : "",
            "address": data[i]['address'] ? data[i]['address'] : "",
            "phone_number": data[i]['phone'] ? data[i]['phone'] : "",
            "state": data[i]['state'] ? data[i]['state'] : "",
            "zip_code": data[i]['zip'] ? data[i]['zip'] : "",
            "email": data[i]['email'] ? data[i]['email'] : "",
            "gender": data[i]['gender'] ? data[i]['gender'] : "",
            "user_type": data[i]['userType'] ? data[i]['userType'] : "",
        }
        console.log('prepareUserData', prepareUserData)

        const userCreation = await userSchema.create(prepareUserData)

        let prepareUserAccountData = {
            "account_name": data[i]['account_name'] ? data[i]['account_name'] : ""
        }

        const userAccountCreation = await userAccountSchema.create(prepareUserAccountData)

        let prepareAgentData = {
            "agent_name": data[i]['agent'] ? data[i]['agent'] : ""
        }

        const agentCreation = await agentSchema.create(prepareAgentData)

        let preparePolicyCategoryData = {
            "category_name": data[i]['category_name'] ? data[i]['category_name'] : ""
        }

        const categoryCreation = await policyCategorySchema.create(preparePolicyCategoryData)

        let preparePolicyCarrierSchema = {
            "company_name": data[i]['company_name'] ? data[i]['company_name'] : ""
        }

        const carrierCreation = await policyCarrierSchema.create(preparePolicyCarrierSchema)

        let preparePolicyInfoSchema = {
            "policy_number": data[i]['policy_number'] ? data[i]['policy_number'] : "",
            "policy_start_Date": data[i]['policy_start_date'] ? data[i]['policy_start_date'] : "",
            "policy_end_Date": data[i]['policy_end_date'] ? data[i]['policy_end_date'] : "",
            "policy_category": categoryCreation._id,
            "collection_id": Math.random().toString(36).slice(2),
            "company_collection_id": carrierCreation._id,
            "user_id": userCreation._id
        }

        const policyInfoCreation = await policyInfoSchema.create(preparePolicyInfoSchema)

    }
    parentPort.postMessage({ status: "Inserted Successfully" })

}