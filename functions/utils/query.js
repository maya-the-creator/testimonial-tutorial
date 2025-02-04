const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

module.exports = async (query, variables) => {
  const result = await axios({
    url: `https://graphql.fauna.com/graphql`,
    method: `POST`,
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_SERVER_SECRET}`,
    },
    data: {
      query,
      variables,
    },
  })

  return result.data
}
