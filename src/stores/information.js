import { defineStore } from 'pinia'

export const useInformationStore = defineStore('information', {
  state: () => ({
    exhibits: [
      {
        id: 1,
        title: '数字展品',
        description: '这是一个3D展示的数字艺术作品，展现了现代科技与艺术的结合。观众可以通过交互方式从不同角度欣赏这件作品。',
        modelUrl: '/models/chuxianzhe_t.glb',
        type: '3d',
        details: {
          author: '数字艺术家A',
          year: '2025',
          medium: '数字雕塑',
          teacher: '指导教师A'
        }
      },
      {
        id: 2,
        title: '展品二',
        description: '这是第二个展品的详细描述',
        type: '3d',
        modelUrl: '/public/models/cimushouzhong_w_l.glb', // 这里需要替换为实际的3D模型文件路径
        details: {
          author: '作者B',
          year: '2025',
          medium: '数字艺术'
        }
      },
      {
        id: 3,
        title: '展品三',
        description: '这是第三个展品的详细描述',
        imageUrl: '/path/to/image3.jpg',
        details: {
          author: '作者C',
          year: '2025',
          medium: '装置艺术'
        }
      }
    ]
  }),
  getters: {
    getExhibitById: (state) => (id) => {
      return state.exhibits.find(exhibit => exhibit.id === id)
    },
    getTotalExhibits: (state) => state.exhibits.length
  }
})
