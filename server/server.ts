import express, {Application, Request, Response} from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import BaseRouter from './routes';

// Init express
const app: Application = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('client/dist'));


app.use('/api', BaseRouter);

// Export express instance
export default app;