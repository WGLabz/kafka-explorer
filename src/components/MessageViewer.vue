<template>
  <a href="">Hello</a>
</template>
<script>
export default {
  props: {
    data: {},
  },
  mounted() {
    console.log(this.data);
  },
};
</script>

// message: (...) // partition: (...) // publishstatus: (...) // timestamp:
(...) // topic: (...) // type: (...) // _id: (...)
