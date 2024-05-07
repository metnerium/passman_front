<template>
  <v-app dark>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card color="grey darken-4" elevation="10">
            <v-card-title class="white--text">
              <span class="headline">Passwords</span>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="addPassword">
                <v-icon left>mdi-plus</v-icon>
                Add Password
              </v-btn>
            </v-card-title>
            <v-list>
              <v-list-item
                v-for="(item, index) in passwords"
                :key="index"
                :class="{ 'mb-2': index !== passwords.length - 1 }"
              >
                <v-list-item-content>
                  <v-list-item-title class="white--text">{{ item.site }}</v-list-item-title>
                  <v-list-item-subtitle class="white--text">{{ item.login }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="editPassword(item)">
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="deletePassword(item)">
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card color="grey darken-4" elevation="10">
          <v-card-title class="white--text">
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.site"
                    label="Site"
                    outlined
                    dense
                    color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.login"
                    label="Login"
                    outlined
                    dense
                    color="white"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.password"
                    label="Password"
                    outlined
                    dense
                    color="white"
                    type="password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="close">Cancel</v-btn>
            <v-btn color="primary" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
import store from '@/store'

export default {
  name: 'PasswordsPage',
  data: () => ({
    passwords: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {
      site: '',
      login: '',
      password: '',
    },
    defaultItem: {
      site: '',
      login: '',
      password: '',
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Password' : 'Edit Password'
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {
    this.fetchPasswords()
  },
  methods: {
    async fetchPasswords() {
      try {
        const response = await axios.get('/api/passwords', {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        })
        this.passwords = response.data
      } catch (error) {
        console.error(error)
        alert('Error fetching passwords')
      }
    },
    addPassword() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialog = true
    },
    editPassword(item) {
      this.editedIndex = this.passwords.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async deletePassword(item) {
      try {
        await axios.delete(`/api/passwords/${item.id}`, {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        })
        this.passwords = this.passwords.filter((password) => password.id !== item.id)
      } catch (error) {
        console.error(error)
        alert('Error deleting password')
      }
    },
    async save() {
      if (this.editedIndex > -1) {
        try {
          await axios.put(
            `/api/passwords/${this.passwords[this.editedIndex].id}`,
            {
              site: this.editedItem.site,
              login: this.editedItem.login,
              password: this.editedItem.password,
            },
            {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            }
          )
          Object.assign(this.passwords[this.editedIndex], this.editedItem)
        } catch (error) {
          console.error(error)
          alert('Error updating password')
        }
      } else {
        try {
          const response = await axios.post(
            '/api/passwords',
            {
              site: this.editedItem.site,
              login: this.editedItem.login,
              password: this.editedItem.password,
            },
            {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            }
          )
          this.passwords.push(response.data)
        } catch (error) {
          console.error(error)
          alert('Error creating password')
        }
      }
      this.close()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  }
}
</script>
