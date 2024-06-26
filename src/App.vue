<template>
  <div class="switch-distraction" :class="{ 'is-active': distraction }">
    <el-switch
      active-text="On"
      inactive-text="Off"
      v-model="distraction"
      title="Toggles Distraction Free Mode"
    />
    <p style="font-size: x-small">
      Distracted? Turn on the new distraction free mode to focus on what's important!
    </p>
    <el-switch active-text="On" inactive-text="Off" v-model="darkMode" title="Toggles Dark Mode" />
    <p style="font-size: x-small">Turn on REAL dark mode</p>
  </div>

  <el-dialog v-model="dialogVisible" title="ok!bot cares about you" class="dialog-care" >
    <h3>Are you ok?</h3>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">No</el-button>
      </div>
    </template>
  </el-dialog>

  <el-main
    v-if="!distraction"
    class="main"
    :class="{ darkMode }"
    ref="main"
    :style="{ 'margin-top': darkMode ? '0' : '6em' }"
  >
    <el-row justify="center">
      <el-col :lg="12" :md="24">
        <h1>Welcome to your Ok!-Bot</h1>
        <h2>Overall Status Report</h2>
        <p>
          In order to not make the user unnecessarily nervous, the status level is always green and
          has a fixed value of 85%.
        </p>

        <el-progress :percentage="85" status="success" />
        <el-text
          ><strong>Everything Is Possibly Ok{{ formattedConfidenceLevel }}</strong></el-text
        >
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-top: 80px">
      <el-col :lg="12" :md="24">
        <p>
          The confidence level is displayed as a slider. The user can adjust the confidence level.
          The confidence level is displayed as a number.
          <br />
          <small style="font-size: x-small; font-style: italic"
            >This text was generated by an AI.</small
          >
        </p>
        <el-slider :min="-2" :max="122" v-model="confidenceLevel" />
        <el-text>Confidence Level: {{ confidenceLevel }}</el-text>
        <p v-show="message">
          <el-text>{{ message }}</el-text>
        </p>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-top: 80px">
      <el-col :lg="12" :md="24">
        <h3>
          Ok!-Bot offers a clean and easy UI with simple buttons not hiding their functionality
        </h3>
        <el-popover
          :visible="counter[0] >= 10"
          placement="bottom"
          title="Information!"
          :width="200"
          content="You reached maximum functionality. Please user other button"
        >
          <template #reference>
            <el-button
              @click="click(0)"
              :style="{ transform: transform(0), zIndex: counter[0] }"
              :disabled="counter[0] >= 10"
              >Functionality
            </el-button>
          </template>
        </el-popover>

        <el-popover
          :visible="counter[1] >= 10"
          placement="bottom"
          title="Information!"
          :width="200"
          content="You reached maximum functionality. Please user other button"
        >
          <template #reference>
            <el-button
              @click="click(1)"
              :style="{ transform: transform(1), zIndex: counter[1] }"
              :disabled="counter[1] >= 10"
              >Functionality
            </el-button>
          </template>
        </el-popover>
      </el-col>
    </el-row>

    <el-row justify="center" style="margin-top: 2em">
      <el-col :lg="12" :md="24">
        <h2 class="new">On Demand Checks!</h2>
        <p>
          We now offer easy to use on demand checks! You can check the status of any url, at any
          time.
        </p>
        <p>
          Ok!Bot will use an AI based algorithm to find out what services to check for and will give
          you detailed results on any service that you didn't even know you cared about!
        </p>
        <el-input
          :class="{ invalid: v$.urlToCheck.$invalid }"
          placeholder="Enter A URL ..."
          v-model="state.urlToCheck"
        ></el-input>
        <p v-show="v$.urlToCheck.$invalid">
          Your input does not appear to be a URL. However, we will try to use this input for Ok!Bot
          anyway.
        </p>
        <el-button
          style="margin-top: 1em"
          :disabled="state.urlToCheck.length === 0"
          @click="doCheck(0)"
          >Check</el-button
        >
        <ul>
          <li v-for="message in checkedMessages" :key="message">
            {{ message }}
          </li>
        </ul>
        <h3 v-if="checkDone">Everything is possibly ok!</h3>
      </el-col>
    </el-row>

    <el-row justify="center" style="margin-top: 2em">
      <el-col :lg="12" :md="24">
        <h3>With Ok!-Bot, you can monitor anything that is important to you:</h3>
        <el-table table-layout="fixed" :data="data" style="width: 100%" height="250">
          <el-table-column sortable fixed prop="name" label="Monitor" />
          <el-table-column sortable prop="status" label="Status" />
          <el-table-column sortable prop="percentage" label="%" />
        </el-table>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin: 5em 0">
      <el-col :lg="12" :md="24">
        <h2>Coming soon</h2>
        <p>
          At Ok!-Bot we are listening to our users! We are constantly improving our product to make
          it the best it can be. Here are some features that are coming soon:
        </p>
        <h3>Dark Mode!</h3>
        <p>Ok!-Bot will soon offer a dark mode to reduce eye strain. See a Screenshot:</p>
        <div class="preview-dark-mode"></div>
      </el-col>
    </el-row>
  </el-main>
  <el-main class="distraction-free" v-else>
    <span class="gigantic">85%</span>
  </el-main>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, inject} from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useVuelidate } from '@vuelidate/core'
import { url } from '@vuelidate/validators'

const counter = reactive([0, 0])
const sliderCount = ref(0)
const confidenceLevel = ref(77)
const message = ref('')
const numClicks = ref(0)
const distraction = ref(false)
const checkedMessages = reactive<Array<string>>([])
const checkDone = ref(false)
const main = ref()
const darkMode = inject("darkMode", ref(false))
const dialogVisible = ref(false)


