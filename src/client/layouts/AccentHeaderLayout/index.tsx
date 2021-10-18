import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ThemeSettings from 'src/client/components/ThemeSettings';

import Sidebar from './Sidebar';
import Header from './Header';

interface AccentHeaderLayoutProps {
  children?: ReactNode;
}

const MainWrapper = styled(Box)(
  () => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
`
);

const MainContent = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.header.height};
        margin-left: ${theme.sidebar.width};
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
`
);

const AccentHeaderLayout: FC<AccentHeaderLayoutProps> = ({ children }) => {
  return (
    <>
      <MainWrapper>
        <Header />
        <Sidebar />
        <MainContent>
          {children}
          <ThemeSettings />
        </MainContent>
      </MainWrapper>
    </>
  );
};

AccentHeaderLayout.propTypes = {
  children: PropTypes.node
};

export default AccentHeaderLayout;
