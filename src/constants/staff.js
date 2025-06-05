// 基础URL
export const baseURL = import.meta.env.VITE_BASE_URL || "";

// 教师与工作人员配置
export const staffGroups = [
  {
    id: 1,
    name: "指导教师",
    members: [
      {
        id: 1,
        name: {
          zh: "边放",
          en: "Fang BIAN",
        },
        avatar: `${baseURL}assets/images/staff/teachers/bianfang.jpg`,
        role: {
          zh: "展览理论知识讲授，设计指导",
          en: "Exhibition theory knowledge lecture, design guidance",
        },
      },
      {
        id: 2,
        name: {
          zh: "张赫晨",
          en: "Hechen ZHANG",
        },
        avatar: `${baseURL}assets/images/staff/teachers/zhanghechen.jpeg`,
        role: {
          zh: "年展策划协调，设计指导",
          en: "Annual exhibition planning coordination, design guidance",
        },
      },
      {
        id: 3,
        name: {
          zh: "李擎炜",
          en: "Qingwei LI",
        },
        avatar: `${baseURL}assets/images/staff/teachers/liqingwei.jpeg`,
        role: {
          zh: "年展实验指导，文宣指导",
          en: "Annual exhibition experiment guidance, publicity guidance",
        },
      },
      {
        id: 4,
        name: {
          zh: "杨君宇",
          en: "Junyu YANG",
        },
        avatar: `${baseURL}assets/images/staff/teachers/yangjunyu.jpg`,
        role: {
          zh: "年展视觉设计指导",
          en: "Annual exhibition visual design guidance",
        },
      },
    ],
  },
  {
    id: 2,
    name: "总负责",
    members: [
      {
        id: 1,
        name: {
          zh: "刘佳怡",
          en: "Jiayi LIU",
        },
        avatar: `${baseURL}assets/images/staff/curations/liujiayi.jpg`,
        role: {
          zh: "展览总体策划",
          en: "Overall exhibition planning",
        },
      },
    ],
  },
  {
    id: 3,
    name: "策展A组",
    members: [
      {
        id: 1,
        name: {
          zh: "代园宁",
          en: "Yuanning DAI",
        },
        avatar: `${baseURL}assets/images/staff/curations/daiyuanning.jpg`,
        role: {
          zh: "线下展览策划",
          en: "Offline exhibition planning",
        },
      },
      {
        id: 2,
        name: {
          zh: "张歆梓",
          en: "Xinzi ZHANG",
        },
        avatar: `${baseURL}assets/images/staff/curations/zhangxinzi.jpg`,
        role: {
          zh: "线下展览策划",
          en: "Offline exhibition planning",
        },
      },
    ],
  },
  {
    id: 4,
    name: "策展B组",
    members: [
      {
        id: 1,
        name: {
          zh: "王宁远",
          en: "Ningyuan WANG",
        },
        avatar: `${baseURL}assets/images/staff/curations/wangningyuan.jpg`,
        role: {
          zh: "网站框架设计，辅助开发，中译英",
          en: "Website framework design, development assistance and Chinese-English translation",
        },
      },
      {
        id: 2,
        name: {
          zh: "苏畅",
          en: "Chang SU",
        },
        avatar: `${baseURL}assets/images/staff/curations/suchang.jpg`,
        role: {
          zh: "负责虚拟展厅和移动端",
          en: "Responsible for virtual exhibition hall and mobile terminal",
        },
      },
    ],
  },
  {
    id: 5,
    name: "策展C组",
    members: [
      {
        id: 1,
        name: {
          zh: "崔智彧",
          en: "Zhiyu CUI",
        },
        avatar: `${baseURL}assets/images/staff/curations/cuizhiyu.jpg`,
        role: {
          zh: "信息收集，辅助策展",
          en: "Information collection, assisting curation",
        },
      },
    ],
  },
  {
    id: 6,
    name: "设计A组",
    members: [
      {
        id: 1,
        name: {
          zh: "张宇澄",
          en: "Yucheng ZHANG",
        },
        avatar: `${baseURL}assets/images/staff/curations/zhangyucheng.jpg`,
        role: {
          zh: "协调全组，设计制作线下展板和物料",
          en: "Coordinate the entire group, design and produce offline exhibition panels and materials",
        },
      },
      {
        id: 2,
        name: {
          zh: "强巴央宗",
          en: "Qampa Yangzom",
        },
        avatar: `${baseURL}assets/images/staff/curations/qiangbayangzong.jpg`,
        role: {
          zh: "设计制作线下展板和物料",
          en: "Design and produce offline exhibition panels and materials",
        },
      },
      {
        id: 3,
        name: {
          zh: "陈嘉倩",
          en: "Jiaqian CHEN",
        },
        avatar: `${baseURL}assets/images/staff/curations/chenjiaqian.jpg`,
        role: {
          zh: "设计制作线下展板和物料",
          en: "Design and produce offline exhibition panels and materials",
        },
      },
      {
        id: 4,
        name: {
          zh: "苗玟",
          en: "Wen MIAO",
        },
        avatar: `${baseURL}assets/images/staff/curations/miaowen.jpg`,
        role: {
          zh: "设计制作线下展板和物料",
          en: "Design and produce offline exhibition panels and materials",
        },
      },
      {
        id: 5,
        name: {
          zh: "李可人",
          en: "Keren LI",
        },
        avatar: `${baseURL}assets/images/staff/curations/likeren.jpg`,
        role: {
          zh: "设计制作线下展板和物料",
          en: "Design and produce offline exhibition panels and materials",
        },
      },
      {
        id: 6,
        name: {
          zh: "桂丰宜",
          en: "Fengyi GUI",
        },
        avatar: `${baseURL}assets/images/staff/curations/guifengyi.jpg`,
        role: {
          zh: "设计A组",
          en: "Design Group A",
        },
      },
      {
        id: 7,
        name: {
          zh: "林俊维",
          en: "Junwei LIN",
        },
        avatar: `${baseURL}assets/images/staff/curations/linjunwei.jpg`,
        role: {
          zh: "采购线下物料",
          en: "Procurement of offline materials",
        },
      },
    ],
  },
  {
    id: 7,
    name: "设计B组",
    members: [
      {
        id: 1,
        name: {
          zh: "吴林翰",
          en: "Linhan WU",
        },
        avatar: `${baseURL}assets/images/staff/curations/wulinhan.jpg`,
        role: {
          zh: "组织协调，辅助图形，虚拟展厅及网页",
          en: "Organization and coordination, auxiliary graphics, virtual exhibition hall and webpage",
        },
      },
      {
        id: 2,
        name: {
          zh: "肖梓坤",
          en: "Zikun XIAO",
        },
        avatar: `${baseURL}assets/images/staff/curations/xiaozikun.jpg`,
        role: {
          zh: "主视觉，辅助图形，虚拟展厅及网页",
          en: "Key visual, auxiliary graphics, virtual exhibition hall and webpage",
        },
      },
      {
        id: 3,
        name: {
          zh: "于稑翔",
          en: "Luxiang YU",
        },
        avatar: `${baseURL}assets/images/staff/curations/yuluxiang.jpg`,
        role: {
          zh: "辅助图形，虚拟展厅及网页",
          en: "Auxiliary graphics, virtual exhibition hall and webpage",
        },
      },
      {
        id: 4,
        name: {
          zh: "刘晋宇",
          en: "Jinyu LIU",
        },
        avatar: `${baseURL}assets/images/staff/curations/liujinyu.jpg`,
        role: {
          zh: "设计制作虚拟展厅，主视觉动画",
          en: "Design and produce virtual exhibition hall, key visual animation",
        },
      },
      {
        id: 5,
        name: {
          zh: "兰晶雯",
          en: "Jingwen LAN",
        },
        avatar: `${baseURL}assets/images/staff/curations/lanjingwen.jpg`,
        role: {
          zh: "设计制作虚拟展厅",
          en: "Design and produce virtual exhibition hall",
        },
      },
      {
        id: 6,
        name: {
          zh: "刁培培",
          en: "Peipei DIAO",
        },
        avatar: `${baseURL}assets/images/staff/curations/diaopeipei.jpg`,
        role: {
          zh: "设计制作线下展板和物料",
          en: "Design and produce offline exhibition panels and materials",
        },
      },
      {
        id: 7,
        name: {
          zh: "唐灿",
          en: "Can TANG",
        },
        avatar: `${baseURL}assets/images/staff/curations/tangcan.jpg`,
        role: {
          zh: "设计B组",
          en: "Design Group B",
        },
      },
    ],
  },
  {
    id: 8,
    name: "宣传组",
    members: [
      {
        id: 1,
        name: {
          zh: "陈煊鹏",
          en: "Xuanpeng CHEN",
        },
        avatar: `${baseURL}assets/images/staff/curations/chenxuanpeng.jpg`,
        role: {
          zh: "统筹规划宣传事项，拍摄，采访",
          en: "Overall planning of publicity matters, shooting, interviews",
        },
      },
      {
        id: 2,
        name: {
          zh: "陈佩芳",
          en: "Cevina",
        },
        avatar: `${baseURL}assets/images/staff/curations/chenpeifang.jpg`,
        role: {
          zh: "视频脚本制作，视频拍摄，后期制作，推送制作，采访",
          en: "Video script production, video shooting, post-production, push notification production, interviews",
        },
      },
      {
        id: 3,
        name: {
          zh: "王春予",
          en: "Chunyu WANG",
        },
        avatar: `${baseURL}assets/images/staff/curations/wangchunyu.jpg`,
        role: {
          zh: "脚本策划，视频剪辑，推送制作，采访",
          en: "Script planning, video editing, push notification production, interviews",
        },
      },
      {
        id: 4,
        name: {
          zh: "袁静怡",
          en: "Jingyi YUAN",
        },
        avatar: `${baseURL}assets/images/staff/curations/yuanjingyi.jpg`,
        role: {
          zh: "视频拍摄，后期制作，推送制作，采访",
          en: "Video shooting, post-production, push notification production, interviews",
        },
      },
    ],
  },
  {
    id: 9,
    name: "对接人",
    members: [
      {
        id: 1,
        name: {
          zh: "付宇轩",
          en: "Yuxuan FU",
        },
        avatar: `${baseURL}assets/images/staff/liasons/fuyuxuan.jpg`,
        role: {
          zh: "布鲁内尔大学对接人",
          en: "Liaison with Brunel",
        },
      },
      {
        id: 2,
        name: {
          zh: "江长林",
          en: "Changlin JIANG",
        },
        avatar: `${baseURL}assets/images/staff/liasons/jiangchanglin.jpeg`,
        role: {
          zh: "工业设计21级对接人",
          en: "Liaison for '21 ID",
        },
      },
      {
        id: 3,
        name: {
          zh: "龚东跃",
          en: "Dongyue GONG",
        },
        avatar: `${baseURL}assets/images/staff/liasons/gongdongyue.jpg`,
        role: {
          zh: "工业设计23级对接人",
          en: "Liaison for '23 ID",
        },
      },
    ],
  },
];
