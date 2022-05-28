import {FieldsSelection,Observable} from '@genql/runtime'

export type Scalars = {
    DateTime: any,
    String: string,
    Int: number,
    Float: number,
    Boolean: boolean,
}

export interface Favorite {
    comment?: Scalars['String']
    createdAt: Scalars['DateTime']
    id: Scalars['String']
    modifiedAt: Scalars['DateTime']
    note?: Scalars['Int']
    player: Scalars['String']
    type: FavoriteType
    user: User
    __typename: 'Favorite'
}

export type FavoriteType = 'DISLIKE' | 'LIKE'

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
    toogleFavoritePlayer?: User
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
    getAllFavorites?: (Favorite | undefined)[]
    getFavorite?: Favorite
    getFavorites?: (Favorite | undefined)[]
    getUsers?: (User | undefined)[]
    project?: Project
    strategie?: Strategie
    user?: User
    __typename: 'Query'
}

export interface Strategie {
    betAmountPercent: Scalars['Float']
    color?: Scalars['String']
    createdAt: Scalars['DateTime']
    currentAmount: Scalars['Float']
    decreaseAmount?: Scalars['Int']
    generated: Scalars['String']
    history: Scalars['String'][]
    id: Scalars['String']
    increaseAmount?: Scalars['Int']
    isActive: Scalars['Boolean']
    isDeleted: Scalars['Boolean']
    isError: Scalars['Boolean']
    isNeedRestart: Scalars['Boolean']
    isRunning: Scalars['Boolean']
    isTrailing: Scalars['Boolean']
    maxLooseAmount?: Scalars['Float']
    minWinAmount?: Scalars['Float']
    modifiedAt: Scalars['DateTime']
    name?: Scalars['String']
    player: Scalars['String']
    playsCount: Scalars['Int']
    private: Scalars['String']
    roundsCount: Scalars['Int']
    startedAmount: Scalars['Float']
    stopLoss?: Scalars['Int']
    takeProfit?: Scalars['Int']
    user: User
    __typename: 'Strategie'
}

export interface User {
    address: Scalars['String']
    createdAt: Scalars['DateTime']
    email?: Scalars['String']
    favorites: Favorite[]
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

export interface FavoriteRequest{
    comment?: boolean | number
    createdAt?: boolean | number
    id?: boolean | number
    modifiedAt?: boolean | number
    note?: boolean | number
    player?: boolean | number
    type?: boolean | number
    user?: UserRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface FavoriteWhereUniqueInput {id?: (Scalars['String'] | null)}

export interface MutationRequest{
    createFriend?: [{id: Scalars['String']},UserRequest]
    createProject?: [{name: Scalars['String'],slug?: (Scalars['String'] | null)},ProjectRequest]
    createStrategie?: [{betAmountPercent: Scalars['Float'],color?: (Scalars['String'] | null),decreaseAmount?: (Scalars['Float'] | null),increaseAmount?: (Scalars['Float'] | null),isTrailing?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),name?: (Scalars['String'] | null),player: Scalars['String'],startedAmount: Scalars['Float'],stopLoss?: (Scalars['Int'] | null),takeProfit?: (Scalars['Int'] | null)},StrategieRequest]
    createStripeCheckoutBillingPortalUrl?: [{projectId: Scalars['String']}]
    createStripeCheckoutSession?: [{plan: PaidPlan,projectId: Scalars['String']}]
    deleteStrategie?: [{id: Scalars['String']},StrategieRequest]
    inviteToProject?: [{email: Scalars['String'],projectId: Scalars['String']}]
    removeFunds?: [{id: Scalars['String'],value: Scalars['String']},UserRequest]
    toogleActivateStrategie?: [{id: Scalars['String']},StrategieRequest]
    toogleFavoritePlayer?: [{isNeedToFavorite: Scalars['Boolean'],player: Scalars['String'],type: Scalars['String']},UserRequest]
    toogleIsActivated?: [{id: Scalars['String']},UserRequest]
    updateStrategie?: [{betAmountPercent?: (Scalars['Float'] | null),color?: (Scalars['String'] | null),decreaseAmount?: (Scalars['Float'] | null),id: Scalars['String'],increaseAmount?: (Scalars['Float'] | null),isActive?: (Scalars['Boolean'] | null),isDeleted?: (Scalars['Boolean'] | null),isError?: (Scalars['Boolean'] | null),isRunning?: (Scalars['Boolean'] | null),isTrailing?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),name?: (Scalars['String'] | null),player?: (Scalars['String'] | null),playsCount?: (Scalars['Int'] | null),roundsCount?: (Scalars['Int'] | null),stopLoss?: (Scalars['Int'] | null),takeProfit?: (Scalars['Int'] | null)},StrategieRequest]
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
    getAllFavorites?: FavoriteRequest
    getFavorite?: [{id: Scalars['String']},FavoriteRequest]
    getFavorites?: FavoriteRequest
    getUsers?: UserRequest
    project?: [{id?: (Scalars['String'] | null),slug?: (Scalars['String'] | null)},ProjectRequest] | ProjectRequest
    strategie?: [{id: Scalars['String']},StrategieRequest]
    user?: [{id: Scalars['String']},UserRequest]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StrategieRequest{
    betAmountPercent?: boolean | number
    color?: boolean | number
    createdAt?: boolean | number
    currentAmount?: boolean | number
    decreaseAmount?: boolean | number
    generated?: boolean | number
    history?: boolean | number
    id?: boolean | number
    increaseAmount?: boolean | number
    isActive?: boolean | number
    isDeleted?: boolean | number
    isError?: boolean | number
    isNeedRestart?: boolean | number
    isRunning?: boolean | number
    isTrailing?: boolean | number
    maxLooseAmount?: boolean | number
    minWinAmount?: boolean | number
    modifiedAt?: boolean | number
    name?: boolean | number
    player?: boolean | number
    playsCount?: boolean | number
    private?: boolean | number
    roundsCount?: boolean | number
    startedAmount?: boolean | number
    stopLoss?: boolean | number
    takeProfit?: boolean | number
    user?: UserRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StrategieWhereUniqueInput {generated?: (Scalars['String'] | null),id?: (Scalars['String'] | null),private?: (Scalars['String'] | null)}

export interface UserRequest{
    address?: boolean | number
    createdAt?: boolean | number
    email?: boolean | number
    favorites?: [{after?: (FavoriteWhereUniqueInput | null),before?: (FavoriteWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)},FavoriteRequest] | FavoriteRequest
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


const Favorite_possibleTypes = ['Favorite']
export const isFavorite = (obj?: { __typename?: any } | null): obj is Favorite => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isFavorite"')
  return Favorite_possibleTypes.includes(obj.__typename)
}



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


export interface FavoritePromiseChain{
    comment: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    note: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Promise<(Scalars['Int'] | undefined)>}),
    player: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    type: ({get: (request?: boolean|number, defaultValue?: FavoriteType) => Promise<FavoriteType>}),
    user: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Promise<FieldsSelection<User, R>>})
}

