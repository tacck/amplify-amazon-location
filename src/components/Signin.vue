<template>
  <v-row>
    <v-col cols="12">
      <amplify-authenticator>
        <div>
          <template v-if="authState === 'signedin' && user">
            <slot></slot>
          </template>
          <v-row justify="center" class="mt-4">
            <v-col cols="6">
              <amplify-sign-out></amplify-sign-out>
            </v-col>
          </v-row>
        </div>
      </amplify-authenticator>
    </v-col>
  </v-row>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'

export default {
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.authState = authState
      this.user = authData
    })
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
    }
  },
  beforeDestroy() {
    this.unsubscribeAuth()
  },
}
</script>

<style></style>
