<template>
  <div class="mt-4">
    <a-row type="flex" :gutter="[8, 8]">
      <a-col :span="16" :order="1">
        <home-page-producer />
      </a-col>
      <a-col :span="8" :order="2">
        <home-page-consumer />
      </a-col>
    </a-row>
    <a-row type="flex" class="mt-2" :gutter="[8, 8]">
      <a-col :span="16" :order="3"></a-col>
      <a-col :span="8" :order="4">
        <a-card title="Cluster Information" size="small"></a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import HomePageConsumer from "../components/HomePageConsumer.vue";
import HomePageProducer from "../components/HomePageProducer.vue";
export default {
  components: {
    HomePageConsumer,
    HomePageProducer,
  },
};
</script>
