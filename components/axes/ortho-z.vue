<template>
  <svg  ref="axes" id="axes" height="165.6pt" version="1.1" viewBox="0 0 158.4 165.6" width="158.4pt" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <image width="158.4" height="165.6" href="/brainaxes/z.svg"/>
  </svg>
</template>

<script>
  // import {OrthoMixin} from '/mixins/ortho.js';

  module.exports = {
    mixins: [OrthoMixin],
    data: function () {
      return {
        scale: 0.8657852,
        offset: [78.335913, 68.616047]
      };
    }
  };
</script>

<style>

</style>