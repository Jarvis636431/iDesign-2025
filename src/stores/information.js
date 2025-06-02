import { defineStore } from 'pinia'

export const useInformationStore = defineStore('information', {
  state: () => ({
    exhibits: [
      {
        id: 1,
        title: '展品一',
        description: '这是第一个展品的详细描述',
        imageUrl: '/path/to/image1.jpg',
        details: {
          author: '作者A',
          year: '2024',
          medium: '油画'
        }
      },
      {
        id: 2,
        title: '展品二',
        description: '这是第二个展品的详细描述',
        imageUrl: '/path/to/image2.jpg',
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
