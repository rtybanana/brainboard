<template>
  <div>
    <ortho-x :regions="regionsX" :connections="connections"></ortho-x>
    <ortho-y :regions="regionsY" :connections="connections"></ortho-y>
    <ortho-z :regions="regionsZ" :connections="connections"></ortho-z>
  </div>
</template>

<script>
  module.exports = {
    components: {
      'ortho-x': loader('./components/axes/ortho-x.vue'),
      'ortho-y': loader('./components/axes/ortho-y.vue'),
      'ortho-z': loader('./components/axes/ortho-z.vue')
    },
    props: {
      regions: Array,         // n_ROIs x 3 array describing regions center of mass
      connections: Array,     // array of connected regions
    },
    data: function () {
      return {
        
      };
    },
    computed: {
      regionsX() {
        return this.getRegionCoords('x');
      },
      regionsY() {
        return this.getRegionCoords('y');
      },
      regionsZ() {
        return this.getRegionCoords('z');
      }
    },
    methods: {
      getRegionCoords(direction) {
        let dimensions = direction === 'x' ? [1, 2] : direction === 'y' ? [0, 2] : [0, 1];
        let regions = this.regions.reduce((a, e) => {
          a.push([e[dimensions[0]], e[dimensions[1]]]);
          return a;
        }, []);

        console.log(direction, regions);

        return regions;
      }
    }
  };
</script>

<style>

</style>