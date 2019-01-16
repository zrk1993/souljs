import * as http from 'http';
import { Application, ApplicationOptions } from './application';

export async function createApplication(options: ApplicationOptions): Promise<Application> {
    return new Application(options);
}