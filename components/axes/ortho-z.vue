<template>
  <svg id="x" height="165.6pt" version="1.1" viewBox="0 0 187.2 165.6" width="187.2pt" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <image width="187.2" height="165.6" href="/brainaxes/z.svg"/>
  </svg>
</template>

<script>
  module.exports = {
    props: {
      regions: Array,
      connections: Array
    },
    data: function () {
      return {
        scale: 0.8657852,
        offset: [78.335913, 68.616047]
      };
    },
    watch: {
      regions: {
        handler() {
          console.log('regions changed');
        },
        immediate: true
      }
    }
  };
</script>

<style>

</style>