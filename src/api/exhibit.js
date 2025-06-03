// 远程展品API请求封装
import axios from 'axios'


// 获取某个展场下所有展品
export function fetchExhibitsByCategoryId(categoryId) {
  return axios.get('http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists', {
    params: {
      per_page: 9999,
      current_page: 1,
      category_id: categoryId
    }
  })
}

// 获取某个展品的详细信息
export function fetchExhibitDetail(categoryId, id) {
  return axios.get('http://idesign.tju.edu.cn/portal/api_v1/get_design_detail', {
    params: {
      category_id: categoryId,
      id: id
    }
  })
}
