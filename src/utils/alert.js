import Swal from 'sweetalert2'

const alert = (title, text) => {
  Swal.fire({
    icon: 'error',
    title,
    text
  })
}
export const alertSuccess = (title) => {
  Swal.fire({
    icon: 'success',
    title
  })
}

export default alert
