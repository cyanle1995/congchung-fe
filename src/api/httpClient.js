import axios from "axios";
import constants from '../constants';

let my_axios = axios.create(
  {
    baseURL: constants.baseUrl,
    timeout: 60000,
  });

const post = (url, data, config = {}) => {
  return my_axios.post(url, data, config);
};

const get = (url, config = {}) => {
  return my_axios.get(url, config);
};

const put = (url, data, config = {}) => {
  return my_axios.put(url, data, config);
};

const del = (url, config = {}) => {
  return my_axios.delete(url, config);
};

export async function setConfigAxios() {
  const access_token = await localStorage.getItem('TOKEN');
  my_axios.defaults.headers.common = {"Access-Control-Allow-Origin": "*"};
  my_axios.defaults.timeout = 60000;
  my_axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
  my_axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// ('Access-Control-Allow-Origin', 'http://localhost:3333');
  // my_axios.defaults.headers.post['Accept-Encoding'] = 'gzip, deflate';
  // my_axios.defaults.headers.post['Accept-Language'] = 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4';
  if (access_token) {
    my_axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
  }
}

//Encapsulating in a JSON object

const HttpClient = {
  post,
  get,
  put,
  delete: del
};

export { HttpClient };

