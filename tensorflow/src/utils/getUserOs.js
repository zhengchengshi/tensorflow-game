export default function getOperationSys() {
    // let OS = '';
    // let OSArray = {};
    // let UserAgent = navigator.userAgent.toLowerCase();
    // OSArray.Windows = (navigator.platform == 'Win32') || (navigator.platform == 'Windows');
    // OSArray.Mac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC')
    //     || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
    // OSArray.iphone = UserAgent.indexOf('iPhone') > -1;
    // OSArray.ipod = UserAgent.indexOf('iPod') > -1;
    // OSArray.ipad = UserAgent.indexOf('iPad') > -1;
    // OSArray.Android = UserAgent.indexOf('Android') > -1;
    // for (let i in OSArray) {
    //     if (OSArray[i]) {
    //     OS = i;
    //     }
    // }
    // return OS;
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isiOS
    
}