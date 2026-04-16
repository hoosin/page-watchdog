[English](./README.md) | [简体中文](./README.zh-CN.md)

# Page Watchdog

轻量级页面资源监控库。通过轮询检测页面 `<script>` 和 `<link rel="stylesheet">` 标签的变化，适用于提示用户刷新页面、获取最新版本等场景。零依赖，TypeScript 编写。

## 特性

- 🚀 **零依赖**：纯原生实现，无任何第三方依赖。
- 🛡️ **类型安全**：完整的 TypeScript 类型支持。
- ✨ **现代异步**：基于 `async/await`，API 简洁直观。
- 📦 **轻量**：极小的体积，即装即用。

## 安装

```bash
npm install page-watchdog
```

## 使用

### 配合构建工具（Vite、Webpack 等）

```typescript
import PageWatcher from 'page-watchdog';

async function initializeWatcher() {
  try {
    const watcher = await PageWatcher.create({ timer: 5000 });

    watcher.on('changed', () => {
      console.log('检测到页面更新，即将刷新...');
      window.location.reload();
    });

    // ... 其他事件监听

  } catch (e) {
    console.error('Page Watchdog 初始化失败:', e);
  }
}

initializeWatcher();
```

### 在浏览器中直接使用（CDN）

```html
<script src="https://cdn.jsdelivr.net/npm/page-watchdog@latest/dist/page-watchdog.umd.min.js"></script>
<script>
  (async () => {
    try {
      const watcher = await window.PageWatcher.create({ timer: 5000 });

      watcher.on('changed', () => {
        console.log('检测到页面更新，即将刷新...');
        window.location.reload();
      });

      console.log('Page Watchdog 已启动。');

    } catch (e) {
      console.error('Page Watchdog 初始化失败:', e);
    }
  })();
</script>
```

## API 参考

### `PageWatcher.create(options?)`

异步创建并初始化 `PageWatcher` 实例。返回 `Promise<PageWatcher>`。

- `options`（可选）：配置对象。
  - `timer` (number)：轮询间隔，单位毫秒。**默认值**：`10000`。
  - `disableCache` (boolean)：是否禁用浏览器缓存。默认会在请求 URL 后附加时间戳，设为 `false` 可允许缓存。**默认值**：`true`。

### `watcher.on(event, listener)`

注册事件监听器。返回 watcher 实例，支持链式调用。

- `event`：事件名称。
  - `'changed'`：检测到脚本或样式表变化时触发。
  - `'unchanged'`：未检测到变化时触发。
  - `'error'`：发生错误时触发，回调参数为 `Error` 对象。
- `listener`：回调函数。

### `watcher.off(event, listener)`

移除事件监听器。返回 watcher 实例，支持链式调用。

- `event`：事件名称。
- `listener`：要移除的回调函数（必须与 `on()` 传入的是同一个引用）。

### `watcher.stop()`

停止轮询。不再需要监控时调用此方法释放资源。
