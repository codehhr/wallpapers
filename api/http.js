// 封装 http请求

const BASE_URL = "http://wp.birdpaper.com.cn/intf";

export const httpRequest = ({ url, method = "GET", data = "" }) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: method,
      data,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      },
    });
  }).catch((e) => e);
};
