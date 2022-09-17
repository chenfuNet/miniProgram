/* eslint-disable no-param-reassign */
import {
  config
} from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(params) {
  const {
    delay
  } = require('../_utils/delay');
  const {
    getSearchResult
  } = require('../../model/search');

  const data = getSearchResult(params);

  if (data.spuList.length) {
    data.spuList.forEach((item) => {
      item.spuId = item.spuId;
      item.thumb = item.primaryImage;
      item.title = item.title;
      item.price = item.minSalePrice;
      item.originPrice = item.maxLinePrice;
      item.desc = '';
      if (item.spuTagList) {
        item.tags = item.spuTagList.map((tag) => tag.title);
      } else {
        item.tags = [];
      }
    });
  }
  return delay().then(() => {
    return data;
  });
}

/** 获取商品列表 */
export function fetchGoodsList(params) {
  const {
    categoryId
  } = params;
  console.log('rjl___' + params);
  return new Promise((resolve) => {
    wx.request({
      url: 'https://r-cf.com/web/itemCollection/filter',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('userToken')
      },
      data: {
        'categoryId': categoryId,
        'page': {
          'pageSize': 20,
          'currentPage': 1
        }
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
}