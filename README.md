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
``

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

### createApplication

创建应用实例

- 参数

  - ```typescript
    root: string = __dirname
    ``` 

