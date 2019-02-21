import * as cluster from 'cluster';

export function isPM2Master(): boolean {
  return parseInt(process.env.INSTANCE_ID) === 0;
}

/**
 * 当前进程是否主进程
 */
export default function isMaster(): boolean {
  return cluster.isMaster || isPM2Master();
}