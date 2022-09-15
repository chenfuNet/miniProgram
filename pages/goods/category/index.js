import { getCategoryList } from '../../../services/good/fetchCategoryList';
Page({
  data: {
    list: [],
  },
  async init() {
    try {
      const result = await getCategoryList();
      this.setData({
        list: result,
      });
    } catch (error) {
      console.error('err:', error);
    }
  },

  onShow() {
    this.getTabBar().init();
  },
  onChange(e) {
    console.log('rjl3'+ JSON.stringify(e));
    const {
      itemId
    } = e.detail.item.categoryId;
    console.log('rjl4');
    wx.navigateTo({
      url: '/pages/goods/list/index?categoryId=${itemId}',
    });
  },
  onLoad() {
    this.init(true);
  },
});
