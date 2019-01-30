# souljs
A nodejs framework for building concise and decorative applications written by typescript

## 安装

``` bash
git clone https://github.com/my-soul/souljs-starter.git

npm install && npm run start
```
Node.js >= 8.0.0 required.

## 快速开始

#### 创建应用实例

```typescript main.ts
import { createApplication } from 'souljs';

async function main() {
  const app = await createApplication(__dirname, 'controller/*.ts');

  app.listen(8080);
}

main();
```

#### 路由处理并返回数据

```typescript controller/user.ts
@Controller('/user')
export default class User {

  @Post('/chname')
  changeName() {
    return ‘hello world’;
  }
}
```

#### 通过@Render返回视图

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


#### 请求参数验证

```typescript
@Controller('/user')
export default class User {

  @Post('/chname')
  @QuerySchame(joi.object().keys({
    id: joi.string()
  }))
  @BodySchame(joi.object().keys({
    name: joi.string().required()
  }))
  changeName(@Body() body: any, @Query() query: any) {
    return ResultUtils.ok(body);
  }
}

```

#### 接口描述

```typescript
@Controller('/user')
@ApiUseTags('user')
@ApiDescription('用户信息')
export default class User {

  @Post('/hi')
  @ApiDescription('test')
  test() {}
}

```

## API

### createApplication(root, controllers, options): Application

- 参数
  - { string } root - 项目路径
  - { string | controller[] } controllers - 控制器的目录位置，或者是控制器类的数组
  - { ApplicationOptions }  options - 参考如下ApplicationOptions

  ```typescript
    nterface ApplicationOptions {
      staticAssets?: { root: string; prefix?: string } | boolean; // 静态资源
      swagger?: { url: string; prefix?: string } | boolean; // swagger-ui
      bodyparser?: Bodyparser.Options | boolean;
      session?: KoaSession.opts | boolean;
      hbs?: { viewPath?: string } | boolean;
      helmet?: object | boolean; // 安全相关
    }
  ```
- 返回值：Application

### Application

实例方法

- use(mid: Koa.Middleware)

- listen(port: number)

- getKoaInstance(): Koa

- getHttpServer(): http.Server



