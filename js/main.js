// http://hiphoff.com/using-require-js-to-efficiently-load-javascript-files-and-their-dependencies/
require.config({ paths: { d3v4: "https://d3js.org/d3.v4.min",
                          d3v3: "https://d3js.org/d3.v3.min",
                          d3disp: "https://d3js.org/d3-dispatch.v1.min",
                          d3sel: "https://d3js.org/d3-selection.v1.min",
                          d3drag: '../d3-drag/d3-drag.min',
                          d3geod: '../d3-geomap/vendor/d3.geomap.dependencies.min',
                          d3geo: '../d3-geomap/js/d3.geomap.min',
                          hbar: 'hbarV4',
                          line: 'multiline',
                          map: 'basic_chloropleth'
                },
                shim: {
                  // 'd3geo': {
                  //   deps: ['d3v3', 'd3geod']
                  // },
                  // 'd3drag': {
                  //   deps: ['d3v3', 'd3disp', 'd3sel']
                  // },
                  'hbar': {
                    deps: ['d3v4']
                  },
                  'line': {
                    deps: ['d3v3']
                  },
                  'map': {
                    deps: ['d3v3', 'd3geo', 'd3geod', 'd3drag', 'd3sel', 'd3']
                  }
                }
              });

require(["hbar", "line", "map"]);
