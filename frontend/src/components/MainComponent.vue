<script>
import AppHeader from './common/AppHeader.vue'

export default {
  name: "FreshaPlantPOS",
  components: {
    AppHeader,
  }
}
</script>

<template>
  <AppHeader></AppHeader>
  <div class="page"> 
    <div class="page-wrapper">
      <router-view :key="$route.path"></router-view>
    </div> 
  </div>
</template>
