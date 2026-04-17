# 鲁班教学大师 · K12理科可视化

> 以器载道，以物明理 —— 将春秋末期顶尖工匠鲁班的科学思想融入K12理科教育

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Three.js](https://img.shields.io/badge/Three.js-r170-orange)

## 项目简介

鲁班教学大师是一个开源的K12理科可视化教育工具，通过交互式3D实验让数学、物理、化学、科学知识点"看得见、摸得着、用得上"。

每个知识点包含三大板块：
- **鲁班心法**：核心理论 + 生活场景应用
- **鲁班开物**：交互式实验控件 + 实时参数
- **鲁班问答**：5道精选练习题 + 详细解析

## 设计特色

- **墨韵黑金**配色体系：深色墨黑背景 + 暖金色点缀
- **榫卯暗纹**装饰元素：传统工艺与现代科技的融合
- **Dark/Light**双模式切换
- **全屏沉浸**式3D实验

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 + Vite |
| 3D渲染 | Three.js |
| 动画 | GSAP |
| 样式 | CSS Variables |
| 图标 | Lucide React |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

## 已上线知识点

| 知识点 | 学科 | 年级 |
|--------|------|------|
| 杠杆原理 | 物理·力学 | 八年级 |
| 光的折射 | 物理·光学 | 八年级 |
| 二元一次方程组 | 数学·代数 | 七年级 |
| 元素周期表 | 化学·原子结构 | 九年级 |

## 项目结构

```
src/
├── components/
│   ├── cases/           # 页面组件
│   │   ├── HomePage.jsx
│   │   └── CasePage.jsx
│   └── visualizations/  # 3D可视化
│       └── LeverVisualization.jsx
├── data/
│   └── cases.js          # 案例数据
└── styles/
    └── theme.css         # 设计系统
```

## 设计规范

### 色彩体系

| 模式 | 背景色 | 强调色 |
|------|--------|--------|
| Dark | `#1A1A2E` | `#C9A227` |
| Light | `#FAF8F5` | `#B8860B` |

### 字体

- 标题：ZCOOL QingKe HuangYou
- 正文：Noto Serif SC
- 数据/公式：JetBrains Mono

## Roadmap

- [ ] 完成4个知识点的3D可视化
- [ ] 添加更多知识点覆盖
- [ ] 开发Skill封装包
- [ ] 完善题库系统

## License

MIT License - 欢迎开源贡献
