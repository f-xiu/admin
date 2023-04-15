<template>
  <div class="w-full">
    <my-datatable title="用户管理" :name="name" @change-name="(s) => name = s" :colums="columns" :data="data"
      @search="handleSearch">
      <template #pagination>
        <n-pagination class="flex-x-center" v-model:page="page" v-model:page-count="total" size="large"
          v-model:page-size="pageSize" :page-sizes="pageSizes" show-quick-jumper show-size-picker />
      </template>
    </my-datatable>
    <!-- 删除提示 -->
    <n-modal v-model:show="showModalDelete" preset="dialog" :title="deleteTitle" content="你确认?" positive-text="确认"
      negative-text="算了" @positive-click="deleteSubmit" />
    <!-- 用户信息编辑 -->
    <n-modal v-model:show="showModal">
      <n-card style="width: 500px" title="用户信息编辑" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <edit-info :theRow="selectedRow" @close-modal="closeModal" />
      </n-card>
    </n-modal>
  </div>
</template>
<script lang="ts" setup>  
import { ref, computed } from 'vue'
import { createColumns } from './components'
import { getUsers } from '@/service/simple/user'
import { EditInfo } from './components'
import { deleteUser } from "@/service/simple/user"
import useMyTable from '@/hooks/business/use-mytable'
const closeModal = () => {
  showModal.value = false;
  //刷新
  handleSearch()
}
const {
  name,
  data,
  page,
  pageSize,
  pageSizes,
  total,
  handleSearch
} = useMyTable(getUsers)
const showModalDelete = ref(false)
const showModal = ref(false)
const selectedRow = ref({
  id: 1,
  name: "",
  account: "",
  password: "",
  email: "",
  date: "",
  money: 0.00,
  avatar: "",
  deleted: 0
});
const columns = createColumns({
  edit(row: any) {
    selectedRow.value = row
    showModal.value = true;
  },
  deleteRow(row: any) {
    selectedRow.value = row
    showModalDelete.value = true;
  }
});

const deleteTitle = computed(() => {
  return '删除用户:  ' + selectedRow.value.name
});
const deleteSubmit = () => {
  //删除并更新
  deleteUser(selectedRow.value.id).then((res) => {
    let { message, code } = res.data
    if (code == 200) {
      window.$message?.success("删除成功")
      showModalDelete.value = false;
    }
    else {
      window.$message?.error(message ? message : "删除失败")
    }
  })
  handleSearch()
}
</script>