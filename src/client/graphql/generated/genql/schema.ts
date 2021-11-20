import {FieldsSelection,Observable} from '@genql/runtime'

export type Scalars = {
    DateTime: any,
    String: string,
    Float: number,
    Boolean: boolean,
    Int: number,
}

export interface Mutation {
    createFriend?: User
    createProject?: Project
    createStrategie?: Strategie
    createStripeCheckoutBillingPortalUrl?: Scalars['String']
    createStripeCheckoutSession?: Scalars['String']
    deleteStrategie?: Strategie
    inviteToProject?: Scalars['Boolean']
    removeFunds?: User
    toogleActivateStrategie?: Strategie
    toogleIsActivated?: User
    updateStrategie?: Strategie
    updateUser?: User
    __typename: 'Mutation'
}

export type PaidPlan = 'pro'

export interface Project {
    id: Scalars['String']
    name: Scalars['String']
    paidPlan?: PaidPlan
    slug: Scalars['String']
    users: User[]
    __typename: 'Project'
}

export interface Query {
    currentUser?: User
    getUsers?: (User | undefined)[]
    project?: Project
    strategie?: Strategie
    user?: User
    __typename: 'Query'
}

export interface Strategie {
    createdAt: Scalars['DateTime']
    currentAmount: Scalars['Float']
    generated: Scalars['String']
    id: Scalars['String']
    isActive: Scalars['Boolean']
    isDeleted: Scalars['Boolean']
    isError: Scalars['Boolean']
    isNeedRestart: Scalars['Boolean']
    isRunning: Scalars['Boolean']
    maxLooseAmount: Scalars['Float']
    minWinAmount: Scalars['Float']
    modifiedAt: Scalars['DateTime']
    player: Scalars['String']
    playsCount: Scalars['Int']
    private: Scalars['String']
    roundsCount: Scalars['Int']
    startedAmount: Scalars['Float']
    user: User
    __typename: 'Strategie'
}

export interface User {
    address: Scalars['String']
    createdAt: Scalars['DateTime']
    email?: Scalars['String']
    generated: Scalars['String']
    id: Scalars['String']
    isActivated: Scalars['Boolean']
    loginAt: Scalars['DateTime']
    modifiedAt: Scalars['DateTime']
    name?: Scalars['String']
    private: Scalars['String']
    referrals: User[]
    registeredAt: Scalars['DateTime']
    strategies: Strategie[]
    __typename: 'User'
}

export interface MutationRequest{
    createFriend?: [{id: Scalars['String']},UserRequest]
    createProject?: [{name: Scalars['String'],slug?: (Scalars['String'] | null)},ProjectRequest]
    createStrategie?: [{maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),player: Scalars['String'],startedAmount: Scalars['Float']},StrategieRequest]
    createStripeCheckoutBillingPortalUrl?: [{projectId: Scalars['String']}]
    createStripeCheckoutSession?: [{plan: PaidPlan,projectId: Scalars['String']}]
    deleteStrategie?: [{id: Scalars['String']},StrategieRequest]
    inviteToProject?: [{email: Scalars['String'],projectId: Scalars['String']}]
    removeFunds?: [{id: Scalars['String'],value: Scalars['String']},UserRequest]
    toogleActivateStrategie?: [{id: Scalars['String']},StrategieRequest]
    toogleIsActivated?: [{id: Scalars['String']},UserRequest]
    updateStrategie?: [{id: Scalars['String'],isActive?: (Scalars['Boolean'] | null),isDeleted?: (Scalars['Boolean'] | null),isError?: (Scalars['Boolean'] | null),isRunning?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),player?: (Scalars['String'] | null),playsCount?: (Scalars['Int'] | null),roundsCount?: (Scalars['Int'] | null)},StrategieRequest]
    updateUser?: [{address: Scalars['String'],email?: (Scalars['String'] | null),id: Scalars['String'],name?: (Scalars['String'] | null)},UserRequest]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ProjectRequest{
    id?: boolean | number
    name?: boolean | number
    paidPlan?: boolean | number
    slug?: boolean | number
    users?: [{after?: (UserWhereUniqueInput | null),before?: (UserWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)},UserRequest] | UserRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryRequest{
    currentUser?: UserRequest
    getUsers?: UserRequest
    project?: [{id?: (Scalars['String'] | null),slug?: (Scalars['String'] | null)},ProjectRequest] | ProjectRequest
    strategie?: [{id: Scalars['String']},StrategieRequest]
    user?: [{id: Scalars['String']},UserRequest]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StrategieRequest{
    createdAt?: boolean | number
    currentAmount?: boolean | number
    generated?: boolean | number
    id?: boolean | number
    isActive?: boolean | number
    isDeleted?: boolean | number
    isError?: boolean | number
    isNeedRestart?: boolean | number
    isRunning?: boolean | number
    maxLooseAmount?: boolean | number
    minWinAmount?: boolean | number
    modifiedAt?: boolean | number
    player?: boolean | number
    playsCount?: boolean | number
    private?: boolean | number
    roundsCount?: boolean | number
    startedAmount?: boolean | number
    user?: UserRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StrategieWhereUniqueInput {generated?: (Scalars['String'] | null),id?: (Scalars['String'] | null),private?: (Scalars['String'] | null)}

export interface UserRequest{
    address?: boolean | number
    createdAt?: boolean | number
    email?: boolean | number
    generated?: boolean | number
    id?: boolean | number
    isActivated?: boolean | number
    loginAt?: boolean | number
    modifiedAt?: boolean | number
    name?: boolean | number
    private?: boolean | number
    referrals?: [{after?: (UserWhereUniqueInput | null),before?: (UserWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)},UserRequest] | UserRequest
    registeredAt?: boolean | number
    strategies?: [{after?: (StrategieWhereUniqueInput | null),before?: (StrategieWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)},StrategieRequest] | StrategieRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserWhereUniqueInput {address?: (Scalars['String'] | null),email?: (Scalars['String'] | null),generated?: (Scalars['String'] | null),id?: (Scalars['String'] | null),private?: (Scalars['String'] | null)}


const Mutation_possibleTypes = ['Mutation']
export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
  return Mutation_possibleTypes.includes(obj.__typename)
}



const Project_possibleTypes = ['Project']
export const isProject = (obj?: { __typename?: any } | null): obj is Project => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isProject"')
  return Project_possibleTypes.includes(obj.__typename)
}



const Query_possibleTypes = ['Query']
export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
  return Query_possibleTypes.includes(obj.__typename)
}



const Strategie_possibleTypes = ['Strategie']
export const isStrategie = (obj?: { __typename?: any } | null): obj is Strategie => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isStrategie"')
  return Strategie_possibleTypes.includes(obj.__typename)
}



