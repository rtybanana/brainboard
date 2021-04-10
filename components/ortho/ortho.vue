<template>
  <div class="py-3">
    <ortho-x width="35%"   :regions="regionsX" :connections="connections" :region-names="regionNames"></ortho-x>
    <ortho-y width="30.5%" :regions="regionsY" :connections="connections" :region-names="regionNames"></ortho-y>
    <ortho-z width="30.5%" :regions="regionsZ" :connections="connections" :region-names="regionNames"></ortho-z>
  </div>
</template>

<script>
  module.exports = {
    components: {
      'ortho-x': loader('./components/ortho/ortho-x.vue'),
      'ortho-y': loader('./components/ortho/ortho-y.vue'),
      'ortho-z': loader('./components/ortho/ortho-z.vue')
    },
    props: {
      regions: Array,         // n_ROIs x 3 array describing regions center of mass
      connections: Array,     // connectivity matrix
      regionNames: Array
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
      },
      // sortedConnections() {
      //   let connections = [];
      //   for (let i = 0; i < this.connections.length; i++){
      //     for (let j = i + 1; j < this.connections.length; j++) {
      //       if (this.connections[i][j] !== 0) {
      //         connections.push({ region1: i, region2: j, strength: this.connections[i][j] });     
      //       }
      //     }
      //   }

      //   return connections.sort((a, b) => b.strength - a.strength);
      // }
    },
    methods: {
      getRegionCoords(direction) {
        let dimensions = direction === 'x' ? [1, 2] : direction === 'y' ? [0, 2] : [0, 1];

        return this.regions.reduce((a, e) => {
          a.push([e[dimensions[0]], e[dimensions[1]]]);
          return a;
        }, []);
      }
    }
  };
</script>

<style>

</style>