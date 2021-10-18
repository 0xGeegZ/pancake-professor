import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { alpha, Box, Card, Hidden, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { SidebarContext } from 'src/client/contexts/SidebarContext';

import HeaderButtons from './Buttons';
import Logo from './Logo';
import HeaderSearch from './Search';
import HeaderUserbox from './Userbox';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    height: ${theme.header.height};
    color: ${theme.header.textColor};
    padding: ${theme.spacing(0, 2)};
    right: 0;
    z-index: 6;
    background-color: ${theme.colors.primary.main};
    position: fixed;
    justify-content: space-between;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 0;
`
);

const IconButtonPrimary = styled(IconButton)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
    color: ${theme.colors.alpha.trueWhite[70]};
    padding: 0;
    width: 42px;
    height: 42px;
    border-radius: 100%;
    margin-left: ${theme.spacing(2)};

    &.active,
    &:active,
    &:hover {
      background: ${alpha(theme.colors.alpha.trueWhite[30], 0.2)};
      color: ${theme.colors.alpha.trueWhite[100]};
    }
`
);

const BoxLogoWrapper = styled(Box)(
  ({ theme }) => `
  margin-right: ${theme.spacing(2)};

  @media (min-width: ${theme.breakpoints.values.lg}px) {
    width: calc(${theme.sidebar.width} - ${theme.spacing(4)});
  }
    
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper>
      <Box display="flex" alignItems="center">
        <BoxLogoWrapper>
          <Logo />
        </BoxLogoWrapper>
        <Hidden smDown>
          <HeaderSearch />
        </Hidden>
      </Box>
      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <HeaderUserbox />
        <Hidden lgUp>
          <Tooltip arrow title="Toggle Menu">
            <IconButtonPrimary color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButtonPrimary>
          </Tooltip>
        </Hidden>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
