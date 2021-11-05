import { useEffect, useRef } from 'react'
import type { ReactElement } from 'react'

import Head from 'next/head'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

import TopBarContent from 'src/client/components/Applications/Messenger/TopBarContent'
import BottomBarContent from 'src/client/components/Applications/Messenger/BottomBarContent'
import SidebarContent from 'src/client/components/Applications/Messenger/SidebarContent'
import ChatContent from 'src/client/components/Applications/Messenger/ChatContent'

import { Scrollbars } from 'react-custom-scrollbars-2'

import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const RootWrapper = styled(Box)(
  () => `
       height: 100%;
       display: flex;
`
)

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 300px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`
)

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
)

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(3)};
`
)

const ChatMain = styled(Box)(
  () => `
        flex: 1;
`
)

const ChatBottomBar = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(3)};
`
)

function ApplicationsMessenger() {
  const ref = useRef<any>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToBottom()
    }
  })

  return (
    <>
      <Head>
        <title>Messenger - Applications</title>
      </Head>
      <RootWrapper>
        <Sidebar>
          <Scrollbars universal autoHide>
            <SidebarContent />
          </Scrollbars>
        </Sidebar>
        <ChatWindow>
          <ChatTopBar>
            <TopBarContent />
          </ChatTopBar>
          <ChatMain>
            <Scrollbars universal ref={ref} autoHide>
              <ChatContent />
            </Scrollbars>
          </ChatMain>
          <ChatBottomBar>
            <BottomBarContent />
          </ChatBottomBar>
        </ChatWindow>
      </RootWrapper>
    </>
  )
}

export default ApplicationsMessenger

ApplicationsMessenger.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
