// import { Server } from "socket.io"
// import http from "http"
// import express from "express"

// const app = express()

// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//   },
// })

// export const getReceiverSocketId = (receiverId) => {
//   return userSocketMap[receiverId]
// }

// const userSocketMap = {} // {userId: socketId}

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id)

//   const userId = socket.handshake.query.userId
//   if (userId != "undefined") userSocketMap[userId] = socket.id

//   // io.emit() is used to send events to all the connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap))

//   // socket.on() is used to listen to the events. can be used both on client and server side
//   socket.on("disconnect", () => {
//     console.log("user disconnected", socket.id)
//     delete userSocketMap[userId]
//     io.emit("getOnlineUsers", Object.keys(userSocketMap))
//   })
// })

// export { app, io, server }

import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Utility function to get the receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId]
}

const userSocketMap = {} // {userId: socketId}

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  const userId = socket.handshake.query.userId

  // Validate and map the user ID to the socket ID
  if (userId) {
    userSocketMap[userId] = socket.id
    console.log(`User ID ${userId} mapped to socket ID ${socket.id}`)
  }

  // Broadcast the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  // Handle socket disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)

    // Remove the user from the socket map
    for (const user in userSocketMap) {
      if (userSocketMap[user] === socket.id) {
        delete userSocketMap[user]
        console.log(`Removed User ID ${user} for socket ID ${socket.id}`)
        break
      }
    }

    // Update the online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

export { app, io, server }
