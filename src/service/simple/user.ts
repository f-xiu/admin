import request from "./index";

const BASE_URL = "/user";
export const loginAPI = (data) => {
	return request.post(BASE_URL + "/login", data);
};
export const logoutAPI = () => {
	return request.get(BASE_URL + "/logout");
};
export const testAccessAPI = () => {
	return request.get(BASE_URL + "/test_access");
};
export const getUserInfo = () => {
	return request.get(BASE_URL + "/userinfo");
};

export const changeUserInfo = (data) => {
	return request.post(BASE_URL + "/change-info", data);
};

export const changePasswd = (data) => {
	return request.post(BASE_URL + "/change-passwd", data);
};
