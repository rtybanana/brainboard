<template>
  <svg id="x" height="165.6pt" version="1.1" viewBox="0 0 187.2 165.6" width="187.2pt" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <image width="187.2" height="165.6" href="/brainaxes/y.svg"/>
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
        scale: 1.0056895,
        offset: [79.232008, 88.458424]
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