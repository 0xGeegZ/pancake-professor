import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone'
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone'
import { Badge, Box, IconButton, ListItem, Popover, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { FC, ReactNode, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarContext } from 'src/client/contexts/SidebarContext'

const IndicatorWrapper = styled(Box)(
  ({ theme }) => `
  position: absolute;
  left: 50%;
  margin-left: -10px;
  top: -${theme.spacing(0.5)};
  width: 20px;
  height: 20px;

  .MuiSvgIcon-root {
    width: 100%;
    height: auto;
  }
`
)

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
        background: transparent !important;
        color: ${theme.colors.alpha.black[70]} !important;
        padding: ${theme.spacing(1, 2)} !important;

        .name-wrapper {
          display: block !important;
        }

        &.Mui-active,
        &:hover {
          background: ${theme.colors.alpha.black[10]} !important;
          color: ${theme.colors.alpha.black[100]} !important;
        }
      }
    }  
  }
`
)

interface NavigationMenuItemProps {
  children?: ReactNode
  link?: string
  icon?: any
  badge?: string
  open?: boolean
  active?: boolean
  name: string
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
  const { t }: { t: any } = useTranslation()
  const { toggleSidebar } = useContext(SidebarContext)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  if (children) {
    return (
      <ListItem component="div" className="Mui-children" key={name} {...rest}>
        <Tooltip title={t(name)} disableInteractive placement="top" arrow>
          <IconButton className={clsx({ 'Mui-active': active })} onClick={handleClick}>
            {Icon && <Icon />}

            <IndicatorWrapper>
              {open ? <KeyboardArrowDownTwoToneIcon /> : <KeyboardArrowUpTwoToneIcon />}
            </IndicatorWrapper>
          </IconButton>
        </Tooltip>
        <PopoverWrapper
          classes={{ root: 'child-popover' }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
          onClick={handleClose}
          open={open}>
          {children}
        </PopoverWrapper>
      </ListItem>
    )
  }

  return (
    <ListItem component="div" key={name} {...rest}>
      <Tooltip title={t(name)} disableInteractive placement="top" arrow>
        <IconButton className={clsx({ 'Mui-active': active })} onClick={toggleSidebar} href={link}>
          {Icon && <Icon />}
          <span className="name-wrapper">{name}</span>
          {badge && <Badge badgeContent={badge} />}
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}

NavigationMenuItem.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  link: PropTypes.string,
  icon: PropTypes.elementType,
  badge: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired,
}

NavigationMenuItem.defaultProps = {
  open: false,
  active: false,
}

export default NavigationMenuItem
