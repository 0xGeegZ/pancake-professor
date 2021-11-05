/* eslint-disable import/no-cycle */
import { SeedData } from '.'

export const testData: SeedData = {
  users: [
    {
      id: 'test',
      name: 'Tester',
      email: 'test@test.com',
      address: '0xFAKE',
      generated: '0xFAKE',
      private: '0xFAKE',
    },
  ],
  projects: [
    {
      id: 'test',
      name: 'Test Project',
      slug: 'test',
      users: ['test'],
    },
  ],
}
