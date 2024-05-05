<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Username"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="username"
              />
              <v-text-field
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginPage',
  data: () => ({
    username: '',
    password: '',
  }),
  methods: {
    async login() {
      try {
        await axios.post('/login', {
          username: this.username,
          password: this.password,
        })
        this.$store.commit('setAuthenticated', true)
        this.$router.push('/passwords')
      } catch (error) {
        console.error(error)
        alert('Invalid username or password')
      }
    },
  },
}
</script>
