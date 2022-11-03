import os from 'os'
import cluster from 'cluster'

const runPrimaryProcess = () => {
    const numberWorkers = os.cpus().length * 2;

    for (let index = 0; index < numberWorkers; index++) {
        cluster.fork();
    }
}

const runWorkerProcess = async () => {
    await import('./server');
}

cluster.isPrimary ? runPrimaryProcess() : runWorkerProcess()