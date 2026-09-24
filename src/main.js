import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { KIOSK, startIdleTimer } from './lib/kiosk.js'

// Kiosk builds get the 2019 iPad layout (a separate stylesheet, scoped to
// html.kiosk) and the idle timer that hands over to the attract loop.
if (KIOSK) {
  document.documentElement.classList.add('kiosk')
  import('./kiosk.css')
  startIdleTimer()
}

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
