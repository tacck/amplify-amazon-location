<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="place"
          filled
          label="Place"
          clearable
          @change="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <Map :lat="lat" :lng="lng"></Map>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import Location from 'aws-sdk/clients/location'
import Map from './Map.vue'
import awsconfig from '../aws-exports'

export default {
  components: {
    Map,
  },
  data: function () {
    return {
      lat: 43.0618,
      lng: 141.3545,
      place: '',
      client: null,
    }
  },
  mounted: async function () {
    this.client = await this.createClient()
  },
  beforeDestroy: function () {
    this.place = ''
    this.client = null
  },
  methods: {
    createClient: async () => {
      const credentials = await Auth.currentCredentials()
      const client = new Location({
        credentials,
        region: awsconfig.aws_project_region,
      })
      return client
    },
    search: function () {
      if (!this.place || this.place.length === 0) {
        return
      }

      const params = {
        IndexName: 'SamplePlaceIndex',
        Text: this.place,
      }
      this.client.searchPlaceIndexForText(params, (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        if (data) {
          console.log(data)

          if (data.Results && data.Results.length > 0) {
            this.lng = data.Results[0].Place.Geometry.Point[0]
            this.lat = data.Results[0].Place.Geometry.Point[1]
          }
        }
      })
    },
  },
}
</script>

<style></style>
