[English](./README.md) | [简体中文](./README.zh-CN.md)

# Page Watchdog：页面脚本动态监控引擎

Page Watchdog 是一款专为现代 Web 应用设计的轻量级脚本监控引擎。它通过高效的轮询机制，实时感知页面脚本的动态变化，并以事件驱动的方式通知应用，从而实现诸如热重载、版本更新提示等高级功能。项目采用纯 TypeScript 构建，确保了卓越的类型安全与开发体验。

## 核心优势

- 🚀 **零依赖，纯粹原生**：不引入任何第三方库，确保极致轻量与纯净，无潜在的依赖冲突风险。
- 🛡️ **全方位类型安全**：基于 TypeScript 的严格类型定义，赋能开发者在编译阶段规避潜在错误，提升代码健壮性。
- ✨ **现代化异步架构**：深度集成 `async/await`，提供声明式、非阻塞的编程范式，让异步流程控制如同步代码般优雅。
- 📦 **极简设计哲学**：API 设计遵循最小化原则，接口直观易用，开发者可以零成本快速集成。

## 快速上手

### 方式一：通过 npm 集成 (推荐)

在采用 Vite、Webpack 等构建工具的项目中，你可以通过 npm 安装并导入本库。

```bash
npm install page-watchdog
```

```typescript
import PageWatcher from 'page-watchdog';

async function bootstrapWatcher() {
  try {
    const watcher = await PageWatcher.create({ timer: 5000 });

    watcher.on('update', () => {
      console.log('检测到应用更新，正在执行刷新操作...');
      window.location.reload();
    });

    // ... 其他事件监听

  } catch (e) {
    console.error('Page Watchdog 初始化失败:', e);
  }
}

bootstrapWatcher();
```

### 方式二：在浏览器中直接使用 (通过 CDN)

你也可以通过 CDN 直接在 HTML 页面中引入并使用 Page Watchdog。

```html
<script src="https://cdn.jsdelivr.net/npm/page-watchdog@latest/dist/page-watchdog.umd.min.js"></script>
<script>
  (async () => {
    try {
      // UMD 包会创建一个全局变量 window.PageWatcher
      const watcher = await window.PageWatcher.create({ timer: 5000 });

      watcher.on('update', () => {
        console.log('检测到应用更新，正在执行刷新操作...');
        window.location.reload();
      });

      console.log('Page Watchdog 监控服务已成功启动。');

    } catch (e) {
      console.error('Page Watchdog 初始化失败:', e);
    }
  })();
</script>
```

## API 参考

### `PageWatcher.create(options?)`

静态工厂方法，用于异步创建并初始化 `PageWatcher` 实例。此方法返回一个 `Promise`，其解析值为一个可用的 `watcher` 对象。

- `options` (可选): 配置对象。
  - `timer` (number): 轮询控制器检查更新的周期（单位：毫秒）。**默认值**: `10000`。
  - `disableCache` (boolean): 决定是否禁用浏览器对页面抓取的缓存。默认情况下，每次抓取请求都会附加一个时间戳以防止缓存。如果需要允许浏览器缓存响应，请将此项设置为 `false`。**默认值**: `true`。

### `watcher.on(event, listener)`

注册事件监听器，以响应监视器的生命周期事件。

- `event`: 事件名称，可选项如下：
  - `'update'`: 当检测到页面脚本集合发生变更时触发。
  - `'no-update'`: 在一个轮询周期内未检测到任何变更时触发。
  - `'error'`: 在初始化或轮询过程中发生错误时触发。监听器回调将接收一个 `Error` 对象。

### `watcher.stop()`

终止监视器的轮询活动，并释放相关资源。建议在组件卸载或页面关闭前调用此方法，以防止内存泄漏。
