<template>
  <div class="map-content">
    <mt-init-map ref="mapRef" :options="mapOptions">
      <mt-group-gl-layer>
        <mt-vector-tile-layer :options="options"></mt-vector-tile-layer>
      </mt-group-gl-layer>
    </mt-init-map>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";

let mapOptions = {
  center: [103.82591437579072,36.05400583727757],
  spatialReference: {
    projection: "EPSG:3857"
  },
  zoom: 14,
  bearing: -17.873136718680257,
  pitch: 45,
  minZoom: 5,
  maxZoom: 19,
  seamlessZoom: true,
  zoomable: true,
  draggable: true,
  renderable: true,
}

let options = {
  urlTemplate: 'https://hbaoyun.cn:9006/map-imgdate-serve/biz-api/eemp/search/v1/map-title/layerXYZ/lanzhoutilescoutry/{z}/{x}/{y}',
  spatialReference: 'preset-vt-3857',
  maxAvailableZoom: 13,
  minZoom: 8,
  style: [
        {//兰州市面
          name: "兰州市@电厂",
          "filter": ['all', ['==', '$layer', '兰州市@电厂'], ['==', '$type', 'Polygon']],
          "renderPlugin": {
            "dataConfig": {
              "type": "fill"
            },
            "sceneConfig": {},
            "type": "fill"
          },
          "symbol": {
            "polygonBloom": false,
            "polygonFill": [
              0.0509803921568627,
              0.0941176470588235,
              0.1764705882352941,
              1
            ],
            "polygonOpacity": 1,
            "polygonPatternFile": null,
            "visible": true
          }
        },
        {
          "filter": ['all', ['==', '$layer', '兰州市@电厂'], ['==', '$type', 'Polygon']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              0.2980392156862745,
              0.5372549019607843,
              0.9450980392156863,
              1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            "linePatternAnimSpeed": 0,
            "linePatternFile": null,
            "lineStrokeWidth": 0,
            "lineStrokeColor": [
              0,
              0,
              0,
              0
            ],
            "lineJoinPatternMode": 0,
            "lineWidth": 2,
            "visible": true
          }
        },
        {//绿地
          "filter": ['all', ['==', '$layer', '绿地@电厂'], ['==', '$type', 'Polygon']],
          "renderPlugin": {
            "dataConfig": {
              "type": "fill"
            },
            "sceneConfig": {},
            "type": "fill"
          },
          "symbol": {
            "polygonBloom": false,
            "polygonFill": [
              0.1058823529411765,
              0.4823529411764706,
              0.2392156862745098,
              1
            ],
            "polygonOpacity": 1,
            "polygonPatternFile": null,
            "visible": true
          },
        },
        {
          "filter": ['all', ['==', '$layer', '绿地@电厂'], ['==', '$type', 'Polygon']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              0.1058823529411765,
              0.4823529411764706,
              0.2392156862745098,
              1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            "linePatternAnimSpeed": 0,
            "linePatternFile": null,
            "lineStrokeWidth": 0,
            "lineStrokeColor": [
              0,
              0,
              0,
              0
            ],
            "lineJoinPatternMode": 0,
            "lineWidth": 2,
            "visible": true
          }
        },
        {//建筑
          "filter": ['all', ['==', '$layer', '建筑@电厂']],
          renderPlugin: {
            type: "lit",
            dataConfig: {
              type: "3d-extrusion",
              altitudeProperty: "height",
              minHeightProperty: "null",
              altitudeScale: 1,
              defaultAltitude: 10,
              // "topThickness": 0,
              // "top": true,
              // "side": false
            },
            sceneConfig: {
              animation: null,
              animationDuration: 800,
            },
          },
          symbol: {
            bloom: false,
            ssr: false,
            polygonOpacity: 0.8,
            topPolygonFill: "#B6C2E2",
            bottomPolygonFill: "#4B609E",
            material: {
              hsv: [0, 0, -0.021],
              baseColorIntensity: 1.585,
              contrast: 1.117,
              outputSRGB: 1,
              roughnessFactor: 1,
              metallicFactor: 0,
            },
            visible: true,
          },
        },
        {//水系面
          "filter": ['all', ['==', '$layer', '水系面@电厂'], ['==', '$type', 'Polygon']],
          "renderPlugin": {
            "dataConfig": {
              "type": "fill"
            },
            "sceneConfig": {},
            "type": "fill"
          },
          "symbol": {
            "polygonBloom": false,
            "polygonFill": [
              0.3176470588235294,
              0.6274509803921569,
              0.8509803921568627,
              1
            ],
            "polygonOpacity": 1,
            "polygonPatternFile": null,
            "visible": true
          },
          //   "renderPlugin": {
          //     "type": "water",
          //     "dataConfig": {
          //       "type": "fill"
          //     }
          //   },
          //   "symbol": {
          //     "ssr": false,
          //     "texWaveNormal": "./dist/res/img/normal.png",
          //     "texWavePerturbation": "./dist/res/img/perturbation.png",
          //     "waterBaseColor": [
          //       0,
          //       0.7490196078431373,
          //       1,
          //       1
          //     ],
          //     "contrast": 1,
          //     "hsv": [
          //       0,
          //       0,
          //       0
          //     ],
          //     "uvScale": 3,
          //     "animation": true,
          //     "waterSpeed": 7.34,
          //     "waterDirection": 114.9,
          //     "visible": true
          //   },
          zIndex: 500,
        },
        {
          "filter": ['all', ['==', '$layer', '水系面@电厂'], ['==', '$type', 'Polygon']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              0.3176470588235294,
              0.6274509803921569,
              0.8509803921568627,
              1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            "linePatternAnimSpeed": 0,
            "linePatternFile": null,
            "lineStrokeWidth": 0,
            "lineStrokeColor": [
              0,
              0,
              0,
              0
            ],
            "lineJoinPatternMode": 0,
            "lineWidth": 2,
            "visible": true
          }
        },
        {//高速
          "filter": ['all', ['==', '$layer', '高速公路@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              0.4705882352941176, 0.1725490196078431, 0.0392156862745098,
              0.1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            "linePatternAnimSpeed": 0,
            "linePatternFile": null,
            "lineStrokeWidth": {
              "type": "interval",
              "default": 3,
              "stops": [
                [
                  4.8,
                  0
                ],
                [
                  5,
                  0.6
                ],
                [
                  7,
                  1
                ]
              ]
            },
            "lineStrokeColor": [
              0.4705882352941176, 0.1725490196078431, 0.0392156862745098,
              0.1
            ],
            "lineJoinPatternMode": 0,
            "lineWidth": {
              "type": "interval",
              "default": 0,
              "stops": [
                [
                  4.6,
                  0
                ],
                [
                  5,
                  1.3
                ]
              ]
            },
            "visible": true
          }
        }, {//高速
          "filter": ['all', ['==', '$layer', '高速公路@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          symbol: {
            lineBloom: true,
            lineCap: "butt",
            // lineColor: [0.73, 0.73, 0.73, 1],
            lineDasharray: [0, 0, 0, 0],
            lineDashColor: [1, 1, 1, 0],
            lineDx: 0,
            lineDy: 0,
            lineGapWidth: 0,
            lineJoin: "miter",
            lineOpacity: 1,
            linePatternAnimSpeed: 1,
            linePatternFile: "./dist/shangli/gd.png",
            lineStrokeWidth: 0.5,
            lineStrokeColor: [
              0.4705882352941176, 0.1725490196078431, 0.0392156862745098,
              1],
            lineJoinPatternMode: 1,
            lineWidth: {
              type: "exponential",
              default: 1.5,
              stops: [
                [10, 1],
                [15, 2],
                [18, 4],
              ],
            },
            visible: true,
            linePatternGap: 4.1,
          },
        },
        { //高速公路标注
          "filter": ['all', ['==', '$layer', '高速公路@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "point"
            },
            "sceneConfig": {
              "collision": true,
              "fading": true,
              "depthFunc": "always"
            },
            "type": "text"
          },
          "symbol": {
            "textBloom": false,
            "textAllowOverlap": false,
            "textDx": 0,
            "textDy": 3,
            "textFaceName": "kaiti,serif",
            "textFill": [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            "textHaloFill": [
              1,
              1,
              1,
              1
            ],
            "textHaloOpacity": 1,
            "textHaloRadius": 1,
            "textHorizontalAlignment": "middle",
            "textIgnorePlacement": false,
            "textName": "{NAME}",
            "textOpacity": 1,
            "textPitchAlignment": "viewport",
            "textPlacement": "line",
            "textRotation": 0,
            "textRotationAlignment": "viewport",
            "textSize": {
              "type": "exponential",
              "default": 0,
              "stops": [
                [
                  6.8,
                  0
                ],
                [
                  7,
                  8
                ],
                [
                  9.1,
                  10
                ]
              ]
            },
            "textSpacing": 330,
            "textStyle": "normal",
            "textVerticalAlignment": "top",
            "textWeight": "normal",
            "textWrapWidth": 0,
            "visible": true
          }
        }, {//铁路
          "filter": ['all', ['==', '$layer', '铁路@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              0.73,
              0.73,
              0.73,
              1
            ],
            "lineDasharray": [
              8,
              8,
              0,
              0
            ],
            "lineDashColor": [
              0,
              0,
              0,
              1
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            "linePatternAnimSpeed": 0,
            "linePatternFile": null,
            "lineStrokeWidth": 0,
            "lineStrokeColor": [
              0,
              0,
              0,
              0
            ],
            "lineJoinPatternMode": 0,
            "lineWidth": {
              "type": "interval",
              "default": 2,
              "stops": [
                [
                  11.3,
                  1
                ],
                [
                  13,
                  3
                ]
              ]
            },
            "visible": true
          }
        },
        {//地铁
          "filter": ['all', ['==', '$layer', '兰州地铁@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              0.2117647058823529,
              0.3764705882352941,
              0.5725490196078431,
              1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            "linePatternAnimSpeed": 0,
            "linePatternFile": null,
            "lineStrokeWidth": 0,
            "lineStrokeColor": [
              0,
              0,
              0,
              0
            ],
            "lineJoinPatternMode": 0,
            "lineWidth": {
              "type": "interval",
              "default": 0,
              "stops": [
                [
                  8.6,
                  1
                ],
                [
                  10,
                  5
                ]
              ]
            },
            "visible": true
          }
        }, {//国道
          "filter": ['all', ['==', '$layer', '国道@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              1,
              0.9254901960784314,
              0.7294117647058824,
              1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            linePatternAnimSpeed: 0.5,
            linePatternFile: null,
            lineStrokeWidth: 0.5,
            lineStrokeColor: [
              0.992156862745098,
              0.8509803921568627,
              0.6431372549019608,
              1],
            lineJoinPatternMode: 1,
            "lineWidth": {
              "type": "interval",
              "default": 1,
              "stops": [
                [
                  8.6,
                  0.6
                ],
                [
                  9,
                  0.8
                ],
                [
                  12,
                  1
                ]
              ]
            },
            "visible": true
          }
        },
        {//国道
          "filter": ['all', ['==', '$layer', '国道@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": true,
            "lineCap": "butt",
            "lineColor": [
              1,
              0.9254901960784314,
              0.7294117647058824,
              0
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            linePatternAnimSpeed: 0.8,
            linePatternFile: "./dist/shangli/sd.png",
            lineStrokeWidth: 0.5,
            lineStrokeColor: [
              0.992156862745098,
              0.8509803921568627,
              0.6431372549019608,
              0],
            lineJoinPatternMode: 0,
            "lineWidth": {
              "type": "interval",
              "default": 1,
              "stops": [
                [
                  15,
                  0
                ],
                [
                  15.1,
                  0
                ]
              ]
            },
            "visible": true,
            linePatternGap: 4.1,
          }
        },
        { //国道标注
          "filter": ['all', ['==', '$layer', '国道@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "point"
            },
            "sceneConfig": {
              "collision": true,
              "fading": true,
              "depthFunc": "always"
            },
            "type": "text"
          },
          "symbol": {
            "textBloom": false,
            "textAllowOverlap": false,
            "textDx": 0,
            "textDy": 0,
            "textFaceName": "kaiti,serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            textHaloFill: [1, 1, 1, 1],
            textHaloOpacity: 1,
            textHaloRadius: 1,
            "textHorizontalAlignment": "middle",
            "textIgnorePlacement": false,
            "textName": "{NAME}",
            "textOpacity": 1,
            "textPitchAlignment": "viewport",
            "textPlacement": "line",
            "textRotation": 0,
            "textRotationAlignment": "viewport",
            "textSize": {
              "type": "interval",
              "default": 10,
              "stops": [
                [
                  8,
                  0
                ],
                [
                  8.2,
                  9
                ],
                [
                  11.6,
                  10
                ]
              ]
            },
            "textSpacing": 250,
            "textStyle": "normal",
            "textVerticalAlignment": "top",
            "textWeight": "normal",
            "textWrapWidth": 240,
            "visible": true
          }
        }
        ,

        //  {//西津西路
        //       "filter": ['all', ['==', '$layer', '西津西路@电厂']],
        //     "renderPlugin": {
        //       "dataConfig": {
        //         "type": "line"
        //       },
        //       "sceneConfig": {},
        //       "type": "line"
        //     },
        //     "symbol": {
        //       "lineBloom": false,
        //       "lineCap": "butt",
        //       "lineColor": [
        //       0.4980392156862745,
        //       0.4980392156862745,
        //       0.4980392156862745,
        //         1
        //       ],
        //       "lineDasharray": [
        //         0,
        //         0,
        //         0,
        //         0
        //       ],
        //       "lineDashColor": [
        //         1,
        //         1,
        //         1,
        //         0
        //       ],
        //       "lineDx": 0,
        //       "lineDy": 0,
        //       "lineGapWidth": 0,
        //       "lineJoin": "miter",
        //       "lineOpacity": 1,
        //       linePatternAnimSpeed: 0.8,
        //       linePatternFile: "./dist/shangli/blue1.png",
        //       lineStrokeWidth: 0.5,
        //       lineStrokeColor: [
        //         0.4313725490196078,
        //         0.8431372549019608,
        //         0.8, 
        //         1],                     //0.7764705882352941, 0.6431372549019608, 0.2509803921568627, 1
        //       lineJoinPatternMode: 1,
        //       "lineWidth": {
        //         "type": "interval",
        //         "default": 0,
        //         "stops": [
        //           [
        //             8.6,
        //             1
        //           ],
        //           [
        //             9,
        //             3
        //           ]
        //         ]
        //       },
        //       "visible": true
        //     }
        //   },
        // {
        //     "filter": ['all', ['==', '$layer', '西津西路@电厂']],
        //   "renderPlugin": {
        //     "dataConfig": {
        //       "type": "point"
        //     },
        //     "sceneConfig": {
        //       "collision": true,
        //       "fading": true,
        //       "depthFunc": "always"
        //     },
        //     "type": "text"
        //   },
        //   "symbol": {
        //     "textBloom": false,
        //     "textAllowOverlap": false,
        //     "textDx": 0,
        //     "textDy": 0,
        //     "textFaceName": "kaiti,serif",
        //     "textFill": [
        //       1,
        //       1,
        //       1,
        //       1
        //     ],
        //     "textHaloFill": [
        //       1,
        //       1,
        //       1,
        //       1
        //     ],
        //     "textHaloOpacity": 1,
        //     "textHaloRadius": 0,
        //     "textHorizontalAlignment": "middle",
        //     "textIgnorePlacement": false,
        //     "textName": "{NAME}",
        //     "textOpacity": 1,
        //     "textPitchAlignment": "viewport",
        //     "textPlacement": "line",
        //     "textRotation": 0,
        //     "textRotationAlignment": "viewport",
        //     "textSize": {
        //       "type": "interval",
        //       "default": 10,
        //       "stops": [
        //         [
        //           8,
        //           0
        //         ],
        //         [
        //           8.2,
        //           9
        //         ],
        //         [
        //           11.6,
        //           10
        //         ]
        //       ]
        //     },
        //     "textSpacing": 250,
        //     "textStyle": "normal",
        //     "textVerticalAlignment": "top",
        //     "textWeight": "normal",
        //     "textWrapWidth": 240,
        //     "visible": true
        //   }
        // },
        {//滨河路
          "filter": ['all', ['==', '$layer', '滨河路@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              1,
              0.9254901960784314,
              0.7294117647058824,
              1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            linePatternAnimSpeed: 0.8,
            linePatternFile: null,
            lineStrokeWidth: 0.5,
            lineStrokeColor: [
              0.992156862745098,
              0.8509803921568627,
              0.6431372549019608,
              1],                     //0.7764705882352941, 0.6431372549019608, 0.2509803921568627, 1
            lineJoinPatternMode: 1,
            "lineWidth": {
              "type": "interval",
              "default": 0,
              "stops": [
                [
                  8.6,
                  0.6
                ],
                [
                  9,
                  0.8
                ],
                [
                  12,
                  1
                ]
              ]
            },
            "visible": true
          }
        },
        {//滨河路
          "filter": ['all', ['==', '$layer', '滨河路@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": true,
            "lineCap": "butt",
            "lineColor": [
              1,
              0.9254901960784314,
              0.7294117647058824,
              0
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            linePatternAnimSpeed: 0.8,
            linePatternFile: "./dist/shangli/red.png",
            lineStrokeWidth: 0.5,
            lineStrokeColor: [
              0.992156862745098,
              0.8509803921568627,
              0.6431372549019608,
              0],                     //0.7764705882352941, 0.6431372549019608, 0.2509803921568627, 1
            lineJoinPatternMode: 1,
            "lineWidth": {
              "type": "interval",
              "default": 0,
              "stops": [
                [
                  15,
                  0
                ],

                [
                  15.1,
                  0
                ]
              ]
            },
            "visible": true,
            linePatternGap: 4.1,
          }
        },
        {
          "filter": ['all', ['==', '$layer', '滨河路@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "point"
            },
            "sceneConfig": {
              "collision": true,
              "fading": true,
              "depthFunc": "always"
            },
            "type": "text"
          },
          "symbol": {
            "textBloom": false,
            "textAllowOverlap": false,
            "textDx": 0,
            "textDy": 0,
            "textFaceName": "kaiti,serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            "textHaloFill": [
              1,
              1,
              1,
              1
            ],
            "textHaloOpacity": 1,
            "textHaloRadius": 1,
            "textHorizontalAlignment": "middle",
            "textIgnorePlacement": false,
            "textName": "{NAME}",
            "textOpacity": 1,
            "textPitchAlignment": "viewport",
            "textPlacement": "line",
            "textRotation": 0,
            "textRotationAlignment": "viewport",
            "textSize": {
              "type": "interval",
              "default": 10,
              "stops": [
                [
                  8,
                  0
                ],
                [
                  8.2,
                  9
                ],
                [
                  11.6,
                  10
                ]
              ]
            },
            "textSpacing": 250,
            "textStyle": "normal",
            "textVerticalAlignment": "top",
            "textWeight": "normal",
            "textWrapWidth": 240,
            "visible": true
          }
        },
        // {//省道
        //     "filter": ['all', ['==', '$layer', '省道@电厂']],
        //   "renderPlugin": {
        //     "dataConfig": {
        //       "type": "line"
        //     },
        //     "sceneConfig": {},
        //     "type": "line"
        //   },
        //   "symbol": {
        //     "lineBloom": false,
        //     "lineCap": "butt",
        //     "lineColor": [
        //     0.4980392156862745,
        //     0.4980392156862745,
        //     0.4980392156862745,
        //       1
        //     ],
        //     "lineDasharray": [
        //       0,
        //       0,
        //       0,
        //       0
        //     ],
        //     "lineDashColor": [
        //       1,
        //       1,
        //       1,
        //       0
        //     ],
        //     "lineDx": 0,
        //     "lineDy": 0,
        //     "lineGapWidth": 0,
        //     "lineJoin": "miter",
        //     "lineOpacity": 1,
        //     "linePatternAnimSpeed": 0,
        //     "linePatternFile": null,
        //     "lineStrokeWidth": 0,
        //     "lineStrokeColor": [
        //       0,
        //       0,
        //       0,
        //       0
        //     ],
        //     "lineJoinPatternMode": 0,
        //     "lineWidth": {
        //       "type": "interval",
        //       "default": 0,
        //       "stops": [
        //         [
        //           8.6,
        //           1
        //         ],
        //         [
        //           9,
        //           3
        //         ]
        //       ]
        //     },
        //     "visible": true
        //   }
        // },
        // {
        //     "filter": ['all', ['==', '$layer', '省道@电厂']],
        //   "renderPlugin": {
        //     "dataConfig": {
        //       "type": "point"
        //     },
        //     "sceneConfig": {
        //       "collision": true,
        //       "fading": true,
        //       "depthFunc": "always"
        //     },
        //     "type": "text"
        //   },
        //   "symbol": {
        //     "textBloom": false,
        //     "textAllowOverlap": false,
        //     "textDx": 0,
        //     "textDy": 0,
        //     "textFaceName": "kaiti,serif",
        //     "textFill": [
        //       1,
        //       1,
        //       1,
        //       1
        //     ],
        //     "textHaloFill": [
        //       1,
        //       1,
        //       1,
        //       1
        //     ],
        //     "textHaloOpacity": 1,
        //     "textHaloRadius": 0,
        //     "textHorizontalAlignment": "middle",
        //     "textIgnorePlacement": false,
        //     "textName": "{NAME}",
        //     "textOpacity": 1,
        //     "textPitchAlignment": "viewport",
        //     "textPlacement": "line",
        //     "textRotation": 0,
        //     "textRotationAlignment": "viewport",
        //     "textSize": {
        //       "type": "interval",
        //       "default": 10,
        //       "stops": [
        //         [
        //           8,
        //           0
        //         ],
        //         [
        //           8.2,
        //           9
        //         ],
        //         [
        //           11.6,
        //           10
        //         ]
        //       ]
        //     },
        //     "textSpacing": 250,
        //     "textStyle": "normal",
        //     "textVerticalAlignment": "top",
        //     "textWeight": "normal",
        //     "textWrapWidth": 240,
        //     "visible": true
        //   }
        // },{//县道
        //     "filter": ['all', ['==', '$layer', '县道@电厂']],
        //   "renderPlugin": {
        //     "dataConfig": {
        //       "type": "line"
        //     },
        //     "sceneConfig": {},
        //     "type": "line"
        //   },
        //   "symbol": {
        //     "lineBloom": false,
        //     "lineCap": "butt",
        //     "lineColor": [
        //     0.4980392156862745,
        //     0.4980392156862745,
        //     0.4980392156862745,
        //       1
        //     ],
        //     "lineDasharray": [
        //       0,
        //       0,
        //       0,
        //       0
        //     ],
        //     "lineDashColor": [
        //       1,
        //       1,
        //       1,
        //       0
        //     ],
        //     "lineDx": 0,
        //     "lineDy": 0,
        //     "lineGapWidth": 0,
        //     "lineJoin": "miter",
        //     "lineOpacity": 1,
        //     "linePatternAnimSpeed": 0,
        //     "linePatternFile": null,
        //     "lineStrokeWidth": 0,
        //     "lineStrokeColor": [
        //       0,
        //       0,
        //       0,
        //       0
        //     ],
        //     "lineJoinPatternMode": 0,
        //     "lineWidth": {
        //       "type": "interval",
        //       "default": 0,
        //       "stops": [
        //         [
        //           8.6,
        //           1
        //         ],
        //         [
        //           9,
        //           10
        //         ]
        //       ]
        //     },
        //     "visible": true
        //   }
        // },
        // {
        //     "filter": ['all', ['==', '$layer', '县道@电厂']],
        //   "renderPlugin": {
        //     "dataConfig": {
        //       "type": "point"
        //     },
        //     "sceneConfig": {
        //       "collision": true,
        //       "fading": true,
        //       "depthFunc": "always"
        //     },
        //     "type": "text"
        //   },
        //   "symbol": {
        //     "textBloom": false,
        //     "textAllowOverlap": false,
        //     "textDx": 0,
        //     "textDy": 0,
        //     "textFaceName": "kaiti,serif",
        //     "textFill": [
        //       1,
        //       1,
        //       1,
        //       1
        //     ],
        //     "textHaloFill": [
        //       1,
        //       1,
        //       1,
        //       1
        //     ],
        //     "textHaloOpacity": 1,
        //     "textHaloRadius": 0,
        //     "textHorizontalAlignment": "middle",
        //     "textIgnorePlacement": false,
        //     "textName": "{NAME}",
        //     "textOpacity": 1,
        //     "textPitchAlignment": "viewport",
        //     "textPlacement": "line",
        //     "textRotation": 0,
        //     "textRotationAlignment": "viewport",
        //     "textSize": {
        //       "type": "interval",
        //       "default": 10,
        //       "stops": [
        //         [
        //           8,
        //           0
        //         ],
        //         [
        //           8.2,
        //           9
        //         ],
        //         [
        //           11.6,
        //           10
        //         ]
        //       ]
        //     },
        //     "textSpacing": 250,
        //     "textStyle": "normal",
        //     "textVerticalAlignment": "top",
        //     "textWeight": "normal",
        //     "textWrapWidth": 240,
        //     "visible": true
        //   }
        //  },
        {//兰州路网
          "filter": ['all', ['==', '$layer', '兰州路网@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": false,
            "lineCap": "butt",
            "lineColor": [
              1,
              1,
              1,
              1
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            linePatternAnimSpeed: 0,
            linePatternFile: null,
            lineStrokeWidth: 0,
            lineStrokeColor: [
              1,
              1,
              1,
              0.5],
            lineJoinPatternMode: 0,
            "lineWidth": {
              "type": "interval",
              "default": 0,
              "stops": [
                [
                  9,
                  0
                ],
                [
                  10,
                  0.8
                ],
                [
                  15.1,
                  1.5
                ]
              ]
            },
            "visible": true
          }
        },
        {//兰州路网
          "filter": ['all', ['==', '$layer', '兰州路网@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "line"
            },
            "sceneConfig": {},
            "type": "line"
          },
          "symbol": {
            "lineBloom": true,
            "lineCap": "butt",
            "lineColor": [
              0.6823529411764706,
              0.6392156862745098,
              0.4313725490196078,
              0
            ],
            "lineDasharray": [
              0,
              0,
              0,
              0
            ],
            "lineDashColor": [
              1,
              1,
              1,
              0
            ],
            "lineDx": 0,
            "lineDy": 0,
            "lineGapWidth": 0,
            "lineJoin": "miter",
            "lineOpacity": 1,
            linePatternAnimSpeed: 0.5,
            linePatternFile: "./dist/shangli/green1.png",
            lineStrokeWidth: 0,
            lineStrokeColor: [
              1,
              1,
              1,
              1],
            lineJoinPatternMode: 0,
            "lineWidth": {
              "type": "interval",
              "default": 0,
              "stops": [
                [
                  15.9,
                  0
                ],
                [
                  16,
                  0.5
                ],
              ]
            },
            "visible": true
          }
        },
        {
          "filter": ['all', ['==', '$layer', '兰州路网@电厂']],
          "renderPlugin": {
            "dataConfig": {
              "type": "point"
            },
            "sceneConfig": {
              "collision": true,
              "fading": true,
              "depthFunc": "always"
            },
            "type": "text"
          },
          "symbol": {
            "textBloom": false,
            "textAllowOverlap": false,
            "textDx": 0,
            "textDy": 0,
            "textFaceName": "kaiti,serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            "textHaloFill": [
              1,
              1,
              1,
              1
            ],
            "textHaloOpacity": 1,
            "textHaloRadius": 1,
            "textHorizontalAlignment": "middle",
            "textIgnorePlacement": false,
            "textName": "{name}",
            "textOpacity": 1,
            "textPitchAlignment": "viewport",
            "textPlacement": "line",
            "textRotation": 0,
            "textRotationAlignment": "viewport",
            "textSize": {
              "type": "interval",
              "default": 10,
              "stops": [
                [
                  8,
                  0
                ],

                [
                  14,
                  10
                ]
              ]
            },
            "textSpacing": 250,
            "textStyle": "normal",
            "textVerticalAlignment": "top",
            "textWeight": "normal",
            "textWrapWidth": 240,
            "visible": true
          }
        },

        {  //地铁站点
          filter: ['all', ['==', '$layer', '地铁站点@电厂'], ['==', '$type', 'Point']],
          renderPlugin: {
            dataConfig: {
              type: 'point',
            },
            sceneConfig: {
              collision: true,
              fading: true,
              depthFunc: 'always',
            },
            type: 'icon',
          },
          symbol: {
            //markerType: "ellipse",
            markerFile: './dist/maptalks/resouces/markers/ditiezhan.png',
            markerHeight: 12,
            markerWidth: 12,
            // markerFill: [0.71, 0.53, 0.07, 1],
            //  markerFillOpacity: 1,
            // markerLineOpacity: 0,
            textDy: -19,
            textFaceName: "Microsoft YaHei,sans-serif",
            textFill: [0.9019607843137255, 0, 0.3137254901960784, 1],
            textHaloFill: [1, 1, 1, 1],
            textHaloOpacity: 1,
            textHaloRadius: 1,
            textName: '{name}',
            textSize: 8
          },
        },
        {  //公园
          filter: ['all', ['==', '$layer', '公园@电厂'], ['==', '$type', 'Point']],
          renderPlugin: {
            dataConfig: {
              type: 'point',
            },
            sceneConfig: {
              collision: true,
              fading: true,
              depthFunc: 'always',
            },
            type: 'icon',
          },
          symbol: {
            //markerType: "ellipse",
            markerFile: './dist/maptalks/resouces/markers/gongyuan.png',
            markerHeight: 12,
            markerWidth: 12,
            // markerFill: [0.71, 0.53, 0.07, 1],
            //  markerFillOpacity: 1,
            // markerLineOpacity: 0,
            textDy: -19,
            textFaceName: "Microsoft YaHei,sans-serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            textHaloFill: [1, 1, 1, 1],
            textHaloOpacity: 1,
            textHaloRadius: 1,
            textName: '{NAME}',
            textSize: 8
          },
        },
        {  //兰州火车站
          filter: ['all', ['==', '$layer', '兰州火车站@电厂'], ['==', '$type', 'Point']],
          renderPlugin: {
            dataConfig: {
              type: 'point',
            },
            sceneConfig: {
              collision: true,
              fading: true,
              depthFunc: 'always',
            },
            type: 'icon',
          },
          symbol: {
            //markerType: "ellipse",
            markerFile: './dist/maptalks/resouces/markers/huochezhan.png',
            markerHeight: 15,
            markerWidth: 15,
            // markerFill: [0.71, 0.53, 0.07, 1],
            //  markerFillOpacity: 1,
            // markerLineOpacity: 0,
            textDy: -19,
            textFaceName: "Microsoft YaHei,sans-serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            textHaloFill: [1, 1, 1, 1],
            textHaloOpacity: 1,
            textHaloRadius: 1,
            textName: '{NAME}',
            textSize: 8
          },
        },
        {  //大学
          filter: ['all', ['==', '$layer', '大学@电厂'], ['==', '$type', 'Point']],
          renderPlugin: {
            dataConfig: {
              type: 'point',
            },
            sceneConfig: {
              collision: true,
              fading: true,
              depthFunc: 'always',
            },
            type: 'icon',
          },
          symbol: {
            //markerType: "ellipse",
            markerFile: './dist/maptalks/resouces/markers/daxue.png',
            markerHeight: 15,
            markerWidth: 15,
            // markerFill: [0.71, 0.53, 0.07, 1],
            //  markerFillOpacity: 1,
            // markerLineOpacity: 0,
            textDy: -19,
            textFaceName: "Microsoft YaHei,sans-serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            textHaloFill: [1, 1, 1, 1],
            textHaloOpacity: 1,
            textHaloRadius: 1,
            textName: '{NAME}',
            textSize: 8
          },
        },
        {  //重点三甲医院
          filter: ['all', ['==', '$layer', '重点三甲医院@电厂'], ['==', '$type', 'Point']],
          renderPlugin: {
            dataConfig: {
              type: 'point',
            },
            sceneConfig: {
              collision: true,
              fading: true,
              depthFunc: 'always',
            },
            type: 'icon',
          },
          symbol: {
            //markerType: "ellipse",
            markerFile: './dist/maptalks/resouces/markers/yiyuan.png',
            markerHeight: 15,
            markerWidth: 15,
            // markerFill: [0.71, 0.53, 0.07, 1],
            //  markerFillOpacity: 1,
            // markerLineOpacity: 0,
            textDy: -19,
            textFaceName: "Microsoft YaHei,sans-serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            textHaloFill: [1, 1, 1, 1],
            textHaloOpacity: 1,
            textHaloRadius: 1,
            textName: '{NAME}',
            textSize: 8
          },
        },
        {  //人大
          filter: ['all', ['==', '$layer', '人大@电厂'], ['==', '$type', 'Point']],
          renderPlugin: {
            dataConfig: {
              type: 'point',
            },
            sceneConfig: {
              collision: true,
              fading: true,
              depthFunc: 'always',
            },
            type: 'icon',
          },
          symbol: {
            //markerType: "ellipse",
            markerFile: './dist/maptalks/resouces/markers/renda.png',
            markerHeight: 15,
            markerWidth: 15,
            // markerFill: [0.71, 0.53, 0.07, 1],
            //  markerFillOpacity: 1,
            // markerLineOpacity: 0,
            textDy: -19,
            textFaceName: "Microsoft YaHei,sans-serif",
            textFill: [0.2117647058823529, 0.3764705882352941, 0.5725490196078431, 1],
            textHaloFill: [1, 1, 1, 1],
            textHaloOpacity: 1,
            textHaloRadius: 1,
            textName: '{NAME}',
            textSize: 8
          },
        },
  ],
}

</script>

<style lang="scss" scoped>
.main-content {
  margin: 2px 0 0 !important;
}

.map-content {
  position: relative;
  width: 100%;
  height: calc(100vh - 86px);
  overflow: hidden;
  
}
</style>
