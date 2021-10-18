import { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import Header from './Header';

import ThemeSettings from 'src/client/components/ThemeSettings';

interface CollapsedSidebarLayoutProps {
  children?: ReactNode;
}

const MainWrapper = styled(Box)(
  ({ theme }) => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
        
        @media (min-width: ${theme.breakpoints.values.md}px) {
            padding-left: 120px;
        }
`
);

const MainContent = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.header.height};
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
`
);

const CollapsedSidebarLayout: FC<CollapsedSidebarLayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <MainWrapper>
        <Header />
        <MainContent>
          {children}
          <ThemeSettings />
        </MainContent>
      </MainWrapper>
    </>
  );
};

CollapsedSidebarLayout.propTypes = {
  children: PropTypes.node
};

export default CollapsedSidebarLayout;
