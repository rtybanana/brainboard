<template>
  <svg ref="axes" id="axes" width="100%" version="1.1" viewBox="0 0 158.4 165.6" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <image width="158.4" height="165.6" href="/brainaxes/y.svg"/>
  </svg>
</template>

<script>
  // OrthoMixin = require('../../mixins/ortho').OrthoMixin;

  module.exports = {
    mixins: [OrthoMixin],
    data: function () {
      return {
        scale: 1.0056895,
        offset: [79.232008, 88.458424]
      };
    }
  };
</script>

<style scoped>
#axes {
  overflow: visible;
}
</style>