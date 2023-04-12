const plugin: AuthRoute.Route = {
	name: "plugin",
	path: "/plugin",
	component: "basic",
	children: [
		{
			name: "plugin_editor",
			path: "/plugin/editor",
			component: "multi",
			children: [
				{
					name: "plugin_editor_quill",
					path: "/plugin/editor/quill",
					component: "self",
					meta: {
						title: "富文本编辑器",
						requiresAuth: true,
						icon: "mdi:file-document-edit-outline",
					},
				},
				{
					name: "plugin_editor_markdown",
					path: "/plugin/editor/markdown",
					component: "self",
					meta: {
						title: "markdown编辑器",
						requiresAuth: true,
						icon: "ri:markdown-line",
					},
				},
			],
			meta: {
				title: "编辑器",
				icon: "icon-park-outline:editor",
			},
		},
	],
	meta: {
		title: "插件示例",
		icon: "clarity:plugin-line",
		order: 4,
	},
};

export default plugin;
