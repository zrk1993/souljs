# souljs
A nodejs framework for building concise and decorative applications written by typescript

## 安装

``` bash
git clone https://github.com/my-soul/souljs-starter.git

npm install && npm run start
```
Node.js >= 8.0.0 required.

## 快速开始

创建应用实例

```typescript main.ts
import { createApplication } from 'souljs';

async function main() {
  const app = await createApplication(__dirname, 'controller/*.ts');

  app.listen(8080);
}

main();
```

路由处理

```typescript controller/user.ts
@Controller('/user')
@ApiUseTags('user')
@ApiDescription('用户信息')
@Use(Auth())
export default class User {

  @Get()
  @ApiDescription('用户首页')
  @Render('user')
  index() {
    return { content: 'hi' };
  }

  @Post('/chname')
  @BodySchame(joi.object().keys({
    name: joi.string().required()
  }))
  changeName(@Body() body: any) {
    return ResultUtils.ok(body.name);
  }
}
```

## API

### createApplication

创建应用实例

- 参数

  - ```typescript root: string = __dirname ``` 

