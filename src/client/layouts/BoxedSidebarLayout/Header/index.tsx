import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { Box, Hidden, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import Logo from 'src/client/components/Logo';
import { SidebarContext } from 'src/client/contexts/SidebarContext';

import HeaderButtons from './Buttons';
import HeaderMenu from './Menu';
import HeaderUserbox from './Userbox';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.spacing(3)};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        position: relative;
        justify-content: space-between;
        width: 100%;
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <Hidden lgUp>
          <Logo />
        </Hidden>
        <Hidden mdDown>
          <HeaderMenu />
        </Hidden>
      </Box>
      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <HeaderUserbox />
        <Hidden lgUp>
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Hidden>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
