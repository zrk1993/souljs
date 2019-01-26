export class ResultUtils {
  static ok(): Object;
  static ok(msgOrData: any): Object;
  static ok(msgOrData: any = '', data?: Object): Object {
    if (data !== undefined || typeof msgOrData === 'string') {
      return { code: 200, message: msgOrData, data };
    }
    return { code: 200, message: '', data: msgOrData || {} };
  }
}
