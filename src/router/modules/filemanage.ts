const filemanage: AuthRoute.Route = {
	name: "filemanage",
	path: "/filemanage",
	component: "basic",
	children: [
		{
			name: "filemanage_userfilemanage",
			path: "/filemanage/userfilemanage",
			component: "self",
			meta: {
				title: "文件统计管理",
				requiresAuth: true,
				icon: "icon-park-outline:analysis",
			},
		},
		{
			name: "filemanage_userself",
			path: "/filemanage/userself",
			component: "self",
			meta: {
				title: "个人文件管理",
				requiresAuth: true,
				icon: "system-uicons:info-circle",
			},
		},
	],
	meta: {
		title: "文章管理",
		icon: "system-uicons:book-text",
		order: 3,
	},
};

export default filemanage;
