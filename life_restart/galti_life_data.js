// ============================================
// Gal人生重开模拟器 - World & Identity Data
// ============================================

const LIFE_WORLDS = {
  // ===== 通用类型 =====
  "和平现代": {
    desc: "平凡而安稳的现代社会，没有超自然力量",
    icon: "🏙️",
    happinessMod: 1,
    identities: [
      {name:"普通学生",desc:"平凡家庭的孩子",happinessMod:0,wealthMod:0},
      {name:"富二代",desc:"企业家子女，含着金汤匙出生",happinessMod:1,wealthMod:3},
      {name:"学霸天才",desc:"智商超群的天才少年",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"体育特长生",desc:"天赋异禀的运动少年",happinessMod:1,wealthMod:0,hpBonus:2},
      {name:"艺术世家",desc:"音乐/绘画世家的传人",happinessMod:1,wealthMod:1,looksBonus:1},
      {name:"孤儿",desc:"自幼失去双亲的可怜孩子",happinessMod:-2,wealthMod:-2},
      {name:"乡村少年",desc:"在小村庄长大的纯朴孩子",happinessMod:0,wealthMod:-1},
      {name:"混血儿",desc:"跨国婚姻家庭的孩子",happinessMod:0,wealthMod:1,looksBonus:1},
      {name:"留守儿童",desc:"父母在外打工，跟着爷爷奶奶",happinessMod:-1,wealthMod:-1},
      {name:"军人子女",desc:"军人家庭，纪律严明",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"留学生",desc:"在国外出生长大的华裔",happinessMod:0,wealthMod:1,intBonus:1},
    ],
    birthplaces: ["北京","上海","小城镇","偏远山村","深圳","成都","台北","东京"],
    extraChoices: []
  },

  "高武世界": {
    desc: "武道昌盛的世界，强者可开山裂石",
    icon: "👊",
    happinessMod: 0,
    identities: [
      {name:"武馆弟子",desc:"从小在武馆习武",happinessMod:0,wealthMod:0,hpBonus:2},
      {name:"武术世家传人",desc:"百年武学世家的继承人",happinessMod:1,wealthMod:1,hpBonus:1},
      {name:"天赋废柴",desc:"无法凝聚内力的废材",happinessMod:-2,wealthMod:0},
      {name:"散修之子",desc:"独来独往的武者后代",happinessMod:-1,wealthMod:-1,hpBonus:1},
      {name:"江湖浪子",desc:"四海为家的武林人士",happinessMod:0,wealthMod:-1},
      {name:"将军之子",desc:"镇国将军的后代",happinessMod:1,wealthMod:2,hpBonus:1},
      {name:"药师学徒",desc:"跟随药师学习炼药",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"铸剑师后人",desc:"打造神兵利器的家族",happinessMod:0,wealthMod:1},
      {name:"武道天才",desc:"百年难遇的练武奇才",happinessMod:1,wealthMod:0,hpBonus:2,intBonus:1},
      {name:"隐世高人弟子",desc:"被隐世高人收为关门弟子",happinessMod:1,wealthMod:0,hpBonus:2},
      {name:"山贼之子",desc:"占山为王的草莽后代",happinessMod:-1,wealthMod:-1},
    ],
    birthplaces: ["武当山","少林寺","京城武馆","江湖小镇","边关要塞","深山老林","铸剑山庄"],
    extraChoices: [
      {
        title: "你的武道天赋偏向",
        key: "martialType",
        options: ["拳法","剑术","刀法","掌法","腿法","内功","暗器","枪法"]
      }
    ]
  },

  "魔法世界": {
    desc: "充满魔法与冒险的奇幻大陆",
    icon: "🔮",
    happinessMod: 0,
    identities: [
      {name:"魔法学徒",desc:"刚踏入魔法殿堂的新人",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"贵族法师",desc:"名门魔法家族的继承人",happinessMod:1,wealthMod:2,intBonus:1},
      {name:"精灵混血",desc:"拥有精灵血统的半精灵",happinessMod:0,wealthMod:0,looksBonus:2},
      {name:"兽人后裔",desc:"拥有兽人力量的混血儿",happinessMod:-1,wealthMod:-1,hpBonus:2},
      {name:"龙语者",desc:"能与中国巨龙沟通的稀有天赋",happinessMod:1,wealthMod:0,intBonus:2},
      {name:"炼金术士",desc:"追求等价交换的真理",happinessMod:0,wealthMod:1,intBonus:2},
      {name:"暗影法师",desc:"行走在光明与黑暗之间",happinessMod:-1,wealthMod:0,intBonus:1},
      {name:"圣光祭司",desc:"信仰光明神的治愈者",happinessMod:1,wealthMod:0},
      {name:"流浪吟游诗人",desc:"用歌声传递故事的旅人",happinessMod:0,wealthMod:-1,looksBonus:1},
      {name:"魔法学院优等生",desc:"天赋与努力并存的学霸",happinessMod:1,wealthMod:0,intBonus:2},
      {name:"魔物猎人",desc:"专门猎杀危险魔物的战士",happinessMod:-1,wealthMod:1,hpBonus:1},
    ],
    birthplaces: ["魔法学院","精灵森林","矮人山脉","王都","边境小镇","暗影之城","龙之谷"],
    extraChoices: [
      {
        title: "你的魔法属性",
        key: "magicElement",
        options: ["火系","水系","风系","土系","雷系","光系","暗系","空间系"]
      }
    ]
  },

  "修仙世界": {
    desc: "追求长生不老的仙侠世界",
    icon: "⛰️",
    happinessMod: 0,
    identities: [
      {name:"散修之子",desc:"无门无派的修仙者",happinessMod:-1,wealthMod:-1,intBonus:1},
      {name:"仙门弟子",desc:"名门正派的弟子",happinessMod:1,wealthMod:0,intBonus:1},
      {name:"天灵根",desc:"万中无一的修炼奇才",happinessMod:2,wealthMod:0,intBonus:3},
      {name:"废灵根",desc:"修炼之路困难重重",happinessMod:-2,wealthMod:0},
      {name:"魔修",desc:"走上魔道修炼之路",happinessMod:-1,wealthMod:0,intBonus:1},
      {name:"炼丹师",desc:"擅长炼制丹药的修士",happinessMod:0,wealthMod:1,intBonus:2},
      {name:"剑修",desc:"一心向道的剑道修士",happinessMod:0,wealthMod:0,hpBonus:1,intBonus:1},
      {name:"妖族后裔",desc:"拥有妖族血脉的修士",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"凡人转世",desc:"前世大能转世重修",happinessMod:1,wealthMod:0,intBonus:2},
      {name:"符箓师",desc:"精通符箓之道",happinessMod:0,wealthMod:1,intBonus:1},
      {name:"世家嫡系",desc:"修仙世家的正统传人",happinessMod:1,wealthMod:2},
    ],
    birthplaces: ["太虚山","昆仑仙山","天机城","魔域深渊","灵药园","剑冢","混沌秘境"],
    extraChoices: [
      {
        title: "你的灵根属性",
        key: "linggen",
        options: ["金灵根","木灵根","水灵根","火灵根","土灵根","冰灵根","雷灵根","风灵根"]
      }
    ]
  },

  "末世废土": {
    desc: "资源匮乏的末日世界，适者生存",
    icon: "☢️",
    happinessMod: -2,
    identities: [
      {name:"幸存者",desc:"普通避难所居民",happinessMod:-1,wealthMod:-2},
      {name:"搜拾者",desc:"在废墟中搜寻物资的拾荒者",happinessMod:-1,wealthMod:-1},
      {name:"军阀之子",desc:"掌控一片区域的军阀后代",happinessMod:0,wealthMod:1},
      {name:"变异者",desc:"因辐射获得了异能",happinessMod:-2,wealthMod:-1,hpBonus:1},
      {name:"科学家子女",desc:"研究治愈方法的科学家后代",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"雇佣兵",desc:"拿钱办事的末世战士",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"避难所管理者",desc:"管理避难所的核心人员",happinessMod:0,wealthMod:1},
      {name:"流浪商人",desc:"在聚落之间穿行的贸易者",happinessMod:0,wealthMod:1},
      {name:"猎兽人",desc:"专门猎杀变异兽的猎人",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"邪教信徒",desc:"末日教派的虔诚信徒",happinessMod:-2,wealthMod:-1},
      {name:"改造人",desc:"安装了机械义体的人类",happinessMod:-1,wealthMod:0,hpBonus:1,intBonus:1},
    ],
    birthplaces: ["地下避难所","废弃城市","军事要塞","移动聚落","研究所废墟","荒漠绿洲"],
    extraChoices: [
      {
        title: "你携带的初始物资",
        key: "starterGear",
        options: ["医疗包","老式步枪","净水器","收音机","手摇发电机","种子包"]
      }
    ]
  },

  "赛博朋克": {
    desc: "高科技低生活的未来都市，巨型企业统治一切",
    icon: "🌃",
    happinessMod: -1,
    identities: [
      {name:"企业职员",desc:"大企业的底层员工",happinessMod:-1,wealthMod:0},
      {name:"黑客",desc:"在网络世界中纵横的骇客",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"义体医生",desc:"安装改造人体义体的技师",happinessMod:0,wealthMod:1,intBonus:1},
      {name:"街头佣兵",desc:"接受各种委托的赏金猎人",happinessMod:-1,wealthMod:0,hpBonus:1},
      {name:"企业高管子女",desc:"住在云端豪宅的精英阶层",happinessMod:2,wealthMod:3},
      {name:"地下格斗士",desc:"在非法格斗场搏命的拳手",happinessMod:-2,wealthMod:0,hpBonus:2},
      {name:"走私商",desc:"在暗处做非法交易的商人",happinessMod:-1,wealthMod:2},
      {name:"AI研究员",desc:"研究人工意识的前沿科学家",happinessMod:0,wealthMod:1,intBonus:2},
      {name:"贫民窟居民",desc:"住在最底层的普通人",happinessMod:-2,wealthMod:-2},
      {name:"摇滚歌手",desc:"用音乐反抗体制的叛逆者",happinessMod:0,wealthMod:0,looksBonus:1},
      {name:"赏金猎人",desc:"追捕企业逃犯的职业猎手",happinessMod:-1,wealthMod:1,hpBonus:1},
    ],
    birthplaces: ["新东京","夜之城","上城区","下城区","企业太空站","地下黑市"],
    extraChoices: [
      {
        title: "你的初始义体改造",
        key: "cyberware",
        options: ["无（纯天然）","视觉增强眼","机械臂","神经加速器","皮下护甲","内置黑客模块"]
      }
    ]
  },

  "异世界": {
    desc: "被召唤到另一个维度的异世界冒险",
    icon: "🌀",
    happinessMod: 0,
    identities: [
      {name:"勇者",desc:"被召唤来拯救世界的勇者",happinessMod:1,wealthMod:1,hpBonus:1,intBonus:1},
      {name:"魔王候补",desc:"拥有魔王潜力的暗之子",happinessMod:-1,wealthMod:0,intBonus:2},
      {name:"转生者",desc:"带着前世记忆转世重生",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"被遗弃的召唤者",desc:"被召唤后又被抛弃的人",happinessMod:-2,wealthMod:-2},
      {name:"龙族契约者",desc:"与巨龙签订了契约",happinessMod:1,wealthMod:0,hpBonus:2},
      {name:"技能觉醒者",desc:"觉醒了稀有技能的幸运儿",happinessMod:1,wealthMod:0,intBonus:1},
      {name:"商人转生",desc:"带着商业头脑来到异世界",happinessMod:0,wealthMod:2},
      {name:"奴隶开局",desc:"在异世界被卖为奴隶",happinessMod:-3,wealthMod:-3},
      {name:"神谕之子",desc:"受到神明眷顾的使者",happinessMod:1,wealthMod:1,intBonus:1},
      {name:"魔物驯养师",desc:"能驯服魔物的特殊职业",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"贵族转生",desc:"转生到异世界贵族家庭",happinessMod:1,wealthMod:2},
    ],
    birthplaces: ["王都","边境村庄","魔法塔","魔族领地","精灵森林","迷宫都市"],
    extraChoices: [
      {
        title: "你的初始技能",
        key: "isekaiSkill",
        options: ["火焰魔法","治愈术","时间减速","物品鉴定","超再生","语言通晓","状态查看","烹饪大师"]
      }
    ]
  },

  "战国乱世": {
    desc: "群雄割据的乱世年代",
    icon: "⚔️",
    happinessMod: -2,
    identities: [
      {name:"武士之子",desc:"忠诚奉公的武士后代",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"忍者",desc:"隐于暗处的情报人员",happinessMod:-1,wealthMod:0,intBonus:1},
      {name:"大名嫡子",desc:"一方诸侯的继承人",happinessMod:1,wealthMod:3},
      {name:"农民",desc:"被战火蹂躏的平民百姓",happinessMod:-2,wealthMod:-3},
      {name:"浪人",desc:"没有主君的流浪武士",happinessMod:-1,wealthMod:-1,hpBonus:1},
      {name:"商人",desc:"在乱世中经营贸易的商人",happinessMod:0,wealthMod:1},
      {name:"僧兵",desc:"寺院武装力量的成员",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"铸造师",desc:"锻造名刀的工匠",happinessMod:0,wealthMod:1,intBonus:1},
      {name:"药师",desc:"治愈伤兵的医者",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"盗贼",desc:"趁乱劫掠的盗匪",happinessMod:-2,wealthMod:0},
      {name:"朝廷贵族",desc:"京都朝廷的公家",happinessMod:1,wealthMod:1,intBonus:1},
    ],
    birthplaces: ["京都","的的府","战场","小田原","安土城","的农村","港口小镇"],
    extraChoices: [
      {
        title: "你效忠的势力",
        key: "faction",
        options: ["织田家","武田家","上杉家","德川家","毛利家","真田家","无主（浪人）"]
      }
    ]
  },

  "弹丸论破": {
    desc: "希望之峰学园——超高校级的绝望与希望之争",
    icon: "🕹️",
    happinessMod: -1,
    identities: [
      {name:"超高校级的幸运",desc:"以抽签入选的天选之人",happinessMod:1,wealthMod:0},
      {name:"超高校级的程序员",desc:"天才级编程能力",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"超高校级的偶像",desc:"国民级人气偶像",happinessMod:0,wealthMod:1,looksBonus:2},
      {name:"超高校级的格斗家",desc:"各种格斗技精通",happinessMod:0,wealthMod:0,hpBonus:2},
      {name:"超高校级的侦探",desc:"推理能力超群",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"超高校级的贵公子",desc:"名门望族的完美少爷/小姐",happinessMod:1,wealthMod:2,looksBonus:1},
      {name:"超高校级的军人",desc:"从战场归来的少年兵",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"超高校级的摄影师",desc:"捕捉决定性瞬间的天才",happinessMod:0,wealthMod:0,looksBonus:1},
      {name:"超高校级的风纪委员",desc:"绝对的秩序维护者",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"超高校级的动漫家",desc:"创作力丰富的宅系天才",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"超高校级的绝望",desc:"隐藏在学生中的绝望残党",happinessMod:-2,wealthMod:0,intBonus:2},
    ],
    birthplaces: ["希望之峰学园本部","希望之峰学园分部","未来机关","塔和市","贾巴沃克岛"],
    extraChoices: [
      {
        title: "你在学级裁判中的角色",
        key: "trialRole",
        options: ["推理担当（像苗木诚）","旁观者","迷之转学生","幕后推手","被冤枉的嫌疑人"]
      }
    ]
  },

  "龙族": {
    desc: "卡塞尔学院——混血种的龙族猎杀者",
    icon: "🐉",
    happinessMod: 0,
    identities: [
      {name:"卡塞尔学院新生",desc:"刚入学的一年级新生",happinessMod:0,wealthMod:0},
      {name:"S级血统拥有者",desc:"拥有极高龙族血统比例",happinessMod:1,wealthMod:0,hpBonus:2,intBonus:1},
      {name:"A级血统混血种",desc:"优秀但非顶级的龙族后裔",happinessMod:0,wealthMod:0,hpBonus:1,intBonus:1},
      {name:"B级血统混血种",desc:"普通的龙族后裔",happinessMod:0,wealthMod:0},
      {name:"C级血统混血种",desc:"血统稀薄的混血种",happinessMod:-1,wealthMod:0},
      {name:"执行局特工",desc:"秘党执行局的精英特工",happinessMod:-1,wealthMod:1,hpBonus:2},
      {name:"诺玛系统的天才黑客",desc:"能操纵诺玛系统的技术天才",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"蛇岐八家成员",desc:"日本蛇岐八家的后裔",happinessMod:0,wealthMod:1},
      {name:"死侍",desc:"血统失控堕落为死侍",happinessMod:-3,wealthMod:-2,hpBonus:3},
      {name:"纯血龙族",desc:"纯血龙族的后裔，极度危险",happinessMod:-2,wealthMod:0,hpBonus:3,intBonus:2},
      {name:"普通人类",desc:"被卷入龙族世界的普通人",happinessMod:-1,wealthMod:0},
    ],
    birthplaces: ["卡塞尔学院（芝加哥）","中国北京","蛇岐八家（东京）","尼伯龙根","北欧冰原","学院图书馆"],
    extraChoices: [
      {
        title: "你的言灵等级",
        key: "yanlingLevel",
        options: ["无（未觉醒）","言灵·命令（83号）","言灵·君焰（89号）","言灵·风行（57号）","言灵·审判（112号）","言灵·镰鼬（59号）","言灵·黑洞（未知号）","言灵·不朽（70号）"]
      }
    ]
  },

  "王者荣耀": {
    desc: "王者大陆——英雄辈出的传奇世界",
    icon: "👑",
    happinessMod: 0,
    identities: [
      {name:"长安城少侠",desc:"长安城的年轻侠客",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"稷下学院学生",desc:"稷下学院的年轻学子",happinessMod:1,wealthMod:0,intBonus:2},
      {name:"魔道天赋者",desc:"拥有魔道天赋的修炼者",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"长城守卫军新兵",desc:"守卫长城的新兵",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"机关师学徒",desc:"研究机关术的学徒",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"玄雍城贵族",desc:"玄雍城的贵族后裔",happinessMod:1,wealthMod:2},
      {name:"丛林部落勇士",desc:"来自原始部落的勇士",happinessMod:-1,wealthMod:-1,hpBonus:2},
      {name:"阴阳家传人",desc:"精通阴阳术的传人",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"云中漠地游侠",desc:"在沙漠中行走的游侠",happinessMod:-1,wealthMod:-1,hpBonus:1},
      {name:"海都贵族",desc:"海都的富裕商人家庭",happinessMod:1,wealthMod:2,looksBonus:1},
      {name:"暗影刺客",desc:"行走在暗处的杀手",happinessMod:-2,wealthMod:0,hpBonus:1,intBonus:1},
    ],
    birthplaces: ["长安城","稷下学院","长城关隘","日之塔","玄雍城","云中漠地"],
    extraChoices: [
      {
        title: "你的职业倾向",
        key: "heroClass",
        options: ["战士","法师","刺客","射手","辅助","坦克","打野"]
      }
    ]
  },

  "火影忍者": {
    desc: "忍者的世界——木叶村与各大忍村的对决",
    icon: "🍥",
    happinessMod: 0,
    identities: [
      {name:"木叶村民",desc:"木叶隐村的普通村民",happinessMod:0,wealthMod:0},
      {name:"宇智波一族",desc:"拥有写轮眼的宇智波族人",happinessMod:-1,wealthMod:0,intBonus:2},
      {name:"日向一族",desc:"拥有白眼的日向宗家/分家",happinessMod:0,wealthMod:1,intBonus:1},
      {name:"漩涡一族后裔",desc:"拥有庞大查克拉的漩涡族人",happinessMod:0,wealthMod:0,hpBonus:2},
      {name:"猿飞一族",desc:"三代火影的家族成员",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"旗木一族",desc:"天才忍者卡卡西的家族",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"油女一族",desc:"操控虫子的秘术家族",happinessMod:-1,wealthMod:0,intBonus:1},
      {name:"秋道一族",desc:"倍化之术的传承者",happinessMod:0,wealthMod:0,hpBonus:2},
      {name:"奈良一族",desc:"影子模仿术的智者一族",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"犬冢一族",desc:"与犬类搭档战斗的野性一族",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"孤儿",desc:"失去父母的战争孤儿",happinessMod:-2,wealthMod:-2},
    ],
    birthplaces: ["木叶隐村","砂隐村","雾隐村","云隐村","岩隐村","雨隐村"],
    extraChoices: [
      {
        title: "你的查克拉属性",
        key: "chakraNature",
        options: ["火遁","水遁","风遁","雷遁","土遁","木遁（极稀有）"]
      }
    ]
  },

  "SCP基金会": {
    desc: "Secure, Contain, Protect——收容超自然异常的世界",
    icon: "📎",
    happinessMod: -1,
    identities: [
      {name:"D级人员",desc:"用于实验的一次性人员（死刑犯出身）",happinessMod:-3,wealthMod:-3},
      {name:"初级研究员",desc:"刚入职的SCP研究员",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"机动特遣队成员",desc:"执行收容行动的精锐战士",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"高级研究员",desc:"经验丰富的异常研究专家",happinessMod:0,wealthMod:1,intBonus:2},
      {name:"站点主管",desc:"管理整个设施的高层人员",happinessMod:1,wealthMod:2,intBonus:1},
      {name:"O5议会成员子女",desc:"最高权力机构成员的亲属",happinessMod:2,wealthMod:3},
      {name:"混沌分裂者特工",desc:"叛离基金会的敌对组织成员",happinessMod:-1,wealthMod:0,hpBonus:1,intBonus:1},
      {name:"被收容者",desc:"自身就是异常的存在",happinessMod:-2,wealthMod:-2,hpBonus:1,intBonus:2},
      {name:"安保主管",desc:"负责设施安保的负责人",happinessMod:0,wealthMod:1,hpBonus:1},
      {name:"外勤特工",desc:"调查异常事件的卧底",happinessMod:-1,wealthMod:0,intBonus:1,hpBonus:1},
      {name:"医学部主管",desc:"研究异常医疗的主治医师",happinessMod:0,wealthMod:1,intBonus:2},
    ],
    birthplaces: ["Site-19","Site-17","Area-12","Mobile Task Force基地","GOC总部附近","普通人社区"],
    extraChoices: [
      {
        title: "你接触的第一个SCP",
        key: "firstSCP",
        options: ["SCP-173（雕像）","SCP-096（害羞的人）","SCP-682（不灭孽蜥）","SCP-999（痒痒怪）","SCP-1471（MalO ver1.0.0）","SCP-914（万能转换机）"]
      }
    ]
  },

  "奇幻冒险": {
    desc: "剑与魔法的经典冒险世界",
    icon: "🗡️",
    happinessMod: 0,
    identities: [
      {name:"骑士学徒",desc:"在骑士团中训练的年轻人",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"精灵游侠",desc:"来自精灵森林的神射手",happinessMod:0,wealthMod:0,looksBonus:1,hpBonus:1},
      {name:"矮人工匠",desc:"精通锻造的矮人",happinessMod:0,wealthMod:1,hpBonus:1},
      {name:"盗贼公会成员",desc:"在城市暗处活动的盗贼",happinessMod:-1,wealthMod:1,intBonus:1},
      {name:"见习牧师",desc:"信仰神明的治愈者",happinessMod:1,wealthMod:0},
      {name:"吟游诗人",desc:"用音乐和故事旅行的艺人",happinessMod:1,wealthMod:-1,looksBonus:1},
      {name:"皇家法师",desc:"服务于王室的宫廷法师",happinessMod:1,wealthMod:1,intBonus:2},
      {name:"半兽人战士",desc:"拥有兽人血统的混血战士",happinessMod:-1,wealthMod:-1,hpBonus:3},
      {name:"龙骑士",desc:"与龙缔结契约的骑手",happinessMod:1,wealthMod:0,hpBonus:2},
      {name:"赏金猎人",desc:"追捕通缉犯的职业猎人",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"预言中的勇者",desc:"被选中的命运之子",happinessMod:1,wealthMod:0,hpBonus:1,intBonus:1},
    ],
    birthplaces: ["王都","边境堡垒","精灵森林","矮人矿山","盗贼之城","龙脊山脉"],
    extraChoices: [
      {
        title: "你的冒险伙伴",
        key: "companion",
        options: ["忠诚的剑士","聪明的法师","可爱的盗贼","可靠的牧师","神秘的精灵","沉默的猎人"]
      }
    ]
  },

  "三国演义": {
    desc: "天下大势，分久必合，合久必分",
    icon: "🏛️",
    happinessMod: -1,
    identities: [
      {name:"蜀汉将领之后",desc:"追随刘备的忠义之士",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"曹魏世族子弟",desc:"挟天子以令诸侯的势力",happinessMod:1,wealthMod:1,intBonus:1},
      {name:"东吴水军将士",desc:"据守江东的豪杰",happinessMod:0,wealthMod:1},
      {name:"黄巾军后裔",desc:"苍天已死的余孽",happinessMod:-2,wealthMod:-2},
      {name:"世家大族嫡子",desc:"名门望族的继承人",happinessMod:1,wealthMod:2},
      {name:"隐居山林的谋士",desc:"卧龙凤雏般的隐士",happinessMod:0,wealthMod:0,intBonus:3},
      {name:"行商",desc:"在战乱中经营的商人",happinessMod:-1,wealthMod:1},
      {name:"武林高手",desc:"在乱世中行走江湖",happinessMod:0,wealthMod:0,hpBonus:2},
      {name:"军医",desc:"在战场上救死扶伤",happinessMod:-1,wealthMod:0,intBonus:1},
      {name:"山越族勇士",desc:"南方山越族的战士",happinessMod:-1,wealthMod:-1,hpBonus:2},
      {name:"匈奴贵族",desc:"北方草原的游牧贵族",happinessMod:0,wealthMod:0,hpBonus:2},
    ],
    birthplaces: ["洛阳","成都","建业","荆州","许昌","邺城","南阳"],
    extraChoices: [
      {
        title: "你效忠的势力",
        key: "kingdom",
        options: ["蜀汉","曹魏","东吴","独立势力","匈奴","南蛮"]
      }
    ]
  },

  "星际时代": {
    desc: "人类文明踏上星辰大海的征途",
    icon: "🚀",
    happinessMod: 0,
    identities: [
      {name:"星际军校学员",desc:"联邦军校的新生",happinessMod:0,wealthMod:0,hpBonus:1,intBonus:1},
      {name:"太空殖民者",desc:"在新星球上开拓的先驱",happinessMod:-1,wealthMod:0,hpBonus:1},
      {name:"星际商人",desc:"在星球间进行贸易",happinessMod:0,wealthMod:2},
      {name:"AI工程师",desc:"开发人工智能的科学家",happinessMod:0,wealthMod:1,intBonus:2},
      {name:"赏金猎人",desc:"追捕星际通缉犯",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"外星混血",desc:"人类与外星种族的混血",happinessMod:-1,wealthMod:0,hpBonus:1,intBonus:1},
      {name:"星际海盗",desc:"掠夺星际商船的海盗",happinessMod:-2,wealthMod:0,hpBonus:1},
      {name:"舰队指挥官",desc:"统帅星际舰队的将领",happinessMod:1,wealthMod:1,hpBonus:1,intBonus:1},
      {name:"基因改造人",desc:"经过基因优化的超级人类",happinessMod:0,wealthMod:0,hpBonus:2,intBonus:1},
      {name:"考古学家",desc:"研究远古文明遗迹",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"流浪者",desc:"没有母星的太空游牧民",happinessMod:-1,wealthMod:-1},
    ],
    birthplaces: ["地球","火星殖民地","太空站Alpha","半人马座星系","联邦首都星","小行星带"],
    extraChoices: [
      {
        title: "你的飞船类型",
        key: "shipType",
        options: ["战斗巡洋舰","轻型侦察舰","货船","科研船","偷来的飞船","没有飞船"]
      }
    ]
  },

  "武侠江湖": {
    desc: "快意恩仇的武侠世界",
    icon: "🎭",
    happinessMod: 0,
    identities: [
      {name:"名门正派弟子",desc:"少林武当等正派弟子",happinessMod:0,wealthMod:0,hpBonus:1},
      {name:"邪教妖人",desc:"日月神教等邪教成员",happinessMod:-1,wealthMod:0,hpBonus:1},
      {name:"独行侠",desc:"独来独往的江湖人",happinessMod:-1,wealthMod:-1,hpBonus:1},
      {name:"神医传人",desc:"悬壶济世的神医弟子",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"镖局少主",desc:"押镖护运的镖局继承者",happinessMod:0,wealthMod:1,hpBonus:1},
      {name:"丐帮弟子",desc:"天下第一大帮的成员",happinessMod:-1,wealthMod:-2,hpBonus:1},
      {name:"武林盟主之子",desc:"号令群雄的盟主后代",happinessMod:1,wealthMod:2},
      {name:"绝世高手关门弟子",desc:"被隐世高手收为弟子",happinessMod:1,wealthMod:0,hpBonus:2},
      {name:"世家公子",desc:"书香门第的公子/千金",happinessMod:1,wealthMod:1,intBonus:1},
      {name:"暗器高手",desc:"精通暗器的刺客",happinessMod:-1,wealthMod:0,intBonus:1},
      {name:"酒馆老板之子",desc:"在酒馆中听遍江湖事",happinessMod:0,wealthMod:0,intBonus:1},
    ],
    birthplaces: ["华山","少林寺","武当山","江南水乡","大漠","洛阳城","西湖边"],
    extraChoices: [
      {
        title: "你的武学方向",
        key: "martialArt",
        options: ["拳掌","剑法","刀法","内功","轻功","暗器","医术","毒术"]
      }
    ]
  },

  "蒸汽朋克": {
    desc: "蒸汽动力驱动的维多利亚时代平行世界",
    icon: "⚙️",
    happinessMod: 0,
    identities: [
      {name:"发明家",desc:"创造蒸汽机械的天才",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"贵族继承者",desc:"维多利亚式的上层阶级",happinessMod:1,wealthMod:3},
      {name:"工厂工人",desc:"在蒸汽工厂劳动的底层",happinessMod:-2,wealthMod:-2},
      {name:"飞艇船长",desc:"驾驶蒸汽飞艇的冒险家",happinessMod:1,wealthMod:1,hpBonus:1},
      {name:"钟表匠",desc:"精密机械的匠人",happinessMod:0,wealthMod:0,intBonus:2},
      {name:"探险家",desc:"探索未知大陆的冒险者",happinessMod:0,wealthMod:0,hpBonus:1,intBonus:1},
      {name:"蒸汽骑士",desc:"穿着蒸汽动力甲胄的战士",happinessMod:0,wealthMod:0,hpBonus:2},
      {name:"炼金术士",desc:"研究蒸汽与炼金的结合",happinessMod:0,wealthMod:1,intBonus:1},
      {name:"地下抵抗军",desc:"反抗贵族统治的革命者",happinessMod:-1,wealthMod:-1,hpBonus:1},
      {name:"马戏团表演者",desc:"在蒸汽马戏团表演",happinessMod:0,wealthMod:-1,looksBonus:1},
      {name:"情报贩子",desc:"在蒸汽城市中贩卖消息",happinessMod:0,wealthMod:0,intBonus:1},
    ],
    birthplaces: ["伦敦","蒸汽城","飞艇港口","地下都市","殖民地","钟塔镇"],
    extraChoices: [
      {
        title: "你的蒸汽装备",
        key: "steamGear",
        options: ["蒸汽动力臂","飞行背包","机械眼镜","蒸汽步枪","自动怀表","蒸汽义肢"]
      }
    ]
  },

  "地狱客栈": {
    desc: "Hell is Forever——无论生前如何，地狱的生活也要继续",
    icon: "😈",
    happinessMod: -1,
    identities: [
      {name:"客栈住客",desc:"Hazbin Hotel的赎罪者",happinessMod:0,wealthMod:-1},
      {name:"地狱贵族",desc:"地狱七宗罪领主的家族",happinessMod:1,wealthMod:2},
      {name:"堕落天使",desc:"从天堂坠落到地狱的天使",happinessMod:-2,wealthMod:0,intBonus:1},
      {name:"恶魔猎人",desc:"在地狱中猎杀恶魔的强者",happinessMod:-1,wealthMod:0,hpBonus:2},
      {name:"电视恶魔",desc:"掌控影像力量的恶魔",happinessMod:0,wealthMod:1,intBonus:1},
      {name:"猫妖",desc:"地狱中活泼的猫妖",happinessMod:1,wealthMod:-1,looksBonus:2},
      {name:"鹿妖",desc:"拥有鹿角的神秘恶魔",happinessMod:0,wealthMod:0,intBonus:1},
      {name:"蜘蛛恶魔",desc:"多臂的蜘蛛型恶魔",happinessMod:-1,wealthMod:0,hpBonus:1},
      {name:"地狱执法官",desc:"维护地狱秩序的执法者",happinessMod:-1,wealthMod:1,hpBonus:1},
      {name:"灵魂经纪人",desc:"买卖灵魂合约的中间人",happinessMod:0,wealthMod:2,intBonus:1},
      {name:"新生恶魔",desc:"刚到地狱的新灵魂",happinessMod:-1,wealthMod:-1},
    ],
    birthplaces: ["骄傲环","贪婪环","欲念环","愤怒环","暴食环","嫉妒环"],
    extraChoices: [
      {
        title: "你在地狱的身份形态",
        key: "demonForm",
        options: ["猫妖形态","鹿妖形态","蜘蛛形态","电视信号形态","天使堕落形态","普通恶魔形态"]
      }
    ]
  },
};

