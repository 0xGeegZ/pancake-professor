import type { User } from 'src/client/models/user'
import { mock } from 'src/client/utils/axios'

const users: User[] = []

mock.onGet('/api/users').reply(() => [200, { users }])

mock.onGet('/api/user').reply((config) => {
  const { userId } = config.params
  const user = users.find((_user) => _user.id === userId)

  return [200, { user }]
})
