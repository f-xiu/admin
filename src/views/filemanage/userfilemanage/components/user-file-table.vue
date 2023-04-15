<template>
  <my-datatable title="用户文章统计表格" :name="name" search-tip="请输入名称查询" @change-name="changName" :colums="columns" :data="data"
    @search="search">
  </my-datatable>
</template>
<script lang="ts" setup>
import { watch, ref } from "vue";
import { h } from 'vue'
import { NButton } from "naive-ui";
const props = defineProps(['userId2FileList', 'userList'])
const emits = defineEmits(['open-filemanage'])
const name = ref('')
const data = ref([])
const changName = (v: string) => {
  name.value = v
};
watch(props, (newProps) => {
  data.value = getData(newProps);
})
const getData = (newProps: any) => {
  let dataV: any = newProps.userList.map((item: any) => {
    let key = item.id;
    return {
      id: key,
      name: item.name,
      number: newProps.userId2FileList[key].length
    }
  });
  return dataV;
}

const createColumns = ({ gotoManage }: any) => {
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
      title: '文章数量',
      key: 'number'
    },
    {
      title: "操作",
      key: "actions",
      render(row: Object) {
        return h(
          NButton,
          {
            strong: true,
            type: "primary",
            size: "small",
            onClick: () => gotoManage(row),
          },
          { default: () => "管理该用户" }
        )
      }
    }
  ];
};
const columns = createColumns({
  gotoManage: (row: any) => {
    emits('open-filemanage', row?.id)
  }
})
const search = () => {
  //根据name模糊搜索用户名
  let dataV = getData(props);
  let newData: any = dataV.filter((item: any) => item?.name.match(`^.*${name.value}.*$`));
  data.value = newData
}

</script>