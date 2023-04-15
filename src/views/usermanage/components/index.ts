import { h } from "vue";
import { NButton, NSpace } from "naive-ui";
import EditInfo from "./edit-info.vue";
export { EditInfo };
export const createColumns = ({ edit, deleteRow }) => {
	return [
		{
			title: "ID",
			key: "id",
		},
		{
			title: "姓名",
			key: "name",
		},
		{
			title: "账号",
			key: "account",
		},
		{
			title: "密码",
			key: "password",
		},
		{
			title: "邮箱",
			key: "email",
		},
		{
			title: "生日",
			key: "date",
		},
		{
			title: "余额(元)",
			key: "money",
		},
		{
			title: "操作",
			key: "actions",
			render(row: Object) {
				return h(NSpace, [
					h(
						NButton,
						{
							strong: true,
							type: "primary",
							size: "small",
							onClick: () => edit(row),
						},
						{ default: () => "编辑" }
					),
					h(
						NButton,
						{
							strong: true,
							size: "small",
							type: "warning",
							onClick: () => deleteRow(row),
						},
						{ default: () => "删除" }
					),
				]);
			},
		},
	];
};
