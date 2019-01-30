export class ResultUtils {
  static ok(msgOrData?: any): object;
  static ok(msgOrData?: any, data?: object): object {
    if (data !== undefined || typeof msgOrData === 'string') {
      return { code: 200, message: msgOrData, data };
    }
    return { code: 200, message: '', data: msgOrData || {} };
  }
}
