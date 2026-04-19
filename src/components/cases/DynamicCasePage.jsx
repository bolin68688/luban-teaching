import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Maximize2, Minimize2, Sun, Moon, X, BookOpen, Sliders, HelpCircle, Sparkles } from 'lucide-react'

const TABS = [
  { id: 'xinfa', label: '鲁班心法', icon: BookOpen },
  { id: 'kaiwu', label: '鲁班开物', icon: Sliders },
  { id: 'wenda', label: '鲁班问答', icon: HelpCircle }
]

/* ═══════════════════════════════════════════════════════════
   专门知识点配置 —— 输入匹配到这些关键词时，展示专门可视化
   ═══════════════════════════════════════════════════════════ */
const TOPIC_PRESETS = {
  '牛顿第二定律': {
    subject: 'physics',
    label: '物理 · 力学',
    color: '#4ECDC4',
    theory: '牛顿第二定律：物体的加速度与所受合外力成正比，与质量成反比，方向与合外力方向相同。公式表达为 F = ma，其中 F 为合外力（N），m 为质量（kg），a 为加速度（m/s²）。',
    luBanView: '鲁班推重器，知力大则动速、质重则行缓。以恒力推一物，其速递增而不止——此乃F=ma之理也。匠人知此，则举重若轻。',
    scenarios: [
      { name: '汽车加速', desc: '油门提供牵引力，F=ma决定加速性能' },
      { name: '电梯升降', desc: '缆绳拉力与重力之差产生加速度' },
      { name: '火箭发射', desc: '推力大于重力时产生向上加速度' },
      { name: '滑雪下坡', desc: '重力分量提供沿斜面的加速度' }
    ],
    controls: [
      { type: 'slider', label: '拉力F', min: 0, max: 100, default: 50, step: 5, unit: 'N' },
      { type: 'slider', label: '质量m', min: 1, max: 20, default: 5, step: 1, unit: 'kg' },
      { type: 'slider', label: '摩擦系数μ', min: 0, max: 1, default: 0.2, step: 0.05 },
      { type: 'toggle', label: '显示受力分析', default: true },
      { type: 'toggle', label: '显示v-t图像', default: true }
    ],
    displayParams: [
      { key: 'acceleration', label: '加速度 a' },
      { key: 'velocity', label: '速度 v' },
      { key: 'displacement', label: '位移 x' },
      { key: 'netForce', label: '合外力 F合' }
    ],
    questions: [
      { question: '根据牛顿第二定律 F=ma，若质量不变，拉力加倍，则加速度如何变化？', options: ['A. 不变', 'B. 减半', 'C. 加倍', 'D. 变为4倍'], answer: 'C', explanation: '由 F=ma 可知，当质量m不变时，加速度a与外力F成正比。F加倍，a也加倍。' },
      { question: '在光滑水平面上，用10N的力推一个2kg的物体，其加速度为？', options: ['A. 2 m/s²', 'B. 5 m/s²', 'C. 10 m/s²', 'D. 20 m/s²'], answer: 'B', explanation: 'a = F/m = 10N / 2kg = 5 m/s²。' },
      { question: '关于牛顿第二定律，下列说法正确的是？', options: ['A. 加速度方向与速度方向一定相同', 'B. 加速度方向与合外力方向相同', 'C. 速度越大加速度越大', 'D. 力消失后物体立即停止'], answer: 'B', explanation: '牛顿第二定律指出加速度方向与合外力方向相同。力消失后物体以该时刻速度做匀速运动（惯性）。' },
      { question: '一个物体在水平面上受拉力F和摩擦力f作用，若F < f，则物体？', options: ['A. 加速运动', 'B. 匀速运动', 'C. 减速运动或静止', 'D. 无法判断'], answer: 'C', explanation: '合外力 F合 = F - f < 0，加速度为负，物体将减速（若正在运动）或保持静止（若原本静止）。' },
      { question: '质量为m的物体在光滑斜面上自由下滑，斜面倾角为θ，则加速度为？', options: ['A. g', 'B. g·sinθ', 'C. g·cosθ', 'D. g·tanθ'], answer: 'B', explanation: '重力沿斜面分量为 mg·sinθ，故 a = F/m = g·sinθ。' }
    ]
  },
  '光合作用': {
    subject: 'chemistry',
    label: '生物 · 化学',
    color: '#50C878',
    theory: '光合作用是绿色植物利用光能将二氧化碳和水转化为有机物（葡萄糖）并释放氧气的过程。总反应式：6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂。分为光反应（类囊体膜）和暗反应（叶绿体基质）两个阶段。',
    luBanView: '鲁班观草木，知日光为火、叶脉为器。以光为媒，化气为食——此造物之妙也。匠人造器，亦当效法自然，以最小之力成最大之功。',
    scenarios: [
      { name: '农业生产', desc: '大棚种植调控光照和CO₂提高产量' },
      { name: '碳中和', desc: '植物吸收CO₂，是地球碳循环的关键' },
      { name: '生物能源', desc: '藻类光合作用产氢、产油脂' },
      { name: '太空生命支持', desc: '密闭舱内植物提供氧气和食物' }
    ],
    controls: [
      { type: 'slider', label: '光照强度', min: 0, max: 100, default: 60, step: 5, unit: '%' },
      { type: 'slider', label: 'CO₂浓度', min: 0.01, max: 0.1, default: 0.04, step: 0.005, unit: '%' },
      { type: 'slider', label: '温度', min: 0, max: 50, default: 25, step: 1, unit: '°C' },
      { type: 'toggle', label: '显示光反应', default: true },
      { type: 'toggle', label: '显示暗反应', default: true }
    ],
    displayParams: [
      { key: 'o2Rate', label: 'O₂释放速率' },
      { key: 'glucoseRate', label: '葡萄糖合成速率' },
      { key: 'lightEfficiency', label: '光能转化效率' },
      { key: 'enzymeActivity', label: '酶活性' }
    ],
    questions: [
      { question: '光合作用的产物是什么？', options: ['A. CO₂和H₂O', 'B. O₂和葡萄糖', 'C. 酒精和CO₂', 'D. 乳酸和ATP'], answer: 'B', explanation: '光合作用总反应：6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂，产物为葡萄糖(C₆H₁₂O₆)和氧气(O₂)。' },
      { question: '光合作用中，光反应发生在叶绿体的哪个部位？', options: ['A. 基质', 'B. 类囊体薄膜', 'C. 外膜', 'D. 内膜'], answer: 'B', explanation: '光反应在类囊体薄膜上进行，利用光能将水分解产生O₂、ATP和NADPH；暗反应在基质中进行，利用ATP和NADPH固定CO₂合成有机物。' },
      { question: '影响光合作用速率的环境因素不包括？', options: ['A. 光照强度', 'B. CO₂浓度', 'C. 温度', 'D. 土壤颜色'], answer: 'D', explanation: '影响光合作用的主要环境因素：光照强度、CO₂浓度、温度、水分、矿质元素。土壤颜色与光合作用无直接关系。' },
      { question: '关于光反应和暗反应的关系，正确的是？', options: ['A. 光反应为暗反应提供ATP和NADPH', 'B. 暗反应为光反应提供光能', 'C. 两者互不相关', 'D. 暗反应必须在无光条件下进行'], answer: 'A', explanation: '光反应产生的ATP和NADPH为暗反应中CO₂的固定和还原提供能量和还原剂。暗反应有光无光均可进行，只是需要光反应产物。' },
      { question: '若光照突然增强，短时间内C₃（三碳化合物）的含量如何变化？', options: ['A. 增加', 'B. 减少', 'C. 不变', 'D. 先增后减'], answer: 'B', explanation: '光照增强→光反应加快→ATP和NADPH增多→C₃还原加快→而CO₂固定速率暂时不变→C₃消耗加快而生成速率不变→C₃含量减少。' }
    ]
  },
  '勾股定理': {
    subject: 'math',
    label: '数学 · 几何',
    color: '#9B6BD4',
    theory: '勾股定理：直角三角形中，两直角边的平方和等于斜边的平方。若直角边为a、b，斜边为c，则 a² + b² = c²。这是欧几里得几何中最基本、最重要的定理之一，已有超过400种证明方法。',
    luBanView: '鲁班量方，知直角之弦。以勾三股四，必得弦五——此几何之根基也。匠人造屋架、设斜撑，皆赖此理以求尺寸之精确。',
    scenarios: [
      { name: '建筑测量', desc: '利用勾股定理测量不可直接测量的距离' },
      { name: '导航系统', desc: '计算两点间直线距离（经度差、纬度差）' },
      { name: '电子屏幕', desc: '计算对角线分辨率（如1920×1080的屏幕对角线）' },
      { name: '楼梯设计', desc: '踏步高度和深度决定斜边长度' }
    ],
    controls: [
      { type: 'slider', label: '直角边a', min: 3, max: 20, default: 3, step: 1, unit: '' },
      { type: 'slider', label: '直角边b', min: 4, max: 20, default: 4, step: 1, unit: '' },
      { type: 'toggle', label: '显示面积标注', default: true },
      { type: 'toggle', label: '显示证明动画', default: false },
      { type: 'toggle', label: '显示毕达哥拉斯树', default: false }
    ],
    displayParams: [
      { key: 'hypotenuse', label: '斜边 c' },
      { key: 'areaA', label: 'a² 面积' },
      { key: 'areaB', label: 'b² 面积' },
      { key: 'areaC', label: 'c² 面积' }
    ],
    questions: [
      { question: '直角三角形的两条直角边分别为3和4，则斜边为？', options: ['A. 5', 'B. 6', 'C. 7', 'D. 25'], answer: 'A', explanation: 'c = √(a² + b²) = √(9 + 16) = √25 = 5。这是最著名的勾股数（3, 4, 5）。' },
      { question: '下列哪组数可以作为直角三角形的三边长？', options: ['A. 1, 2, 3', 'B. 2, 3, 4', 'C. 5, 12, 13', 'D. 6, 7, 8'], answer: 'C', explanation: '5² + 12² = 25 + 144 = 169 = 13²。验证：1²+2²≠3², 2²+3²≠4², 6²+7²≠8²。' },
      { question: '若直角三角形斜边为10，一条直角边为6，则另一条直角边为？', options: ['A. 4', 'B. 8', 'C. 16', 'D. √136'], answer: 'B', explanation: 'b = √(c² - a²) = √(100 - 36) = √64 = 8。' },
      { question: '勾股定理的逆命题是什么？', options: ['A. 若a²+b²=c²，则三角形为直角三角形', 'B. 若三角形为直角三角形，则a²+b²=c²', 'C. 以上都对', 'D. 以上都不对'], answer: 'A', explanation: '勾股定理的逆命题：若三角形三边满足a²+b²=c²，则该三角形为直角三角形，c边所对角为直角。这是判定直角三角形的重要依据。' },
      { question: '等腰直角三角形的直角边为a，则斜边为？', options: ['A. a', 'B. a√2', 'C. 2a', 'D. a²'], answer: 'B', explanation: 'c = √(a² + a²) = √(2a²) = a√2 ≈ 1.414a。这是等腰直角三角形的重要性质。' }
    ]
  }
}

