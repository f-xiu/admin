import { ref, watchEffect } from "vue";
export default function useMyTable(apiF: any, params?: any) {
	const data = ref([]);
	const page = ref(1);
	const pageSize = ref(10);
	const total = ref(10);
	const name = ref("");
	const pageSizes = [
		{
			label: "5 每页",
			value: 5,
		},
		{
			label: "10 每页",
			value: 10,
		},
		{
			label: "20 每页",
			value: 20,
		},
		{
			label: "30 每页",
			value: 30,
		},
		{
			label: "40 每页",
			value: 40,
		},
	];

	function getData(obj: any) {
		let readyParams = {
			...obj,
			...params,
		};
    console.log(readyParams)
		apiF(readyParams).then((res: any) => {
			let { code, data: resData } = res.data;
			if (code == 200) {
				let { pageSize: pSize, data: theData, totalPage } = resData;
				// page.value = currentNum
				pageSize.value = pSize;
				total.value = totalPage;
				data.value = theData;
			} else {
				window.$message?.error("失败");
			}
		});
	}
	watchEffect(() => {
		getData({
			num: page.value,
			size: pageSize.value,
		});
	});

	function handleSearch() {
		getData({
			num: page.value,
			size: pageSize.value,
			name: name.value,
		});
	}

	return {
		data,
		page,
		pageSize,
		pageSizes,
		total,
		name,
		getData,
		handleSearch,
	};
}
