// 定义基础URL
export const baseURL = import.meta.env.VITE_BASE_URL || ''

// 毕业生数据配置
export const graduates = [
    {
        id: 1,
        name: {
            zh: '白昊',
            en: 'Bai Hao'
        },
        destination: {
            zh: '工作',
            en: 'Work'
        },
        avatar: `${baseURL}assets/images/graduates/baihao.png`,
        thoughts: {
            zh: '毕业，是一段程序的结点，亦是新生命的起源。那些大大大的片刻，每一段我们总以为之前的经验会终其一生有用，但事经常并非如此。新的事与物也在等待我们重新定义，重新解构，重新阐释。',
            en: 'Graduation is both an endpoint of a program and the origin of new life. In those grand moments, while we believe our past experiences will serve us forever, reality often proves otherwise. New things and matters await our redefinition, reconstruction, and reinterpretation.'
        }
    },
    {
        id: 2,
        name: {
            zh: '风巳夷',
            en: 'Feng Siyi'
        },
        destination: {
            zh: '软件开发',
            en: 'Software Development'
        },
        avatar: `${baseURL}assets/images/graduates/fengsiyi.jpg`,
        thoughts: {
            zh: '南方来风，不到不就，劲扬而无声。已携布着方向，通晓与节奏。晚霞亦消伴终才，也推动万物的生长。',
            en: 'The southern wind comes, neither rushing nor lingering, vigorous yet silent. It carries direction, understanding rhythm. As the sunset fades with completion, it also drives the growth of all things.'
        }
    }
]
