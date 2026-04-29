# 动森电波 / AC FM

基于现实时间和天气的动森音乐放送

Animal Crossing music aired on real time and weather

## 功能特点

- **时间联动**：24小时制，每小时对应一首BGM
- **天气联动**：根据实时天气播放晴天/雨天/雪天版本
- **实时天气**：获取位置信息，自动匹配当地天气
- **动态场景**：背景随时间段变化，包含星星、雨雪效果
- **双语支持**：支持中文和英文界面

## 在线体验

[GitHub Pages 链接]

## 本地开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 音频文件配置

项目需要BGM音频文件才能正常播放。请将音频文件放置在以下目录结构中：

```
public/audio/
├── sunny/          # 晴天BGM
│   ├── 00.mp3      # 0:00-1:00
│   ├── 01.mp3      # 1:00-2:00
│   ├── ...
│   └── 23.mp3      # 23:00-24:00
├── rainy/          # 雨天BGM
│   ├── 00.mp3
│   ├── ...
│   └── 23.mp3
└── snowy/          # 雪天BGM
    ├── 00.mp3
    ├── ...
    └── 23.mp3
```

## 技术栈

- Vue 3 + TypeScript
- Vite
- Pinia (状态管理)
- vue-i18n (国际化)
- Howler.js (音频播放)
- Open-Meteo API (天气数据)

## 项目结构

```
src/
├── components/     # Vue组件
│   ├── Scene.vue   # 场景背景
│   ├── Clock.vue   # 时钟显示
│   ├── Weather.vue # 天气切换
│   ├── Player.vue  # 播放控制器
│   ├── Settings.vue# 设置面板
│   └── RealtimeWeather.vue # 实时天气开关
├── composables/    # 组合式函数
│   ├── useTime.ts  # 时间处理
│   ├── useWeather.ts# 天气获取
│   ├── useAudio.ts # 音频播放
│   └── useLocation.ts# 地理定位
├── stores/         # Pinia状态管理
├── i18n/           # 国际化
├── styles/         # CSS变量
└── types/          # TypeScript类型
```

## License

MIT

## 致谢

灵感来源于《集合啦！动物森友会》(Animal Crossing: New Horizons)
