import { useEffect, useState } from "react"

function useForm({ initialValues, onSubmit, validate }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    console.log([name],":", value )
  }

  const handleSubmit = async (event) => {
    setSubmitting(true)
    event.preventDefault()
    await new Promise((r) => setTimeout(r, 1500))
    setErrors(validate(values))
  }

  useEffect(() => {
    console.log('handleSubmit',errors)
    if (submitting) {
      if (Object.keys(errors).length === 0) {
        onSubmit(values)
      }
      setSubmitting(false)
    }
  }, [errors])

  return {
    values,
    errors,
    submitting,
    handleChange,
    handleSubmit,
  }
}

export default useForm