// 远程展品API请求封装
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://idesign.tju.edu.cn/portal/api_v1",
  timeout: 15000,
});

// 获取某个展场下所有展品
export function fetchExhibitsByCategoryId(
  categoryId,
  { perPage = 9999, currentPage = 1 } = {}
) {
  return apiClient.get("/get_cates_lists", {
    params: {
      per_page: perPage,
      current_page: currentPage,
      category_id: categoryId,
    },
  });
}

// 获取某个展品的详细信息
export function fetchExhibitDetail(categoryId, id) {
  return apiClient.get("/get_design_detail", {
    params: {
      category_id: categoryId,
      id: id,
    },
  });
}
