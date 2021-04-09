<template>
  <div>
    <ortho-x :regions="regionsX" :connections="sortedConnections"></ortho-x>
    <ortho-y :regions="regionsY" :connections="sortedConnections"></ortho-y>
    <ortho-z :regions="regionsZ" :connections="sortedConnections"></ortho-z>
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
      connections: Array,     // connectivity matrix
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
      sortedConnections() {
        let connections = [];
        for (let i = 0; i < this.connections.length; i++){
          for (let j = i + 1; j < this.connections.length; j++) {
            if (this.connections[i][j] !== 0) {
              connections.push({ region1: i, region2: j, strength: this.connections[i][j] });     
            }
          }
        }

        return connections.sort((a, b) => b.strength - a.strength);
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