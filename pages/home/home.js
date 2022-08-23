import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: 500,
    interval: 5000,
    navigation: { type: 'dots' },
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({
      tabList
    }) => {
      this.setData({
        tabList,
        pageLoading: false,
      });
      this.loadGoodsList(true);
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail.value;
    this.loadGoodsList(true);
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    let pageIndex =
      this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 0;
    }

    try {
      const nextList = await fetchGoodsList(this.privateData.tabIndex, pageIndex, pageSize);
      const tabIndex = this.privateData.tabIndex;
      if (tabIndex == 0) {
        this.setData({
          goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
          goodsListLoadStatus: 2,
        });
      } else {
        this.setData({
          goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
          goodsListLoadStatus: 0,
        });
      }
      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      this.setData({
        goodsListLoadStatus: 3
      });
    }
  },

  goodListClickHandle(e) {
    const {
      index
    } = e.detail;
    const {
      itemId
    } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?itemId=${itemId}`,
    });
  },

  goodListAddCartHandle(e) {
    const {
      index
    } = e.detail;
    const {
      itemId
    } = this.data.goodsList[index];
    wx.request({
      url: 'http://47.98.117.117/web/shopCart/add',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('userToken')
      },
      data: {
        'itemId': itemId,
        'quantity': 1
      },
      success: function (res) {
        if (res.data.errorMsg) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.errorMsg,
          });
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '加入购物车成功',
          });
        }
      },
      fail: function (err) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '加入购物车失败',
        });
      }
    })
  },

  navToSearchPage() {
    wx.navigateTo({
      url: '/pages/goods/search/index'
    });
  },

  navToActivityDetail({
    detail
  }) {
    const {
      index: promotionID = 0
    } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },
});