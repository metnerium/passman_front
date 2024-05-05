<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Passwords
            <v-spacer />
            <v-btn color="primary" @click="addPassword">Add Password</v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="passwords"
            :items-per-page="5"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.actions="{ item }">
              <v-icon small class="mr-2" @click="editPassword(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deletePassword(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.website"
                  label="Website"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.login"
                  label="Login"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.password"
                  label="Password"
                  type="password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PasswordsPage',
  data: () => ({
    headers: [
      {text: 'Website', value: 'website'},
      {text: 'Login', value: 'login'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    passwords: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {
      website: '',
      login: '',
      password: '',
    },
    defaultItem: {
      website: '',
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
        const response = await axios.get('/passwords')
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
        await axios.delete(`/passwords/${item.id}`)
        this.passwords = this.passwords.filter((password) => password.id !== item.id)
      } catch (error) {
        console.error(error)
        alert('Error deleting password')
      }
    },
    async save() {
      if (this.editedIndex > -1) {
        try {
          await axios.put(`/passwords/${this.passwords[this.editedIndex].id}`, {
            website: this.editedItem.website,
            login: this.editedItem.login,
            password: this.editedItem.password,
          })
          Object.assign(this.passwords[this.editedIndex], this.editedItem)
        } catch (error) {
          console.error(error)
          alert('Error updating password')
        }
      } else {
        try {
          const response = await axios.post('/passwords', {
            website: this.editedItem.website,
            login: this.editedItem.login,
            password: this.editedItem.password,
          })
          this.passwords.push(response.data)
        } catch (error) {
          console.error(error)
          alert('Error creating password')
        }
      }
      this.close()
    },
  }
}
</script>