const state = reactive({
  urlToCheck: ''
})

const data = reactive(new Array<{ name: string; status: string; percentage: number }>())

for (let n = 0; n < 100; n++) {
  data.push({
    name: 'Data',
    status: 'Possibly Ok',
    percentage: 85
  })
}

const formattedConfidenceLevel = computed(() => {
  if (confidenceLevel.value >= 73) {
    return '!'
  } else if (confidenceLevel.value >= 29) {
    return '.'
  } else {
    return '?'
  }
})

const services = ['ping', 'dns', 'network', 'dns', 'ssl', 'cpu', 'memory', 'disk space']

const others = [
  'Passport',
  'Safety Equipment',
  'First Aid Kit',
  'Vehicle Maintenance',
  'Home Appliances',
  'Smoke Alarms',
  'Emergency Exits',
  'Food Expiry Dates',
  'Travel Itinerary'
]

function doCheck(n: number) {
  if (n === 0) {
    checkedMessages.splice(0)
    checkDone.value = false
  }
  let tocheck = v$.value.urlToCheck.$invalid ? others : services
  let verb = v$.value.urlToCheck.$invalid ? (s: string) => (s.endsWith('s') ? 'are' : 'is') : 'is'

  const timeout = Math.random() * 3000 + 1000
  let info = ''
  if (tocheck[n] === 'dns' && n > 1) {
    info = " (again, it's important!)"
  }

  let last = checkedMessages.push(`Checking ${tocheck[n]}${info} ...`) - 1

  setTimeout(() => {
    checkedMessages[last] = `${tocheck[n]} ${
      verb instanceof Function ? verb(tocheck[n]) : verb
    } Possibly Ok!`
    setTimeout(() => {
      n++
      if (n < tocheck.length) doCheck(n)
      else {
        checkDone.value = true
      }
    }, timeout)
  }, timeout)
}

function transform(button: number) {
  const sign = numClicks.value > 20 ? -1 : 1
  return `scale(${sign * (1 + counter[button] / 10)}, ${1 + counter[button] / 10})`
}

function click(button: number) {
  numClicks.value++
  counter[button]++
  if (button === 0) {
    counter[1] = 0
  } else {
    counter[0] = 0
  }
}


watchDebounced(
  confidenceLevel,
  () => {
    sliderCount.value++
  },
  { debounce: 500, immediate: true }
)

watch(sliderCount, () => {
  if (sliderCount.value > 10) {
    message.value = 'You got that slider business under control!'
    if (counter.every((n) => n === 0)) {
      message.value += ' Maybe you should try the buttons now?'
    } else {
      message.value += ' You should try the buttons again!'
    }
  } else if (sliderCount.value > 7) {
    message.value = 'You are very good at using the slider. Keep going!'
  } else if (sliderCount.value > 3) {
    message.value = 'You are getting the hang of it!'
  }
})

watch(
  () => counter,
  () => {
    if (counter.some((n) => n >= 10)) {
      sliderCount.value = 0
      message.value = ''
    }
  },
  { deep: true }
)

const rules = {
  urlToCheck: { url }
}
const v$ = useVuelidate(rules, state)

onMounted(() => {
  const root = document.documentElement
  root.addEventListener('mousemove', (evt) => {
    let x = evt.clientX + window.scrollX
    let y = evt.clientY + window.scrollY

    root.style.setProperty('--mouse-x', `${x}px`)
    root.style.setProperty('--mouse-y', `${y}px`)
    root.style.setProperty('--el-text-color', 'transparent')
  })

  setTimeout(() => {
    dialogVisible.value = true
  }, 1000 * 20)

})

watch(darkMode, () => {
  if (darkMode.value) {
    document.getElementById("app")?.classList.add("darkMode")
  } else {
    document.getElementById("app")?.classList.remove("darkMode")
  }


})
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300&display=swap');

:root {
  --color-1: rgb(205 205 155 / 1);
  --color-2: rgb(0 0 0 / 0);
  --mouse-x: 50%;
  --mouse-y: 10em;
  --size: 15em;
}

.main {
  margin: auto;
  &.darkMode {
    background: radial-gradient(
      var(--size) var(--size) at var(--mouse-x) var(--mouse-y),
      var(--color-1) 0%,
      var(--color-2) 99%
    ) !important;
    background-clip: text;
    -webkit-background-clip: text;
    user-select: none;
  }
}

html,
body {
  height: 100%;
}

body {
  font-family: 'Roboto', sans-serif;
}

#app {
  position: relative;
  min-height: 100%;
  &.darkMode {
    background: #000;
    line-height: 1;
  }
}

.el-main {
  justify-content: center;
  align-items: center;
  &.distraction-free {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    .gigantic {
      font-size: 100px;
    }
  }
}

.el-button {
  transition-property: transform;
  transition-duration: 1s;
  position: relative;
}

.switch-distraction {
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: right;
  width: 10em;
  height: 10em;
  z-index: 10;

  p {
    margin-right: 2em;
  }
  &.is-active {
    opacity: 0.2 !important;
  }
}

.new {
  background-image: url('/new.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top right;
  padding-top: 20px;
}

.preview-dark-mode {
  width: 100%;
  height: 20vh;
  background-color: #333333;
}

.el-input {
  &.invalid {
    el-input__wrapper {
      border-color: magenta;
    }
  }
}
.dialog-care {
  width: 500px;

  @media screen and (max-width: 600px) {
    width: 80%;
  }
}

</style>
