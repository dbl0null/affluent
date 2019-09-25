const axios = require('axios')
const api = 'https://reqres.in/api'

async function getData (acc = [], index = 1) {
  const {data: { total_pages, page, data }} = await axios.get(`${api}/users?page=${index}`)
  acc = acc.concat(data)
  return (total_pages === page) ? acc : await getData(acc, ++index)
}

module.exports = { getData }

if (require.main === module) {
  getData()
    .then(result => console.log(result, result.length))
    .catch(error => console.error(error))
}