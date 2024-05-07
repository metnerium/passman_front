<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <div class="container">
        <div class="stack" style="--stacks: 3;">
          <span style="--index: 0;">MeitPass</span>
          <span style="--index: 1;">MeitPass</span>
          <span style="--index: 2;">MeitPass</span>
        </div>
      </div>
      <v-container class="w-lg-33 w-md-50 w-sm-75">
        <v-form >
          <v-text-field
            label="Username"
            name="username"
            variant="outlined"
            type="text"
            v-model="username"
          />
          <v-text-field
            label="Password"
            name="password"
            variant="outlined"
            type="password"
            v-model="password"
          />
          <v-btn-group>
            <v-btn class="ml-2" variant="outlined" @click="login">Войти</v-btn>
            <v-btn variant="outlined" @click="register">Регистрация</v-btn>
          </v-btn-group>
        </v-form>
      </v-container>
    </v-responsive>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginPage',
  data: () => ({
    username: '',
    password: '',
    shakingIntervals: [],
  }),
  methods: {
    async login() {
      try {
        const response = await axios.post('/login', {
          username: this.username,
          password: this.password,
        })
        this.$store.commit('setAuthenticated', true)
        this.$store.commit('setToken', response.data.access_token)
        this.$router.push('/passwords')
      } catch (error) {
        console.error(error)
        alert('Неверное имя пользователя или пароль')
      }
    },
    async register() {
      try {
        const response = axios.post('/api/register', {
          username: this.username,
          password: this.password,
        })
        this.$store.commit('setAuthenticated', true)
        this.$store.commit('setToken', response.data.access_token)
        this.$router.push('/passwords')
      } catch (error) {
        console.error(error)
        alert('Неверное имя пользователя или пароль')
      }
    },
    startShaking(index) {
      const element = document.querySelectorAll('.animated-text')[index]
      const shakeAnimation = () => {
        const angle = Math.random() * 10 - 5
        element.style.transform = `rotate(${angle}deg)`
      }
      const interval = setInterval(shakeAnimation, 10)
      this.shakingIntervals.push(interval)
    },
    stopShaking(index) {
      clearInterval(this.shakingIntervals[index])
      this.shakingIntervals[index] = null
    },
  },
}
</script>

<style scoped>
.service-info {
  margin-bottom: 2rem;
}

.animated-text {
  opacity: 0;
  animation: fade-in 0.5s ease-in-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --background: #060608;
  --color: #fafafa;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: Arial;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--background);
}

.container {
  color: var(--color);
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
}

.right {
  text-align: right;
  width: 100%;
}

.stack {
  display: grid;
  grid-template-columns: 1fr;
}

.stack span {
  font-weight: bold;
  grid-row-start: 1;
  grid-column-start: 1;
  font-size: 4rem;
  --stack-height: calc(100% / var(--stacks) - 1px);
  --inverse-index: calc(calc(var(--stacks) - 1) - var(--index));
  --clip-top: calc(var(--stack-height) * var(--index));
  --clip-bottom: calc(var(--stack-height) * var(--inverse-index));
  clip-path: inset(var(--clip-top) 0 var(--clip-bottom) 0);
  animation: stack 340ms cubic-bezier(0.46, 0.29, 0, 1.24) 1 backwards calc(var(--index) * 120ms),
  glitch 2s ease infinite 2s alternate-reverse;
}

.stack span:nth-child(odd) {
  --glitch-translate: 8px;
}

.stack span:nth-child(even) {
  --glitch-translate: -8px;
}

@keyframes stack {
  0% {
    opacity: 0;
    transform: translateX(-50%);
    text-shadow: -2px 3px 0 red, 2px -3px 0 blue;
  }

  60% {
    opacity: 0.5;
    transform: translateX(50%);
  }

  80% {
    transform: none;
    opacity: 1;
    text-shadow: 2px -3px 0 red, -2px 3px 0 blue;
  }

  100% {
    text-shadow: none;
  }
}

@keyframes glitch {
  0% {
    text-shadow: -2px 3px 0 red, 2px -3px 0 blue;
    transform: translate(var(--glitch-translate));
  }

  2% {
    text-shadow: 2px -3px 0 red, -2px 3px 0 blue;
  }

  4%,
  100% {
    text-shadow: none;
    transform: none;
  }
}
</style>
