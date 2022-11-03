import cluster from 'cluster';
import { cpus } from 'os';
import process from 'process';


const runPrimaryProcess = () => {
    const numberWorkers = cpus().length * 2;
    console.log(`Primary ${process.pid} is running`);

    for (let index = 0; index < numberWorkers; index++)
    cluster.fork();
}

const runWorkerProcess = async () => {
    await import('./server');
}

cluster.isWorker ? runWorkerProcess() : runPrimaryProcess()