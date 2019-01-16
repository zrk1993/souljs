import { Controller, Get } from '../../../index';

@Controller('/user')
export class User {

    @Get('/info')
    info() {
        console.log('hahah');
    }

}