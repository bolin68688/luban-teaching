// 案例数据
export const cases = [
  {
    id: 'lever',
    title: '杠杆原理',
    subject: '物理 · 力学',
    grade: '八年级',
    difficulty: 2,
    icon: 'scale',
    tagline: '省力必费距离，费力必省距离——天地之道也',
    description: '通过3D交互实验，深入理解杠杆平衡原理，探索力与距离的trade-off关系。',
    xinfa: {
      theory: '杠杆平衡条件：F₁·L₁ = F₂·L₂',
      luBanView: '鲁班造器，必依杠杆之理。砣秤量金，剪裁成形，皆源于此。生活中，杠杆无处不在——从杆秤到指甲剪，无一不遵循此道。',
      scenarios: [
        { name: '杆秤', desc: '等臂杠杆的典范，古代鲁班发明' },
        { name: '裁纸刀', desc: '省力杠杆，降低手指疲劳' },
        { name: '镊子', desc: '费力杠杆，便于精细操作' },
        { name: '核桃夹', desc: '省力杠杆，轻松碎壳' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'slider', label: '支点位置', min: 0.2, max: 0.8, default: 0.5, step: 0.01 },
        { type: 'slider', label: '动力臂长度', min: 0.5, max: 3, default: 1.5, step: 0.1, unit: 'm' },
        { type: 'slider', label: '阻力臂长度', min: 0.5, max: 3, default: 1.5, step: 0.1, unit: 'm' },
        { type: 'select', label: '动力大小', options: ['1N', '2N', '5N', '10N'], default: '5N' },
        { type: 'select', label: '阻力物质量', options: ['1kg', '2kg', '5kg', '10kg'], default: '5kg' }
      ],
      displayParams: [
        { key: 'leftTorque', label: '左侧力矩' },
        { key: 'rightTorque', label: '右侧力矩' },
        { key: 'balanceState', label: '平衡状态' },
        { key: 'mechanicalAdvantage', label: '机械效率' }
      ]
    },
    wenda: [
      {
        id: 'lever-q1',
        question: '下列工具中，哪个是费力杠杆？',
        options: ['A. 核桃夹', 'B. 裁纸刀', 'C. 镊子', 'D. 开瓶器'],
        answer: 'C',
        explanation: '镊子属于费力杠杆，其目的是省距离而非省力，便于夹取细小物体。费力杠杆的特点是动力臂小于阻力臂。'
      },
      {
        id: 'lever-q2',
        question: '用杠杆撬起一块200N的石头，若动力臂长3m，阻力臂长0.5m，则需要施加的力为多少？',
        options: ['A. 30N', 'B. 33.3N', 'C. 50N', 'D. 100N'],
        answer: 'B',
        explanation: '根据杠杆平衡条件 F₁·L₁ = F₂·L₂，F₁ = F₂·L₂/L₁ = 200×0.5/3 ≈ 33.3N'
      },
      {
        id: 'lever-q3',
        question: '"省力必费距离"的本质是什么定律？',
        options: ['A. 能量守恒定律', 'B. 牛顿第三定律', 'C. 功的原理', 'D. 摩擦力'],
        answer: 'C',
        explanation: '功的原理指出，使用任何机械都不能省功。省力则意味着力减小，距离必增加，保持功不变。'
      },
      {
        id: 'lever-q4',
        question: '若支点无限靠近重物，杠杆会变成哪种简单机械？',
        options: ['A. 斜面', 'B. 滑轮', 'C. 轮轴', 'D. 劈'],
        answer: 'C',
        explanation: '当支点无限靠近阻力点时，杠杆演变为轮轴，本质上是连续旋转的杠杆。'
      },
      {
        id: 'lever-q5',
        question: '为什么裁纸刀通常设计成省力杠杆？',
        options: ['A. 省力', 'B. 省距离', 'C. 更稳定', 'D. 更省材料'],
        answer: 'A',
        explanation: '裁纸需要较大力量，设计成省力杠杆可以用较小的手部力量完成裁切任务。'
      }
    ]
  },
  {
    id: 'refraction',
    title: '光的折射',
    subject: '物理 · 光学',
    grade: '八年级',
    difficulty: 2,
    icon: 'eye',
    tagline: '光行水里，如人行陆——变的是介质，不变的是心',
    description: '通过交互式光路实验，理解斯涅尔定律，探索折射与全反射的奥秘。',
    xinfa: {
      theory: '斯涅尔定律：n₁·sinθ₁ = n₂·sinθ₂',
      luBanView: '光入异质必折，此天地之常理。鲁班制灯，须知光之折向，方能聚照成形。',
      scenarios: [
        { name: '叉鱼', desc: '看到的鱼比实际位置浅' },
        { name: '筷子折断', desc: '水中筷子看起来变弯' },
        { name: '钻石火彩', desc: '高折射率产生绚烂光彩' },
        { name: '彩虹', desc: '水滴折射+反射分解阳光' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'slider', label: '入射角', min: 0, max: 90, default: 45, step: 1, unit: '°' },
        { type: 'select', label: '介质组合', options: ['空气→水(n=1.33)', '空气→玻璃(n=1.50)', '空气→钻石(n=2.42)'], default: '空气→水(n=1.33)' },
        { type: 'toggle', label: '显示全反射', default: false }
      ],
      displayParams: [
        { key: 'refractionAngle', label: '折射角' },
        { key: 'criticalAngle', label: '临界角' },
        { key: 'refractiveIndex', label: '折射率' },
        { key: 'totalReflection', label: '全反射' }
      ]
    },
    wenda: [
      {
        id: 'refraction-q1',
        question: '光从空气垂直射入水中时，传播方向会怎样？',
        options: ['A. 向法线偏折', 'B. 背向法线偏折', 'C. 不变', 'D. 无法确定'],
        answer: 'C',
        explanation: '当光线垂直入射（入射角为0°）时，不发生偏折，沿着原来的方向传播。'
      },
      {
        id: 'refraction-q2',
        question: '水的折射率约为1.33，若入射角为60°，折射角约为多少？',
        options: ['A. 40.8°', 'B. 45°', 'C. 22.5°', 'D. 60°'],
        answer: 'A',
        explanation: '根据斯涅尔定律：sin60°/1.33 ≈ 0.65，arcsin(0.65) ≈ 40.8°'
      },
      {
        id: 'refraction-q3',
        question: '全反射现象发生在什么条件下？',
        options: ['A. 光从光密介质到光疏介质，入射角>临界角', 'B. 光从光疏介质到光密介质', 'C. 任何情况', 'D. 光垂直入射时'],
        answer: 'A',
        explanation: '全反射仅当光从光密介质射向光疏介质，且入射角大于临界角时才会发生。'
      },
      {
        id: 'refraction-q4',
        question: '为什么钻石看起来特别闪亮？',
        options: ['A. 颜色特别', 'B. 硬度高', 'C. 折射率大，全反射多', 'D. 体积小'],
        answer: 'C',
        explanation: '钻石折射率高达2.42，临界角很小，切割角度使光在内部多次全反射，产生火彩。'
      },
      {
        id: 'refraction-q5',
        question: '池水看起来比实际深度要浅，这是因为？',
        options: ['A. 水的密度不均匀', 'B. 折射使光线向法线偏折', 'C. 心理作用', 'D. 水面波动'],
        answer: 'B',
        explanation: '从水中物体发出的光线经水面折射后进入空气，折射角大于入射角，人眼逆着光路看到虚像在较浅位置。'
      }
    ]
  },
  {
    id: 'equation',
    title: '二元一次方程组',
    subject: '数学 · 代数',
    grade: '七年级',
    difficulty: 1,
    icon: 'grid-3x3',
    tagline: '一线定势，两线相交，知交点则知全局',
    description: '通过动态坐标系，直观理解方程组的解的几何意义。',
    xinfa: {
      theory: '方程组解的几何意义：两条直线的交点坐标',
      luBanView: '解方程如寻两线之交点，交点既得，问题自明。鲁班制图，必先定点位，方能成器。',
      scenarios: [
        { name: '购物决策', desc: '比较两家店的性价比' },
        { name: '行程规划', desc: '两人相向而行的相遇时间' },
        { name: '配料配比', desc: '两种原料混合达到目标浓度' },
        { name: '工程预算', desc: '材料与人工成本的最优组合' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'slider', label: '直线1斜率', min: -5, max: 5, default: 1, step: 0.1 },
        { type: 'slider', label: '直线1截距', min: -10, max: 10, default: 0, step: 0.5 },
        { type: 'slider', label: '直线2斜率', min: -5, max: 5, default: -1, step: 0.1 },
        { type: 'slider', label: '直线2截距', min: -10, max: 10, default: 5, step: 0.5 },
        { type: 'button', label: '预设场景', options: ['购物决策', '行程相遇', '配料配比'] }
      ],
      displayParams: [
        { key: 'solution', label: '交点坐标' },
        { key: 'solutionType', label: '解的类型' },
        { key: 'eq1', label: '方程1' },
        { key: 'eq2', label: '方程2' }
      ]
    },
    wenda: [
      {
        id: 'eq-q1',
        question: '方程组 {x + y = 5, x - y = 1} 的解是？',
        options: ['A. (3, 2)', 'B. (2, 3)', 'C. (4, 1)', 'D. (3, 1)'],
        answer: 'A',
        explanation: '两式相加得2x=6，x=3；代入得y=2。故解为(3, 2)。'
      },
      {
        id: 'eq-q2',
        question: '若两条直线平行无交点，方程组的解的情况是？',
        options: ['A. 唯一解', 'B. 无解', 'C. 无数解', 'D. 无法确定'],
        answer: 'B',
        explanation: '平行直线无交点，对应方程组无解（矛盾方程）。'
      },
      {
        id: 'eq-q3',
        question: '用代入消元法解 {2x + y = 7, x - y = 2}，第一步是？',
        options: ['A. 将x=y+2代入第一个方程', 'B. 将y=2x-7代入第二个方程', 'C. 两式相加消元', 'D. 将x=2+y代入'],
        answer: 'A',
        explanation: '代入消元法应从一个方程中解出一个未知数，再代入另一个方程。这里从第二个方程解出x=y+2代入第一个方程。'
      },
      {
        id: 'eq-q4',
        question: '方程组 {ax + by = 6, 2ax + 2by = 12} 有多少解？',
        options: ['A. 0个', 'B. 1个', 'C. 无数个', 'D. 无法确定'],
        answer: 'C',
        explanation: '第二个方程是第一个方程的2倍，两式等价，因此有无数解（两方程表示同一条直线）。'
      },
      {
        id: 'eq-q5',
        question: '"代入消元法"的核心思想是什么？',
        options: ['A. 消去一个未知数', 'B. 用一个问题表示另一个', 'C. 两式相加', 'D. 画图求解'],
        answer: 'B',
        explanation: '代入消元的核心是用一个未知数表示另一个，将二元转化为一元，体现了鲁班"以简驭繁"的思想。'
      }
    ]
  },
  {
    id: 'periodic',
    title: '元素周期表',
    subject: '化学 · 原子结构',
    grade: '九年级',
    difficulty: 3,
    icon: 'atom',
    tagline: '万物皆有数，数目定则性——原子之数，化学之本',
    description: '探索元素周期律的本质，理解原子结构与化学性质的关系。',
    xinfa: {
      theory: '元素性质呈周期性变化的本质：电子层结构周期性',
      luBanView: '天下之物，皆有定数。原子电子之数，定化学之性。周期表者，天地物质之谱也。',
      scenarios: [
        { name: '钠钾剧烈反应', desc: '同族元素，都与水剧烈反应' },
        { name: '卤族氧化性', desc: '氟氯溴碘氧化性从上到下递减' },
        { name: '惰性气体稳定', desc: '难得"不动心"，化学性质稳定' },
        { name: '金属活动顺序', desc: '置换反应的"江湖地位排序"' }
      ]
    },
    kaiwu: {
      controls: [
        { type: 'element-select', label: '选择元素' },
        { type: 'dimension', label: '属性维度', options: ['原子半径', '电负性', '金属性', '化合价'], default: '电负性' },
        { type: 'toggle', label: '同族高亮', default: false },
        { type: 'toggle', label: '3D电子层模型', default: false }
      ],
      displayParams: [
        { key: 'symbol', label: '元素符号' },
        { key: 'atomicNumber', label: '原子序数' },
        { key: 'electronConfig', label: '电子排布' },
        { key: 'electronegativity', label: '电负性' }
      ]
    },
    wenda: [
      {
        id: 'pt-q1',
        question: '下列元素中，电负性最大的是？',
        options: ['A. C', 'B. N', 'C. O', 'D. F'],
        answer: 'D',
        explanation: '氟(F)是电负性最强的元素，鲍林标度为3.98。'
      },
      {
        id: 'pt-q2',
        question: 'Na和Al在元素周期表中的位置关系是？',
        options: ['A. 同周期，Na在Al左边', 'B. 同周期，Na在Al右边', 'C. 同族', 'D. 无法确定'],
        answer: 'A',
        explanation: 'Na和Al同属第三周期，金属性Na>Al，故Na在Al左边（金属性越强越靠左）。'
      },
      {
        id: 'pt-q3',
        question: '某元素原子序数为17，它在化学反应中通常显示什么价态？',
        options: ['A. -1', 'B. +1', 'C. +5', 'D. -1或+5或+7'],
        answer: 'D',
        explanation: '氯(Cl)原子序数为17，常见价态有-1、+1、+3、+5、+7等多种氧化态。'
      },
      {
        id: 'pt-q4',
        question: '元素周期律的本质原因是什么？',
        options: ['A. 原子量递增', 'B. 最外层电子数周期性变化', 'C. 核电荷数递增', 'D. 中子数变化'],
        answer: 'B',
        explanation: '随着核电荷数递增，最外层电子数呈周期性变化，导致化学性质周期性变化，这正是元素周期律的本质。'
      },
      {
        id: 'pt-q5',
        question: '为什么He/Ne/Ar等惰性气体化学性质稳定？',
        options: ['A. 原子最小', 'B. 电子数为偶数', 'C. 最外层8电子稳定结构', 'D. 密度小'],
        answer: 'C',
        explanation: '惰性气体的最外层电子数达到稳定结构（氦为2电子，其他为8电子），难得失电子，化学性质稳定。'
      }
    ]
  }
]

export const getCaseById = (id) => cases.find(c => c.id === id)
