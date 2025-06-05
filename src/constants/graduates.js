// 定义基础URL
export const baseURL = import.meta.env.VITE_BASE_URL || "";

// 毕业生数据配置
export const graduates = [
  {
    id: 1,
    name: {
      zh: "王佳一",
      en: "JiaYi WANG",
    },
    destination: {
      zh: "推免本校,辅导员专项计划",
      en: "Recommended for admission to Tianjin University, special instructor program",
    },
    avatar: `${baseURL}assets/images/graduates/wangjiayi.jpg`,
    thoughts: {
      zh: "赶毕业设计的日子好像和赶任何一个大作业没有那么明显的不同,一样的人、一样的地方、一样的事情,一样忙碌到崩溃的夜晚想着再也不要这样拖延与突击。想到这里才发现,再一次忘记自己要规划时间的时候,那些爱着的人已经离开了,不自觉地眼泪落下。谢谢四年来一起走过的所有人,也谢谢自己。",
      en: "The days of rushing to complete the graduation project didn't seem so different from rushing any other major assignment—the same people, the same place, the same tasks, the same nights of being so busy to the point of collapse, thinking I would never procrastinate and rush like this again. It was only then that I realized, when I once again forgot to plan my time, those I loved had already left, and tears fell unconsciously. Thank you to everyone who has walked with me over the past four years, and thank you to myself.",
    },
  },
  {
    id: 2,
    name: {
      zh: "吴语晴",
      en: "Yuqing WU",
    },
    destination: {
      zh: "香港理工大学",
      en: "The Hong Kong Polytechnic University",
    },
    avatar: `${baseURL}assets/images/graduates/wuyuqing.jpg`,
    thoughts: {
      zh: "三年前,我握着笔,以为能画出设计的世界;两年前,我敲着键盘,以为能渲出设计的未来;一年前,我四处调研,以为能学会设计中的洞察。今天我想,或许最重要的是,我的心脏会继续为设计而滚烫。",
      en: "Three years ago, holding a pen, I thought I could draw the world of design. Two years ago, typing on a keyboard, I thought I could render the future of design. One year ago, conducting research everywhere, I thought I could learn insight in design. Today, I think, perhaps the most important thing is that my heart will continue to burn passionately for design.",
    },
  },
  {
    id: 3,
    name: {
      zh: "王骞",
      en: "Qian WANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/wangqian.jpg`,
    thoughts: {
      zh: "毕业,是一段旅程的终点,亦是新生的起点。站在时光的渡口回望,那些交织着汗水与欢笑的片段如电影般在脑海中流转,凝结成青春最珍贵的注脚。当离歌唱响,请将教室的晚霞、师长的嘱托、同窗的笑语封存在记忆琥珀中。正如诗人所言:“聚散离别终有时”,但那些共同仰望过的星空,终将化作指引前路的星光。愿此去繁花似锦,再相逢依旧如故。",
      en: "Graduation is the end of a journey and also the beginning of a new life. Looking back from the ferry of time, those fragments interwoven with sweat and laughter flow like a movie in my mind, solidifying into the most precious footnotes of youth. When the farewell song resounds, please seal the sunset in the classroom, the advice of teachers, and the laughter of classmates in the amber of memory. As the poet said: 'Gatherings and partings all have their time,' but the stars we once gazed upon together will ultimately transform into starlight guiding the road ahead. May your journey ahead be like a path of blooming flowers, and may we meet again as we always were.",
    },
  },
  {
    id: 4,
    name: {
      zh: "余春阳",
      en: "Chunyang YU",
    },
    destination: {
      zh: "天津大学",
      en: "Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/yuchunyang.jpg`,
    thoughts: {
      zh: "四年本科时光如白驹过隙,这四年好的坏的都经历过,自己也成长了许多。毕业是本科生涯的结束,更是一个新的开始。希望你带着勇气去做任何你想做的事,去任何你想去的地方!",
      en: "The four years of undergraduate life passed by in a flash. I have experienced both good and bad during these four years, and I have grown a lot. Graduation is the end of undergraduate life, and even more so, a new beginning. I hope you carry courage to do whatever you want to do, and go wherever you want to go!",
    },
  },
  {
    id: 5,
    name: {
      zh: "黄诗淇",
      en: "Shiqi HUANG",
    },
    destination: {
      zh: "读研",
      en: "Postgraduate studies",
    },
    avatar: `${baseURL}assets/images/graduates/huangshiqi.jpg`,
    thoughts: {
      zh: "不知不觉要毕业了,时间过得还是挺快的,真的要毕业了也没有很大的感觉,可能因为前路已定,又或者是因为开心或悲伤的瞬间都已经定格在记忆里,成为了一种习惯吧,接下来就希望能一切顺利。",
      en: "Unknowingly, it's time to graduate. Time has passed quite quickly. Now that I'm really graduating, I don't have a strong feeling about it. Perhaps it's because the path ahead is set, or perhaps because moments of joy or sadness have already been frozen in memory, becoming a habit. Next, I just hope everything goes smoothly.",
    },
  },
  {
    id: 6,
    name: {
      zh: "洛扎",
      en: "Zha LUO",
    },
    destination: {
      zh: "就业",
      en: "Employment",
    },
    avatar: `${baseURL}assets/images/graduates/luozha.jpg`,
    thoughts: {
      zh: "站在青春的十字路口,回望校园的晨光与晚霞,每一帧都是成长的印记。图书馆的奋笔疾书,操场的欢声笑语,师长的谆谆教诲,让懵懂的心逐渐丰盈。毕业不是终点,而是带着知识与勇气奔向山海的新起点。愿我们以初心为灯,在风雨中仍记得教学楼前那株开得热烈的樱花。",
      en: "Standing at the crossroads of youth, looking back at the dawn and dusk of the campus, every frame is a mark of growth. The diligent writing in the library, the laughter on the playground, the earnest teachings of our mentors, have gradually enriched our once naive hearts. Graduation is not the end, but a new starting point to rush towards mountains and seas with knowledge and courage. May we take our original intentions as a lamp, and in the midst of wind and rain, still remember the cherry blossom tree in front of the teaching building that bloomed so passionately.",
    },
  },
  {
    id: 7,
    name: {
      zh: "江长林",
      en: "Changlin JIANG",
    },
    destination: {
      zh: "读研",
      en: "Postgraduate studies",
    },
    avatar: `${baseURL}assets/images/graduates/jiangchanglin.jpg`,
    thoughts: {
      zh: "毕业让人快乐又感伤。这些年小组一起熬夜的日子还历历在目,为了考毛概等课通宵背书的痛苦还留在脑海。虽然学业辛苦,但也收获颇丰。锻炼了专业能力,收获了友情。四年一路走来感谢大家陪伴。",
      en: "Graduation makes one happy yet sentimental. The days of our group staying up late together are still vivid in my mind, and the pain of cramming overnight for exams like Maoist ideology is still etched in my memory. Although the studies were hard, the rewards were plentiful. I improved my professional skills and gained friendships. Thank you all for your companionship throughout these four years.",
    },
  },
  {
    id: 8,
    name: {
      zh: "陈诗语",
      en: "Shiyu CHEN",
    },
    destination: {
      zh: "Gap year",
      en: "Gap year",
    },
    avatar: `${baseURL}assets/images/graduates/chenshiyu.jpg`,
    thoughts: {
      zh: "毕毕业快乐!希望自己永远能拥有探索和尝试的勇气,永远充满生命力!",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 9,
    name: {
      zh: "贺杨晨",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/heyangchen.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 10,
    name: {
      zh: "刘北辰",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/liubeichen.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 11,
    name: {
      zh: "张仁洁",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/zhangrenjie.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 12,
    name: {
      zh: "王茗杨",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/wangmingyang.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 13,
    name: {
      zh: "白昊",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/baihao.png`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 14,
    name: {
      zh: "张璋",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/zhangzhang.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 15,
    name: {
      zh: "仁增旺姆",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/renzengmuwang.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 16,
    name: {
      zh: "蒋婵娟",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/jiangchanjuan.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 17,
    name: {
      zh: "刘皓月",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/liuhaoyue.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 18,
    name: {
      zh: "曲自涵",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/quzihan.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 19,
    name: {
      zh: "刘子祎",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/liuziyi.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 20,
    name: {
      zh: "曾楚懿",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/zengchuyi.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 21,
    name: {
      zh: "尹祎晗",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/yinyihan.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 22,
    name: {
      zh: "陈雪懿",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/chenxueyi.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 23,
    name: {
      zh: "张宇星",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/zhangyuxing.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 24,
    name: {
      zh: "唐安尼达",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/tangannida.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
  {
    id: 25,
    name: {
      zh: "赵玉奇",
      en: "ZiHan ZHANG",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/zhaoyuqi.jpg`,
    thoughts: {
      zh: "毕业设计的日子里,我学会了如何在纷繁复杂的世界中坚持自己的信念,如何在设计中找到自己的声音,以及如何在这个过程中不断成长。感谢所有陪伴我走过这段旅程的人,是你们的支持和鼓励让我更加坚定了自己的信念。",
      en: "During the days of graduation design, I learned how to find my own voice in design and how to hold onto my beliefs in a complex world. Thank you to everyone who has accompanied me on this journey; your support and encouragement have strengthened my resolve.",
    },
  },
];
