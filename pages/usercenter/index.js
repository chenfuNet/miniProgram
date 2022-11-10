import {
  fetchUserCenter,
  updateWeChatUserInfo,
  checkWechatUserLoginStatus
} from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';
import {
  updateUserInfoWithWeChat,
  clearUserProfile
} from '../../model/usercenter';

const menuData = [
  // [{
  //     title: '收货地址',
  //     tit: '',
  //     url: '',
  //     type: 'address',
  //   },
  //   {
  //     title: '优惠券',
  //     tit: '',
  //     url: '',
  //     type: 'coupon',
  //   },
  //   {
  //     title: '积分',
  //     tit: '',
  //     url: '',
  //     type: 'point',
  //   },
  // ],
  [
    // {
    //   title: '退出登录',
    //   tit: '',
    //   url: '',
    //   type: 'login-out',
    // },
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
  ],
];

const orderTagInfos = [{
    title: '待付款',
    iconName: 'wallet',
    orderNum: 10,
    tabType: 5,
    status: 1,
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: 10,
    status: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: 40,
    status: 1,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 60,
    status: 1,
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 1,
  },
];

const getDefaultData = () => ({
  showMakePhone: false,
  userInfo: {
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: '',
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {},
  currAuthStep: 1,
  showKefu: true,
  versionNo: '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
    this.getUserInfo();
  },

  onShow() {
    this.getTabBar().init();
    // this.init();
    this.getUserInfo();
  },
  onPullDownRefresh() {
    // this.init();
  },

  init() {

  },

  onShareTimeline() {
    const customInfo = {
      imageUrl: '/images/logo.jpeg',
      title: '写忆出品',
      query: 'pages/home/home',
    };
    return customInfo;
  },

  onShareAppMessage() {
    const customInfo = {
      imageUrl: '/images/logo.jpeg',
      title: '写忆出品',
      path: 'pages/home/home',
    };
    return customInfo;
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(
      ({
        userInfo,
        countsData,
        orderTagInfos: orderInfo,
        customerServiceInfo,
      }) => {
        // eslint-disable-next-line no-unused-expressions
        menuData?.[0].forEach((v) => {
          countsData.forEach((counts) => {
            if (counts.type === v.type) {
              // eslint-disable-next-line no-param-reassign
              v.tit = counts.num;
            }
          });
        });
        const info = orderTagInfos.map((v, index) => ({
          ...v,
          ...orderInfo[index],
        }));
        this.setData({
          userInfo,
          menuData: [
            [
              // {
              //   title: '退出登录',
              //   tit: '',
              //   url: '',
              //   type: 'login-out',
              // },
              {
                title: '客服热线',
                tit: '',
                url: '',
                type: 'service',
                icon: 'service',
              },
            ]
          ],
          orderTagInfos: info,
          customerServiceInfo,
          currAuthStep: 2,
        });
        wx.stopPullDownRefresh();
      },
    );
  },

  onClickCell({
    currentTarget
  }) {
    const {
      type
    } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({
          url: '/pages/usercenter/address/list/index'
        });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'gotoShopCar': {
        wx.switchTab({
          url: '/pages/cart/index',
        });
        // wx.getUserProfile({
        //   desc: '用于完善会员资料',
        //   success: (res) => {

        //   },
        //   fail: () => {

        //   }
        // })
        break;
      }
      case 'login-out': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '退出登录成功',
          icon: '',
          duration: 1000,
        });
        clearUserProfile();
        wx.setStorageSync('userToken', "")
        this.setData({
          userInfo: {},
          currAuthStep: 1,
          menuData: [
            [{
              title: '客服热线',
              tit: '',
              url: '',
              type: 'service',
              icon: 'service',
            }]
          ],
        });

        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({
          url: '/pages/coupon/coupon-list/index'
        });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({
        url: '/pages/order/after-service-list/index'
      });
    } else {
      wx.navigateTo({
        url: `/pages/order/order-list/index?status=${status}`
      });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({
      url: '/pages/order/order-list/index'
    });
  },

  openMakePhone() {
    this.setData({
      showMakePhone: true
    });
  },

  closeMakePhone() {
    this.setData({
      showMakePhone: false
    });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    const {
      currAuthStep
    } = this.data;
    if (currAuthStep === 2) {
      // wx.navigateTo({
      //   url: '/pages/usercenter/person-info/index'
      // });
    } else {
      // this.fetUseriInfoHandle();
      var success = (res) => {
        this.setData({
          userInfo: {
            avatarUrl: res?.avatarUrl,
            nickName: res?.nickName,
          },
          menuData: [
            [{
                title: '退出登录',
                tit: '',
                url: '',
                type: 'login-out',
              },
              {
                title: '去购物车',
                tit: '',
                url: '',
                type: 'gotoShopCar',
              },
              {
                title: '客服热线',
                tit: '',
                url: '',
                type: 'service',
                icon: 'service',
              },
            ]
          ],
          currAuthStep: 2
        });
      };

      var failure = () => {
        wx.showToast({
          title: '授权失败',
          icon: 'error',
        });
      }

      updateWeChatUserInfo(success, failure);
    }
  },

  getUserLoginRequest() {
    checkWechatUserLoginStatus(() => {
      console.log('zdy-------登录验证成功')
      this.gotoUserEditPage()
    });
  },

  getUserInfo() {
    updateUserInfoWithWeChat((res) => {
      this.setData({
        userInfo: {
          avatarUrl: res?.avatarUrl,
          nickName: res?.nickName,
        },
        menuData: [
          [{
              title: '退出登录',
              tit: '',
              url: '',
              type: 'login-out',
            },
            {
              title: '去购物车',
              tit: '',
              url: '',
              type: 'gotoShopCar',
            },
            {
              title: '客服热线',
              tit: '',
              url: '',
              type: 'service',
              icon: 'service',
            },
          ]
        ],
        currAuthStep: 2
      });
    })
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const {
      version,
      envVersion = __wxConfig
    } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});