/* ═══════════════════════════════════════════════════════════
   通用回退配置 —— 未匹配到专门知识点时使用
   ═══════════════════════════════════════════════════════════ */
const SUBJECT_CONFIG = {
  physics: {
    label: '物理',
    color: '#4ECDC4',
    theory: '物理学研究物质、能量、空间和时间的基本规律。力学、电磁学、光学、热学等分支揭示了自然界运行的普遍法则。',
    luBanView: '鲁班制器，知力与动之理。杠杆之平衡、滑轮之省力、斜面之巧借，皆物理之精髓。匠人通物理，则器无不精。',
    scenarios: [
      { name: '桥梁工程', desc: '斜拉桥利用力学原理分散载荷' },
      { name: '体育运动', desc: '跳远利用惯性、投篮利用抛物线' },
      { name: '交通工具', desc: '汽车引擎将热能转化为机械能' },
      { name: '日常用品', desc: '剪刀利用杠杆原理省力' }
    ],
    controls: [
      { type: 'slider', label: '粒子数量', min: 50, max: 500, default: 200, step: 50 },
      { type: 'slider', label: '运动速度', min: 0.5, max: 3, default: 1, step: 0.1 },
      { type: 'slider', label: '引力强度', min: 0, max: 2, default: 0.5, step: 0.1 },
      { type: 'toggle', label: '显示轨迹', default: true },
      { type: 'toggle', label: '显示速度矢量', default: false }
    ],
    displayParams: [
      { key: 'particleCount', label: '活跃粒子数' },
      { key: 'avgSpeed', label: '平均速度' },
      { key: 'kineticEnergy', label: '系统动能' },
      { key: 'collisionCount', label: '碰撞次数' }
    ],
    questions: [
      { question: '物体的运动状态改变一定是因为受到了力的作用吗？', options: ['A. 是', 'B. 否', 'C. 不一定', 'D. 只有在地球上才是'], answer: 'A', explanation: '根据牛顿第一定律，力是改变物体运动状态的原因。没有外力作用，物体将保持静止或匀速直线运动。' },
      { question: '关于能量守恒定律，下列说法正确的是？', options: ['A. 能量可以被创造', 'B. 能量可以被消灭', 'C. 能量既不会凭空产生也不会凭空消失', 'D. 能量守恒只在宏观世界成立'], answer: 'C', explanation: '能量守恒定律：能量既不会凭空产生，也不会凭空消失，它只会从一种形式转化为另一种形式，或从一个物体转移到另一个物体，总量保持不变。' },
      { question: '光在真空中的传播速度约为？', options: ['A. 3×10⁵ m/s', 'B. 3×10⁸ m/s', 'C. 3×10¹⁰ m/s', 'D. 3×10³ m/s'], answer: 'B', explanation: '光速 c ≈ 3×10⁸ m/s（精确值 299,792,458 m/s），是自然界的基本常数之一。' },
      { question: '简谐运动的周期与振幅的关系是？', options: ['A. 周期随振幅增大而增大', 'B. 周期随振幅增大而减小', 'C. 周期与振幅无关', 'D. 关系不确定'], answer: 'C', explanation: '对于简谐运动（如单摆小角度摆动、弹簧振子），周期仅由系统本身的性质决定（如摆长、弹簧劲度系数），与振幅无关。' },
      { question: '关于波粒二象性，下列说法正确的是？', options: ['A. 光只具有波动性', 'B. 光只具有粒子性', 'C. 光既具有波动性又具有粒子性', 'D. 波粒二象性只在微观世界存在'], answer: 'C', explanation: '光具有波粒二象性：干涉和衍射证明光的波动性，光电效应证明光的粒子性。德布罗意进一步提出所有物质都具有波粒二象性。' }
    ]
  },
  chemistry: {
    label: '化学',
    color: '#50C878',
    theory: '化学研究物质的组成、结构、性质及其变化规律。从原子分子层面揭示物质世界的奥秘，是连接微观与宏观的桥梁。',
    luBanView: '鲁班炼丹，知水火相克、酸碱中和之理。化学变化，旧质消而新质生，此造化之玄机。匠人知化学，则材料之选、工艺之配，皆有据可依。',
    scenarios: [
      { name: '食品加工', desc: '发酵、膨松剂、防腐剂的应用' },
      { name: '医药制造', desc: '药物合成、提纯、制剂工艺' },
      { name: '能源开发', desc: '电池、燃料电池、太阳能电池' },
      { name: '环境保护', desc: '污水处理、大气净化、固废利用' }
    ],
    controls: [
      { type: 'slider', label: '反应温度', min: 0, max: 200, default: 25, step: 5, unit: '°C' },
      { type: 'slider', label: '反应物浓度', min: 0.1, max: 2, default: 1, step: 0.1, unit: 'mol/L' },
      { type: 'slider', label: '催化剂用量', min: 0, max: 100, default: 20, step: 5, unit: '%' },
      { type: 'toggle', label: '显示分子式', default: true },
      { type: 'toggle', label: '显示电子转移', default: false }
    ],
    displayParams: [
      { key: 'reactionRate', label: '反应速率' },
      { key: 'conversionRate', label: '转化率' },
      { key: 'productYield', label: '产物产率' },
      { key: 'activationEnergy', label: '活化能' }
    ],
    questions: [
      { question: '化学反应的本质是什么？', options: ['A. 分子重新排列', 'B. 原子重新组合', 'C. 电子得失', 'D. 以上都对'], answer: 'D', explanation: '化学反应本质是原子重新组合形成新物质的过程，常伴随电子转移（氧化还原）或共用电子对变化（共价键重组）。' },
      { question: '关于化学平衡，下列说法正确的是？', options: ['A. 平衡时正逆反应速率相等', 'B. 平衡时各物质浓度相等', 'C. 平衡后反应停止', 'D. 平衡不受温度影响'], answer: 'A', explanation: '化学平衡是动态平衡：正逆反应速率相等，各物质浓度保持不变但不一定相等。温度、压强、浓度变化可使平衡移动（勒夏特列原理）。' },
      { question: 'pH = 7的溶液一定呈中性吗？', options: ['A. 一定', 'B. 不一定', 'C. 只有在25°C时才是', 'D. 无法判断'], answer: 'C', explanation: 'pH = 7只在25°C时代表中性。温度升高时，水的离子积Kw增大，中性溶液的pH会小于7（如100°C时，中性pH ≈ 6）。' },
      { question: '关于催化剂，下列说法错误的是？', options: ['A. 催化剂改变反应速率', 'B. 催化剂改变反应平衡', 'C. 催化剂反应前后质量不变', 'D. 催化剂有选择性'], answer: 'B', explanation: '催化剂通过降低活化能改变反应速率，但不改变反应的平衡位置和平衡常数，反应前后催化剂的质量和化学性质不变。' },
      { question: '元素周期表中，同主族元素从上到下，金属性如何变化？', options: ['A. 增强', 'B. 减弱', 'C. 不变', 'D. 先增强后减弱'], answer: 'A', explanation: '同主族从上到下，原子半径增大，原子核对外层电子吸引力减弱，失电子能力增强，金属性增强（非金属性减弱）。' }
    ]
  },
  math: {
    label: '数学',
    color: '#9B6BD4',
    theory: '数学研究数量、结构、变化、空间等概念。从算术到代数、几何到分析，数学是描述自然规律的语言和工具。',
    luBanView: '鲁班量度，知方圆曲直之理。勾股之弦、圆周之率、三角之函数，皆数学之精华。匠人精数学，则尺寸无差、结构稳固。',
    scenarios: [
      { name: '建筑设计', desc: '几何学决定建筑结构的稳定性与美学' },
      { name: '金融投资', desc: '概率统计评估风险与收益' },
      { name: '人工智能', desc: '线性代数、微积分是机器学习的基础' },
      { name: '密码学', desc: '数论保障信息安全' }
    ],
    controls: [
      { type: 'slider', label: '角度θ', min: 0, max: 360, default: 45, step: 1, unit: '°' },
      { type: 'slider', label: '振幅A', min: 0.5, max: 3, default: 1, step: 0.1 },
      { type: 'slider', label: '频率ω', min: 0.5, max: 3, default: 1, step: 0.1 },
      { type: 'toggle', label: '显示正弦', default: true },
      { type: 'toggle', label: '显示余弦', default: true }
    ],
    displayParams: [
      { key: 'sinValue', label: 'sin(θ)' },
      { key: 'cosValue', label: 'cos(θ)' },
      { key: 'period', label: '周期' },
      { key: 'frequency', label: '频率' }
    ],
    questions: [
      { question: '若函数 f(x) = sin(2x)，则其周期为？', options: ['A. π', 'B. 2π', 'C. π/2', 'D. 4π'], answer: 'A', explanation: 'sin(ωx) 的周期为 2π/ω。此处 ω=2，故周期 T = 2π/2 = π。' },
      { question: '关于勾股定理，下列说法正确的是？', options: ['A. 只适用于直角三角形', 'B. a² + b² = c²', 'C. c 是斜边', 'D. 以上都对'], answer: 'D', explanation: '勾股定理：直角三角形中，两直角边平方和等于斜边平方（a² + b² = c²）。这是欧氏几何的基本定理之一。' },
      { question: '导数的几何意义是什么？', options: ['A. 函数在某点的切线斜率', 'B. 函数的极值', 'C. 函数的积分', 'D. 函数的零点'], answer: 'A', explanation: '导数 f\'(x₀) 表示函数 y=f(x) 在点 x₀ 处的切线斜率，反映了函数在该点的变化率。' },
      { question: '复数 i 的平方等于？', options: ['A. 1', 'B. -1', 'C. i', 'D. -i'], answer: 'B', explanation: '虚数单位 i 定义为 i² = -1。复数的一般形式为 a + bi，其中 a 为实部，b 为虚部。' },
      { question: '关于等比数列，若首项 a₁=2，公比 q=3，则第5项为？', options: ['A. 54', 'B. 162', 'C. 486', 'D. 6'], answer: 'B', explanation: '等比数列通项公式：aₙ = a₁·qⁿ⁻¹。a₅ = 2×3⁴ = 2×81 = 162。' }
    ]
  },
  astronomy: {
    label: '天文',
    color: '#D4AF37',
    theory: '天文学研究天体和宇宙的结构、起源与演化。从行星运动到星系形成，从黑洞到宇宙大爆炸，探索宇宙最深层的奥秘。',
    luBanView: '鲁班观天象，知日月五星之行。引力如丝，行星如珠，各循其道而不乱。此天道也，匠人仰观俯察，以通天地之变。',
    scenarios: [
      { name: '卫星导航', desc: 'GPS利用人造卫星精确确定位置' },
      { name: '历法编制', desc: '根据天体运行规律制定历法' },
      { name: '深空探测', desc: '探测器利用引力弹弓加速前往外行星' },
      { name: '天文观测', desc: '望远镜观测遥远星系和宇宙现象' }
    ],
    controls: [
      { type: 'slider', label: '中心质量', min: 0.5, max: 3, default: 1, step: 0.1, unit: 'M☉' },
      { type: 'slider', label: '轨道半径', min: 50, max: 300, default: 150, step: 10, unit: 'AU' },
      { type: 'slider', label: '时间流速', min: 0.2, max: 5, default: 1, step: 0.2 },
      { type: 'toggle', label: '显示轨道', default: true },
      { type: 'toggle', label: '显示引力场', default: false }
    ],
    displayParams: [
      { key: 'orbitalPeriod', label: '公转周期' },
      { key: 'orbitalSpeed', label: '轨道速度' },
      { key: 'gravity', label: '引力加速度' },
      { key: 'escapeVelocity', label: '逃逸速度' }
    ],
    questions: [
      { question: '太阳系中体积最大的行星是？', options: ['A. 土星', 'B. 木星', 'C. 海王星', 'D. 天王星'], answer: 'B', explanation: '木星是太阳系中体积和质量最大的行星，质量约为地球的318倍，体积约为地球的1300倍。' },
      { question: '黑洞的边界被称为什么？', options: ['A. 视界', 'B. 事件穹界', 'C. 史瓦西半径', 'D. 以上都对'], answer: 'D', explanation: '黑洞边界称为事件视界（event horizon），其半径称为史瓦西半径。光一旦越过此边界便无法逃逸。' },
      { question: '宇宙大爆炸理论认为宇宙起源于约多少年前？', options: ['A. 46亿年', 'B. 138亿年', 'C. 100亿年', 'D. 200亿年'], answer: 'B', explanation: '根据普朗克卫星观测数据，宇宙年龄约为138亿年（13.8×10⁹年）。太阳系年龄约为46亿年。' },
      { question: '光年是什么单位？', options: ['A. 时间单位', 'B. 距离单位', 'C. 速度单位', 'D. 质量单位'], answer: 'B', explanation: '光年是距离单位，指光在真空中一年时间走过的距离，约等于 9.46×10¹² km。常用于描述天体之间的距离。' },
      { question: '关于开普勒第三定律，下列说法正确的是？', options: ['A. T² ∝ R³', 'B. T ∝ R²', 'C. T³ ∝ R²', 'D. T ∝ R'], answer: 'A', explanation: '开普勒第三定律：行星公转周期T的平方与轨道半长轴R的立方成正比，即 T²/R³ = k（常数）。' }
    ]
  },
  general: {
    label: '综合',
    color: '#D4AF37',
    theory: '科学是探索自然、认识世界的系统性知识体系。通过观察、实验、推理和验证，人类不断揭示自然界的规律，推动文明进步。',
    luBanView: '鲁班之学，贯通天文地理、数理化工。以器载道，以物明理，知行合一。匠人不仅精于技艺，更通晓万物之理。',
    scenarios: [
      { name: '科学探究', desc: '提出问题、设计方案、实验验证、得出结论' },
      { name: '技术创新', desc: '将科学发现转化为实际应用' },
      { name: '工程实践', desc: '综合运用多学科知识解决复杂问题' },
      { name: '终身学习', desc: '保持好奇心，持续探索未知领域' }
    ],
    controls: [
      { type: 'slider', label: '粒子数量', min: 50, max: 400, default: 150, step: 50 },
      { type: 'slider', label: '运动速度', min: 0.3, max: 2.5, default: 1, step: 0.1 },
      { type: 'slider', label: '能量强度', min: 0.2, max: 2, default: 1, step: 0.1 },
      { type: 'toggle', label: '显示轨迹', default: true },
      { type: 'toggle', label: '显示场线', default: false }
    ],
    displayParams: [
      { key: 'activeCount', label: '活跃粒子' },
      { key: 'avgEnergy', label: '平均能量' },
      { key: 'entropy', label: '系统熵值' },
      { key: 'interactionCount', label: '相互作用' }
    ],
    questions: [
      { question: '科学探究的基本环节包括？', options: ['A. 提出问题', 'B. 作出假设', 'C. 实验验证', 'D. 以上都是'], answer: 'D', explanation: '科学探究通常包括：提出问题→作出假设→设计实验→收集数据→分析论证→得出结论→交流反思。' },
      { question: '关于科学方法，下列说法正确的是？', options: ['A. 科学结论是绝对真理', 'B. 科学理论可以被证伪', 'C. 科学不需要实验验证', 'D. 科学只研究宏观现象'], answer: 'B', explanation: '科学理论具有可证伪性（波普尔），可以被新证据修正或推翻。科学是不断接近真理的过程，而非绝对真理。' },
      { question: '量纲分析中，速度的量纲是？', options: ['A. [L]', 'B. [T]', 'C. [L][T]⁻¹', 'D. [L]⁻¹[T]'], answer: 'C', explanation: '速度 = 位移/时间，量纲为 [L][T]⁻¹。量纲分析是检验物理公式正确性的重要工具。' },
      { question: '关于模型在科学研究中的作用，下列说法正确的是？', options: ['A. 模型必须完全等同于真实对象', 'B. 模型是对真实对象的简化抽象', 'C. 模型不能用于预测', 'D. 模型一旦建立就不能修改'], answer: 'B', explanation: '科学模型是对真实对象的简化抽象，忽略次要因素、突出主要特征，用于解释现象和预测结果，可以随新证据不断完善。' },
      { question: '控制变量法中，需要改变的因素称为？', options: ['A. 常量', 'B. 自变量', 'C. 因变量', 'D. 无关变量'], answer: 'B', explanation: '自变量是实验中主动改变的因素；因变量是随自变量变化而变化的测量量；无关变量是需保持恒定的其他因素。' }
    ]
  }
}

