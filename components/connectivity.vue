<template>
  <div class="py-3">
    <highcharts ref="chart" :options="options"></highcharts>
    <div id="connectivity-container"></div>
  </div>
</template>

<script>
module.exports = {
  components: {
    highcharts: HighchartsVue.Chart,
  },
  props: {
    connections: Array,     // n_connections length array of objects: {region1, region2, strength}
    regionNames: Array,     // n_ROIs length array of region names
  },
  computed: {
    connectionCount() {
      let map = new Map();
      this.connections.forEach(e => {
        map.set(e.region1, map.has(e.region1) ? map.get(e.region1) + 1 : 1);
        map.set(e.region2, map.has(e.region2) ? map.get(e.region2) + 1 : 1);
      });

      return map;
    },
    namedConnections() {
      let named_connections = [];
      this.connections.forEach((e, index) => {
        named_connections.push({
          from: this.regionNames[e.region1], 
          to: this.regionNames[e.region2], 
          weight: e.strength, 
          region1: e.region1, 
          region2: e.region2, 
          index: index
          });
      });

      return named_connections;
    },
    nodes() {
      let nodes = [];
      this.regionNames.forEach((e, i) => {
        nodes.push({
          id: e, 
          index: i,
          connections: this.connectionCount.get(i)
        });
      });

      return nodes;
    }
  },
  data() {
    return {
      options: {
        ...options,
        tooltip: {
          padding: 3,
          formatter: function () {
            let props = this.point.options;

            if (props.isNode) 
              return `<b>Region</b><br>${props.id}<br>No. of Connections: ${props.connections}`;
            
            else return `<b>Connection</b><br>${props.from}<br>${props.to}<br><b>${props.weight.toFixed(3)}</b>`;
          }
        }
      },
      selected: []
    };
  },
  methods: {
    redrawConnectivity() {
      this.options.series[0].data = this.namedConnections;
      this.options.series[0].nodes = this.nodes;
    }
  },
  created() {
    var ctx = this;
  },
  mounted() {
    EventBus.$on('connection:mouseenter', (region1, region2, index) => {
      this.$refs.chart.chart.series[0].data.forEach(e => e.setState('inactive'));
      this.$refs.chart.chart.series[0].data[index].setState('hover');
    });

    EventBus.$on('connection:mouseleave', () => {
      this.$refs.chart.chart.series[0].data.forEach(e => e.setState());
    });

    EventBus.$on('region:mouseenter', (index) => {
      let region = this.$refs.chart.chart.series[0].nodes.find(e => e.options.index === index);
      if (region) {
        this.$refs.chart.chart.series[0].nodes.forEach(e => e.setState('inactive'));
        region.setState('hover');
      }
    });

    EventBus.$on('region:mouseleave', () => {
      this.$refs.chart.chart.series[0].nodes.forEach(e => e.setState());
    });
  },
  watch: {
    connections: {
      handler: 'redrawConnectivity',
      immediate: true
    },
    regionNames: 'redrawConnectivity'
  }
};

/** 
 * base options for constructing the dependency wheel chart
 * placing it down here keeps it out of cluttering the vue data
 */ 
var options = {
  title: {
    text: null,
  },
  accessibility: {
    point: {
      valueDescriptionFormat: "{index}. From {point.from} to {point.to}: {point.weight}.",
    }
  },
  plotOptions: {
    series: {
      point: {
        events: {
          mouseOver: (event) => { 
            let props = event.target.options;
            if (props.isNode) EventBus.$emit('region:mouseenter', props.index);
            else EventBus.$emit('connection:mouseenter', props.region1, props.region2, props.index);
          },
          mouseOut: (event) => { 
            let props = event.target.options;
            if (props.isNode) EventBus.$emit('region:mouseleave', props.index); 
            else EventBus.$emit('connection:mouseleave', props.region1, props.region2, props.index);
          }
        }
      }
    }
  },
  chart: {
    height: 600,
    margin: 15,
    marginTop: 30
  },

  series: [{
    data: [],
    type: "dependencywheel",
    name: "Connectivity",
    label: {
      enabled: false
    },
    dataLabels: {
      enabled: false
    }
  }]
};
</script>

<style>
</style>