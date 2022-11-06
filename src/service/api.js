import HTTP from "../utils/HTTP";

export default {
  get(url, data) {
    let option = { url, data };
    return HTTP.request(option, "GET");
  },
  post: function (url, data, contentType) {
    let option = { url, data, contentType };
    return HTTP.request(option, "POST");
  },
  put(url, data) {
    let option = { url, data };
    return HTTP.request(option, "PUT");
  },
  delete(url, data, contentType) {
    let option = { url, data, contentType };
    return HTTP.request(option, "DELETE");
  },
};
