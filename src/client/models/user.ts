export type UserRole = 'admin' | 'customer' | 'subscriber'

export interface User {
  id: string
  // avatar: string;
  email?: string
  name?: string
  // role: UserRole
  address: string
  generated: string
  registeredAt?: string
  loginAt?: string
  // jobtitle: string;
  // username: string;
  // location: string;
  // posts: string
  // coverImg: string
  // followers: string
  // description: string
  // [key: string]: any
}
