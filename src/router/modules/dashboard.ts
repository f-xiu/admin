const dashboard: AuthRoute.Route = {
	name: "dashboard",
	path: "/dashboard",
	component: "basic",
	children: [
		{
			name: "dashboard_analysis",
			path: "/dashboard/analysis",
			component: "self",
			meta: {
				title: "分析页",
				requiresAuth: true,
				icon: "icon-park-outline:analysis",
			},
		},
		{
			name: "dashboard_userinfo",
			path: "/dashboard/userinfo",
			component: "self",
			meta: {
				title: "个人信息",
				requiresAuth: true,
				icon: "system-uicons:info-circle",
			},
		},
	],
	meta: {
		title: "主页",
		icon: "mdi:monitor-dashboard",
		order: 1,
	},
};

export default dashboard;
