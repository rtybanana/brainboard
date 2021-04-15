<template>
  <div class="row no-gutters pl-lg-3">
    <div class="col-12">
      <div class="px-1 pb-1" style="position:absolute; background-color: black; color: white; z-index: 10;">{{regionTableData.length}} Regions</div>
      <b-table class="mt-4" style="font-size: 14px" :items="regionTableData" :fields="region_fields" 
               sticky-header="calc(0.28 * (100vh - 56px))" head-variant="light" small 
               @row-hovered="(item) => { EventBus.$emit('region:mouseenter', item.index) }"
               @row-unhovered="(item) => { EventBus.$emit('region:mouseleave', item.index) }">
        <template #cell(name)="data">
          <span class="dot" :style="{backgroundColor: data.item.colour}"></span>
          {{data.item.name}}
        </template>
      </b-table>
    </div>
    <div class="col-12">
      <div class="px-1 pb-1" style="position:absolute; background-color: black; color: white; z-index: 10;">{{connections.length}} Connection{{ connections.length === 1 ? '' : 's'}}</div>
      <b-table class="mt-4" style="font-size: 14px" :items="connectionTableData" :fields="connection_fields" 
               sticky-header="calc(0.28 * (100vh - 56px))" head-variant="light" small 
               @row-hovered="(item) => { EventBus.$emit('connection:mouseenter', item.region1index, item.region2index, item.index) }"
               @row-unhovered="(item) => { EventBus.$emit('connection:mouseleave', item.region1index, item.region2index, item.index) }">
        <template #cell(region_1)="data">
          <span class="dot" :style="{backgroundColor: data.item.region1colour}"></span>
          {{data.item.region_1}}
        </template>

        <template #cell(region_2)="data">
          <span class="dot" :style="{backgroundColor: data.item.region2colour}"></span>
          {{data.item.region_2}}
        </template>
      </b-table>
    </div>
    <div class="col-12">
      <div class="px-1 pb-1" style="position:absolute; background-color: black; color: white; z-index: 10;">{{networks.length}} Network{{ networks.length === 1 ? '' : 's'}}</div>
      <b-table class="mt-4" style="font-size: 14px" :items="networkTableData" :fields="network_fields" 
               sticky-header="calc(0.28 * (100vh - 56px))" head-variant="light" small
               @row-hovered="(item) => { EventBus.$emit('network:mouseenter', item.network) }"
               @row-unhovered="(item) => { EventBus.$emit('network:mouseleave', item.network) }">
        <template #cell(estimated_hub)="data">
          <span class="dot" :style="{backgroundColor: data.item.colour}"></span>
          {{data.item.estimated_hub}}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
  module.exports = {
    components: {
      highcharts: HighchartsVue.Chart,
    },
    props: {
      connections: Array,           // n_connections length array of objects: {region1, region2, strength}
      regions: Array,               // n_regions length array, each element containing the node timeseries
      regionNames: Array,           // n_regions length array containing region names
      sortedRegions: Array,         // n_regions length array containing the sort order of the region for highcharts colour matching
      nNeighbours: Map,             // n_regions length map describing how many one hop neighbours each region has 
      networks: Array               // n_networks length array of sets describing regions in each network
    },
    computed: {
      regionTableData() {
        let region_table = [];
        this.regions.forEach((r, i) => {
          let isolated = !this.nNeighbours.has(i);

          if (!isolated) {
            region_table.push({
              name: this.regionNames[i],
              neighbours: this.nNeighbours.get(i),
              coordinates: `(${r[0].toFixed(2)}, ${r[1].toFixed(2)}, ${r[2].toFixed(2)})`,
              colour: this.getColour(this.sortedRegions[i]),
              index: i
            });
          }
        });

        return region_table.sort((a, b) => b.neighbours - a.neighbours);
      },
      connectionTableData() {
        let connection_table = [];
        this.connections.forEach((c, i) => {
          connection_table.push({
            region_1: this.regionNames[c.region1],
            region_2: this.regionNames[c.region2],
            strength: c.strength.toFixed(3),
            region1colour: this.getColour(this.sortedRegions[c.region1]),
            region2colour: this.getColour(this.sortedRegions[c.region2]),
            index: i,
            region1index: c.region1,
            region2index: c.region2
          });
        });

        return connection_table;
      },
      networkTableData() {
        let network_table = [];
        this.networks.forEach((n, i) => {
          let estimated_hub = [...n].reduce((a, e) => {
            if (this.nNeighbours.get(e) > this.nNeighbours.get(a)) return e;
            else return a;
          }, [...n][0]);

          network_table.push({
            estimated_hub: this.regionNames[estimated_hub],
            hub_connections: this.nNeighbours.get(estimated_hub),
            total_connections: this.networks[i].size,
            colour: this.getColour(this.sortedRegions[estimated_hub]),
            network: n
          })
        });

        return network_table.sort((a, b) => b.total_connections - a.total_connections);
      }
    },
    data() {
      return {
        region_fields: [
          {key: 'name'},
          {key: 'neighbours', sortable: true},
          {key: 'coordinates'},
        ],

        connection_fields: [
          {key: 'region_1'},
          {key: 'region_2'},
          {key: 'strength', sortable: true},
        ],

        network_fields: [
          {key: 'estimated_hub'},
          {key: 'hub_connections'},
          {key: 'total_connections', sortable: true},
        ],

        EventBus: EventBus,

        highcharts_colours: [
          "#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", 
          "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
        ]
      };
    },
    methods: {
      getColour(index) {
        return this.highcharts_colours[index % this.highcharts_colours.length]
      }
    },
    created() {
      // EventBus.$on('connection:mouseenter', (region1, region2, index) => {
      //   this.plotTimeseries(region1, region2)
      // });

      // EventBus.$on('connection:mouseleave', (region1, region2, index) => {
      //   this.options.series = [];
      // });

      // // ...this.connectedRegions.get(index)
      // EventBus.$on('region:mouseenter', (index) => {
      //   this.plotTimeseries(index);
      // });

      // EventBus.$on('region:mouseleave', (index) => {
      //   this.options.series = [];
      // });
    }
  };
</script>

<style>
.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-bottom: -1px;
}
</style>