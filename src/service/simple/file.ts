import request from "./index";
const BASE_URL = "/file";
export const getStatistic = () => {
	return request.get(BASE_URL + "/statistic");
};
export const getUserFiles = (id: Number) => {
	return request.get(BASE_URL + `/getUserFiles/${id}`);
};

export const getUserPages = ({ num, size, name, userId }: any) => {
	console.log(num, size, name, userId);
	let str = "";
	if (num != undefined) {
		str += "?num=" + num;
	}
	if (size != undefined) {
		str += "&size=" + size;
	}
	if (name != undefined) {
		str += "&name=" + name;
	}

	if (userId != undefined) {
		str += "&userId=" + userId;
	}
	return request.get(BASE_URL + "/file-list" + str);
};

export const getMd = (id) => {
	return request.get(BASE_URL + "/get_markdown_content/" + id);
};

export const getFileById = (id) => {
	return request.get(BASE_URL + "/get-file/" + id);
};


export const deleteFileById = (id) => {
	return request.get(BASE_URL + "/delete/" + id);
};


export const uploadMd = (formData) => {
	return request.post(BASE_URL + "/upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const updateMd = (formData) => {
	return request.post(BASE_URL + "/update", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

