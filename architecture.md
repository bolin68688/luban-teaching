# Architecture — 鲁班教学大师

## 技术栈

| 层级 | 技术 | 选型理由 |
|------|------|----------|
| 前端框架 | React 18 + Vite | 组件化、ESM、构建快 |
| 3D渲染 | Three.js | WebGL 3D可视化，支持交互 |
| 数学计算 | Math.js | 精确符号计算，避免浮点误差 |
| 动画 | GSAP | 高性能补间，精确控制 |
| 样式 | 原生CSS + CSS变量 | 轻量、主题切换简单 |
| 图标 | Lucide React | 赛事规范要求的图标库 |

## 目录结构

```
luBan-teaching/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # 顶部导航
│   │   │   ├── TabBar.jsx       # 三板块标签
│   │   │   └── Panel.jsx        # 右侧展开面板
│   │   ├── visualizations/
│   │   │   ├── LeverSim.jsx     # 杠杆原理3D
│   │   │   ├── RefractionSim.jsx # 光的折射
│   │   │   ├── EquationSim.jsx  # 方程组
│   │   │   └── PeriodicTable.jsx # 元素周期表
│   │   ├── ui/
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Slider.jsx
│   │   └── cases/
│   │       ├── CasePage.jsx     # 案例详情页
│   │       └── CaseCard.jsx     # 案例卡片
│   ├── data/
│   │   └── cases.js             # 案例数据
│   ├── styles/
│   │   ├── theme.css            # 色彩变量
│   │   ├── fonts.css            # 字体栈
│   │   └── animations.css       # 动效
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── models/                   # 3D模型（如有）
├── index.html
├── package.json
└── vite.config.js
```

## 数据流

```
用户操作（拖拽滑块）
    ↓
React State 更新（useState）
    ↓
计算函数（Math.js 精确计算）
    ↓
Three.js 场景更新（requestAnimationFrame）
    ↓
UI 面板实时显示（参数刷新）
```

## 降级方案

- Three.js CDN引入 → 本地node_modules
- Math.js计算 → 原生JS Math（精度降级但可运行）
- GSAP动画 → CSS transition降级
