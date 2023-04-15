import request from "./index";

const BASE_URL = "/user";
export const loginAPI = (data) => {
	return request.post(BASE_URL + "/login", data);
};
export const logoutAPI = () => {
	return request.get(BASE_URL + "/logout");
};

export const registerAPI = (data) => {
	return request.post(BASE_URL + "/register", data);
};

export const testAccessAPI = () => {
	return request.get(BASE_URL + "/test_access");
};
export const getUserInfo = (id) => {
	return request.get(BASE_URL + `/userinfo/${id}`);
};

export const changeUserInfo = (data) => {
	return request.post(BASE_URL + "/change-info", data);
};

export const changeUserInfoById = (data, id) => {
	return request.post(BASE_URL + `/change-info/${id}`, data);
};
export const changePasswd = (data) => {
	return request.post(BASE_URL + "/change-passwd", data);
};

export const getUsers = ({ num, size, name }: any) => {
	let str = "?num=" + num + "&size=" + size + "&name=" + (name ? name : "");
	return request.get(BASE_URL + "/user-list" + str);
};

export const deleteUser = (id: Number) => {
	return request.get(BASE_URL + "/delete/" + id);
};


