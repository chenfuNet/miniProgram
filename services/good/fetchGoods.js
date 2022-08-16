import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    }),
  );
}

/** 获取商品列表 */
export function fetchGoodsList(tabIndex = 0, pageIndex = 1, pageSize = 20) {
  // if (config.useMock) {
  //   return mockFetchGoodsList(pageIndex, pageSize);
  // }
  if (tabIndex == 0) {
    return new Promise((resolve) => {
      wx.request({
        url: 'http://8.136.244.224/web/itemCollection/recommend',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': wx.getStorageSync('userToken')
        },
        success: function (res) {
          if (res) {
            resolve(res.data.data);
          }
        },
        fail: function (err) {
          console.log('rjl');
        }
      })
    });
  } else {
    return new Promise((resolve) => {
      wx.request({
        url: 'http://8.136.244.224/web/itemCollection/home',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': wx.getStorageSync('userToken')
        },
        data: {
          'pageSize': 10,
          'currentPage': 1
        },
        success: function (res) {
          if (res) {
            resolve(res.data.data.listData);
          }
        },
        fail: function (err) {
          console.log('rjl');
        }
      })
    });
  }
}