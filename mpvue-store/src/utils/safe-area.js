let cache = null;
export default function getSafeArea() {
    return new Promise((resolve, reject) => {
        if (cache != null) {
        // 如果有缓存不行行调用
            resolve(cache);
        }
        else {
        // 获取系统信息
            wx.getSystemInfo({
                success: ({ model, screenHeight, statusBarHeight }) => {
                    const iphoneX = /iphone x/i.test(model);
                    const iphoneNew = /iPhone11/i.test(model) && screenHeight === 812;
                    const iphoneSX = /iphone\sx/i.test(model)
                    const iphoneUnknow = /iphone/i.test(model) && /unknown/.test(model)
                    const iphoneS11 = /iphone\s11/i.test(model)
                    cache = {
                        isIPhoneX: iphoneX || iphoneNew || iphoneSX || iphoneUnknow || iphoneS11,
                        statusBarHeight
                    };
                    resolve(cache);
                },
                fail: reject
            });
        }
    });
}