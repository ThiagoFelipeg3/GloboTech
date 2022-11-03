import env from './configs/env';
import app from './configs/app';
import dotenv from 'dotenv';

dotenv.config()

app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port} process ${process.pid}`))