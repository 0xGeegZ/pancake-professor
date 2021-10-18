import { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import Header from './Header';

import ThemeSettings from 'src/client/components/ThemeSettings';

interface BoxedSidebarLayoutProps {
  children?: ReactNode;
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
);

const MainContent = styled(Box)(
  () => `
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
`
);

const BoxedSidebarLayout: FC<BoxedSidebarLayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <MainWrapper>
        <MainContent>
          <Header />
          {children}
          <ThemeSettings />
        </MainContent>
      </MainWrapper>
    </>
  );
};

BoxedSidebarLayout.propTypes = {
  children: PropTypes.node
};

export default BoxedSidebarLayout;
