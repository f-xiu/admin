import { unref, nextTick } from "vue";
import { defineStore } from "pinia";
import { router } from "@/router";
import { fetchLogin } from "@/service";
import { useRouterPush } from "@/composables";
import { localStg } from "@/utils";
import { useTabStore } from "../tab";
import { useRouteStore } from "../route";
import { getToken, getUserInfo, clearAuthStorage } from "./helpers";
import { loginAPI } from "@/service/simple/user";
interface AuthState {
	/** 用户信息 */
	userInfo: Auth.UserInfo;
	/** 用户token */
	token: string;
	/** 登录的加载状态 */
	loginLoading: boolean;
}

export const useAuthStore = defineStore("auth-store", {
	state: (): AuthState => ({
		userInfo: getUserInfo(),
		token: getToken(),
		loginLoading: false,
	}),
	getters: {
		/** 是否登录 */
		isLogin(state) {
			return Boolean(state.token);
		},
	},
	actions: {
		/** 重置auth状态 */
		resetAuthStore() {
			const { toLogin } = useRouterPush(false);
			const { resetTabStore } = useTabStore();
			const { resetRouteStore } = useRouteStore();
			const route = unref(router.currentRoute);

			clearAuthStorage();
			this.$reset();

			if (route.meta.requiresAuth) {
				toLogin();
			}

			nextTick(() => {
				resetTabStore();
				resetRouteStore();
			});
		},
		/**
		 * 处理登录后成功或失败的逻辑
		 * @param backendToken - 返回的token
		 */
		async handleActionAfterLogin(data) {
			const route = useRouteStore();
			const { toLoginRedirect } = useRouterPush(false);

			// const loginSuccess = await this.loginByToken(backendToken);

			if (data.code == 200) {
				await route.initAuthRoute();
				let user = data.data.user;
				console.log(data.data.user);
				await this.loginByToken({
					token: "dfadf",
					refreshToken: "dfadf",
					userinfo: {
						/** 用户id */
						userId: user.id,
						/** 用户名 */
						userName: user.name,
						/** 用户角色类型 */
						userRole: "admin",
					},
				});
				// 跳转登录后的地址
				toLoginRedirect();

				// 登录成功弹出欢迎提示
				if (route.isInitAuthRoute) {
					window.$notification?.success({
						title: "登录成功!",
						content: `欢迎回来，${this.userInfo.userName}!`,
						duration: 3000,
					});
				}
				return;
			}

			// 不成功则重置状态

			window.$message?.error("登录失败!");
			this.resetAuthStore();
		},
		/**
		 * 根据token进行登录
		 * @param backendToken - 返回的token
		 */
		async loginByToken(data) {
			// 先把token存储到缓存中(后面接口的请求头需要token)
			const { token, refreshToken } = data;
			localStg.set("token", token);
			localStg.set("refreshToken", refreshToken);
			localStg.set("userInfo", data.userinfo);

			// 更新状态
			this.userInfo = data.userinfo;
			this.token = token;

			return true;
		},
		/**
		 * 登录
		 * @param userName - 用户名
		 * @param password - 密码
		 */
		async login(account: string, password: string) {
			this.loginLoading = true;
			const { data } = await loginAPI({
				account: account,
				password: password,
			});
			if (data) {
				await this.handleActionAfterLogin(data);
			}
			this.loginLoading = false;
		},
		/**
		 * 更换用户权限(切换账号)
		 * @param userRole
		 */
		async updateUserRole(userRole: Auth.RoleType) {
			const { resetRouteStore, initAuthRoute } = useRouteStore();

			const accounts: Record<
				Auth.RoleType,
				{ userName: string; password: string }
			> = {
				super: {
					userName: "Super",
					password: "super123",
				},
				admin: {
					userName: "Admin",
					password: "admin123",
				},
				user: {
					userName: "User01",
					password: "user01123",
				},
			};
			const { userName, password } = accounts[userRole];
			const { data } = await fetchLogin(userName, password);
			if (data) {
				await this.loginByToken(data);
				resetRouteStore();
				initAuthRoute();
			}
		},
	},
});
