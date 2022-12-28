import { httpRequest } from "../../api/http";

// search
export const onSearch = ({ keywords, pageNum, pageSize }) => {
  return httpRequest({
    url: "/search",
    data: {
      content: keywords,
      pageno: pageNum,
      count: pageSize,
    },
  });
};

// Get categories
export const getCategory = () => {
  return httpRequest({ url: "/getCategory" });
};

// Get imgList By CategoryId
export const getImgListByCategoryId = ({ categoryId, pageNum, pageSize }) => {
  return httpRequest({
    url: "/GetListByCategory",
    data: {
      cids: categoryId,
      pageno: pageNum,
      count: pageSize,
    },
  });
};
