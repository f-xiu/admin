<template>
  <div class="w-full relative">
    <div class="absolute right-2 top-2  z-100">
      <slot name="btn" />
    </div>
    <n-space vertical>
      <div v-if="showCard">
        <userinfo-card :userinfo="userinfo" :number="number" />
      </div>
      <my-datatable :name="name" @change-name="(e) => name = e" @search="handleSearch" title="文件管理表格" :colums="colums"
        :data="data">
        <template #func_btn>
          <n-button @click="handleAddNew">新增</n-button>
        </template>
        <template #pagination>
          <n-pagination class="flex-x-center" v-model:page="page" v-model:page-count="total" size="large"
            v-model:page-size="pageSize" :page-sizes="pageSizes" show-quick-jumper show-size-picker />
        </template>
      </my-datatable>
    </n-space>


    <n-modal v-model:show="modal.showEditContent" @after-leave="() => {
      modal.showEditContent = false;
      newFile = false;
    }">
      <n-card style="width:80%;height:680px" :bordered="false" size="huge" role="dialog" aria-modal="true">

        <div>
          <my-makdown :file-id="modal.readyId" :new-file="newFile" :user-id="$props.userId" :title="modal.title"
            @search="handleSearch" :description="modal.description" @colse="() => {
              modal.showEditContent = false;
              modal.showEditInfo = false;
              newFile = false;
            }">
          </my-makdown>
        </div>
      </n-card>
    </n-modal>


    <!-- <n-modal v-model:show="modal.showEditInfo" preset="dialog" title="修改基本信息" @after-leave="() => {
        modal.showEditInfo = false;
        newFile = false;
      }">
        <n-card :bordered="false" size="huge" role="dialog" aria-modal="true">
          <n-form inline :label-width="80" :model="modal" size="small">
            <n-space vertical>
              <n-form-item label="标题" path="title">
                <n-input v-model:value="modal.title" placeholder="输入标题" />
              </n-form-item>
              <n-form-item label="描述" path="description">
                <n-input v-model:value="modal.description" placeholder="输入描述" />
              </n-form-item>
              <n-space>
                <n-button type="primary">确定</n-button>
                <n-button type="warning" @click="() => {
                  modal.title = selectedRow?.title;
                  modal.description = selectedRow?.description;
                }">重置</n-button>
              </n-space>
            </n-space>
          </n-form>
        </n-card>
      </n-modal> -->
  </div>
</template>

<script setup lang="ts">
import { getUserPages } from "@/service/simple/file";
import { NSpace, NButton } from 'naive-ui';
import { h, reactive, onMounted, ref } from "vue";
import useMyTable from "~/src/hooks/business/use-mytable";
import { getUserFiles, deleteFileById } from "~/src/service/simple/file";
import { getUserInfo } from "~/src/service/simple/user";
const props = defineProps(['userId', 'showCard'])
const {
  data,
  page,
  pageSize,
  pageSizes,
  total,
  name,
  handleSearch,
} = useMyTable(getUserPages, {
  userId: props.userId
})
let selectedRow = null;
const userinfo = ref();
const number = ref(0);
const modal = reactive({
  showEditContent: false,
  showEditInfo: false,
  readyId: 0,
  title: '',
  description: ''
})
const newFile = ref(false)
onMounted(() => {
  requestUserinfo()
  requestUserFiles()
})

const requestUserinfo = async () => {
  //根据id得到用户信息
  let id = props.userId;
  let res = await getUserInfo(id);
  let { code, message, data } = res.data;
  if (code == 200) {
    userinfo.value = data
  }
  else {
    window.$message?.error("失败," + message);
  }
}
const requestUserFiles = async () => {
  let id = props.userId;
  let res = await getUserFiles(id);
  let { code, message, data } = res.data;
  if (code == 200) {
    number.value = data.length;
  }
  else {
    window.$message?.error("失败," + message);
  }
}
const createColumns = ({ editContent, editInfo, deleteRow }) => {
  return [
    {
      title: "FileID",
      key: "id",
      width: 100,
    },
    {
      title: "文件标题",
      key: "title",
      resizable: true,
      width: 120
    },
    {
      title: '描述',
      key: 'description',
      ellipsis: true,
      resizable: true
    },
    {
      title: "服务端path",
      key: "filename",
      ellipsis: true,
      resizable: true
    },
    {
      title: "所属者id",
      key: "userId",
      width: 100,
    }, {
      title: "删除",
      key: "delete",
      align: 'center',
      width: 80,
      render(row: Object) {
        return h(
          NButton,
          {
            strong: true,
            size: "small",
            type: "warning",
            onClick: () => deleteRow(row),
          },
          { default: () => "删除" }
        )
      }
    },
    {
      title: "操作",
      key: "actions",
      align: "center",
      resizable: true,
      render(row: Object) {
        return h(
          NButton,
          {
            strong: true,
            type: "primary",
            size: "small",
            onClick: () => editContent(row),
          },
          { default: () => "编辑内容" }
        )
        // return h(NSpace, { justify: 'center' }, [
        //   h(
        //     NButton,
        //     {
        //       strong: true,
        //       type: "primary",
        //       size: "small",
        //       onClick: () => editContent(row),
        //     },
        //     { default: () => "编辑内容" }
        //   ),
        //   h(
        //     NButton,
        //     {
        //       strong: true,
        //       type: "primary",
        //       size: "small",
        //       onClick: () => editInfo(row),
        //     },
        //     { default: () => "编辑信息" }
        //   )
        // ]);
      },
    },
  ];

}
const colums = createColumns({
  editContent(row) {
    modal.showEditContent = true;
    getFileInfo(row);
  },

  editInfo(row) {
    modal.showEditInfo = true;
    getFileInfo(row);
  },

  deleteRow(row) {
    //调用删除接口
    deleteFileById(row.id).then(res => {
      let { code, message } = res.data
      if (code == 200) {
        window.$message?.success("成功")
      }
      else {
        window.$message?.error("失败" + message)
      }
    })
    handleSearch()
  }
})
const getFileInfo = (row) => {
  modal.readyId = row.id;
  modal.title = row.title;
  modal.description = row.description;
  selectedRow = row;
}
const handleAddNew = () => {
  modal.showEditContent = true;
  newFile.value = true;
}

</script>

<style scoped></style>