export interface FavoriteObservableChain{
    comment: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    note: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Observable<(Scalars['Int'] | undefined)>}),
    player: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    type: ({get: (request?: boolean|number, defaultValue?: FavoriteType) => Observable<FavoriteType>}),
    user: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Observable<FieldsSelection<User, R>>})
}

export interface MutationPromiseChain{
    createFriend: ((args: {id: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    createProject: ((args: {name: Scalars['String'],slug?: (Scalars['String'] | null)}) => ProjectPromiseChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Promise<(FieldsSelection<Project, R> | undefined)>}),
    createStrategie: ((args: {betAmountPercent: Scalars['Float'],color?: (Scalars['String'] | null),decreaseAmount?: (Scalars['Float'] | null),increaseAmount?: (Scalars['Float'] | null),isTrailing?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),name?: (Scalars['String'] | null),player: Scalars['String'],startedAmount: Scalars['Float'],stopLoss?: (Scalars['Int'] | null),takeProfit?: (Scalars['Int'] | null)}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    createStripeCheckoutBillingPortalUrl: ((args: {projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    createStripeCheckoutSession: ((args: {plan: PaidPlan,projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    deleteStrategie: ((args: {id: Scalars['String']}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    inviteToProject: ((args: {email: Scalars['String'],projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['Boolean'] | undefined)) => Promise<(Scalars['Boolean'] | undefined)>}),
    removeFunds: ((args: {id: Scalars['String'],value: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    toogleActivateStrategie: ((args: {id: Scalars['String']}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    toogleFavoritePlayer: ((args: {isNeedToFavorite: Scalars['Boolean'],player: Scalars['String'],type: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    toogleIsActivated: ((args: {id: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    updateStrategie: ((args: {betAmountPercent?: (Scalars['Float'] | null),color?: (Scalars['String'] | null),decreaseAmount?: (Scalars['Float'] | null),id: Scalars['String'],increaseAmount?: (Scalars['Float'] | null),isActive?: (Scalars['Boolean'] | null),isDeleted?: (Scalars['Boolean'] | null),isError?: (Scalars['Boolean'] | null),isRunning?: (Scalars['Boolean'] | null),isTrailing?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),name?: (Scalars['String'] | null),player?: (Scalars['String'] | null),playsCount?: (Scalars['Int'] | null),roundsCount?: (Scalars['Int'] | null),stopLoss?: (Scalars['Int'] | null),takeProfit?: (Scalars['Int'] | null)}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    updateUser: ((args: {address: Scalars['String'],email?: (Scalars['String'] | null),id: Scalars['String'],name?: (Scalars['String'] | null)}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>})
}

export interface MutationObservableChain{
    createFriend: ((args: {id: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    createProject: ((args: {name: Scalars['String'],slug?: (Scalars['String'] | null)}) => ProjectObservableChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Observable<(FieldsSelection<Project, R> | undefined)>}),
    createStrategie: ((args: {betAmountPercent: Scalars['Float'],color?: (Scalars['String'] | null),decreaseAmount?: (Scalars['Float'] | null),increaseAmount?: (Scalars['Float'] | null),isTrailing?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),name?: (Scalars['String'] | null),player: Scalars['String'],startedAmount: Scalars['Float'],stopLoss?: (Scalars['Int'] | null),takeProfit?: (Scalars['Int'] | null)}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    createStripeCheckoutBillingPortalUrl: ((args: {projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    createStripeCheckoutSession: ((args: {plan: PaidPlan,projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    deleteStrategie: ((args: {id: Scalars['String']}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    inviteToProject: ((args: {email: Scalars['String'],projectId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['Boolean'] | undefined)) => Observable<(Scalars['Boolean'] | undefined)>}),
    removeFunds: ((args: {id: Scalars['String'],value: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    toogleActivateStrategie: ((args: {id: Scalars['String']}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    toogleFavoritePlayer: ((args: {isNeedToFavorite: Scalars['Boolean'],player: Scalars['String'],type: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    toogleIsActivated: ((args: {id: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    updateStrategie: ((args: {betAmountPercent?: (Scalars['Float'] | null),color?: (Scalars['String'] | null),decreaseAmount?: (Scalars['Float'] | null),id: Scalars['String'],increaseAmount?: (Scalars['Float'] | null),isActive?: (Scalars['Boolean'] | null),isDeleted?: (Scalars['Boolean'] | null),isError?: (Scalars['Boolean'] | null),isRunning?: (Scalars['Boolean'] | null),isTrailing?: (Scalars['Boolean'] | null),maxLooseAmount?: (Scalars['Float'] | null),minWinAmount?: (Scalars['Float'] | null),name?: (Scalars['String'] | null),player?: (Scalars['String'] | null),playsCount?: (Scalars['Int'] | null),roundsCount?: (Scalars['Int'] | null),stopLoss?: (Scalars['Int'] | null),takeProfit?: (Scalars['Int'] | null)}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
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
    getAllFavorites: ({get: <R extends FavoriteRequest>(request: R, defaultValue?: ((FieldsSelection<Favorite, R> | undefined)[] | undefined)) => Promise<((FieldsSelection<Favorite, R> | undefined)[] | undefined)>}),
    getFavorite: ((args: {id: Scalars['String']}) => FavoritePromiseChain & {get: <R extends FavoriteRequest>(request: R, defaultValue?: (FieldsSelection<Favorite, R> | undefined)) => Promise<(FieldsSelection<Favorite, R> | undefined)>}),
    getFavorites: ({get: <R extends FavoriteRequest>(request: R, defaultValue?: ((FieldsSelection<Favorite, R> | undefined)[] | undefined)) => Promise<((FieldsSelection<Favorite, R> | undefined)[] | undefined)>}),
    getUsers: ({get: <R extends UserRequest>(request: R, defaultValue?: ((FieldsSelection<User, R> | undefined)[] | undefined)) => Promise<((FieldsSelection<User, R> | undefined)[] | undefined)>}),
    project: ((args?: {id?: (Scalars['String'] | null),slug?: (Scalars['String'] | null)}) => ProjectPromiseChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Promise<(FieldsSelection<Project, R> | undefined)>})&(ProjectPromiseChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Promise<(FieldsSelection<Project, R> | undefined)>}),
    strategie: ((args: {id: Scalars['String']}) => StrategiePromiseChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Promise<(FieldsSelection<Strategie, R> | undefined)>}),
    user: ((args: {id: Scalars['String']}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>})
}

export interface QueryObservableChain{
    currentUser: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    getAllFavorites: ({get: <R extends FavoriteRequest>(request: R, defaultValue?: ((FieldsSelection<Favorite, R> | undefined)[] | undefined)) => Observable<((FieldsSelection<Favorite, R> | undefined)[] | undefined)>}),
    getFavorite: ((args: {id: Scalars['String']}) => FavoriteObservableChain & {get: <R extends FavoriteRequest>(request: R, defaultValue?: (FieldsSelection<Favorite, R> | undefined)) => Observable<(FieldsSelection<Favorite, R> | undefined)>}),
    getFavorites: ({get: <R extends FavoriteRequest>(request: R, defaultValue?: ((FieldsSelection<Favorite, R> | undefined)[] | undefined)) => Observable<((FieldsSelection<Favorite, R> | undefined)[] | undefined)>}),
    getUsers: ({get: <R extends UserRequest>(request: R, defaultValue?: ((FieldsSelection<User, R> | undefined)[] | undefined)) => Observable<((FieldsSelection<User, R> | undefined)[] | undefined)>}),
    project: ((args?: {id?: (Scalars['String'] | null),slug?: (Scalars['String'] | null)}) => ProjectObservableChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Observable<(FieldsSelection<Project, R> | undefined)>})&(ProjectObservableChain & {get: <R extends ProjectRequest>(request: R, defaultValue?: (FieldsSelection<Project, R> | undefined)) => Observable<(FieldsSelection<Project, R> | undefined)>}),
    strategie: ((args: {id: Scalars['String']}) => StrategieObservableChain & {get: <R extends StrategieRequest>(request: R, defaultValue?: (FieldsSelection<Strategie, R> | undefined)) => Observable<(FieldsSelection<Strategie, R> | undefined)>}),
    user: ((args: {id: Scalars['String']}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>})
}

export interface StrategiePromiseChain{
    betAmountPercent: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Promise<Scalars['Float']>}),
    color: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    currentAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Promise<Scalars['Float']>}),
    decreaseAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Promise<(Scalars['Int'] | undefined)>}),
    generated: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    history: ({get: (request?: boolean|number, defaultValue?: Scalars['String'][]) => Promise<Scalars['String'][]>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    increaseAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Promise<(Scalars['Int'] | undefined)>}),
    isActive: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isDeleted: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isError: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isNeedRestart: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isRunning: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    isTrailing: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    maxLooseAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Float'] | undefined)) => Promise<(Scalars['Float'] | undefined)>}),
    minWinAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Float'] | undefined)) => Promise<(Scalars['Float'] | undefined)>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    name: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    player: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    playsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Promise<Scalars['Int']>}),
    private: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    roundsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Promise<Scalars['Int']>}),
    startedAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Promise<Scalars['Float']>}),
    stopLoss: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Promise<(Scalars['Int'] | undefined)>}),
    takeProfit: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Promise<(Scalars['Int'] | undefined)>}),
    user: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Promise<FieldsSelection<User, R>>})
}

export interface StrategieObservableChain{
    betAmountPercent: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Observable<Scalars['Float']>}),
    color: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    currentAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Observable<Scalars['Float']>}),
    decreaseAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Observable<(Scalars['Int'] | undefined)>}),
    generated: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    history: ({get: (request?: boolean|number, defaultValue?: Scalars['String'][]) => Observable<Scalars['String'][]>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    increaseAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Observable<(Scalars['Int'] | undefined)>}),
    isActive: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isDeleted: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isError: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isNeedRestart: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isRunning: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    isTrailing: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    maxLooseAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Float'] | undefined)) => Observable<(Scalars['Float'] | undefined)>}),
    minWinAmount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Float'] | undefined)) => Observable<(Scalars['Float'] | undefined)>}),
    modifiedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    name: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    player: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    playsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Observable<Scalars['Int']>}),
    private: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    roundsCount: ({get: (request?: boolean|number, defaultValue?: Scalars['Int']) => Observable<Scalars['Int']>}),
    startedAmount: ({get: (request?: boolean|number, defaultValue?: Scalars['Float']) => Observable<Scalars['Float']>}),
    stopLoss: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Observable<(Scalars['Int'] | undefined)>}),
    takeProfit: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Observable<(Scalars['Int'] | undefined)>}),
    user: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Observable<FieldsSelection<User, R>>})
}

export interface UserPromiseChain{
    address: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    email: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    favorites: ((args?: {after?: (FavoriteWhereUniqueInput | null),before?: (FavoriteWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends FavoriteRequest>(request: R, defaultValue?: FieldsSelection<Favorite, R>[]) => Promise<FieldsSelection<Favorite, R>[]>})&({get: <R extends FavoriteRequest>(request: R, defaultValue?: FieldsSelection<Favorite, R>[]) => Promise<FieldsSelection<Favorite, R>[]>}),
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
    favorites: ((args?: {after?: (FavoriteWhereUniqueInput | null),before?: (FavoriteWhereUniqueInput | null),first?: (Scalars['Int'] | null),last?: (Scalars['Int'] | null)}) => {get: <R extends FavoriteRequest>(request: R, defaultValue?: FieldsSelection<Favorite, R>[]) => Observable<FieldsSelection<Favorite, R>[]>})&({get: <R extends FavoriteRequest>(request: R, defaultValue?: FieldsSelection<Favorite, R>[]) => Observable<FieldsSelection<Favorite, R>[]>}),
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