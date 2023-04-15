<template>
  <n-card>
    <div v-if="isManage">
      <my-filemanage :user-id="nowManageId">
        <template #btn>
          <n-button @click="isManage = false">返回</n-button>
        </template>
        
      </my-filemanage>
    </div>
    <n-space vertical :size="20" v-else>
      <n-card>
        <user-file-table @open-filemanage="openFileManage" :user-id2-file-list="needData.userId2FileList"
          :user-list="needData.userList"
        />
      </n-card>
      <n-card>
        <file-chart :x-data="chartData.xData" :value="chartData.value" />
      </n-card>
    </n-space>
  </n-card>
</template>
<script lang="ts" setup>
import { getStatistic } from "@/service/simple/file";
import { reactive, ref, watch } from 'vue';
import { FileChart } from './components'
import { UserFileTable } from "./components";
const isManage = ref(false)
const nowManageId = ref<Number>(1)
const chartData = reactive({
  xData: [],
  value: []
})
const needData = reactive({
  userList: [],
  userId2FileList: {}
})
watch(isManage, async (newValue) => {
  //请求得到data
  if (newValue == false) {
    let { data: theData } = await getStatistic();
    let { code, data: realData } = theData
    if (code == 200) {
      let { userList, userId2FileList } = realData
      // 赋值给对应状态,传递给子组件
      needData.userId2FileList = userId2FileList
      needData.userList = userList
      let xd: any = [], xv: any = [];
      userList.map((item: any) => {
        let id = item.id;
        xd.push(item.name)
        xv.push(userId2FileList[id].length)
      });
      chartData.xData = xd;
      chartData.value = xv;
    }
  }
}, {
  immediate: true
})
const openFileManage = (id: Number) => {
  isManage.value = true;
  //
  nowManageId.value = id;
}
</script>