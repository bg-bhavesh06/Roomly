mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  // container ID
  container: "map",

  // starting position [lng, lat]. Note that lat must be set between -90 and 90
  //   E=lng N=lat
  center: coordinate,

  // starting zoom
  zoom: 10,
});

const marker = new mapboxgl.Marker().setLngLat(coordinate).addTo(map);
