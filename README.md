# 🏏 鲁班教学大师 · LuBan Teaching Master

<div align="center">

![墨韵黑金](https://img.shields.io/badge/设计-墨韵黑金-C9A227?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r170-000000?style=for-the-badge&logo=three.js)
![MIT](https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge)

**以器载道，以物明理 —— 将春秋末期顶尖工匠鲁班的科学思想融入K12理科教育**

[在线演示](https://bolin68688.github.io/luban-teaching) · [项目文档](./SPEC.md) · [提交Issue](../../issues)

</div>

---

## ✨ 项目特色

### 🎯 三大教学板块

| 板块 | 说明 |
|------|------|
| **鲁班心法** | 核心理论 + 鲁班视角解读 + 生活场景应用 |
| **鲁班开物** | 交互式实验控件 + 实时参数计算 |
| **鲁班问答** | 5道精选练习题 + 逐题详细解析 |

### 🎨 设计系统

- **墨韵黑金**配色：深色墨黑背景 `#1A1A2E` + 暖金铜色 `#C9A227`
- **榫卯暗纹**：传统工艺元素融入现代科技界面
- **Dark/Light**双模式：点击右上角太阳/月亮图标切换
- **全屏沉浸模式**：按下 `F11` 或点击全屏按钮

---

## 📚 已上线知识点

| 知识点 | 学科 | 年级 | 可视化 |
|--------|------|------|--------|
| 杠杆原理 | 物理·力学 | 八年级 | 3D杠杆物理模拟 |
| 光的折射 | 物理·光学 | 八年级 | Canvas光路图 |
| 二元一次方程组 | 数学·代数 | 七年级 | 动态坐标系 |
| 元素周期表 | 化学·原子结构 | 九年级 | 交互元素展示 |

---

## 🚀 快速开始

### 本地运行

```bash
# 克隆项目
git clone https://github.com/bolin68688/luban-teaching.git
cd luban-teaching

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看效果

### 生产构建

```bash
npm run build
npm run preview  # 预览构建结果
```

---

## 🗂️ 项目结构

```
luban-teaching/
├── src/
│   ├── components/
│   │   ├── cases/
│   │   │   ├── HomePage.jsx      # 首页
│   │   │   └── CasePage.jsx      # 案例详情页
│   │   └── visualizations/        # 可视化组件
│   │       ├── LeverVisualization.jsx      # 杠杆原理
│   │       ├── RefractionVisualization.jsx # 光的折射
│   │       ├── EquationVisualization.jsx   # 方程组
│   │       └── PeriodicVisualization.jsx   # 元素周期表
│   ├── data/
│   │   └── cases.js              # 知识点数据
│   └── styles/
│       └── theme.css             # 墨韵黑金设计系统
├── SPEC.md                       # 完整开发规格书
├── prd.md                        # 产品需求文档
└── README.md
```

---

## 🎓 教育理念

> **鲁班五法**
> - **以用为本**：知识点服务于实际问题的解决
> - **观物取象**：通过可视化将抽象概念具象化
> - **度量有数**：精确的参数计算，培养数理思维
> - **器以载道**：工具只是载体，思维才是核心
> - **经世致用**：学以致用，连接课堂与生活

---

## 🔧 技术栈

| 领域 | 技术选型 |
|------|----------|
| 框架 | React 18 + Vite |
| 3D渲染 | Three.js |
| 动画 | GSAP |
| 数学计算 | Math.js |
| 样式 | CSS Variables + 榫卯暗纹 |
| 图标 | Lucide React |

---

## 📝 License

MIT License - 欢迎开源贡献与二次开发

---

<div align="center">

**Built with ❤️ by WorkBuddy + Claude**

</div>