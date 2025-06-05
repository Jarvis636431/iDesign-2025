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
      zh: "毕业快乐!希望自己永远能拥有探索和尝试的勇气,永远充满生命力!",
      en: "Happy graduation! I hope I can always have the courage to explore and try, and always be full of vitality!",
    },
  },
  {
    id: 9,
    name: {
      zh: "贺杨晨",
      en: "Yangchen HE",
    },
    destination: {
      zh: "天津大学",
      en: "Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/heyangchen.jpg`,
    thoughts: {
      zh: "大学四年,抱了一心遗憾,撒了满地鸡毛,没习得多少学识,也没涨得多少见识,只是捞得一个人的清静。然,顾然回首,四年来,哭过笑过,前进过也后退过,成熟过也幼稚过,倒也好似没有白过。",
      en: "Four years of university, I held onto a heart full of regrets, made a mess of things, didn't learn much knowledge, nor gained much insight, only managed to find some peace and quiet for myself. However, looking back, over these four years, I've cried, laughed, moved forward, and retreated, been mature and childish. It seems it wasn't all for nothing.",
    },
  },
  {
    id: 10,
    name: {
      zh: "刘北辰",
      en: "Beichen LIU",
    },
    destination: {
      zh: "公考",
      en: "Civil service examination",
    },
    avatar: `${baseURL}assets/images/graduates/liubeichen.jpg`,
    thoughts: {
      zh: "大学期间的学习生活带给了我全新的体验,有迷茫无措,有挫折坎坷,当然也有顿悟成长,无论是何种经历都是我人生宝贵的财富,在即将打开另一扇大门之际,我踟蹰不前,但我相信,进退维谷之日正可能是别有洞天之时",
      en: "The study life during university brought me a brand new experience. There was confusion and helplessness, setbacks and hardships, and of course, moments of epiphany and growth. No matter what kind of experience, it is a precious treasure in my life. As I am about to open another door, I hesitate, but I believe that the day I find myself in a dilemma might just be the time for a new world to open up.",
    },
  },
  {
    id: 11,
    name: {
      zh: "张仁洁",
      en: "Renjie ZHANG",
    },
    destination: {
      zh: "天大工业设计研究生",
      en: "Postgraduate student in Industrial Design at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/zhangrenjie.jpg`,
    thoughts: {
      zh: "感谢工业设计的老师和同学们,感谢一路成长的自己,感谢这个给予无限可能的世界。我毕业啦,愿未来勇敢热烈!",
      en: "Thank you to the teachers and classmates of Industrial Design, thank you to myself for growing along the way, and thank you to this world that offers infinite possibilities. I'm graduating! May the future be brave and passionate!",
    },
  },
  {
    id: 12,
    name: {
      zh: "王茗杨",
      en: "Mingyang WANG",
    },
    destination: {
      zh: "无",
      en: "N/A",
    },
    avatar: `${baseURL}assets/images/graduates/wangmingyang.jpg`,
    thoughts: {
      zh: "四年的工业设计学习,是一场将想法变为现实的旅程,虽然从最初的草图到最终的产品的过程中经历了不少挑战,但也让我更加明确了自身的兴趣与未来方向。感谢这段经历带来的成长与磨砺,它将成为我人生中一段重要的积淀。",
      en: "The four years of studying industrial design have been a journey of turning ideas into reality. Although I encountered many challenges from the initial sketches to the final product, it also made me clearer about my own interests and future direction. I am grateful for the growth and tempering this experience has brought; it will become an important accumulation in my life.",
    },
  },
  {
    id: 13,
    name: {
      zh: "白昊",
      en: "Hao BAI",
    },
    destination: {
      zh: "工作",
      en: "Employment",
    },
    avatar: `${baseURL}assets/images/graduates/baihao.png`,
    thoughts: {
      zh: "四年时光里收获了很多快乐与热爱,前路漫漫亦灿灿,祝我们保持热爱,奔赴山海。青春无错,青春无悔,下个旅途再见。",
      en: "In these four years, I have gained a lot of happiness and love. The road ahead is long and bright. I wish us to maintain our passion and head towards mountains and seas. Youth is not wrong, youth has no regrets. See you on the next journey.",
    },
  },
  {
    id: 14,
    name: {
      zh: "张璋",
      en: "Zhang ZHANG",
    },
    destination: {
      zh: "地球上继续深造",
      en: "Continuing further studies on Earth",
    },
    avatar: `${baseURL}assets/images/graduates/zhangzhang.jpg`,
    thoughts: {
      zh: "其实毕业了也没啥感觉就是感觉毕业了,又好像没毕业因为还要上学就感觉好像没结束过上学一样,其实上学还挺好玩的我还挺喜欢上学的,如果我有能力我倒是希望我能一直上学一直毕业一直没结束上学也一直没结束毕业。",
      en: "Actually, I don't feel much about graduating, just that I've graduated. And yet, it feels like I haven't graduated because I still have to go to school, so it feels like schooling has never ended. Actually, school is quite fun, and I quite like going to school. If I had the ability, I would hope to keep going to school, keep graduating, never finish schooling, and never finish graduating.",
    },
  },
  {
    id: 15,
    name: {
      zh: "仁增旺姆",
      en: "Wangmu RENZENG",
    },
    destination: {
      zh: "就业",
      en: "Employment",
    },
    avatar: `${baseURL}assets/images/graduates/renzengmuwang.jpg`,
    thoughts: {
      zh: "四年青春,感谢相遇。这段旅程的结束意味着下一段旅程的开始,希望下一段旅程依旧收获满满,充满希望。感谢所有陪伴我走过这段旅程的人,祝愿我们前程似锦,顺遂如愿。",
      en: "Four years of youth, thank you for the encounter. The end of this journey means the beginning of the next. I hope the next journey will also be full of gains and hope. Thank you to everyone who accompanied me through this journey. I wish us a bright future and all our wishes come true.",
    },
  },
  {
    id: 16,
    name: {
      zh: "蒋婵娟",
      en: "Chanjuan JIANG",
    },
    destination: {
      zh: "读研",
      en: "Postgraduate studies",
    },
    avatar: `${baseURL}assets/images/graduates/jiangchanjuan.jpg`,
    thoughts: {
      zh: "时光荏苒,岁月如梭。在这充满智慧与希望的殿堂里,我们度过了人生最宝贵的青春年华。感谢恩师谆谆教诲,培育我们成长;感恩同窗相伴,共谱青春华章。今日我们即将踏上新征程,愿以母校培育之恩为基石,以师长教诲为明灯,在未来的道路上砥砺前行,不负韶华。",
      en: "Time flies, and the years pass like a shuttle. In this hall full of wisdom and hope, we have spent the most precious youthful years of our lives. We are grateful for the earnest teachings of our respected teachers, who nurtured our growth; grateful for the companionship of our classmates, who together composed the splendid chapter of youth. Today, we are about to embark on a new journey. May we take the nurturing grace of our alma mater as our cornerstone, and the teachings of our mentors as our guiding light, to forge ahead on the path of the future, living up to our splendid youth.",
    },
  },
  {
    id: 17,
    name: {
      zh: "刘皓月",
      en: "Haoyue LIU",
    },
    destination: {
      zh: "南洋理工大学",
      en: "Nanyang Technological University",
    },
    avatar: `${baseURL}assets/images/graduates/liuhaoyue.jpg`,
    thoughts: {
      zh: "这四载光阴,恰似一幅徐徐展开的工笔——那些实验室通明的灯火,711温热的夜宵,连同电脑风扇的嗡鸣,都成了画中最动人的细节。方案反复推敲的痕迹,pre时微微发颤的声线,现在想来,那都是成长的痕迹。世界很大,我要把草图变成真的。",
      en: "These four years, like a meticulously detailed painting slowly unfolding—the brightly lit labs, the warm late-night snacks from 7-Eleven, along with the hum of computer fans, have all become the most moving details in the picture. The traces of repeatedly deliberated plans, the slightly trembling voice during presentations—thinking back now, those were all signs of growth. The world is vast, and I want to turn my sketches into reality.",
    },
  },
  {
    id: 18,
    name: {
      zh: "曲自涵",
      en: "Zihan QU",
    },
    destination: {
      zh: "就业",
      en: "Employment",
    },
    avatar: `${baseURL}assets/images/graduates/quzihan.jpg`,
    thoughts: {
      zh: "一年智造三年工设,从分流到考研,每一步都是自己的选择,失败成功都很正常,都是日后回忆的锚点。学生时代即将结束,社会的大门正在打开,很幸运在这段时间遇见了值得遇见的人们,很幸运这段时光是目前人生最跌宕起伏精彩无比的篇章。",
      en: "One year in intelligent manufacturing, three years in industrial design; from choosing a major to preparing for postgraduate entrance exams, every step was my own choice. Failure and success are both normal, serving as anchor points for future memories. Student life is about to end, and the doors of society are opening. I am very fortunate to have met worthy people during this time, and very fortunate that this period has been the most tumultuous and wonderfully exciting chapter of my life so far.",
    },
  },
  {
    id: 19,
    name: {
      zh: "刘子祎",
      en: "Ziyi LIU",
    },
    destination: {
      zh: "保研至天津大学",
      en: "Recommended for postgraduate studies at Tianjin University",
    },
    avatar: `${baseURL}assets/images/graduates/liuziyi.jpg`,
    thoughts: {
      zh: "此路将行,敬谢由心,特别鸣谢,一起成长的朋友们,给予我帮助的所有人,千言万语终觉词不达意,祝愿,山水一程,皆要好运,毕业快乐。",
      en: "This path I will tread; heartfelt thanks I offer. Special thanks to the friends who grew with me, and to everyone who helped me. A thousand words cannot fully express my feelings. I wish that for this journey through life, everyone has good luck. Happy graduation.",
    },
  },
  {
    id: 20,
    name: {
      zh: "曾楚懿",
      en: "Chuyi ZENG",
    },
    destination: {
      zh: "",
      en: "To be decided / N/A",
    },
    avatar: `${baseURL}assets/images/graduates/zengchuyi.jpg`,
    thoughts: {
      zh: "用设计年展来延长告别,浓度饱和的大学四年一终归于平静,热爱感恩相遇的每一个人,愿褪去本科生身份的我,更坚韧、勇敢、平和。",
      en: "Using the design annual exhibition to prolong the farewell, four years of intense university life finally return to tranquility. I love and am grateful for every person I've met. I hope that, having shed my undergraduate identity, I will be more resilient, brave, and peaceful.",
    },
  },
  {
    id: 21,
    name: {
      zh: "尹祎晗",
      en: "Yihan YIN",
    },
    destination: {
      zh: "读研",
      en: "Postgraduate studies",
    },
    avatar: `${baseURL}assets/images/graduates/weiyihan.jpg`,
    thoughts: {
      zh: "毕业快乐!夏天快乐!虽然仍有未竟之事,但还请把遗憾和期待留给人生的下一个阶段吧!人生从此将展开新的一页…但前途必然是光明的!",
      en: "Happy graduation! Happy summer! Although there are still unfinished matters, please leave the regrets and expectations for the next stage of life! Life will henceforth turn a new page... but the future is bound to be bright!",
    },
  },
  {
    id: 22,
    name: {
      zh: "陈雪懿",
      en: "Xueyi CHEN",
    },
    destination: {
      zh: "中国工作",
      en: "Work in China",
    },
    avatar: `${baseURL}assets/images/graduates/chenxueyi.jpg`,
    thoughts: {
      zh: "四年时光转瞬即逝,从懵懂走向成熟,感谢师长的谆谆教诲,朋友的真挚陪伴。每一次挑战与坚持,都是成长的印记。未来的路还很长,愿我们怀揣梦想,不忘初心,勇敢追光,在各自的人生舞台上熠熠生辉。再见了,校园;你好,世界!",
      en: "Four years have passed in a flash. From ignorance to maturity, I thank my teachers for their earnest guidance and my friends for their sincere companionship. Every challenge and perseverance is a mark of growth. The road ahead is still long. May we cherish our dreams, never forget our original intentions, bravely chase the light, and shine brightly on our respective life stages. Goodbye, campus; hello, world!",
    },
  },
  {
    id: 23,
    name: {
      zh: "张宇星",
      en: "Yuxing ZHANG",
    },
    destination: {
      zh: "京东",
      en: "JD.com",
    },
    avatar: `${baseURL}assets/images/graduates/zhangyuxing.jpg`,
    thoughts: {
      zh: "清溪奔快。",
      en: "Swiftly flows the clear stream.",
    },
  },
  {
    id: 24,
    name: {
      zh: "唐安尼达",
      en: "Annida TANG",
    },
    destination: {
      zh: "同济大学上海国际创新学院",
      en: "Tongji University, Shanghai International College of Innovation",
    },
    avatar: `${baseURL}assets/images/graduates/tangannida.jpg`,
    thoughts: {
      zh: "道阻且长,行则将至。感谢这一路走来的自己,四年大学生涯,有收获,有成长,有笑语,有泪水,有疯狂,也有遗憾。所有的经历都有意义,接纳普通平凡且不完美的自己。希望自己充满无限可能的未来里,依然满怀热情。",
      en: "The road is long and arduous, but with perseverance, one will arrive. I am grateful to myself for having come this far. In these four years of university life, there have been gains, growth, laughter, tears, madness, and regrets. All experiences have meaning. I accept my ordinary, imperfect self. I hope that in my future full of infinite possibilities, I will still be filled with passion.",
    },
  },
  {
    id: 25,
    name: {
      zh: "赵玉奇",
      en: "Yuqi ZHAO",
    },
    destination: {
      zh: "",
      en: "",
    },
    avatar: `${baseURL}assets/images/graduates/zhaoyuqi.jpg`,
    thoughts: {
      zh: "各位来宾大家好,我是汇报人赵玉奇,我和TJU工设一起完成了这项历时三年的课设。今天的汇报里用户还不够精准、可视化还不够漂亮、蓝图还不够完善。但是我的伙伴们足够可爱,我们的旅程足够精彩。汇报到此结束,请各位批评指正。繁星有一去不回的美,有时擦肩也许最珍贵。此路将行,敬谢由心。",
      en: "Good evening, everyone. I am Zhao Yuqi, the presenter. Together with TJU Industrial Design, I have completed this three-year course project. In today's presentation, the user targeting is not precise enough, the visualization is not beautiful enough, and the blueprint is not perfect enough. However, my partners are lovely enough, and our journey has been wonderful enough. This concludes my presentation. Please offer your critiques and corrections. Stars have a beauty of no return; sometimes, a chance encounter might be the most precious. This path I will tread; heartfelt thanks I offer.",
    },
  },
];
