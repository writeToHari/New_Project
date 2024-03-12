import app from './index.js';
import { createServer } from 'http';
const server = createServer(app);
const port = process.env.PORT;

// run the server locally
server.listen(port, error => {
    if (error)
        console.error(error.toString());
    else
        console.log(`Server listening at port ${port}`);
});
