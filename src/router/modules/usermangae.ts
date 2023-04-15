const usermanage: AuthRoute.Route = {
	name: "usermanage",
	path: "/usermanage",
	component: "self",
	meta: {
		title: "用户管理",
		requiresAuth: true,
		singleLayout: "basic",
		icon: "system-uicons:user-male",
		order: 2,
	},
};

export default usermanage;
