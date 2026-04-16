# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Stylesheet (`<link rel="stylesheet">`) change detection.
- `off()` method for removing event listeners.
- GitHub Actions CI (Node 18/20/22).
- `CHANGELOG.md`.

### Fixed
- Multiline inline scripts were not detected (parser regex missing `s` flag).
- Concurrent polling overlap when network is slow (switched from `setInterval` to recursive `setTimeout`).
- `timer: 0` was ignored due to `||` fallback (changed to `??`).

### Changed
- Rewrote README (EN & CN) — clearer API docs, less marketing fluff.

## [1.2.3] - 2024-10-23

### Fixed
- Reorder `package.json` exports to fix bundler warnings.
- Move UMD example to root `examples/` directory.

## [1.2.2] - 2024-10-23

### Fixed
- React TypeScript example API usage.

## [1.2.1] - 2024-10-23

### Fixed
- Preserve class name in minified UMD bundle.

## [1.2.0] - 2024-10-23

### Added
- `disableCache` option.
- Multi-format build output (CJS, ESM, UMD, UMD minified).
- Default export for UMD and direct script usage.

### Changed
- Modernized build system with Rollup.
- Refined types, function names, and event names.

## [1.1.0] - 2024-10-23

### Changed
- Adjusted Rollup config and export structure.

## [1.0.0] - 2024-10-23

### Added
- Core page script monitoring functionality.
- Event-driven API (`changed`, `unchanged`, `error`).
- Async factory method `PageWatcher.create()`.
- TypeScript support with full type safety.
- Zero runtime dependencies.
