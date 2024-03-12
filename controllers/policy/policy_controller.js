import { codes } from '../../config/index.js';
import { existsSync, mkdirSync, realpathSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'path';
import pkg from 'xlsx';
import * as services from "../../services/index.js"
const { readFile, utils } = pkg;


export const readData = async (req, res) => {
    try {
        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        sampleFile = req.files.file;
        const __dirname = path.dirname("");
        console.log('directory-name', __dirname);
        console.log('uploadPath', uploadPath)
        uploadPath = __dirname
        // to chek if the folder is created or not
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
        }
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath + '/tmp/' + sampleFile.name, async function (err) {
            if (err)
                return res.status(500).send(err);
            const data = await excelTojson(sampleFile.name);
            await services.insertPolicyDetails(data, res);
        });


    }
    catch (err) {
        return res.status(codes.HttpStatusCode.INTERNAL_SERVER).send({ message: err.message });
    }
}

export const getPolicyInfo = async (req, res) => {
    try {
        const { username } = req.query
        const result = await services.searchPolicyDetails(username)
        if (result.length === 0) {
            res.status(codes.HttpStatusCode.NOT_FOUND).send({
                error: codes.ErrorCodes[1002].message,
                statusCode: codes.ErrorCodes[1002].code,
            });
        } else {
            res.status(codes.HttpStatusCode.OK).send({ "data": result })
        }
    } catch (error) {
        console.log('error', error.message)
    }
}

export const setFileData = async (req, res) => {
    const { message, day, time } = req.body;
    if (typeof message === 'undefined' || typeof day === 'undefined' || typeof time === 'undefined') {
        res.status(codes.HttpStatusCode.BAD_REQUEST).send({
            error: "Invalid Body",
            message: "Body Should Be this format {message: Inserting Data, time:19:16, day:2023-03-11 }",
            statusCode: codes.ErrorCodes[1001].code,
        });
    } else if (!codes.TimeRegex.test(time)) {
        res.status(codes.HttpStatusCode.BAD_REQUEST).send({
            error: "Time Should Be 24 hours Format",
            statusCode: codes.ErrorCodes[1001].code,
        });
    } else {
        return await services.saveFileData(req.body, res)
    }
}


async function excelTojson(filename) {
    try {
        const path = process.cwd() + '\\tmp\\' + filename;
        const filePath = realpathSync(path, { encoding: 'utf8' });
        const workbook = readFile(filePath, { cellDates: true });
        let workbook_sheet = workbook.SheetNames;
        let workbook_response = utils.sheet_to_json(workbook.Sheets[workbook_sheet[0]]);
        return workbook_response;

    } catch (err) {
        console.log(err);
        throw new Error(err)
    }
}