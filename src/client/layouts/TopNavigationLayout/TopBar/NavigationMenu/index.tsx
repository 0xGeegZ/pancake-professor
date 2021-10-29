import { Box, List } from '@mui/material'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { v4 as uuidv4 } from 'uuid'
import NavigationMenuItem from './item'
import menuItems, { MenuItem } from './items'

const MenuWrapper = styled(Box)(
  () => `
  .MuiList-root {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    & > .MuiList-root {
      display: flex;
      flex-direction: row;
      width: 100%;
      flex-wrap: wrap;
    }
  }
`
)

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      padding: 0;
      display: flex;
      flex-direction: row;
      
      .MuiList-root .MuiList-root .MuiListItem-root .MuiIconButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 0 2px;
        justify-content: center;
        width: auto;
    
        .MuiIconButton-root {
          display: flex;
          background-color: transparent;
          border-radius: ${theme.general.borderRadiusLg};
          justify-content: center;
          font-size: ${theme.typography.pxToRem(13)};
          padding: ${theme.spacing(1.5, 3)};
          position: relative;
          font-weight: bold;
          color: ${theme.colors.alpha.trueWhite[100]};

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
            font-size: ${theme.typography.pxToRem(24)};
            margin-right: ${theme.spacing(1)};
            color: ${theme.colors.alpha.trueWhite[50]};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.colors.alpha.white[10]};

            .MuiSvgIcon-root {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }
      }
    }
`
)

const renderNavigationMenuItems = ({ items, path }: { items: MenuItem[]; path: string }): JSX.Element => (
  <SubMenuWrapper>
    <List component="div">{items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}</List>
  </SubMenuWrapper>
)

const reduceChildRoutes = ({
  ev,
  path,
  item,
}: {
  ev: JSX.Element[]
  path: string
  item: MenuItem
}): Array<JSX.Element> => {
  const key = uuidv4()
  const router = useRouter()

  if (item.items) {
    ev.push(
      <NavigationMenuItem
        key={key}
        active={router.pathname === item.link}
        open={router.pathname === item.link}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}>
        {renderNavigationMenuItems({
          path,
          items: item.items,
        })}
      </NavigationMenuItem>
    )
  } else {
    ev.push(
      <NavigationMenuItem
        key={key}
        active={router.pathname === item.link}
        name={item.name}
        link={item.link}
        badge={item.badge}
        icon={item.icon}
      />
    )
  }

  return ev
}

function NavigationMenu() {
  const router = useRouter()

  return (
    <>
      {menuItems.map((section) => (
        <MenuWrapper key={uuidv4()}>
          <List component="div">
            {renderNavigationMenuItems({
              items: section.items,
              path: router.pathname,
            })}
          </List>
        </MenuWrapper>
      ))}
    </>
  )
}

export default NavigationMenu
