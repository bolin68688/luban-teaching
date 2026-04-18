// 案例数据 - 精选4个高质量可视化案例
export const cases = [
  {
    id: 'wave-interference',
    title: '波的干涉',
    subject: '物理 · 光学',
    grade: '九年级',
    difficulty: 2,
    icon: 'waves',
    tagline: '两波相遇，或增或减——干涉条纹，明暗相间，此光之密语也',
    description: '通过交互式双缝干涉模拟，直观理解波的叠加原理，探索明暗相间条纹的形成机制。',
    xinfa: {
      theory: '波的干涉条件：频率相同、振动方向相同、相位差恒定',
      luBanView: '鲁班制器，知共振之和、干涉之妙。两波相遇，或增或减，此自然之理。声学之和谐、光学之五彩，皆源于此。',
      scenarios: [
        { name: '水波干涉', desc: '湖面双石击水，形成同心圆波纹相交' },
        { name: '光学干涉', desc: '肥皂泡薄膜呈现彩色条纹' },
        { name: '降噪耳机', desc: '主动降噪利用声波干涉相消原理' },
        { name: '全息摄影', desc: '利用干涉记录物光相位信息' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'slider', label: '波长', min: 0.5, max: 3, default: 1.5, step: 0.1, unit: 'λ' },
        { type: 'slider', label: '双缝间距', min: 1, max: 10, default: 4, step: 0.5, unit: 'd' },
        { type: 'slider', label: '屏幕距离', min: 5, max: 20, default: 10, step: 0.5, unit: 'L' },
        { type: 'toggle', label: '显示加强区', default: true },
        { type: 'toggle', label: '显示相消区', default: true }
      ],
      displayParams: [
        { key: 'fringeSpacing', label: '条纹间距' },
        { key: 'maxOrder', label: '可见最大级次' },
        { key: 'constructiveCount', label: '加强条纹数' },
        { key: 'destructiveCount', label: '相消位置数' }
      ]
    },
    wenda: [
      {
        id: 'wave-q1',
        question: '双缝干涉实验中，若将双缝间距减小，干涉条纹间距如何变化？',
        options: ['A. 增大', 'B. 减小', 'C. 不变', 'D. 先增后减'],
        answer: 'A',
        explanation: '根据条纹间距公式 Δx = λL/d，间距d减小，条纹间距Δx增大。'
      },
      {
        id: 'wave-q2',
        question: '两列波发生稳定干涉的条件是？',
        options: ['A. 振幅相同', 'B. 频率相同且相位差恒定', 'C. 波长相同', 'D. 传播方向相同'],
        answer: 'B',
        explanation: '产生稳定干涉的条件：频率相同、振动方向相同、相位差恒定。'
      },
      {
        id: 'wave-q3',
        question: '在波的干涉中，加强点的相位关系是？',
        options: ['A. 反相', 'B. 同相或相位差为2π的整数倍', 'C. 相差π/2', 'D. 无规律'],
        answer: 'B',
        explanation: '加强点（相长干涉）条件：相位差为2π的整数倍，即波峰与波峰相遇。'
      },
      {
        id: 'wave-q4',
        question: '牛顿环实验属于哪种干涉？',
        options: ['A. 双缝干涉', 'B. 薄膜干涉', 'C. 多缝干涉', 'D. 麦克尔逊干涉'],
        answer: 'B',
        explanation: '牛顿环是平凸透镜与平板玻璃形成的空气薄膜产生的等厚干涉。'
      },
      {
        id: 'wave-q5',
        question: '关于光的干涉，下列说法正确的是？',
        options: ['A. 干涉说明光具有波动性', 'B. 干涉条纹等间距', 'C. 白光干涉产生彩色条纹', 'D. 以上都对'],
        answer: 'D',
        explanation: '干涉证明光具有波动性；双缝干涉条纹等间距；白光含多种波长，各自有不同条纹间距故呈彩色。'
      }
    ]
  },
  {
    id: 'solar-system',
    title: '太阳系运行',
    subject: '天文 · 动力学',
    grade: '八年级',
    difficulty: 2,
    icon: 'sun',
    tagline: '引力如丝，行星如珠——宇宙之舞，万有引力之证',
    description: '模拟太阳系行星轨道运动，探索万有引力定律与开普勒定律的奥秘。',
    xinfa: {
      theory: '万有引力定律：F = G·M·m/r²',
      luBanView: '鲁班观天象，知日月五星之行，皆循天道。引力无形，化万物于轨中，此造物之妙也。太阳系者，天地之微缩也。',
      scenarios: [
        { name: '行星公转', desc: '八大行星各行其道，公转周期不同' },
        { name: '卫星环绕', desc: '月球绕地、地月系绕太阳' },
        { name: '彗星椭圆轨道', desc: '哈雷彗星76年一回归' },
        { name: '潮汐锁定', desc: '月球始终以同一面对着地球' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'slider', label: '太阳质量', min: 0.5, max: 2, default: 1, step: 0.1, unit: 'M☉' },
        { type: 'slider', label: '初始速度', min: 0.5, max: 2, default: 1, step: 0.1, unit: 'v₀' },
        { type: 'slider', label: '引力强度', min: 0.1, max: 2, default: 1, step: 0.1 },
        { type: 'toggle', label: '显示轨道', default: true },
        { type: 'toggle', label: '显示速度矢量', default: false },
        { type: 'button', label: '重置', options: ['圆形轨道', '椭圆轨道', '抛物线轨道'] }
      ],
      displayParams: [
        { key: 'orbitalPeriod', label: '公转周期' },
        { key: 'orbitalSpeed', label: '轨道速度' },
        { key: 'eccentricity', label: '离心率' },
        { key: 'energy', label: '机械能' }
      ]
    },
    wenda: [
      {
        id: 'solar-q1',
        question: '地球绕太阳公转的周期约为多少？',
        options: ['A. 24小时', 'B. 30天', 'C. 365天', 'D. 3650天'],
        answer: 'C',
        explanation: '地球公转周期约为365.25天，即一年。'
      },
      {
        id: 'solar-q2',
        question: '若地球公转轨道是椭圆，则地球在哪个月份离太阳最近？',
        options: ['A. 1月', 'B. 7月', 'C. 无固定规律', 'D. 始终相同距离'],
        answer: 'A',
        explanation: '地球近日点在1月初，远日点在7月初。北半球冬季时地球离太阳最近。'
      },
      {
        id: 'solar-q3',
        question: '太阳系中，哪颗行星的公转周期最短？',
        options: ['A. 金星', 'B. 地球', 'C. 火星', 'D. 水星'],
        answer: 'D',
        explanation: '水星距太阳最近，公转周期最短，约为88地球天。'
      },
      {
        id: 'solar-q4',
        question: '人造地球卫星绕地球做圆周运动，其向心力来源于？',
        options: ['A. 燃料推力', 'B. 地球引力', 'C. 太阳能', 'D. 大气阻力'],
        answer: 'B',
        explanation: '卫星在轨运行时，只受地球引力作用，该引力提供其做圆周运动的向心力。'
      },
      {
        id: 'solar-q5',
        question: '开普勒第三定律T²/R³ = k中，T和R分别代表什么？',
        options: ['A. T是公转周期，R是轨道半径', 'B. T是自转周期，R是行星半径', 'C. T是公转周期，R是日地距离', 'D. 以上都不对'],
        answer: 'A',
        explanation: '开普勒第三定律：T² ∝ R³，T为公转周期，R为轨道半长轴（对于圆轨道即为半径）。'
      }
    ]
  },
  {
    id: 'acid-base',
    title: '酸碱滴定',
    subject: '化学 · 反应原理',
    grade: '九年级',
    difficulty: 2,
    icon: 'flask',
    tagline: '酸碱相遇，氢氧相会——滴定终点，颜色突变，如化学之魔术',
    description: '通过虚拟滴定实验，理解酸碱中和反应的原理，掌握滴定曲线与指示剂变色原理。',
    xinfa: {
      theory: '酸碱中和反应：H⁺ + OH⁻ → H₂O',
      luBanView: '鲁班炼丹，知酸碱之性。相遇则中和，如阴阳相济。滴定之法，以少测多，精确万分，此化学之巧也。',
      scenarios: [
        { name: '胃药制酸', desc: '氢氧化铝中和过多胃酸' },
        { name: '土壤改良', desc: '石灰中和酸性土壤' },
        { name: '工业酸洗', desc: '酸碱废水处理' },
        { name: '食品加工', desc: '柠檬酸调节饮料酸度' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'slider', label: '酸浓度', min: 0.01, max: 0.1, default: 0.05, step: 0.01, unit: 'mol/L' },
        { type: 'slider', label: '碱浓度', min: 0.01, max: 0.1, default: 0.05, step: 0.01, unit: 'mol/L' },
        { type: 'slider', label: '初始体积', min: 10, max: 50, default: 25, step: 1, unit: 'mL' },
        { type: 'select', label: '指示剂', options: ['酚酞(8.2-10.0)', '甲基橙(3.1-4.4)', '石蕊(5.0-8.0)'], default: '酚酞(8.2-10.0)' },
        { type: 'button', label: '滴定操作', options: ['开始滴定', '重置'] }
      ],
      displayParams: [
        { key: 'equivalencePoint', label: '等当点pH' },
        { key: 'titrantVolume', label: '滴定体积' },
        { key: 'phIndicator', label: '指示剂变色范围' },
        { key: 'neutralizationHeat', label: '中和热' }
      ]
    },
    wenda: [
      {
        id: 'acid-q1',
        question: '酸碱滴定中，等当点是指？',
        options: ['A. 指示剂变色的点', 'B. 酸碱物质的量相等的点', 'C. 溶液呈中性的点', 'D. 反应完全停止的点'],
        answer: 'B',
        explanation: '等当点是指加入的酸和碱的物质的量恰好相等的点，此时二者完全反应。'
      },
      {
        id: 'acid-q2',
        question: '用强酸滴定弱碱时，等当点的pH值是多少？',
        options: ['A. 等于7', 'B. 小于7', 'C. 大于7', 'D. 无法确定'],
        answer: 'B',
        explanation: '强酸滴定弱碱生成的盐会水解，使溶液呈酸性，故等当点pH小于7。'
      },
      {
        id: 'acid-q3',
        question: '下列哪种指示剂适用于强酸强碱滴定？',
        options: ['A. 甲基橙', 'B. 酚酞', 'C. 两者均可', 'D. 两者均不行'],
        answer: 'C',
        explanation: '强酸强碱滴定等当点pH=7，甲基橙(3.1-4.4)和酚酞(8.2-10.0)的变色范围都在7附近，都可使用。'
      },
      {
        id: 'acid-q4',
        question: '滴定管读数时，视线应与哪处平齐？',
        options: ['A. 液面上缘', 'B. 液面下缘', 'C. 液面凹液面最低处', 'D. 任意位置'],
        answer: 'C',
        explanation: '读数时应视线与凹液面最低处相平，以减小误差。'
      },
      {
        id: 'acid-q5',
        question: '若用NaOH滴定HCl，以酚酞为指示剂，终点颜色变化为？',
        options: ['A. 无色→红色', 'B. 红色→无色', 'C. 黄色→蓝色', 'D. 无变化'],
        answer: 'A',
        explanation: '酚酞在碱性溶液中呈红色，在酸性或中性溶液中无色。滴定终点由无色变为淡红色。'
      }
    ]
  },
  {
    id: 'trigonometry',
    title: '三角函数',
    subject: '数学 · 三角学',
    grade: '九年级',
    difficulty: 2,
    icon: 'triangle',
    tagline: '正弦余弦，如波起伏——周而复始，此数学之美也',
    description: '通过动态单位圆与函数图像，探索三角函数的周期性变化规律。',
    xinfa: {
      theory: '三角函数定义：sinθ = y/r, cosθ = x/r, tanθ = y/x',
      luBanView: '鲁班制图量角，知三角之妙用。sin与cos如阴阳两极，此消彼长，周而复始。建筑之斜度、声音之波形，皆三角之理也。',
      scenarios: [
        { name: '建筑工程', desc: '斜拉桥索力分析、屋顶坡度计算' },
        { name: '声音与光', desc: '声波是正弦波，广谱颜色由频率决定' },
        { name: 'GPS定位', desc: '三角定位确定位置' },
        { name: '动画制作', desc: '骨骼动画使用三角函数计算关节旋转' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'slider', label: '角度θ', min: 0, max: 360, default: 45, step: 1, unit: '°' },
        { type: 'slider', label: '振幅A', min: 0.5, max: 3, default: 1, step: 0.1, unit: '' },
        { type: 'slider', label: '频率ω', min: 0.5, max: 3, default: 1, step: 0.1, unit: '' },
        { type: 'slider', label: '相位φ', min: 0, max: 360, default: 0, step: 15, unit: '°' },
        { type: 'toggle', label: '显示正弦', default: true },
        { type: 'toggle', label: '显示余弦', default: true },
        { type: 'toggle', label: '显示正切', default: false }
      ],
      displayParams: [
        { key: 'sinValue', label: 'sin(θ)' },
        { key: 'cosValue', label: 'cos(θ)' },
        { key: 'tanValue', label: 'tan(θ)' },
        { key: 'unitCirclePoint', label: '单位圆对应点' }
      ]
    },
    wenda: [
      {
        id: 'trig-q1',
        question: '若点P在单位圆上，∠AOP = 60°，则P点坐标为？',
        options: ['A. (1/2, √3/2)', 'B. (√3/2, 1/2)', 'C. (√2/2, √2/2)', 'D. (1, 0)'],
        answer: 'A',
        explanation: 'cos60° = 1/2, sin60° = √3/2，故P点坐标为(1/2, √3/2)。'
      },
      {
        id: 'trig-q2',
        question: 'sin30° + cos60° = ?',
        options: ['A. 1', 'B. √3', 'C. 1/2', 'D. √3/2'],
        answer: 'A',
        explanation: 'sin30° = 1/2, cos60° = 1/2, 故和为1。'
      },
      {
        id: 'trig-q3',
        question: '三角函数y = sinx的周期是？',
        options: ['A. π', 'B. 2π', 'C. π/2', 'D. 4π'],
        answer: 'B',
        explanation: '正弦函数周期为2π，sin(x + 2π) = sinx。'
      },
      {
        id: 'trig-q4',
        question: '当θ = 45°时，tanθ的值是？',
        options: ['A. 1', 'B. √3', 'C. √3/3', 'D. 0'],
        answer: 'A',
        explanation: 'tan45° = sin45°/cos45° = (√2/2)/(√2/2) = 1。'
      },
      {
        id: 'trig-q5',
        question: '在直角三角形ABC中，∠C = 90°，若AC = 3，BC = 4，则sinA = ?',
        options: ['A. 3/5', 'B. 4/5', 'C. 3/4', 'D. 4/3'],
        answer: 'B',
        explanation: 'AB(斜边) = √(3²+4²) = 5，sinA = 对边/斜边 = BC/AB = 4/5。'
      }
    ]
  }
]

export const getCaseById = (id) => cases.find(c => c.id === id)