const User_possibleTypes = ['User']
export const isUser = (obj?: { __typename?: any } | null): obj is User => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
  return User_possibleTypes.includes(obj.__typename)
}


export interface MutationPromiseChain{
    createFriend: ((args: {id: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    createProject: ((args: {name: Scalars['String'],slug?: (Scalars['String'] | null)}) => ProjectPromiseChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Promise<(FieldsSelection<Project, R> | undefined)>}),
    createStrategie: ((args: {maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),player: Scalars['String'],startedAmount: Scalars['Float']}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    createStripeCheckoutBillingPortalUrl: ((args: {projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    createStripeCheckoutSession: ((args: {plan: PaidPlan,projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    deleteStrategie: ((args: {id: Scalars['String']}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    inviteToProject: ((args: {email: Scalars['String'],projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['Boolean'] | undefined)) => Promise<(Scalars['Boolean'] | undefined)>}),
    removeFunds: ((args: {id: Scalars['String'],value: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    toogleActivateStrategie: ((args: {id: Scalars['String']}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    toogleIsActivated: ((args: {id: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    updateStrategie: ((args: {id: Scalars['String'],isActive?: (Scalars['Boolean'] | null),isDeleted?: (Scalars['Boolean'] | null),isError?: (Scalars['Boolean'] | null),isRunning?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),player?: (Scalars['String'] | null),playsCount?: (Scalars['Int'] | null),roundsCount?: (Scalars['Int'] | null)}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    updateUser: ((args: {address: Scalars['String'],email?: (Scalars['String'] | null),id: Scalars['String'],name?: (Scalars['String'] | null)}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>})
}

export interface MutationObservableChain{
    createFriend: ((args: {id: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    createProject: ((args: {name: Scalars['String'],slug?: (Scalars['String'] | null)}) => ProjectObservableChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Observable<(FieldsSelection<Project, R> | undefined)>}),
    createStrategie: ((args: {maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),player: Scalars['String'],startedAmount: Scalars['Float']}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    createStripeCheckoutBillingPortalUrl: ((args: {projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    createStripeCheckoutSession: ((args: {plan: PaidPlan,projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    deleteStrategie: ((args: {id: Scalars['String']}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    inviteToProject: ((args: {email: Scalars['String'],projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['Boolean'] | undefined)) => Observable<(Scalars['Boolean'] | undefined)>}),
    removeFunds: ((args: {id: Scalars['String'],value: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    toogleActivateStrategie: ((args: {id: Scalars['String']}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    toogleIsActivated: ((args: {id: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    updateStrategie: ((args: {id: Scalars['String'],isActive?: (Scalars['Boolean'] | null),isDeleted?: (Scalars['Boolean'] | null),isError?: (Scalars['Boolean'] | null),isRunning?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),player?: (Scalars['String'] | null),playsCount?: (Scalars['Int'] | null),roundsCount?: (Scalars['Int'] | null)}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    updateUser: ((args: {address: Scalars['String'],email?: (Scalars['String'] | null),id: Scalars['String'],name?: (Scalars['String'] | null)}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>})
}

export interface ProjectPromiseChain{
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    name: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    paidPlan: ({get: (request?: boolean|number, defaultValue?: (PaidPlan | undefined)) => Promise<(PaidPlan | undefined)>}),
    slug: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    users: ((args?: {after?: (UserWhereUniqueInput | null),before?: (UserWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Promise<FieldsSelection<User, R>[]>})&({get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Promise<FieldsSelection<User, R>[]>})
}

export interface ProjectObservableChain{
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    name: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    paidPlan: ({get: (request?: boolean|number, defaultValue?: (PaidPlan | undefined)) => Observable<(PaidPlan | undefined)>}),
    slug: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    users: ((args?: {after?: (UserWhereUniqueInput | null),before?: (UserWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Observable<FieldsSelection<User, R>[]>})&({get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Observable<FieldsSelection<User, R>[]>})
}

export interface QueryPromiseChain{
    currentUser: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    getUsers: ({get: <R extends UserRequest>(request: R, defaultValue?: ((FieldsSelection<User, R> | undefined)[] | undefined)) => Promise<((FieldsSelection<User, R> | undefined)[] | undefined)>}),
    project: ((args?: {id?: (Scalars['String'] | null),slug?: (Scalars['String'] | null)}) => ProjectPromiseChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Promise<(FieldsSelection<Project, R> | undefined)>})&(ProjectPromiseChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Promise<(FieldsSelection<Project, R> | undefined)>}),
    strategie: ((args: {id: Scalars['String']}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    user: ((args: {id: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>})
}

export interface QueryObservableChain{
    currentUser: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    getUsers: ({get: <R extends UserRequest>(request: R, defaultValue?: ((FieldsSelection<User, R> | undefined)[] | undefined)) => Observable<((FieldsSelection<User, R> | undefined)[] | undefined)>}),
    project: ((args?: {id?: (Scalars['String'] | null),slug?: (Scalars['String'] | null)}) => ProjectObservableChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Observable<(FieldsSelection<Project, R> | undefined)>})&(ProjectObservableChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Observable<(FieldsSelection<Project, R> | undefined)>}),
    strategie: ((args: {id: Scalars['String']}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    user: ((args: {id: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>})
}

export interface StrategiePromiseChain{
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    currentAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Promise<Scalars['Float']>}),
    generated: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    isActive: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isDeleted: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isError: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isNeedRestart: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isRunning: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    maxLooseAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Promise<Scalars['Float']>}),
    minWinAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Promise<Scalars['Float']>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    player: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    playsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Promise<Scalars['Int']>}),
    private: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    roundsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Promise<Scalars['Int']>}),
    startedAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Promise<Scalars['Float']>}),
    user: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Promise<FieldsSelection<User, R>>})
}

export interface StrategieObservableChain{
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    currentAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Observable<Scalars['Float']>}),
    generated: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    isActive: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isDeleted: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isError: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isNeedRestart: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isRunning: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    maxLooseAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Observable<Scalars['Float']>}),
    minWinAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Observable<Scalars['Float']>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    player: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    playsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Observable<Scalars['Int']>}),
    private: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    roundsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Observable<Scalars['Int']>}),
    startedAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Observable<Scalars['Float']>}),
    user: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Observable<FieldsSelection<User, R>>})
}

export interface UserPromiseChain{
    address: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    email: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    generated: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    isActivated: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    loginAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    name: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    private: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    referrals: ((args?: {after?: (UserWhereUniqueInput | null),before?: (UserWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Promise<FieldsSelection<User, R>[]>})&({get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Promise<FieldsSelection<User, R>[]>}),
    registeredAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    strategies: ((args?: {after?: (StrategieWhereUniqueInput | null),before?: (StrategieWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends StrategieRequest>(request: R, defaultValue?: FieldsSelection<Strategie, R>[]) => Promise<FieldsSelection<Strategie, R>[]>})&({get: <R extends StrategieRequest>(request: R, defaultValue?: FieldsSelection<Strategie, R>[]) => Promise<FieldsSelection<Strategie, R>[]>})
}

export interface UserObservableChain{
    address: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    email: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    generated: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    isActivated: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    loginAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    name: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    private: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    referrals: ((args?: {after?: (UserWhereUniqueInput | null),before?: (UserWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Observable<FieldsSelection<User, R>[]>})&({get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>[]) => Observable<FieldsSelection<User, R>[]>}),
    registeredAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    strategies: ((args?: {after?: (StrategieWhereUniqueInput | null),before?: (StrategieWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends StrategieRequest>(request: R, defaultValue?: FieldsSelection<Strategie, R>[]) => Observable<FieldsSelection<Strategie, R>[]>})&({get: <R extends StrategieRequest>(request: R, defaultValue?: FieldsSelection<Strategie, R>[]) => Observable<FieldsSelection<Strategie, R>[]>})
}