import { Box, List } from '@mui/material';
import { useRouter } from 'next/router';
import SidebarMenuItem from './item';
import menuItems, { MenuItem } from './items';
import { styled } from '@mui/material/styles';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    margin-bottom: ${theme.spacing(1)};
    padding: 0;

    & > .MuiList-root {
      padding: 0 ${theme.spacing(2)} ${theme.spacing(2)};
    }
  }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      padding: 0;
      
      .MuiList-root .MuiList-root .MuiListItem-root .MuiIconButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 2px 0;
        justify-content: center;
    
        .MuiIconButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 54px;
          height: 54px;
          justify-content: center;
          font-size: ${theme.typography.pxToRem(13)};
          padding: 0;
          position: relative;

          .name-wrapper {
            display: none;
            transition: ${theme.transitions.create(['color'])};
          }

          .MuiBadge-root {
            position: absolute;
            right: 8px;
            top: 12px;

            .MuiBadge-standard {
              background: ${theme.colors.primary.main};
              font-size: ${theme.typography.pxToRem(9)};
              font-weight: bold;
              text-transform: uppercase;
              color: ${theme.palette.primary.contrastText};
            }
          }
  
          .MuiSvgIcon-root {
            transition: ${theme.transitions.create(['color'])};
            font-size: ${theme.typography.pxToRem(28)};
            color: ${theme.sidebar.menuItemIconColor};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.sidebar.menuItemBgActive};
            color: ${theme.sidebar.menuItemColorActive};

            .MuiSvgIcon-root {
                color: ${theme.sidebar.menuItemIconColorActive};
            }
          }
        }
      }
    }
`
);

const renderSidebarMenuItems = ({
  items,
  path
}: {
  items: MenuItem[];
  path: string;
}): JSX.Element => (
  <SubMenuWrapper>
    <List component="div">
      {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}
    </List>
  </SubMenuWrapper>
);

const reduceChildRoutes = ({
  ev,
  path,
  item
}: {
  ev: JSX.Element[];
  path: string;
  item: MenuItem;
}): Array<JSX.Element> => {
  const key = item.name;
  const router = useRouter();

  if (item.items) {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={router.pathname === item.link}
        open={router.pathname === item.link}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}
      >
        {renderSidebarMenuItems({
          path,
          items: item.items
        })}
      </SidebarMenuItem>
    );
  } else {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={router.pathname === item.link}
        name={item.name}
        link={item.link}
        badge={item.badge}
        icon={item.icon}
      />
    );
  }

  return ev;
}

function SidebarMenu() {
  const router = useRouter();

  return (
    <>
      {menuItems.map((section) => (
        <MenuWrapper key={section.heading}>
          <List component="div">
            {renderSidebarMenuItems({
              items: section.items,
              path: router.pathname
            })}
          </List>
        </MenuWrapper>
      ))}
    </>
  );
}

export default SidebarMenu;
