import pkg from 'worker_threads'
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import moment from 'moment';
import dataSchema from '../../models/dataSchema.js';
import { codes } from '../../config/index.js';
import userSchema from '../../models/userSchema.js'
const { Worker } = pkg


const createWorker = async (data, res) => {
    // Implemented workers threads concept
    const worker = new Worker(new URL('../../worker_threads/index.js', import.meta.url))

    worker.postMessage({ status: 'connect' })

    worker.on("message", incoming => {
        const { status } = incoming

        console.log('status', status)
        if (status === 'established') {
            worker.postMessage({ status: 'save', data: data })
        }

        if (status === 'Inserted Successfully') {
            console.log("entered")
            res.status(codes.HttpStatusCode.CREATED).send("Data Inserted Successfully")
        }
    })

    worker.on("error", (error) => {
        res.status(codes.ErrorCodes[1003]).send(error.message)

    })

}

export const insertPolicyDetails = async (params, res) => {
    try {
        await createWorker(params, res)
    } catch (error) {
        console.log('Error', error)
    }
};

export const searchPolicyDetails = async (username) => {
    try {
        var dynamicQuery = [
            {
                $lookup: {
                    from: 'policy_infos',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'policy_info_result'
                }
            },
            {
                $unwind: {
                    path: '$policy_info_result',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'policy_categories',
                    localField:
                        'policy_info_result.policy_category',
                    foreignField: '_id',
                    as: 'policy_category_result'
                }
            },
            {
                $unwind: {
                    path: '$policy_category_result',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'policy_carriers',
                    localField:
                        'policy_info_result.company_collection_id',
                    foreignField: '_id',
                    as: 'policy_company_results'
                }
            },
            {
                $unwind: {
                    path: '$policy_company_results',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "first_name": 1,
                    "date_of_birth": 1,
                    "phone_number": 1,
                    "state": 1,
                    "zip_code": 1,
                    "email": 1,
                    "user_type": 1,
                    "policy_number": "$policy_info_result.policy_number",
                    "policy_start_Date": "$policy_info_result.policy_start_Date",
                    "policy_end_Date": "$policy_info_result.policy_end_Date",
                    "policy_category_name": "$policy_category_result.category_name",
                    "policy_company_name": "$policy_company_results.company_name"
                }

            }
        ]
        if (typeof username !== 'undefined' && username) {
            dynamicQuery.splice(0, 0, {
                $match: {
                    first_name: {
                        $regex: `^${username}`,
                        $options: 'i'
                    }
                }
            })
        }
        return await userSchema.aggregate(dynamicQuery);
    } catch (error) {
        console.log('Error', error)

    }

}
const saveCurrentData = async (body) => {
    var currentDate = new Date().toISOString().split('T')[0]
    if (body['time'] <= moment().format('HH:mm') && currentDate === body['day']) {
        let prepareData = {
            "message": body['message'],
            "time": body['time'],
            "day": body['day'],
        };
        await dataSchema.create(prepareData)
    }
}

export const saveFileData = async (body, res) => {
    const fileExists = existsSync('data.json');
    if (fileExists) {
        var previousValue = JSON.parse(readFileSync('data.json'));
        previousValue.push(body)
        writeFileSync('data.json', JSON.stringify(previousValue), 'utf8');
        saveCurrentData(body)
        res.status(codes.HttpStatusCode.CREATED).send("Data Inserted Successfully")
    } else {
        writeFileSync('data.json', JSON.stringify([body]), 'utf8');
        saveCurrentData(body)
        res.status(codes.HttpStatusCode.CREATED).send("Data Inserted Successfully")
    }

}