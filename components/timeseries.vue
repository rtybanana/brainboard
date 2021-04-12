<template>
  <div class="h-100">
    <highcharts class="h-100" ref="chart" :options="options"></highcharts>
  </div>
</template>

<script>
  module.exports = {
    components: {
      highcharts: HighchartsVue.Chart,
    },
    props: {
      connections: Array,         // n_connections length array of objects: {region1, region2, strength}
      regionTimeseries: Array,    // n_regions length array, each element containing the node timeseries
      regionNames: Array          // n_regions length array containing region names
    },
    computed: {
      /**
       * Returns a list of giving the proper sort order index of the corresponding region index
       */
      sortedRegions() {
        let sorted_regions = [...this.regionTimeseries.keys()];
        let unsorted_regions = new Set([...this.regionTimeseries.keys()]);
        sort_index = 0;
        this.connections.forEach(e => {
          if (unsorted_regions.has(e.region1)) {
            sorted_regions[e.region1] = sort_index++;
            unsorted_regions.delete(e.region1);
          }
          if (unsorted_regions.has(e.region2)) {
            sorted_regions[e.region2] = sort_index++;
            unsorted_regions.delete(e.region2);
          }
        });

        return sorted_regions;
      },
      /**
       * Returns a map of regions connected to a provided region index
       */
      connectedRegions() {
        let connected_regions = new Map();
        this.connections.forEach(e => {
          connected_regions.set(e.region1, 
            connected_regions.has(e.region1) 
              ? [...connected_regions.get(e.region1), e.region2]
              : [e.region2]
          ); 

          connected_regions.set(e.region2, 
            connected_regions.has(e.region2) 
              ? [...connected_regions.get(e.region2), e.region1]
              : [e.region2]
          ); 
        });

        return connected_regions;
      }
    },
    data() {
      return {
        options: options,

        highcharts_colours: [
          "#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", 
          "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
        ]
      };
    },
    methods: {
      plotTimeseries(...regions) {
        let series = regions.reduce((a, e) => {
          a.push({
            data: this.regionTimeseries[e], 
            name: this.regionNames[e], 
            marker: { enabled: false },
            lineWidth: 3,
            color: this.highcharts_colours[this.sortedRegions[e] % this.highcharts_colours.length]
          });
          return a;
        }, []);

        this.options.series = series;
      }
    },
    created() {
      EventBus.$on('connection:mouseenter', (region1, region2, index) => {
        this.plotTimeseries(region1, region2)
      });

      EventBus.$on('connection:mouseleave', (region1, region2, index) => {
        this.options.series = [];
      });

      EventBus.$on('region:mouseenter', (index) => {
        this.plotTimeseries(...this.connectedRegions.get(index), index);
      });

      EventBus.$on('region:mouseleave', (index) => {
        this.options.series = [];
      });
    }
  };

/** 
 * base options for constructing the timeseries chart
 * placing it down here keeps it out of cluttering the vue data
 */ 
var options = {
  chart: {
    type: 'spline'
  },
  title: { 
    text: null 
  },
  legend: {
    enabled: false
  },
  yAxis: {
    min: -3,
    max: 3,
    lineWidth: 2,
    lineColor: 'black',
    plotLines: [{
      color: 'black',
      value: 0,
      width: 2
    }],
    title: {
      enabled: false
    }
  },
  xAxis: {
    visible: false
    // labels: {
    //   enabled: false
    // }
  },
  plotOptions: {
    line: {
      marker: {
        enabled: false
      }
    }
  },

  series: []
};
</script>

<style>

</style>