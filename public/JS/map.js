mapboxgl.accessToken = mapToken;

const maps = new mapboxgl.Map({
  // container ID
  container: "map",

  // starting position [lng, lat]. Note that lat must be set between -90 and 90
  //   E=lng N=lat
  center: coordinate,

  // starting zoom
  zoom: 10,
});

new mapboxgl.Marker().setLngLat(coordinate).addTo(maps);
