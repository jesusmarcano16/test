import axios from 'axios'

const axiosGet = async (url) => {
  const result = await axios.get(url, options)
    .then(resp => {
      return resp.data
    })
    .catch((error) => {
      return { error: error.message }
    })
  return result
}
export default axiosGet
