import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone';
import { Badge, Box, darken, IconButton, ListItem, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FC, ReactNode, useContext, useState } from 'react';
import { SidebarContext } from 'src/client/contexts/SidebarContext';


const IndicatorWrapper = styled(Box)(
  () => `
  width: 20px;
  height: 20px;

  .MuiSvgIcon-root {
    width: 100%;
    height: auto;
  }
`
);

const PopoverWrapper = styled(Popover)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(2)} !important;

    .MuiListItem-root {
      padding: 2px 0 !important;

      .MuiIconButton-root {
        width: 100% !important;
        height: auto !important;
        justify-content: flex-start !important;
        font-weight: bold !important;
        padding: ${theme.spacing(1, 2)} !important;

        .name-wrapper {
          color: ${darken(theme.sidebar.menuItemColor, .3)} !important;
        }

        &.Mui-active,
        &:hover {
          .name-wrapper {
            color: ${theme.palette.primary.main} !important;
          }
        }
      }
    }  
  }
`
);

interface NavigationMenuItemProps {
  children?: ReactNode;
  link?: string;
  icon?: any;
  badge?: string;
  open?: boolean;
  active?: boolean;
  name: string;
}

const NavigationMenuItem: FC<NavigationMenuItemProps> = ({
  children,
  link,
  icon: Icon,
  badge,
  open: openParent,
  active,
  name,
  ...rest
}) => {
  const { toggleSidebar } = useContext(SidebarContext);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (children) {
    return (
      <ListItem component="div" className="Mui-children" key={name} {...rest}>
        <IconButton
          className={clsx({ 'Mui-active': open })}
          onClick={handleClick}
        >
          {Icon && <Icon />}
          <span className="name-wrapper">
            {name}
          </span>
          <IndicatorWrapper>
            {open ? <KeyboardArrowUpTwoToneIcon /> : <KeyboardArrowDownTwoToneIcon />}
          </IndicatorWrapper>
          {badge && <Badge badgeContent={badge} />}

        </IconButton>
        <PopoverWrapper
          classes={{ root: 'child-popover' }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
          onClick={handleClose}
          open={open}>{children}</PopoverWrapper>
      </ListItem>
    );
  }

  return (
    <ListItem component="div" key={name} {...rest}>
      <IconButton
        className={clsx({ 'Mui-active': active })}
        onClick={toggleSidebar}
        href={link}
      >
        {Icon && <Icon />}
        <span className="name-wrapper">
          {name}
        </span>
        {badge && <Badge badgeContent={badge} />}
      </IconButton>
    </ListItem>
  );
};

NavigationMenuItem.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  link: PropTypes.string,
  icon: PropTypes.elementType,
  badge: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired
};

NavigationMenuItem.defaultProps = {
  open: false,
  active: false,
};

export default NavigationMenuItem;
