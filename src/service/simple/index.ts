//对axios进行二次封装,将刚才下载好的axios导入进来
import axios from "axios";
import { useAuthStore } from "~/src/store";
//这里直接使用钩子可能会报错，useStore
// import { useRouter } from "vue-router";
// const router = useRouter();该方法只能在setup中使用
import { router } from "@/router/index";
import { getServiceEnvConfig } from "~/.env-config";
const { proxyPattern } = getServiceEnvConfig(import.meta.env);
//1.利用axios对象的方法create,去创建一个axios实例
//2.requests就是axios,只不过稍微配置一下
const requests = axios.create({
	//配置对象
	//基础路径，发请求的时候，路径当中会出现api，不用你手写
	baseURL: proxyPattern,
	//请求时间超过5秒
	timeout: 5000,
});
//请求拦截器:在发请求之前，请求拦截器可以检测到,可以在请求发出去之前做一些事情
//拦截所有请求，检查是否有token,不用进行路由跳转，只需将token加在请求头即可
requests.interceptors.request.use(
	(config) => {
		//config是个配置对象，对象里面有一个属性很重要，headers请求头

		//将所有使用requests的请求统一处理，添加token在headers中
		let token = localStorage.getItem("token");
		if (token) {
			//携带token发送请求
			config.headers.token = token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//响应拦截器：包含两个函数（一个是成功返回的函数，一个是失败的返回的函数）
requests.interceptors.response.use(
	(res) => {
		let { code } = res.data;
		switch (code) {
			case 401:
				console.log("跳转到login");
				//清除权限
				const auth = useAuthStore();
				auth.resetAuthStore();
				//提示未登录
				window.$message?.error("未登录");
				router.push("/login");
				break;
		}
		return res;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//对外暴露requests(axios的二次封装)
export default requests;
