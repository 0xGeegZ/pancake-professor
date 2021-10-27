import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { Badge, Button, Collapse, ListItem } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FC, ReactNode, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SidebarContext } from 'src/client/contexts/SidebarContext';

interface SidebarMenuItemProps {
  children?: ReactNode
  link?: string
  icon?: any
  badge?: string
  open?: boolean
  active?: boolean
  name: string
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
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
  const [menuToggle, setMenuToggle] = useState<boolean>(openParent)

  const toggleMenu = (): void => {
    setMenuToggle((Open) => !Open)
  }

  if (children) {
    return (
      <ListItem component="div" className="Mui-children" key={name} {...rest}>
        <Button
          className={clsx({ 'Mui-active': menuToggle })}
          startIcon={Icon && <Icon />}
          endIcon={menuToggle ? <ExpandLessTwoToneIcon /> : <ExpandMoreTwoToneIcon />}
          onClick={toggleMenu}>
          {badge && <Badge badgeContent={badge} />}
          {t(name)}
        </Button>
        <Collapse in={menuToggle}>{children}</Collapse>
      </ListItem>
    )
  }

  return (
    <ListItem component="div" key={name} {...rest}>
      <Button
        className={clsx({ 'Mui-active': active })}
        onClick={toggleSidebar}
        href={link}
        startIcon={Icon && <Icon />}>
        {t(name)}
        {badge && <Badge badgeContent={badge} />}
      </Button>
    </ListItem>
  )
}

SidebarMenuItem.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  link: PropTypes.string,
  icon: PropTypes.elementType,
  badge: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired,
}

SidebarMenuItem.defaultProps = {
  open: false,
  active: false,
}

export default SidebarMenuItem
