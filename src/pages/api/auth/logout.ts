import { handler } from '../../../server/api-route'

export default handler().get((req, res) => {
  req.logout()
  res.status(200).json({ success: true })
})
