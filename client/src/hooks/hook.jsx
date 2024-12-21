// //
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({ isError, error, fallback }) => {
            if (isError) {
                if (fallback) fallback()
                else toast.error(error?.data?.message || "Something Went Wrong");
            }
        })
    }, [errors])
}


const useAsyncMutation = (mutationHook) => {

    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)

    const [mutate] = mutationHook()

    const executeMutation = async (toastMessage, ...args) => {
        setIsLoading(true)
        const toastId = toast.loading(toastMessage || "Updating Data...")
        try {
            const res = await mutate(...args)
            console.log("res:::--->>>", res);
            if (res.data) {
                toast.success(res?.data?.message || "Updated data successfully", { id: toastId })
                setData(res.data);
            } else {
                toast.error(res?.error?.data?.message || "Failed to request sent", { id: toastId })
            }
        } catch (error) {
            toast.error("Something Went Wrong")
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    return [ executeMutation, isLoading, data ]

}


export { useErrors, useAsyncMutation }