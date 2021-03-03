const host = 'https://api.tusij.com'
const app = getApp()

// 获取用户信息，每次调用都会弹出弹窗让用户确认
const getUserProfile = ()=>{
    return new Promise((resolve, reject) => {
        wx.getUserProfile({
            desc:'业务需要',
            lang:'zh_CN',
            success(res){
                if(res.userInfo)
                resolve(res.userInfo)
            },
            fail(error){
                reject(error)
            }
        })
    })
}

const getUserInfo = ()=>{
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            lang:'zh_CN',
            success(res){
                if(res)
                    resolve(res)
            },
            fail(error){
                reject(error)
            }
        })
    })
}

// 获取设备信息
const getSystemInfo = ()=>{
    return new Promise((resolve, reject) => {
        wx.getSystemInfo({
            success(res){
                resolve(res)
            },
            fail(error){
                reject(error)
            }
        })
    })
}

// 获取登录临时凭证 code
const getLoginCode = ()=>{
    return new Promise((resolve, reject) => {
        wx.login({
            success(res){
                if(res.code) {
                    console.log({method:'getLoginCode',code:res.code})
                    resolve(res.code)
                }
            },
            fail(error){
                reject(error)
            }
        })
    })
}

// 获取用户当前权限设置，返回值为小程序已经向用户请求过的权限
const getSetting = ()=>{
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res){
                if(res && res.authSetting){
                    resolve(res.authSetting)
                }
            },
            fail(error){
                reject(error)
            }
        })
    })
}

// 在自家服务器上获取用户信息，目前有8个字段（2021.3.3）
// id、needUserInfo、need_user_info、need_user_profile、token、user_id、vip_icon、vip_id
const getUserInfoServer = ()=>{
    return new Promise((resolve, reject) => {
        getLoginCode().then(res=>{
            console.log(res)
            console.log(host + `/v2/login-code?code=${res}`)
            wx.request({
                method: "GET",
                url: host + `/v2/login-code?code=${res}`,
                success(res) {
                    if(res && res.data && res.data.code===200){
                        resolve(res.data.data)
                    }
                },
                fail(error) {
                    reject(error);
                }
            })
        })
    })
}

const fetchPure = (method, api, data, isFormData)=>{
    let url = "";
    if (api.indexOf("?") > -1) {
        url = host + api + `&token=${app && app.globalData && app.globalData.token}`;
    }else {
        url = host + api + `?token=${app && app.globalData && app.globalData.token}`;
    }
    return new Promise((resolve, reject) => {
        wx.request({
            method: method.toUpperCase(),
            url: url,
            header: {
                'content-type': isFormData ? "application/x-www-form-urlencoded": 'application/json' // 默认值
            },
            data: data ? data : '',
            success(res) {
                resolve(res)
            },
            fail(e) {
                reject(e);
            }
        })
    })
}

export {
    host,
    getUserProfile,
    getUserInfo,
    getUserInfoServer,
    getSystemInfo,
    getLoginCode,
    fetchPure
}