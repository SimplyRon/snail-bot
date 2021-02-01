import { Job } from "bullmq";
import { Worker, WorkerType } from "../interfaces/Worker"

export class CheckWorker extends Worker<string, string> {

    constructor() {
        super(WorkerType.workerCheck);
    }

    protected async processJob(job: Job<string, string>): Promise<string> {
        console.log("Worker checked");
        return 'true';
    }

}