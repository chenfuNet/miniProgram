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
export function fetchGoodsList(pageIndex = 1, pageSize = 20) {
  // if (config.useMock) {
  //   return mockFetchGoodsList(pageIndex, pageSize);
  // }
  return new Promise((resolve) => {

    wx.request({
      url: 'http://8.136.244.224/web/itemCollection/home',
      method: 'POST',
      header: {
        'Content-Type':'application/json',
        'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0IiwiZXhwIjoxNjYwNDQ1MzA0LCJpYXQiOjE2NTk4NDA1MDR9.g8zhh40EFykdIZUaCnYchPr92dFcgMYhWFShBfOnynI'
      },
      data: {
          'pageSize':10,
          'currentPage':1
      },
      success:function(res){
        if (res) {
          resolve(res.data.data.listData);
        }
     },
     fail:function(err) {
          console.log('rjl');  
     }
     
    })
  });
}
