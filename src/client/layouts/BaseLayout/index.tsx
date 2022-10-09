import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { FC, ReactNode } from 'react'

interface BaseLayoutProps {
  children?: ReactNode
}

const MainWrapper = styled(Box)(
  () => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
`
)

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => <MainWrapper>{children}</MainWrapper>

BaseLayout.propTypes = {
  children: PropTypes.node,
}

export default BaseLayout
