[English](./README.md) | [简体中文](./README.zh-CN.md)

# Page Watchdog

一个简单、现代且类型安全的库，用于监视页面脚本更新。

## 特性

- 🚀 零依赖
- 🛡️ 完全类型安全的 API
- nowoczesny 现代的 `async/await` 架构
- 📦 轻量且简单

## 安装

```bash
npm install page-watchdog
```

## 使用方法

推荐在顶层 `async` 上下文中使用 Page Watchdog。

```typescript
import { PageWatcher } from 'page-watchdog';

async function initializeWatcher() {
  try {
    const watcher = await PageWatcher.create({ timer: 5000 });

    watcher.on('update', () => {
      console.log('页面有新的脚本！正在重新加载...');
      // 示例：强制重新加载以获取新内容
      window.location.reload();
    });

    watcher.on('no-update', () => {
      console.log('本次检查未发现更新。');
    });

    watcher.on('error', (err) => {
      // `err` 参数被自动类型化为 `Error`
      console.error('监视器遇到错误：', err.message);
      // 如果发生持续性错误，你可能需要停止监视器
      watcher.stop();
    });

    console.log('Page Watchdog 现已激活。');

  } catch (e) {
    console.error('初始化 Page Watchdog 失败：', e);
  }
}

initializeWatcher();
```

## API

### `PageWatcher.create(options?)`

创建并初始化一个新的 `PageWatcher` 实例。这是一个 `async` 方法，必须被 `await`。

- `options`: 一个可选的配置对象。
  - `timer` (number): 检查更新的间隔时间（毫秒）。默认为 `10000` (10 秒)。

### `watcher.on(event, listener)`

监听事件。

- `event`: 要监听的事件。可以是：
  - `'update'`: 当检测到脚本标签发生变化时触发。
  - `'no-update'`: 当未检测到变化时触发。
  - `'error'`: 在初始化或轮询期间发生错误时触发。监听器会收到一个 `Error` 对象。

### `watcher.stop()`

停止监视器轮询更新。当不再需要监视器时，调用此方法进行清理。
