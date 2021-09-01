export default function validateSignup({ username, password1, password2 }) {
  const errors = {}

  if (!username) {
    errors.username = "* username is required."
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(username)) {
  } else if (!/^[a-zA-Z]+[a-zA-Z0-9]+$/i.test(username)) {
    // start with any character and end with any character or number 
    errors.username = "* username is not valid."
  }

  if (!password1) {
    errors.password1 = "* password is required."
  } else if (password1.length < 8) {
    errors.password1 = "* password must be at least 8 characters."
  }

  if (!password2) {
    errors.password2 = "* password is required."
  } else if (password2.length < 8) {
    errors.password2 = "* password must be at least 8 characters."
  }
  return errors
}