<template>
  <div class="py-3 h-100">
    <highcharts class="h-100" ref="chart" :options="options"></highcharts>
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
    regionNames: Array,     // n_regions length array containing region names
    nNeighbours: Map        // n_regions length map describing how many one hop neighbours each region has   
  },
  computed: {
    // connectionCount() {
    //   let map = new Map();
    //   this.connections.forEach(e => {
    //     map.set(e.region1, map.has(e.region1) ? map.get(e.region1) + 1 : 1);
    //     map.set(e.region2, map.has(e.region2) ? map.get(e.region2) + 1 : 1);
    //   });

    //   return map;
    // },
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
          connections: this.nNeighbours.get(i)
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
          shape: 'rect',
          formatter: function () {
            let props = this.point.options;
            let color = this.point.color;
            // console.log(props);
            if (props.isNode) {
              return `
                <b>Region</b><br>\
                <span style="color:${color}">${props.id}</span><br>\
                Degree: <b>${props.connections}</b><br>
              `;
            }
            else {
              let fromColour = this.point.fromNode.color;
              let toColour = this.point.toNode.color;
              return `
                <b>Connection</b><br>\
                <span style="color:${fromColour}">${props.from}</span><br>\
                <span style="color:${toColour}">${props.to}</span><br>\
                Strength: <b>${props.weight.toFixed(3)}</b>
              `;
            }
          },
          positioner: function (labelWidth, labelHeight) {
            return { x: (this.chart.plotWidth / 2) - (labelWidth / 2) + this.chart.plotLeft, y: (this.chart.plotHeight / 2) - (labelHeight / 2) + this.chart.plotTop };
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
      let chart = this.$refs.chart.chart;
      let connection = chart.series[0].data[index];

      chart.series[0].data.forEach(e => e.setState('inactive'));
      connection.setState('hover');
      chart.tooltip.refresh(connection);
    });

    EventBus.$on('connection:mouseleave', () => {
      let chart = this.$refs.chart.chart;
      chart.series[0].data.forEach(e => e.setState());
      chart.tooltip.hide();
    });

    EventBus.$on('region:mouseenter', (index) => {
      let chart = this.$refs.chart.chart;
      let region = chart.series[0].nodes.find(e => e.options.index === index);
      if (region) {
        chart.series[0].nodes.forEach(e => e.setState('inactive'));
        region.setState('hover');
        chart.tooltip.refresh(region);
      }
    });

    EventBus.$on('region:mouseleave', () => {
      let chart = this.$refs.chart.chart;
      chart.series[0].nodes.forEach(e => e.setState());
      chart.tooltip.hide();
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
    text: null
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
    },
    dependencywheel: {
      tooltip: {
        followPointer: false
      }
    }
  },
  chart: {
    // height: 600,
    margin: 15,
    // marginTop: 30
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