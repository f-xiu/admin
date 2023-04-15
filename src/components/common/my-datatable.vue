<template>
  <n-card :title="props.title">
    <n-space vertical :size="20">
      <div class="flex">
        <n-space>
          <slot name="func_btn"></slot>
        </n-space>
        <n-input-group class="flex justify-end">
          <!-- 需要双向绑定，不能通过props传递值,这里使用作用域插槽可以反向向父组件传递值 -->
          <!-- <slot name="input" :name="name"></slot> -->
          <!-- 这里使用一般的做法，通过传递props和changeName来解决 -->
          <n-input :style="{ width: '35%' }" :placeholder="props.searchTip" :value="props.name" @input="handleSearch" />
          <n-button type="primary" @click="emit('search')" ghost>
            搜索
          </n-button>
        </n-input-group>
      </div>
      <n-data-table :columns="props.colums" :max-height="300" :data="props.data" :pagination="false" :bordered="false" />
      <!-- 留给页表的位置 -->
      <slot name="pagination"></slot>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
const props = defineProps(['title', 'data', 'colums', 'name','searchTip'])
const emit = defineEmits(['search', 'change-name']);
const handleSearch=(v:String)=>{
 emit('change-name',v)
}

</script>

<style scoped></style>