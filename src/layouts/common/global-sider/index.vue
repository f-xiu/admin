<template>
  <vertical-sider class="global-sider" />
</template>

<script setup lang="ts">
import { VerticalSider } from './components';
defineOptions({ name: 'GlobalSider' });
</script>

<style scoped>
.global-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
</style>
