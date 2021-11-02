/* eslint-disable camelcase */
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import menuItems from 'src/client/layouts/MainLayout/Sidebar/SidebarMenu/items'

import Header from './Header'
import Sidebar from './Sidebar'
import Banner from './Banner'

// import ThemeSettings from 'src/client/components/ThemeSettings';

interface MainLayoutProps {
  children?: ReactNode
}

const MainWrapper = styled(Box)(
  ({ theme }) => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
        
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            padding-left: calc(${theme.sidebar.width} + ${theme.spacing(3)});
        }

        .footer-wrapper {
            margin: 0;
            background: transparent;
        }
`
)

const MainContent = styled(Box)(
  () => `
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
`
)

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { t }: { t: any } = useTranslation()

  // const isMountedRef = useRefMounted()

  // const [{ data, fetching, error }] = useGetCurrentUserQuery()
  const [{ data, fetching }] = useGetCurrentUserQuery()

  const router = useRouter()
  const [networkId, setNetworkId] = useState<any>(0)
  const [user, setUser] = useState<any>('')
  // const [balance, setBalance] = useState<string>('')
  const [allMenuItems, setAllMenuItems] = useState<any>()

  // const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const { enqueueSnackbar } = useSnackbar()

  const checkBalance = useCallback(async (puser) => {
    const luser = puser
    if (!window.ethereum?.request) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    if (!provider) return

    // setProvider(browserProvider)
    const { chainId } = await provider.getNetwork()
    setNetworkId(chainId)

    const rawBalance = await provider.getBalance(luser.address)

    const lbalance = ethers.utils.formatUnits(rawBalance)
    console.log('🚀 ~ file: index.tsx ~ line 81 ~ checkBalance ~ lbalance', lbalance)
    luser.balance = lbalance
    // setBalance(lbalance)

    // const generatedRawBalance = await provider.getBalance(luser.generated)
    // const lgeneratedBalance = ethers.utils.formatUnits(generatedRawBalance)
    // luser.generatedBalance = lgeneratedBalance

    setUser(luser)

    // window.localStorage.setItem('balance', lbalance)
  }, [])

  useEffect(() => {
    // if (!isMountedRef.current) {
    //   return
    // }

    let isFinded = false

    if (data && data.currentUser) {
      isFinded = process.env.NEXT_PUBLIC_ADMIN_ADDRESS
        ? process.env.NEXT_PUBLIC_ADMIN_ADDRESS.includes(data?.currentUser?.address)
        : false

      const luser = {
        ...data.currentUser,
        isAdmin: isFinded,
      }
      setUser(luser)

      // if (!localStorage.getItem('user')) {
      //   window.localStorage.setItem('user', JSON.stringify(luser))
      // }

      // if (window.localStorage.getItem('balance')) setBalance(window.localStorage.getItem('balance'))
      // else
      checkBalance(data.currentUser)
    }

    // let filtereds: Array<menuItems> = []
    // let filtereds: MenuItem[] = []

    let filtereds = []
    if (isFinded) {
      filtereds = menuItems
    } else {
      filtereds = menuItems.filter((mi) => mi.heading !== 'Admin')
    }

    setAllMenuItems(filtereds)
  }, [data, checkBalance])

  const connect = async (evt) => {
    evt.preventDefault()
    if (!window.ethereum?.request) {
      enqueueSnackbar(t('MetaMask is not installed!'), {
        variant: 'error',
      })
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    // setProvider(provider)

    window.localStorage.setItem('address', accounts[0])

    const msg = 'Pancake Professor Application Sign Up'
    const signer = provider.getSigner()
    const signed = await signer.signMessage(msg)

    fetch(`/api/auth/web3Auth`, {
      method: `POST`,
      body: JSON.stringify({
        address: accounts[0],
        msg,
        signed,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          enqueueSnackbar(t('Wallet succesfully connected!'), {
            variant: 'success',
          })
          router.replace(router.asPath)
        } else {
          enqueueSnackbar(t('Unexpected error occurred during authentification'), {
            variant: 'error',
          })
        }
      })
      .catch(() => {
        enqueueSnackbar(t('Unexpected error occurred'), {
          variant: 'error',
        })
      })
  }

  const logout = () => {
    try {
      fetch(`/api/auth/logout`, {
        method: `GET`,
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            // router.push('/')
            enqueueSnackbar(t('Wallet succesfully unconnected!'), {
              variant: 'success',
            })
            setUser(null)
          } else {
            enqueueSnackbar(t('Unexpected error occurred'), {
              variant: 'error',
            })
          }
        })
    } catch (err) {
      enqueueSnackbar(t('Unexpected error occurred'), {
        variant: 'error',
      })
    }
  }

  return (
    <>
      {/* TODO FIX HEADER ON SCROLL */}
      {/* <Sidebar fetching={fetching} error={error} allMenuItems={allMenuItems} /> */}
      <Banner networkId={networkId} />

      <Sidebar fetching={fetching} allMenuItems={allMenuItems} />
      <MainWrapper>
        <MainContent>
          {/* <Header connect={connect} logout={logout} user={user} balance={balance} fetching={fetching} error={error} /> */}
          <Header connect={connect} logout={logout} user={user} fetching={fetching} />
          {children}
          {/* <ThemeSettings /> */}
        </MainContent>
      </MainWrapper>
    </>
  )
}

MainLayout.defaultProps = {
  children: PropTypes.node,
}

MainLayout.propTypes = {
  children: PropTypes.node,
}

export default MainLayout
