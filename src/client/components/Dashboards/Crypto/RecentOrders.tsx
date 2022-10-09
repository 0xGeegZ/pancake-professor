import { Card } from '@mui/material'
import { useCallback,useEffect, useState } from 'react'
import useRefMounted from 'src/client/hooks/useRefMounted'
import { CryptoOrder } from 'src/client/models/crypto_order'
import axios from 'src/client/utils/axios'

import RecentOrdersTable from './RecentOrdersTable'

function RecentOrders() {
  const isMountedRef = useRefMounted()
  const [cryptoOrders, setCryptoOrders] = useState<CryptoOrder[]>([])

  const getCryptoOrders = useCallback(async () => {
    try {
      const response = await axios.get<{ cryptoOrders: CryptoOrder[] }>('/api/crypto-orders')

      if (isMountedRef.current) {
        setCryptoOrders(response.data.cryptoOrders)
      }
    } catch (err) {
      console.error(err)
    }
  }, [isMountedRef])

  useEffect(() => {
    getCryptoOrders()
  }, [getCryptoOrders])

  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  )
}

export default RecentOrders
