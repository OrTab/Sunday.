import io from 'socket.io-client'
import { httpService } from './httpService'


const baseUrl = (process.env.NODE_ENV === 'production') ? 'https://sunday-app-2021.herokuapp.com/' : '//localhost:3030'
export const socketService = createSocketService()
// export const socketService = createDummySocketService()


var socketIsReady = false;
// socketService.setup()


function createSocketService() {
  var socket = null;
  const socketService = {
    setup() {
      if (socket) return
      socket = io(baseUrl, { reconnection: false })
      socketIsReady = true;
    },
    on(eventName, cb) {
      if (!socket) socketService.setup()
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) socketService.setup()
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      if (!socket) socketService.setup()
      socket.emit(eventName, data)
    },
    terminate() {
      socket = null
      socketIsReady = false
    }
  }
  return socketService
}

// eslint-disable-next-line
function createDummySocketService() {
  var listenersMap = {}
  const socketService = {
    listenersMap,
    setup() {
      listenersMap = {}
    },
    terminate() {
      this.setup()
    },
    on(eventName, cb) {
      listenersMap[eventName] = [...(listenersMap[eventName]) || [], cb]
    },
    off(eventName, cb) {
      if (!listenersMap[eventName]) return
      if (!cb) delete listenersMap[eventName]
      else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
    },
    emit(eventName, data) {
      if (!listenersMap[eventName]) return
      listenersMap[eventName].forEach(listener => {
        listener(data)
      })
    },
    debugMsg() {
      this.emit('chat addMsg', { from: 'Someone', txt: 'Aha it worked!' })
    },
  }
  return socketService
}