/* ─── 检测学科 ─── */
function detectSubject(topic) {
  const t = topic.toLowerCase()
  if (/物理|力|运动|速度|加速度|能量|功|功率|电磁|光|声|波|热|量子|相对论|引力/.test(t)) return 'physics'
  if (/化学|反应|分子|原子|元素|化合物|酸碱|电解|氧化|还原|催化|有机|无机|光合/.test(t)) return 'chemistry'
  if (/数学|函数|几何|代数|方程|积分|微分|概率|统计|数列|向量|矩阵|三角|勾股/.test(t)) return 'math'
  if (/天文|宇宙|太阳|行星|恒星|银河|黑洞|大爆炸|星系|卫星|轨道|引力/.test(t)) return 'astronomy'
  return 'general'
}

/* ─── 获取配置 ─── */
function getConfig(topic) {
  for (const [key, config] of Object.entries(TOPIC_PRESETS)) {
    if (topic.includes(key)) return { ...config, isPreset: true, presetKey: key }
  }
  const subject = detectSubject(topic)
  return { ...SUBJECT_CONFIG[subject], subject, isPreset: false }
}

/* ═══════════════════════════════════════════════════════════
   Canvas 可视化 —— 按知识点分派专门绘制函数
   ═══════════════════════════════════════════════════════════ */

