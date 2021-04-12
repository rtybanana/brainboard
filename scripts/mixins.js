/**
 * Vue mixin for interfacing with SVG
 */
const SvgMixin = {
  data() {
    return {
      ns: 'http://www.w3.org/2000/svg',
    }
  },
  methods: {
    createGroup(cls) {
      let group = document.createElementNS(this.ns, 'g');
      group.setAttributeNS(null, 'class', cls);

      return group;
    },
    createPath(properties, data) {
      let path = document.createElementNS(this.ns, 'path');
      return this.applyProps(path, properties, data);
    },
    createRect(properties, data) {
      let rect = document.createElementNS(this.ns, 'rect');
      return this.applyProps(rect, properties, data);
    },
    createCircle(properties, data) {
      let circle = document.createElementNS(this.ns, 'circle');
      return this.applyProps(circle, properties, data);
    },
    createText(content, properties, data) {
      let text = document.createElementNS(this.ns, 'text');
      text.appendChild(document.createTextNode(content));

      return this.applyProps(text, properties, data);
    },
    applyProps(element, properties, data) {
      if (properties) Object.entries(properties).forEach(([key, value]) => {
        element.setAttributeNS(null, key, value);
      });
      
      if (data) Object.entries(data).forEach(([key, value]) => {
        element.setAttributeNS(null, `data-${key}`, value);
      });

      return element;
    }
  }
};

/**
 * Vue mixin for ortho projection plotting and interaction
 */
