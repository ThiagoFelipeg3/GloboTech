import env from './configs/env';
import app from './configs/app';

app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port} process ${process.pid}`))