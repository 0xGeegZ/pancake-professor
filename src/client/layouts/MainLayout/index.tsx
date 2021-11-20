import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import menuItems from 'src/client/layouts/MainLayout/Sidebar/SidebarMenu/items'
import { useGlobalStore } from 'src/client/store/swr'

import Banner from './Banner'
import Header from './Header'
import Sidebar from './Sidebar'

/* eslint-disable camelcase */
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
  const { user, fetching, mutate } = useGlobalStore()
  // const isMountedRef = useRefMounted()

  // const router = useRouter()
  // const [user, setUser] = useState<any>()
  // const [allMenuItems, setAllMenuItems] = useState<any>(null)

  const { enqueueSnackbar } = useSnackbar()

  // TODO to avoid rules of hooks error, need to manipulate user without useEffect.
  // useEffect(() => {
  //   if (!data) return
  //   if (user) return

  //   if (isMountedRef.current) {
  //     console.log('updating data', data)

  //     setUser(data)
  //     const filtereds = data.isAdmin ? menuItems : menuItems.filter((mi) => mi.heading !== 'Admin')
  //     setAllMenuItems(filtereds)
  //   }
  // }, [data, user, isMountedRef])

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

    // window.localStorage.setItem('address', accounts[0])

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
      .then(async (json) => {
        if (json.success) {
          enqueueSnackbar(t('Wallet succesfully connected!'), {
            variant: 'success',
          })
          mutate('currentUser')
          // router.replace(router.asPath)
        } else {
          enqueueSnackbar(t('Unexpected error occurred during authentification'), {
            variant: 'error',
          })
        }
      })
      .catch(() => {
        // enqueueSnackbar(t('Unexpected error occurred'), {
        //   variant: 'error',
        // })
        enqueueSnackbar(
          t(
            "Your account need to be activated by an admin. You'll recieve some pancake professor token when it will be validated :)"
          ),
          {
            variant: 'error',
          }
        )
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
            // setUser(null)
            // mutate('currentUser')
            // mutate('', null)
            mutate(null)
            // router.replace(router.asPath)

            // cache.clear()
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
      {/* FIX HEADER ON SCROLL */}
      {/* <Sidebar fetching={fetching} error={error} allMenuItems={allMenuItems} /> */}
      {/* {process.env.NODE_ENV === 'development' && <Banner networkId={user?.networkId} />} */}
      {/* {user?.networkId && <Banner networkId={user?.networkId} />} */}
      <Banner networkId={user?.networkId} />
      <Sidebar
        fetching={fetching}
        allMenuItems={user?.isAdmin ? menuItems : menuItems.filter((mi) => mi.heading !== 'Admin')}
      />
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
