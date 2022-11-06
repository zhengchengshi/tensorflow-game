import axios from "axios";

const getBaseUrl = (env) => {
  // base[env] === {...}[env]
  let base = {
    production: "https://tensorflow-game.zhengchengshi.cn/api",
    development: "https://tensorflow-game.zhengchengshi.cn/api",
    test: "http://localhost:3001",
  }[env];
  if (!base) {
    base = "/";
  }
  return base;
};

class NewAxios {
  constructor() {
    this.baseURL = getBaseUrl(process.env.NODE_ENV); //baseUrl设置
    this.timeout = 10000; //超时
    this.withCredentials = true; //凭证携带
  }

  request(params, method) {
    // 每次请求都会创建新的axios实例。
    const instance = axios.create();

    const { url, data } = params;

    let contentType = "application/json";
    contentType = params.contentType || contentType;
    // 将用户传过来的参数与公共配置合并。
    const config = {
      url: url,
      data: data,
      method: method,
      contentType,
      baseURL: this.baseURL,
      timeout: this.timeout,
      // withCredentials: this.withCredentials,  //限定域时开启
    };

    console.log(config);

    // 配置拦截器，支持根据不同url配置不同的拦截器。
    this.setInterceptors(instance, params.url);
    // 返回axios实例的执行结果
    return instance(config);
  }

  setInterceptors = (instance, url) => {
    // 请求拦截器
    instance.interceptors.request.use(
      (config) => {
        // 配置token
        config.headers.Authorization =
          `Bearer ${localStorage.getItem("token")}` || "";
        return config;
      },
      (err) => Promise.reject(err)
    );

    // 响应拦截器
    instance.interceptors.response.use(
      (response) => {
        // todo: 想根据业务需要，对响应结果预先处理的，都放在这里
        console.log(response);
        return response;
      },
      (err) => {
        if (err.response) {
          // 响应错误码处理
          switch (err.response.status) {
            case "403":
              console.log(403);
              // todo: handler server forbidden error
              break;
            // todo: handler other status code
            default:
              break;
          }
          return Promise.reject(err.response);
        }
        if (!window.navigator.online) {
          // 断网处理
          // todo: jump to offline page
          return -1;
        }
        return Promise.reject(err);
      }
    );
  };
}

export default new NewAxios();
