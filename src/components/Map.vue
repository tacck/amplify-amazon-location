<template>
  <v-card id="map" width="100%" height="400px">
    <VueMapboxMap
      v-if="mapInstance"
      :map="mapInstance"
      :lng="scene.lng"
      :lat="scene.lat"
      :zoom="scene.zoom"
      :pitch="scene.pitch"
      :bearing="scene.bearing"
    >
    </VueMapboxMap>
  </v-card>
</template>

<script>
import { Auth, Signer } from 'aws-amplify'
import VueMapboxMap from '@benchmark-urbanism/vue-mapbox-map'
import maplibregl from 'maplibre-gl'
import awsconfig from '../aws-exports'

export default {
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  components: {
    VueMapboxMap,
  },
  data: function () {
    return {
      mapInstance: null,
      scene: {
        lng: 141.3545,
        lat: 43.0618,
        zoom: 13,
        pitch: 0,
        bearing: 0,
      },
      mapName: 'SampleMap',
      credentials: null,
    }
  },
  mounted: async function () {
    this.credentials = await Auth.currentCredentials()

    this.mapInstance = new maplibregl.Map({
      container: 'map',
      style: this.mapName,
      center: [this.scene.lng, this.scene.lat],
      zoom: this.scene.zoom,
      transformRequest: this.transformRequest,
    })

    this.mapInstance.addControl(new maplibregl.NavigationControl(), 'top-left')
    this.mapInstance.on('load', function () {
      this.resize()
    })
  },
  beforeDestroy: function () {
    this.mapInstance = null
  },
  methods: {
    transformRequest: function (url, resourceType) {
      if (resourceType === 'Style' && !url.includes('://')) {
        // resolve to an AWS URL
        url = `https://maps.geo.${awsconfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`
      }

      if (url.includes('amazonaws.com')) {
        // only sign AWS requests (with the signature as part of the query string)
        return {
          url: Signer.signUrl(url, {
            access_key: this.credentials.accessKeyId,
            secret_key: this.credentials.secretAccessKey,
            session_token: this.credentials.sessionToken,
          }),
        }
      }

      // don't sign
      return { url }
    },
  },
  watch: {
    lat: function (value) {
      this.scene.lat = value
    },
    lng: function (value) {
      this.scene.lng = value
    },
  },
}
</script>

<style></style>