// ===== Name generators =====
const LIFE_SURNAMES = ['佐藤','铃木','高桥','田中','渡边','伊藤','山本','中村','小林','加藤','吉田','山田','佐々木','山口','松本','井上','木村','林','斋藤','清水','秋山','石川','的崎','神谷','樱井','月城','星野','风间','天羽','雪村','七濑','远藤','近藤','陈','林','张','王','李','赵','刘','孙','周','吴','郑','杨','黄','许','徐','何','宋','谢','唐'];
const LIFE_MALE_NAMES = ['风间','白石','铃木','高桥','田中','渡边','伊藤','山本','中村','小林','清水','山田','佐藤','松本','井上','木下','秋山','吉田','星野','月城','神谷','樱井','浩然','子轩','宇航','梓轩','思远','一诺','明哲','博文','天佑','俊杰'];
const LIFE_FEMALE_NAMES = ['小樱','美月','雪乃','凛','芽衣','花音','千夏','雫','莉奈','优花','琴音','彩乃','葵','铃','明日香','薰','结衣','诗菜','空','樱','雫','琴里','翼','美樱','雨萱','梓涵','欣怡','思琪','诗涵','梦瑶','若曦','语嫣'];

// ===== Death messages by age range =====
const LIFE_DEATH_MSGS = {
  baby: ["你没能熬过婴儿时期...这个世界的残酷从你出生的那一刻就开始了。",
         "一场突如其来的疾病夺走了你幼小的生命。"],
  child: ["你的童年在这个残酷的世界中戛然而止。",
          "一场意外让你的人生永远停留在了这个年纪。"],
  teen: ["你的青春才刚刚开始，却已经结束。",
         "命运没有给你更多的时间..."],
  young: ["你的生命在最灿烂的年华画上了句号。",
          "你还有很多想做的事，但命运不允许了。"],
  mid: ["你的人生已经走过了大半，最终还是没能继续走下去。",
        "岁月不饶人，你的身体终于撑不住了。"],
  old: ["你度过了漫长而充实的一生，安详地闭上了眼睛。",
        "在家人和朋友的陪伴下，你平静地离开了这个世界。",
        "你带着满足的微笑，走完了人生的最后一程。"],
  ancient: ["你活了惊人的岁数，在这个世界留下了传奇的一生。",
            "你的寿命已经超越了常人的极限，最终在平静中离去。"]
};

// ===== Lifespan modifiers =====
const LIFE_LIFESPAN_MOD = {
  hpBonus: 3,     // per point of 健康
  intBonus: 0.5,  // per point of 智力
  looksBonus: 0.3,// per point of 颜值
  wealthBonus: 0.5,// per point of 财富
  happinessMod: 1.5 // per point of 快乐
};

if(typeof module !== 'undefined') module.exports = { LIFE_WORLDS, LIFE_SURNAMES, LIFE_MALE_NAMES, LIFE_FEMALE_NAMES, LIFE_DEATH_MSGS, LIFE_LIFESPAN_MOD };
