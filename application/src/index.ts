import express, {type Application} from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';

import routes from '@routes/.';
import {basicAuthMiddleware} from '@modules/authentication';

const app: Application = express();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

app.use(basicAuthMiddleware);

app.use('/', routes);

app.get('/health', (req, res) => {
	res.send('OK');
});

app.listen(process.env.PORT || 80, () => {
	console.log(`Server is running on port ${process.env.PORT || 80}`);
});
