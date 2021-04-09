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
    createPath(d, colour, width, parent, cls, dashes) {
      let path = document.createElementNS(this.ns, 'path');
      if (cls) path.setAttributeNS(null, 'class', cls);
      path.setAttributeNS(null, 'd', d);
      path.setAttributeNS(null, "stroke", colour);
      path.setAttributeNS(null, "stroke-width", width);  
      if (dashes) path.setAttributeNS(null, 'stroke-dasharray', dashes);

      if (parent) parent.appendChild(path);
      return path;
    },
    createCircle(cx, cy, r, parent, colour) {
      let circle = document.createElementNS(this.ns, 'circle');
      circle.setAttributeNS(null, 'cx', cx);
      circle.setAttributeNS(null, 'cy', cy);
      circle.setAttributeNS(null, 'r', r);
      circle.setAttributeNS(null, 'fill', colour ? colour : 'black');

      if (parent) parent.appendChild(circle);
      return circle;
    }
  }
};

const OrthoMixin = {
  mixins: [SvgMixin],
  props: {
    regions: Array,
    connections: Array
  },
  data() {
    return {
      axes: null,

      scale: 1,
      offset: [0, 0]
    }
  },
  computed: {
    regionCoords() {
      let regions = this.regions.reduce((a, e) => {
        let x = (e[0] * this.scale) + this.offset[0];
        let y = (-e[1] * this.scale) + this.offset[1];
        a.push([x, y]);
        return a;
      }, []);

      console.log(regions);
      return regions;
    },

  },
  methods: {
    drawConnections() {
      console.log('draw connections');

      this.axes.getElementsByClassName('connections').remove();
      let connections = this.createGroup('connections');

      for (let connection of this.connections) {
        let coords1 = this.regionCoords[connection.region1];
        let coords2 = this.regionCoords[connection.region2];
        this.createPath(`M ${coords1[0]} ${coords1[1]} L ${coords2[0]} ${coords2[1]}`, 'blue', 3, connections);
      }

      this.axes.appendChild(connections);
    },
    drawRegions() {
      console.log('draw regions');

      this.axes.getElementsByClassName('regions').remove();
      let regions = this.createGroup('regions');

      for (let region of this.regionCoords) {
        console.log(region);
        this.createCircle(region[0], region[1], 3, regions, 'red');
      }

      this.axes.appendChild(regions);
    },
    drawConnectivity() {
      this.drawConnections();
      this.drawRegions();
    }
  },
  mounted() {
    // console.log(this.$refs);
    this.axes = this.$refs.axes;
    // this.axes.appendChild();

    // let plot = this.createGroup('plot');

    // this.axes.appendChild(plot);
    console.log(this.connections);

    this.drawConnectivity();

    console.log(this.axes);
  },
  watch: {
    regions: {
      handler: 'drawRegions'
    }
  }
};