/* ─── 1. 牛顿第二定律 ─── */
function NewtonCanvas({ params }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const F = params['拉力F'] || 50
    const m = params['质量m'] || 5
    const mu = params['摩擦系数μ'] || 0.2
    const g = 9.8
    const f = mu * m * g
    const netF = Math.max(0, F - f)
    const a = netF / m

    let t = 0
    let blockX = 80
    const groundY = h * 0.45
    const blockW = 60
    const blockH = 40
    const maxVHistory = 200
    const vHistory = []

    function drawArrow(x1, y1, x2, y2, color, label) {
      const angle = Math.atan2(y2 - y1, x2 - x1)
      const len = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.stroke()
      // 箭头
      const headLen = 10
      ctx.beginPath()
      ctx.moveTo(x2, y2)
      ctx.lineTo(x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4))
      ctx.lineTo(x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4))
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      // 标签
      if (label) {
        ctx.fillStyle = color
        ctx.font = 'bold 13px var(--font-sans)'
        ctx.textAlign = 'center'
        ctx.fillText(label, (x1+x2)/2, y1 - 10)
      }
    }

    function draw() {
      t += 0.016
      ctx.clearRect(0, 0, w, h)

      // 背景
      ctx.fillStyle = '#0D0D14'
      ctx.fillRect(0, 0, w, h)

      // 网格
      ctx.strokeStyle = 'rgba(78,205,196,0.06)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke() }
      for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke() }

      // 地面
      ctx.fillStyle = 'rgba(78,205,196,0.1)'
      ctx.fillRect(0, groundY + blockH, w, 4)
      ctx.strokeStyle = 'rgba(78,205,196,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, groundY + blockH)
      ctx.lineTo(w, groundY + blockH)
      ctx.stroke()

      // 木块运动
      const v = a * t
      blockX = 80 + v * t * 3
      if (blockX > w - blockW - 20) { blockX = 80; t = 0; vHistory.length = 0 }

      // 木块
      ctx.fillStyle = 'rgba(78,205,196,0.15)'
      ctx.strokeStyle = '#4ECDC4'
      ctx.lineWidth = 2
      ctx.fillRect(blockX, groundY, blockW, blockH)
      ctx.strokeRect(blockX, groundY, blockW, blockH)
      ctx.fillStyle = '#4ECDC4'
      ctx.font = 'bold 12px var(--font-mono)'
      ctx.textAlign = 'center'
      ctx.fillText(`${m}kg`, blockX + blockW/2, groundY + blockH/2 + 4)

      // 受力分析
      if (params['显示受力分析'] !== false) {
        const cx = blockX + blockW/2
        const cy = groundY + blockH/2
        // 拉力F
        const fLen = Math.min(F * 1.5, 120)
        drawArrow(cx, cy, cx + fLen, cy, '#4ECDC4', `F=${F}N`)
        // 摩擦力f
        const frLen = Math.min(f * 1.5, 100)
        if (frLen > 5) drawArrow(cx, cy, cx - frLen, cy, '#DC5050', `f=${f.toFixed(1)}N`)
        // 重力
        drawArrow(cx, groundY + blockH + 5, cx, groundY + blockH + 35, '#9B6BD4', `G=${(m*g).toFixed(0)}N`)
        // 支持力
        drawArrow(cx, groundY - 5, cx, groundY - 35, '#E8C967', `N=${(m*g).toFixed(0)}N`)
      }

      // 公式
      ctx.fillStyle = '#4ECDC4'
      ctx.font = 'bold 16px var(--font-mono)'
      ctx.textAlign = 'left'
      ctx.fillText(`F = ma`, 20, 30)
      ctx.font = '13px var(--font-mono)'
      ctx.fillStyle = 'rgba(78,205,196,0.7)'
      ctx.fillText(`a = (F-f)/m = ${a.toFixed(2)} m/s²`, 20, 52)
      ctx.fillText(`v = at = ${(a*t).toFixed(2)} m/s`, 20, 72)
      ctx.fillText(`f = μmg = ${f.toFixed(1)} N`, 20, 92)

      // v-t 图像
      if (params['显示v-t图像'] !== false) {
        const chartX = w * 0.55
        const chartY = h * 0.55
        const chartW = w * 0.4
        const chartH = h * 0.35

        ctx.strokeStyle = 'rgba(78,205,196,0.2)'
        ctx.lineWidth = 1
        ctx.strokeRect(chartX, chartY, chartW, chartH)

        ctx.fillStyle = 'rgba(78,205,196,0.15)'
        ctx.font = 'bold 12px var(--font-sans)'
        ctx.textAlign = 'left'
        ctx.fillText('v-t 图像', chartX + 8, chartY + 20)

        // 坐标轴
        ctx.strokeStyle = 'rgba(78,205,196,0.3)'
        ctx.beginPath()
        ctx.moveTo(chartX + 30, chartY + chartH - 20)
        ctx.lineTo(chartX + chartW - 10, chartY + chartH - 20)
        ctx.moveTo(chartX + 30, chartY + chartH - 20)
        ctx.lineTo(chartX + 30, chartY + 10)
        ctx.stroke()

        // v-t 曲线
        vHistory.push({ t, v: a * t })
        if (vHistory.length > maxVHistory) vHistory.shift()

        ctx.beginPath()
        ctx.strokeStyle = '#4ECDC4'
        ctx.lineWidth = 2
        vHistory.forEach((pt, i) => {
          const px = chartX + 30 + (i / maxVHistory) * (chartW - 50)
          const maxV = Math.max(10, a * 5)
          const py = chartY + chartH - 20 - (pt.v / maxV) * (chartH - 40)
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [params])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

/* ─── 2. 光合作用 ─── */
function PhotosynthesisCanvas({ params }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const light = params['光照强度'] || 60
    const co2 = params['CO₂浓度'] || 0.04
    const temp = params['温度'] || 25
    const showLight = params['显示光反应'] !== false
    const showDark = params['显示暗反应'] !== false

    let time = 0
    let photons = []
    let co2Mols = []
    let o2Mols = []

    function spawnParticle(arr, x, y, vx, vy, color, life) {
      arr.push({ x, y, vx, vy, color, life, maxLife: life, radius: Math.random() * 2 + 1 })
    }

    function draw() {
      time += 0.016
      ctx.fillStyle = 'rgba(13,13,20,0.2)'
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2
      const leafW = 140
      const leafH = 90

      // 太阳光
      const sunX = cx
      const sunY = 50
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 50)
      sunGlow.addColorStop(0, `rgba(232,201,103,${light/100*0.5})`)
      sunGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = sunGlow
      ctx.fillRect(0, 0, w, h)

      // 太阳
      ctx.beginPath()
      ctx.arc(sunX, sunY, 20, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(232,201,103,${light/100*0.8+0.2})`
      ctx.fill()
      ctx.strokeStyle = '#E8C967'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = '#E8C967'
      ctx.font = '11px var(--font-sans)'
      ctx.textAlign = 'center'
      ctx.fillText('☀', sunX, sunY + 4)

      // 光子
      if (light > 0 && Math.random() < light / 200) {
        spawnParticle(photons, sunX + (Math.random()-0.5)*30, sunY + 20, (Math.random()-0.5)*0.5, 1 + Math.random(), '#E8C967', 60)
      }
      photons = photons.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life--
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2)
        ctx.fillStyle = `rgba(232,201,103,${p.life/p.maxLife})`
        ctx.fill()
        return p.life > 0 && p.y < cy + leafH/2
      })

      // 叶子
      ctx.beginPath()
      ctx.ellipse(cx, cy, leafW, leafH, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(80,200,120,0.12)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(80,200,120,0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      // 叶脉
      ctx.strokeStyle = 'rgba(80,200,120,0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx - leafW + 20, cy)
      ctx.lineTo(cx + leafW - 20, cy)
      ctx.stroke()
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath()
        ctx.moveTo(cx + i * 20, cy - 10)
        ctx.lineTo(cx + i * 25, cy + 10)
        ctx.stroke()
      }

      // 光反应区
      if (showLight) {
        ctx.fillStyle = 'rgba(232,201,103,0.08)'
        ctx.beginPath()
        ctx.ellipse(cx - 40, cy - 20, 35, 25, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(232,201,103,0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = '#E8C967'
        ctx.font = '10px var(--font-sans)'
        ctx.textAlign = 'center'
        ctx.fillText('光反应', cx - 40, cy - 20)
      }

      // 暗反应区
      if (showDark) {
        ctx.fillStyle = 'rgba(80,200,120,0.08)'
        ctx.beginPath()
        ctx.ellipse(cx + 40, cy + 20, 35, 25, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(80,200,120,0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = '#50C878'
        ctx.font = '10px var(--font-sans)'
        ctx.textAlign = 'center'
        ctx.fillText('暗反应', cx + 40, cy + 20)
      }

      // CO2 输入
      if (co2 > 0 && Math.random() < co2 * 10) {
        spawnParticle(co2Mols, 20, cy + (Math.random()-0.5)*40, 1 + Math.random(), (Math.random()-0.5)*0.5, '#9B6BD4', 80)
      }
      co2Mols = co2Mols.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life--
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius + 1, 0, Math.PI*2)
        ctx.fillStyle = `rgba(155,107,212,${p.life/p.maxLife*0.7})`
        ctx.fill()
        ctx.fillStyle = `rgba(155,107,212,${p.life/p.maxLife})`
        ctx.font = '9px var(--font-mono)'
        ctx.textAlign = 'center'
        ctx.fillText('CO₂', p.x, p.y + 3)
        return p.life > 0 && p.x < cx - 20
      })

      // O2 输出
      const o2Rate = (light * co2 * 100 * Math.max(0, 1 - Math.abs(temp-25)/30))
      if (o2Rate > 5 && Math.random() < o2Rate / 500) {
        spawnParticle(o2Mols, cx + 60, cy - 20, 1 + Math.random(), -(0.5 + Math.random()), '#4ECDC4', 100)
      }
      o2Mols = o2Mols.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life--
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius + 1, 0, Math.PI*2)
        ctx.fillStyle = `rgba(78,205,196,${p.life/p.maxLife*0.7})`
        ctx.fill()
        ctx.fillStyle = `rgba(78,205,196,${p.life/p.maxLife})`
        ctx.font = '9px var(--font-mono)'
        ctx.textAlign = 'center'
        ctx.fillText('O₂', p.x, p.y + 3)
        return p.life > 0 && p.x < w - 20
      })

      // H2O 输入
      ctx.fillStyle = '#4A9FD4'
      ctx.font = '11px var(--font-sans)'
      ctx.textAlign = 'center'
      ctx.fillText('H₂O ↑', cx, h - 30)
      ctx.strokeStyle = 'rgba(74,159,212,0.3)'
      ctx.beginPath()
      ctx.moveTo(cx, h - 20)
      ctx.lineTo(cx, cy + leafH)
      ctx.stroke()

      // 葡萄糖输出
      ctx.fillStyle = '#D4AF37'
      ctx.font = '11px var(--font-sans)'
      ctx.textAlign = 'center'
      ctx.fillText('C₆H₁₂O₆', cx + 100, cy + leafH + 25)

      // 反应式
      ctx.fillStyle = 'rgba(80,200,120,0.8)'
      ctx.font = '12px var(--font-mono)'
      ctx.textAlign = 'center'
      ctx.fillText('6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', cx, 30)

      // 效率指示
      const efficiency = (light * co2 * 100 * Math.max(0, 1 - Math.abs(temp-25)/30)).toFixed(1)
      ctx.fillStyle = '#50C878'
      ctx.font = '13px var(--font-mono)'
      ctx.textAlign = 'left'
      ctx.fillText(`光能转化效率: ${efficiency}%`, 20, h - 20)

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [params])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

/* ─── 3. 勾股定理 ─── */
function PythagoreanCanvas({ params }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const a = params['直角边a'] || 3
    const b = params['直角边b'] || 4
    const c = Math.sqrt(a*a + b*b)
    const showArea = params['显示面积标注'] !== false
    const showProof = params['显示证明动画'] === true
    const showTree = params['显示毕达哥拉斯树'] === true

    let time = 0
    const scale = Math.min(w, h) / 30

    function draw() {
      time += 0.016
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0D0D14'
      ctx.fillRect(0, 0, w, h)

      // 网格
      ctx.strokeStyle = 'rgba(155,107,212,0.06)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke() }
      for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke() }

      const ox = w * 0.35
      const oy = h * 0.55
      const sa = a * scale
      const sb = b * scale
      const sc = c * scale

      // 直角三角形
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(ox + sa, oy)
      ctx.lineTo(ox, oy - sb)
      ctx.closePath()
      ctx.fillStyle = 'rgba(155,107,212,0.12)'
      ctx.fill()
      ctx.strokeStyle = '#9B6BD4'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // 直角标记
      ctx.strokeStyle = '#9B6BD4'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(ox + 12, oy)
      ctx.lineTo(ox + 12, oy - 12)
      ctx.lineTo(ox, oy - 12)
      ctx.stroke()

      // 边标注
      ctx.fillStyle = '#9B6BD4'
      ctx.font = 'bold 14px var(--font-mono)'
      ctx.textAlign = 'center'
      ctx.fillText(`a=${a}`, ox + sa/2, oy + 22)
      ctx.fillText(`b=${b}`, ox - 22, oy - sb/2)

      // 斜边标注
      const midX = (ox + sa + ox) / 2
      const midY = (oy + oy - sb) / 2
      ctx.fillStyle = '#E8C967'
      ctx.font = 'bold 14px var(--font-mono)'
      ctx.fillText(`c=${c.toFixed(2)}`, midX + 18, midY - 8)

      // a² 正方形
      ctx.strokeStyle = 'rgba(155,107,212,0.4)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(ox, oy, sa, sa)
      if (showArea) {
        ctx.fillStyle = 'rgba(155,107,212,0.08)'
        ctx.fillRect(ox, oy, sa, sa)
        ctx.fillStyle = '#9B6BD4'
        ctx.font = '12px var(--font-mono)'
        ctx.fillText(`a²=${a*a}`, ox + sa/2, oy + sa/2 + 4)
      }

      // b² 正方形
      ctx.strokeStyle = 'rgba(155,107,212,0.4)'
      ctx.strokeRect(ox - sb, oy - sb, sb, sb)
      if (showArea) {
        ctx.fillStyle = 'rgba(155,107,212,0.08)'
        ctx.fillRect(ox - sb, oy - sb, sb, sb)
        ctx.fillStyle = '#9B6BD4'
        ctx.font = '12px var(--font-mono)'
        ctx.fillText(`b²=${b*b}`, ox - sb/2, oy - sb/2 + 4)
      }

      // c² 正方形
      const angle = Math.atan2(-sb, sa)
      ctx.save()
      ctx.translate(ox + sa, oy)
      ctx.rotate(angle)
      ctx.strokeStyle = 'rgba(232,201,103,0.4)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(0, 0, sc, sc)
      if (showArea) {
        ctx.fillStyle = 'rgba(232,201,103,0.08)'
        ctx.fillRect(0, 0, sc, sc)
        ctx.fillStyle = '#E8C967'
        ctx.font = '12px var(--font-mono)'
        ctx.fillText(`c²=${(c*c).toFixed(1)}`, sc/2, sc/2 + 4)
      }
      ctx.restore()

      // 公式
      ctx.fillStyle = '#E8C967'
      ctx.font = 'bold 18px var(--font-mono)'
      ctx.textAlign = 'center'
      ctx.fillText(`a² + b² = c²`, w * 0.75, 40)
      ctx.fillStyle = 'rgba(232,201,103,0.6)'
      ctx.font = '14px var(--font-mono)'
      ctx.fillText(`${a*a} + ${b*b} = ${(c*c).toFixed(1)} ✓`, w * 0.75, 65)

      // 证明动画：把a²和b²切成块拼到c²
      if (showProof) {
        const progress = (Math.sin(time * 0.5) + 1) / 2
        ctx.fillStyle = 'rgba(155,107,212,0.15)'
        // 简化的面积相等现象
        ctx.fillRect(w * 0.65, h * 0.35, 60 * progress, 60 * progress)
        ctx.fillStyle = 'rgba(232,201,103,0.15)'
        ctx.fillRect(w * 0.65 + 70, h * 0.35, 60 * progress, 60 * progress)
        ctx.fillStyle = 'rgba(155,107,212,0.5)'
        ctx.font = '11px var(--font-sans)'
        ctx.fillText('面积相等演示', w * 0.75, h * 0.35 + 80)
      }

      // 毕达哥拉斯树
      if (showTree) {
        function drawBranch(x, y, len, angle, depth) {
          if (depth <= 0) return
          const x2 = x + len * Math.cos(angle)
          const y2 = y + len * Math.sin(angle)
          ctx.strokeStyle = `hsla(${270 + depth * 10}, 60%, 60%, ${0.3 + depth * 0.05})`
          ctx.lineWidth = Math.max(0.5, depth * 0.5)
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x2, y2)
          ctx.stroke()
          const newLen = len * 0.7
          drawBranch(x2, y2, newLen, angle - 0.5, depth - 1)
          drawBranch(x2, y2, newLen, angle + 0.5, depth - 1)
        }
        drawBranch(w * 0.75, h * 0.85, 40, -Math.PI / 2, 6)
      }

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [params])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

/* ─── 4. 通用回退 Canvas ─── */
function GenericCanvas({ subject, params }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    let particles = []
    const count = params['粒子数量'] || 150
    const speed = params['运动速度'] || 1
    const gravity = params['引力强度'] || params['能量强度'] || 0.5
    const showTrail = params['显示轨迹'] !== false
    const showField = params['显示引力场'] === true || params['显示场线'] === true

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed * 2, vy: (Math.random() - 0.5) * speed * 2,
        radius: Math.random() * 2 + 1, alpha: Math.random() * 0.5 + 0.3,
        hue: subject === 'physics' ? 170 : subject === 'chemistry' ? 140 : subject === 'math' ? 270 : 45
      })
    }

    let time = 0
    function draw() {
      time += 0.016
      ctx.fillStyle = showTrail ? 'rgba(13,13,20,0.15)' : '#0D0D14'
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2, cy = h / 2

      if (showField) {
        ctx.strokeStyle = 'rgba(212,175,55,0.04)'
        ctx.lineWidth = 1
        for (let r = 30; r < Math.min(w, h) / 2; r += 40) {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
        }
      }

      const glowSize = 20 + Math.sin(time * 2) * 5
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize * 4)
      const centerColor = subject === 'physics' ? 'rgba(78,205,196,' : subject === 'chemistry' ? 'rgba(80,200,120,' : subject === 'math' ? 'rgba(155,107,212,' : 'rgba(212,175,55,'
      glow.addColorStop(0, centerColor + '0.4)')
      glow.addColorStop(0.3, centerColor + '0.15)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      particles.forEach((p, i) => {
        if ((subject === 'physics' || subject === 'astronomy' || subject === 'general') && gravity > 0) {
          const dx = cx - p.x, dy = cy - p.y
          const dist = Math.sqrt(dx * dx + dy * dy) + 1
          p.vx += (dx / dist) * gravity * 0.02
          p.vy += (dy / dist) * gravity * 0.02
        }
        if (subject === 'chemistry') { p.vx += (Math.random() - 0.5) * 0.1; p.vy += (Math.random() - 0.5) * 0.1 }
        if (subject === 'math') { p.vy += Math.sin(time * 2 + p.x * 0.01) * 0.05 }

        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.alpha})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x, dy = p.y - q.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 80) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `hsla(${p.hue}, 50%, 50%, ${0.08 * (1 - d / 80)})`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [subject, params])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

/* ─── Canvas 路由 ─── */
function TopicCanvas({ topic, params }) {
  if (topic.includes('牛顿第二定律')) return <NewtonCanvas params={params} />
  if (topic.includes('光合作用')) return <PhotosynthesisCanvas params={params} />
  if (topic.includes('勾股定理')) return <PythagoreanCanvas params={params} />
  const subject = detectSubject(topic)
  return <GenericCanvas subject={subject} params={params} />
}

/* ═══════════════════════════════════════════════════════════
   面板组件
   ═══════════════════════════════════════════════════════════ */

function XinfaPanel({ config, topic }) {
  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', marginBottom: '16px', fontWeight: '600' }}>
        鲁班心法
      </h3>
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>核心理论</div>
        <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.7' }}>{config.theory}</div>
      </div>
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>鲁班视角</div>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8', fontStyle: 'italic' }}>"{config.luBanView}"</p>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>现实应用场景</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {config.scenarios.map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{s.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KaiwuPanel({ config, simParams, onParamChange, displayValues }) {
  const { controls, displayParams } = config

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', marginBottom: '16px', fontWeight: '600' }}>
        鲁班开物
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {controls.map((ctrl, i) => {
          if (ctrl.type === 'slider') {
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ctrl.label}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                    {simParams[ctrl.label]}{ctrl.unit || ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={simParams[ctrl.label] ?? ctrl.default}
                  onChange={e => onParamChange(ctrl.label, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>
            )
          }
          if (ctrl.type === 'toggle') {
            const isOn = simParams[ctrl.label] !== false
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ctrl.label}</span>
                <button
                  onClick={() => onParamChange(ctrl.label, !isOn)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isOn ? 'var(--accent-gold)' : 'var(--border)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: isOn ? '22px' : '3px',
                    transition: 'left 0.2s'
                  }} />
                </button>
              </div>
            )
          }
          return null
        })}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>实时数据</div>
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'grid', gap: '12px' }}>
        {displayParams.map((param, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{param.label}</span>
            <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: '500' }}>
              {displayValues[param.key] !== undefined ? String(displayValues[param.key]) : '--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WendaPanel({ config }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState({})

  const handleSelect = (qIdx, opt) => {
    if (submitted[qIdx]) return
    setAnswers(prev => ({ ...prev, [qIdx]: opt }))
  }

  const handleSubmit = (qIdx) => {
    if (!answers[qIdx]) return
    setSubmitted(prev => ({ ...prev, [qIdx]: true }))
  }

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', marginBottom: '16px', fontWeight: '600' }}>
        鲁班问答
      </h3>
      {config.questions.map((q, qi) => {
        const selected = answers[qi]
        const isSubmitted = submitted[qi]
        const isCorrect = isSubmitted && selected === q.answer

        return (
          <div key={qi} style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: '1.6' }}>
              <span style={{ color: 'var(--accent-gold)', marginRight: '8px' }}>{qi + 1}.</span>
              {q.question}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {q.options.map((opt, oi) => {
                const isSelected = selected === opt[0]
                let bg = 'transparent'
                let border = '1px solid var(--border)'
                if (isSubmitted) {
                  if (opt[0] === q.answer) { bg = 'rgba(80,200,120,0.1)'; border = '1px solid #50C878' }
                  else if (isSelected && opt[0] !== q.answer) { bg = 'rgba(220,80,80,0.1)'; border = '1px solid #DC5050' }
                } else if (isSelected) {
                  bg = 'var(--highlight)'
                  border = '1px solid var(--border-gold)'
                }
                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(qi, opt[0])}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: bg,
                      border: border,
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      cursor: isSubmitted ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {!isSubmitted ? (
              <button
                onClick={() => handleSubmit(qi)}
                disabled={!selected}
                style={{
                  padding: '8px 20px',
                  background: selected ? 'var(--gold-gradient)' : 'var(--border)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: selected ? 'var(--bg-primary)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: selected ? 'pointer' : 'not-allowed'
                }}
              >
                提交答案
              </button>
            ) : (
              <div style={{
                padding: '12px',
                background: isCorrect ? 'rgba(80,200,120,0.08)' : 'rgba(220,80,80,0.08)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `3px solid ${isCorrect ? '#50C878' : '#DC5050'}`
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: isCorrect ? '#50C878' : '#DC5050', marginBottom: '4px' }}>
                  {isCorrect ? '✓ 回答正确' : '✗ 回答错误'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{q.explanation}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   主组件
   ═══════════════════════════════════════════════════════════ */
export default function DynamicCasePage({ topic, onBack, theme, onToggleTheme }) {
  const config = getConfig(topic)
  const subject = config.subject || detectSubject(topic)
  const isPreset = config.isPreset

  const [panelState, setPanelState] = useState({ tab: 'xinfa', open: true })
  const [simParams, setSimParams] = useState(() => {
    const defaults = {}
    config.controls.forEach(c => { defaults[c.label] = c.default })
    return defaults
  })
  const [displayValues, setDisplayValues] = useState(() => {
    // 根据预设或通用初始化显示值
    const vals = {}
    config.displayParams.forEach(p => { vals[p.key] = '--' })
    // 牛顿第二定律初始值
    if (topic.includes('牛顿第二定律')) {
      const F = 50, m = 5, mu = 0.2
      const f = mu * m * 9.8
      const netF = Math.max(0, F - f)
      const a = netF / m
      vals.acceleration = a.toFixed(2) + ' m/s²'
      vals.velocity = '0.00 m/s'
      vals.displacement = '0.00 m'
      vals.netForce = netF.toFixed(1) + ' N'
    }
    // 光合作用初始值
    if (topic.includes('光合作用')) {
      vals.o2Rate = '12.5 μmol/m²/s'
      vals.glucoseRate = '2.1 mg/h'
      vals.lightEfficiency = '3.2%'
      vals.enzymeActivity = '85%'
    }
    // 勾股定理初始值
    if (topic.includes('勾股定理')) {
      const a = 3, b = 4
      const c = Math.sqrt(a*a + b*b)
      vals.hypotenuse = c.toFixed(2)
      vals.areaA = (a*a).toString()
      vals.areaB = (b*b).toString()
      vals.areaC = (c*c).toFixed(1)
    }
    // 通用初始值
    if (!isPreset) {
      vals.particleCount = config.controls.find(c => c.label === '粒子数量')?.default || 150
      vals.avgSpeed = (config.controls.find(c => c.label === '运动速度')?.default || 1).toFixed(2)
      vals.kineticEnergy = '2.45'
      vals.collisionCount = '128'
    }
    return vals
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  const handleParamChange = useCallback((key, value) => {
    setSimParams(prev => {
      const next = { ...prev, [key]: value }

      // 牛顿第二定律实时计算
      if (topic.includes('牛顿第二定律')) {
        const F = key === '拉力F' ? value : next['拉力F']
        const m = key === '质量m' ? value : next['质量m']
        const mu = key === '摩擦系数μ' ? value : next['摩擦系数μ']
        const f = (mu || 0) * (m || 1) * 9.8
        const netF = Math.max(0, (F || 0) - f)
        const a = netF / (m || 1)
        setDisplayValues(d => ({
          ...d,
          acceleration: a.toFixed(2) + ' m/s²',
          netForce: netF.toFixed(1) + ' N'
        }))
      }

      // 勾股定理实时计算
      if (topic.includes('勾股定理')) {
        const a = key === '直角边a' ? value : next['直角边a']
        const b = key === '直角边b' ? value : next['直角边b']
        const c = Math.sqrt(a*a + b*b)
        setDisplayValues(d => ({
          ...d,
          hypotenuse: c.toFixed(2),
          areaA: (a*a).toString(),
          areaB: (b*b).toString(),
          areaC: (c*c).toFixed(1)
        }))
      }

      // 光合作用
      if (topic.includes('光合作用')) {
        const light = key === '光照强度' ? value : next['光照强度']
        const co2 = key === 'CO₂浓度' ? value : next['CO₂浓度']
        const temp = key === '温度' ? value : next['温度']
        const eff = Math.max(0, (light || 0) * (co2 || 0.001) * 100 * Math.max(0, 1 - Math.abs((temp || 25) - 25) / 30))
        setDisplayValues(d => ({
          ...d,
          lightEfficiency: eff.toFixed(1) + '%',
          o2Rate: (eff * 0.8).toFixed(1) + ' μmol/m²/s',
          glucoseRate: (eff * 0.15).toFixed(2) + ' mg/h',
          enzymeActivity: Math.min(100, Math.max(0, 100 - Math.abs((temp || 25) - 37) * 3)).toFixed(0) + '%'
        }))
      }

      // 通用
      if (key === '粒子数量') setDisplayValues(d => ({ ...d, particleCount: value, activeCount: value }))
      if (key === '运动速度') setDisplayValues(d => ({ ...d, avgSpeed: value.toFixed(2) }))
      if (key === '引力强度') setDisplayValues(d => ({ ...d, gravity: (value * 19.6).toFixed(1) + ' m/s²' }))
      if (key === '反应温度') setDisplayValues(d => ({ ...d, reactionRate: (value / 25).toFixed(2) }))
      if (key === '反应物浓度') setDisplayValues(d => ({ ...d, conversionRate: Math.min(100, (value * 72)).toFixed(0) + '%' }))
      if (key === '中心质量') setDisplayValues(d => ({ ...d, orbitalPeriod: (365 / value).toFixed(0) + '天' }))
      if (key === '角度θ') {
        const rad = value * Math.PI / 180
        setDisplayValues(d => ({ ...d, sinValue: Math.sin(rad).toFixed(3), cosValue: Math.cos(rad).toFixed(3) }))
      }

      return next
    })
  }, [topic])

  const handleTabClick = useCallback((tabId) => {
    setPanelState(prev => ({
      tab: tabId,
      open: prev.tab === tabId ? !prev.open : true
    }))
  }, [])

  const closePanel = useCallback(() => {
    setPanelState(prev => ({ ...prev, open: false }))
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const { tab: activeTab, open: panelOpen } = panelState

  return (
    <div ref={containerRef} style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {!isFullscreen && (
        <header style={{
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onBack}
              style={{
                background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '14px', padding: '6px 10px', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--highlight)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
            >
              <ArrowLeft size={18} /> 返回
            </button>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
            <Sparkles size={16} color={config.color} />
            <h1 style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontWeight: '600' }}>
              {topic}
            </h1>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--highlight)', padding: '2px 8px', borderRadius: '4px' }}>
              {config.label} · {isPreset ? '专门可视化' : '动态生成'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={toggleFullscreen} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              padding: '6px 8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', transition: 'all 0.2s'
            }}>
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button onClick={onToggleTheme} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              padding: '6px 8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', transition: 'all 0.2s'
            }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
      )}

      {/* 主内容 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          flex: 1,
          marginRight: panelOpen ? '35%' : '0',
          transition: 'margin-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative', background: 'var(--bg-secondary)', zIndex: 1
        }}>
          <TopicCanvas topic={topic} params={simParams} />
          {isFullscreen && (
            <button onClick={toggleFullscreen} style={{
              position: 'absolute', bottom: '20px', right: '20px', padding: '8px 16px',
              background: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(8px)'
            }}>ESC 退出全屏</button>
          )}
        </div>

        {/* 右侧面板 */}
        <div style={{
          position: 'absolute', top: 0, right: panelOpen ? 0 : '-35%', width: '35%', height: '100%',
          background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
          transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 10, boxShadow: panelOpen ? '-4px 0 20px rgba(0,0,0,0.3)' : 'none'
        }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {TABS.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                      background: isActive ? 'var(--highlight)' : 'transparent',
                      border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                      borderRadius: 'var(--radius-md)', color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s'
                    }}>
                      <Icon size={14} /> {tab.label}
                    </button>
                  )
                })}
              </div>
              <button onClick={closePanel} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {activeTab === 'xinfa' && <XinfaPanel config={config} topic={topic} />}
              {activeTab === 'kaiwu' && <KaiwuPanel config={config} simParams={simParams} onParamChange={handleParamChange} displayValues={displayValues} />}
              {activeTab === 'wenda' && <WendaPanel config={config} />}
            </div>
          </div>
        </div>
      </div>

      {/* 底部标签栏 */}
      {!isFullscreen && (
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)',
          display: 'flex', justifyContent: 'center', gap: '12px', flexShrink: 0, position: 'relative', zIndex: 20
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id && panelOpen
            return (
              <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 28px',
                background: isActive ? 'var(--highlight)' : 'transparent',
                border: isActive ? '1px solid var(--border-gold)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s'
              }}>
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