const OrthoMixin = {
  mixins: [SvgMixin],
  props: {
    regions: Array,         // n_regions x 3 array describing regions center of mass
    connections: Array,     // n_connections length array of objects: {region1, region2, strength}
    regionNames: Array      // n_regions length array containing region names
  },
  data() {
    return {
      axes: null,
      scale: 1,
      offset: [0, 0],

      svg_regions: [],
      svg_connections: [],

      highcharts_colours: [
        "#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", 
        "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
      ]
    }
  },
  computed: {
    regionCoords() {
      return this.regions.reduce((a, e) => {
        let x = (e[0] * this.scale) + this.offset[0];
        let y = (-e[1] * this.scale) + this.offset[1];
        a.push([x, y]);

        return a;
      }, []);
    },
    connectionCount() {
      let map = new Map();
      this.connections.forEach(e => {
        map.set(e.region1, map.has(e.region1) ? map.get(e.region1) + 1 : 1);
        map.set(e.region2, map.has(e.region2) ? map.get(e.region2) + 1 : 1);
      });

      return map;
    },
    /**
     * Returns a list of giving the proper sort order index of the corresponding region index
     */
    sortedRegions() {
      let sorted_regions = [...this.regions.keys()];
      let unsorted_regions = new Set([...this.regions.keys()]);
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
    }
  },
  methods: {
    drawConnectivity() {
      this.drawConnections();
      this.drawRegions();
    },
    /**
     * Draws a connection line between two functionally connected ROIs
     */
    drawConnections() {
      this.axes.getElementsByClassName('connections').remove();

      let connections = this.createGroup('connections');
      this.svg_connections = [];
      this.connections.forEach((e, index) => {
        let coords1 = this.regionCoords[e.region1];
        let coords2 = this.regionCoords[e.region2];
        let connection = this.createPath(
          { 
            'd': `M ${coords1[0]} ${coords1[1]} L ${coords2[0]} ${coords2[1]}`, 
            'class': 'connection',
            'stroke': '#007bff', 'stroke-width': 3.5, 
            'opacity': 0.7 
          },
          { 'region-1': e.region1, 'region-2': e.region2, 'index': index }
        );
        
        connection.addEventListener('mouseenter', () => { EventBus.$emit('connection:mouseenter', e.region1, e.region2, index) });
        connection.addEventListener('mouseleave', () => { EventBus.$emit('connection:mouseleave', e.region1, e.region2, index) });

        connections.appendChild(connection);
        this.svg_connections.push(connection);
      });

      this.axes.insertBefore(connections, this.axes.getElementsByClassName('regions')[0])
    },
    /**
     * Draws a dot indicator on the center of mass of each ROI
     */
    drawRegions() {
      this.axes.getElementsByClassName('regions').remove();
      let regions = this.createGroup('regions');

      this.svg_regions = [];
      this.regionCoords.forEach((e, index) => {
        let region_colour = this.highcharts_colours[this.sortedRegions[index] % this.highcharts_colours.length];
        let isolated = !this.connectionCount.has(index);

        let region = this.createCircle({
          'cx': e[0], 'cy': e[1], 'r': 4,
          'class': 'region',
          'fill': isolated ? 'none' : region_colour
        });

        region.addEventListener('mouseenter', () => { EventBus.$emit('region:mouseenter', index) });
        region.addEventListener('mouseleave', () => { EventBus.$emit('region:mouseleave', index) });

        this.svg_regions.push(region);
        regions.appendChild(region);
      });

      this.axes.appendChild(regions);
    },
    /**
     * Draws white text labels on a black background near where its region central coordinates are.
     * Takes a variable number of arguments, one for each region ID to label. Labels are placed above 
     * the highest region and below the lowest to keep labels out of the way as much as possible. If 
     * there is just one label then above or below is determined by the midpoint of the plot.
     * 
     * @param  {...Number} regions region indexes for which to draw labels
     */
    drawLabels(...regions) {
      let labels = this.createGroup('labels');
      this.axes.appendChild(labels);

      regions.sort((a, b) => this.regionCoords[a][1] - this.regionCoords[b][1])
        .forEach((e, i) => {
          let x = this.regionCoords[e][0] + 5;
          let y = this.regionCoords[e][1];

          if (regions.length > 1) y += (i < (regions.length / 2) ? (-10) : (15));
          else y += this.regionCoords[e][1] < this.offset[1] ? -10 : 15;

          let text = this.createText(this.regionNames[e], { 
            'x': x, 'y': y,
            'text-anchor': 'left',
            'font-size': 8,
            'class': 'label',
            'pointer-events': 'none', 
            'fill': 'white'
          });

          labels.appendChild(text);
          let [width, height] = [text.getBBox().width, text.getBBox().height];

          let textbox = this.createRect({
            'x': x - 1,
            'y': y - (height / 2) - 3, 
            'width': width + 2, 'height': height + 1, 
            'pointer-events': 'none', 
            'fill': 'black'
          });

          labels.insertBefore(textbox, labels.firstChild);
        });
    }
  },
  created() {
    EventBus.$on('connection:mouseenter', (region1, region2, index) => {
      this.svg_regions.forEach((e, i) => {
        if (i === region1 || i === region2) e.setAttributeNS(null, "r", 4.5);
        else e.setAttributeNS(null, "opacity", 0.1);
      });

      this.svg_connections.forEach((e, i) => {
        if (i === index) {
          e.setAttributeNS(null, "stroke-width", 4.25); 
          e.setAttributeNS(null, "opacity", 1); 
        }
        else e.setAttributeNS(null, "opacity", 0); 
      });

      this.drawLabels(region1, region2);
    });

    EventBus.$on('connection:mouseleave', (region1, region2, index) => {
      this.svg_regions.forEach((e, i) => {
        if (i === region1 || i === region2) {
          e.setAttributeNS(null, "r", 4);
        }
        else e.setAttributeNS(null, "opacity", 1);
      });

      this.svg_connections.forEach((e, i) => {
        if (i === index) e.setAttributeNS(null, "stroke-width", 3.5); 
        e.setAttributeNS(null, "opacity", 0.6); 
      });

      this.axes.getElementsByClassName('labels').remove();
    });

    EventBus.$on('region:mouseenter', (index) => {
      let connected_regions = this.connections.reduce((a, e) => {
        if (e.region1 === index) a.push(e.region2);
        else if (e.region2 === index) a.push(e.region1);
        return a;
      }, []);

      this.svg_regions.forEach((e, i) => {
        if (connected_regions.includes(i)) e.setAttributeNS(null, "opacity", 1); 
        else if (i !== index) e.setAttributeNS(null, "opacity", 0.1); 
        else e.setAttributeNS(null, "r", 4.5);
      });
      
      this.svg_connections.forEach((e, i) => {
        if (this.connections[i].region1 !== index && this.connections[i].region2 !== index) e.setAttributeNS(null, "opacity", 0); 
        else e.setAttributeNS(null, "opacity", 1); 
      });

      this.drawLabels(index);
    });

    EventBus.$on('region:mouseleave', (index) => {
      this.svg_regions.forEach((e, i) => {
        if (i !== index) e.setAttributeNS(null, "opacity", 1);
        else e.setAttributeNS(null, "r", 4);
      });

      this.svg_connections.forEach((e, i) => {
        e.setAttributeNS(null, "opacity", 0.7); 
      });

      this.axes.getElementsByClassName('labels').remove();
    });
  },
  mounted() {
    this.axes = this.$refs.axes;
    this.drawConnectivity();
  },
  watch: {
    regions: 'drawConnectivity',
    connections: 'drawConnectivity'
  }
};