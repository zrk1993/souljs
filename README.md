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

1. 路由处理@Render返回视图

```typescript controller/user.ts
@Controller('/user')
@Use(Auth())
export default class User {

  @Get()
  @Render('user')
  index() {
    return { content: 'hi' };
  }
}
```


2. 路由处理返回数据

```typescript controller/user.ts
@Controller('/user')
export default class User {

  @Post('/chname')
  changeName() {
    return ‘hello world’;
  }
}
```


3. 路由请求参数验证

```typescript controller/user.ts
@Controller('/user')
export default class User {

  @Post('/add_user')
  @BodySchame(joi.object().keys({
    name: joi.string().required()
  }))
  changeName(@Body() body: any) {
    return body.name;
  }
}
```

## API

### createApplication

创建应用实例

- 参数

  - ```typescript root: string = __dirname ``` 

