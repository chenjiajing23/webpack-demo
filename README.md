# react-template-pc react 项目模板

## 项目运行

```shell
git clone git@github.com:chenjiajing23/react-template-pc.git

cd react-template-pc

yarn

npm run dev

```

## 目标功能

- [x] 支持 typescript 的写法
- [x] antd 按需加载功能
- [x] git 检测功能
- [x] 热更新功能
- [x] less 模块化支持
- [x] webpack 缓存功能
- [x] apis 多 api 功能
- [x] mock 数据
- [ ] upload 上传到 cdn 功能

## 发布

#### 提交版本

1. 修订版本号：patch 不定时会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）列：`1.0.0 -> 1.0.1`。

```shell
npm run patch
```

2. 次版本号：minor 一个 feature 或多个 feature 同时发布,列：`1.0.0 -> 1.1.0`。

```shell
npm run minor
```

3. 主版本号：major 含有破坏性更新和新特性，不在发布周期内，列：`1.0.0 -> 2.0.0`。

```shell
npm run major
```

#### 发布到 npm

```shell
npm run pub
```
