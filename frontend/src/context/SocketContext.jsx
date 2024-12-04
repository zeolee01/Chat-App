import { createContext, useState, useEffect, useContext } from "react"
import { useAuthContext } from "./AuthContext"
import io from "socket.io-client"

const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const { authUser } = useAuthContext()

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:3008", {
        query: {
          userId: authUser._id,
        },
      })

      setSocket(socket)

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users)
      })

      return () => socket.close()
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [authUser])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

// import { createContext, useState, useEffect, useContext } from "react"
// import { useAuthContext } from "./AuthContext"
// import io from "socket.io-client"

// const SocketContext = createContext()

// export const useSocketContext = () => {
//   return useContext(SocketContext)
// }

// export const SocketContextProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null)
//   const [onlineUsers, setOnlineUsers] = useState([])
//   const { authUser } = useAuthContext()

//   useEffect(() => {
//     if (authUser) {
//       // Initialize the socket connection
//       const socket = io("http://localhost:3008", {
//         query: { userId: authUser._id },
//         // reconnection: true, // Enable reconnection
//         // reconnectionAttempts: 5, // Try to reconnect 5 times
//         // reconnectionDelay: 1000, // Delay between reconnection attempts
//       })

//       setSocket(socket)

//       // Listen for online users
//       const handleGetOnlineUsers = (users) => {
//         setOnlineUsers(users)
//       }
//       socket.on("getOnlineUsers", handleGetOnlineUsers)

//       // Cleanup on component unmount or authUser change
//       return () => {
//         socket.off("getOnlineUsers", handleGetOnlineUsers) // Remove specific listener
//         socket.close() // Close the socket connection
//         setSocket(null) // Reset socket state
//       }
//     } else {
//       // Handle case where authUser becomes null
//       if (socket) {
//         socket.close()
//         setSocket(null)
//       }
//     }
//   }, [authUser]) // Re-run when authUser changes

//   return (
//     <SocketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   )
// }
