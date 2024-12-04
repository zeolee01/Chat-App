import { useEffect, useState } from "react"
import useConversation from "../zustand/useConversation"
import toast from "react-hot-toast"

const useGetMessages = () => {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation()

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`)
        if (!res.ok) {
          const errorText = await res.text() // Parse plain text error, if any
          throw new Error(
            errorText || `Failed to fetch messages: ${res.status}`
          )
        }
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setMessages(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (selectedConversation?._id) getMessages()
  }, [selectedConversation?._id, setMessages])

  return { messages, loading }
}
export default useGetMessages

// import { useEffect, useState } from "react"
// import useConversation from "../zustand/useConversation"
// import toast from "react-hot-toast"

// const useGetMessages = () => {
//   const [loading, setLoading] = useState(false)
//   const { messages, setMessages, selectedConversation } = useConversation()

//   useEffect(() => {
//     let isMounted = true // Prevent memory leaks if the component unmounts

//     const getMessages = async () => {
//       setLoading(true)
//       try {
//         const res = await fetch(`/api/messages/${selectedConversation._id}`)

//         // Check if the response is successful
//         if (!res.ok) {
//           const errorText = await res.text() // Parse plain text error, if any
//           throw new Error(
//             errorText || `Failed to fetch messages: ${res.status}`
//           )
//         }

//         const data = await res.json()

//         if (data.error) {
//           throw new Error(data.error)
//         }

//         if (isMounted) {
//           setMessages(data)
//         }
//       } catch (error) {
//         if (isMounted) {
//           toast.error(
//             error.message || "An error occurred while fetching messages."
//           )
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false)
//         }
//       }
//     }

//     if (selectedConversation?._id) {
//       getMessages()
//     }

//     return () => {
//       isMounted = false // Cleanup on unmount
//     }
//   }, [selectedConversation?._id])

//   return { messages, loading }
// }

// export default useGetMessages
