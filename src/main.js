import './main.scss'
import H5 from './H5.js'

const delay = 300
const duration = 1000
const dd = delay + duration

const h5 = new H5([
  [
    {"name":"bounceInDown 1s ease 0s 1 normal both","delay":dd * 0},
    {"name":"fadeInUp 1s ease 0s 1 normal both","delay":dd * 0},
    {"name":"zoomIn 1s ease 0s 1 normal both","delay":dd * 1},
    {"name":"puffIn 1s ease 0s 1 normal both","delay":dd * 1},
    {"name":"tada 1s ease 0s 1 normal both","delay":dd * 2},
  ],

  [
    {"name":"fadeInLeft 1s ease 0s 1 normal both","delay":dd * 0},
    {"name":"fadeInDown 1s ease 0s 1 normal both","delay":dd * 0},
    {"name":"bounceIn 1s ease 0s 1 normal both","delay":dd * 1},
    {"name":"wobble 1s ease 0s 1 normal both","delay":dd * 2},
    {"name":"fadeInLeft 1s ease 0s 1 normal both","delay":dd * 3},
    {"name":"fadeInRight 1s ease 0s 1 normal both","delay":dd * 4},
    {"name":"fadeInLeft 1s ease 0s 1 normal both","delay":dd * 5},
    {"name":"lightSpeedIn 1s ease 0s 1 normal both","delay":dd * 6},
    {"name":"puffIn 1s ease 0s 1 normal both","delay":dd * 6},
  ],

  [
    {"name":"bounceInDown 1s ease 0s 1 normal both","delay":dd * 0},
    {"name":"fadeInUp 1s ease 0s 1 normal both","delay":dd * 1},
    {"name":"puffIn 1s ease 0s 1 normal both","delay":dd * 1},
    {"name":"fadeInUp 1s ease 0s 1 normal both","delay":dd * 2},
    {"name":"puffIn 1s ease 0s 1 normal both","delay":dd * 2},
    {"name":"fadeInUp 1s ease 0s 1 normal both","delay":dd * 3},
    {"name":"puffIn 1s ease 0s 1 normal both","delay":dd * 3},
  ],

  [
    {"name":"zoomIn 4s ease 0s 1 normal both","delay":dd * 0},
    {"name":"puffIn 4s ease 0s 1 normal both","delay":dd * 0},
    {"name":"fadeInUp 1s ease 0s 1 normal both","delay":dd * 1},
    {"name":"bounceInRight 1s ease 0s 1 normal both","delay":dd * 1},
    {"name":"tada 1s ease 0s 1 normal both","delay":dd * 2},
    {"name":"bounceInLeft 1s ease 0s 1 normal both","delay":dd * 1},
  ],
])
