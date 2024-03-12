import express, { urlencoded, json } from 'express';
import pkg from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import cron from 'node-cron'
import dotenv from "dotenv"
import { codes, database } from './config/index.js';
import routes from './routes/index.js';
import { insertFileData } from './cron_job/insertDataBasedonTime.js';
import { cpuUsage } from './cron_job/trackRealTimeCpu.js';


const app = express();

const { set, connect, connection } = pkg;
dotenv.config()

app.use(cors());
app.options('*', cors());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
// app.use(compression());
app.use(helmet());

app.use('/api', routes);

// handle 404 error
app.use(function (req, res, next) {
    return res.status(codes.HttpStatusCode.NOT_FOUND).send({
        error: codes.ErrorCodes[1002].message,
        statusCode: codes.ErrorCodes[1002].code,
    });
});



// Mongoose connection
set('debug', true);
set('runValidators', true);
connect(database.path, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const conSuccess = connection
conSuccess.once('open', _ => {
    console.log('Database connected:', database.path)
})

conSuccess.on('error', err => {
    console.error('connection error:', err)
})


/*
At every minute run this cron
In the cron running two functionality

1. insertFileData : Based on Date and Time Inserting Data on the Database
2. cpuUsage: CPU Usage goes more than equal to 70 percentage. it's automatically restart the server.
*/
cron.schedule('* * * * *', () => {
    console.log('Cron Running')
    insertFileData();
    cpuUsage();
});
export default app;

