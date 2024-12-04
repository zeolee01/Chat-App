import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useGetConversations = () => {
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/users")
        if (!res.ok) {
          const errorText = await res.text() // Parse plain text error (if any)
          throw new Error(
            errorText || `Failed to fetch conversations: ${res.status}`
          )
        }
        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setConversations(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    getConversations()
  }, [])

  return { loading, conversations }
}
export default useGetConversations

// import { useEffect, useState } from "react"
// import toast from "react-hot-toast"

// const useGetConversations = () => {
//   const [loading, setLoading] = useState(false)
//   const [conversations, setConversations] = useState([])

//   useEffect(() => {
//     let isMounted = true // Track if the component is still mounted

//     const getConversations = async () => {
//       setLoading(true)
//       try {
//         const res = await fetch("/api/users")

//         // Check if response is successful
//         if (!res.ok) {
//           const errorText = await res.text() // Parse plain text error (if any)
//           throw new Error(
//             errorText || `Failed to fetch conversations: ${res.status}`
//           )
//         }

//         const data = await res.json()

//         // Check for API-specific errors
//         if (data.error) {
//           throw new Error(data.error)
//         }

//         if (isMounted) {
//           setConversations(data)
//         }
//       } catch (error) {
//         if (isMounted) {
//           toast.error(
//             error.message || "An error occurred while fetching conversations."
//           )
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false)
//         }
//       }
//     }

//     getConversations()

//     return () => {
//       isMounted = false // Cleanup: Prevent state updates if unmounted
//     }
//   }, [])

//   return { loading, conversations }
// }

// export default useGetConversations
