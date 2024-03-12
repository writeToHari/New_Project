import { existsSync, readFileSync } from 'node:fs';
import moment from 'moment';
import dataSchema from '../models/dataSchema.js';

export const insertFileData = async () => {
    const fileExists = existsSync('data.json');
    if (fileExists) {
        var jsonData = JSON.parse(readFileSync('data.json'));
        var currentDate = new Date().toISOString().split('T')[0]
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i]['time'] === moment().format('HH:mm') && currentDate === jsonData[i]['day']) {
                let prepareData = {
                    "message": jsonData[i]['message'],
                    "time": jsonData[i]['time'],
                    "day": jsonData[i]['day'],
                };
                await dataSchema.create(prepareData)

            }
        }

    }
}