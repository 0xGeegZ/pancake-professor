export interface Bet {
  createdAt: string
}
export interface Player {
  id: string
  totalBNB: string
  totalBets: string
  winRate: string
  averageBNB: string
  netBNB: string
  recentGames: number
  winRateRecents: number
  // lastHour: number
  bets: Bet[]
  // [key: string]: any
  // bets: {
  //       [key: string]: Bet
  //   };
  // bets {
  //   position: string
  //   round {
  //     epoch: string
  //     position: string
  //   }
  // }
}
