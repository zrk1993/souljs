export class ResultUtils {
    static ok(message?: string) : any
    static ok(message?: string, data?: Object) {
        return {code: 200, message: '', data};
    }
}