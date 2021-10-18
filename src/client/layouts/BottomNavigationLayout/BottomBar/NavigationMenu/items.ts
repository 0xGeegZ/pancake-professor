import type { ReactNode } from 'react';

import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import KitchenTwoToneIcon from '@mui/icons-material/KitchenTwoTone';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';
import LocalLibraryTwoToneIcon from '@mui/icons-material/LocalLibraryTwoTone';
import DnsTwoToneIcon from '@mui/icons-material/DnsTwoTone';
import TaskAltTwoToneIcon from '@mui/icons-material/TaskAltTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',
    items: [
      {
        name: 'Choose layout',
        icon: BackupTableTwoToneIcon,
        badge: 'New',
        link: '',
        items: [
          {
            name: 'Accent header',
            link: '/dashboards/analytics'
          },
          {
            name: 'Accent sidebar',
            link: '/dashboards/banking'
          },
          {
            name: 'Boxed sidebar',
            link: '/dashboards/monitoring'
          },
          {
            name: 'Collapsed sidebar',
            link: '/dashboards/helpdesk'
          },
          {
            name: 'Bottom navigation',
            link: '/dashboards/automation'
          },
          {
            name: 'Top navigation',
            link: '/dashboards/finance'
          }
        ]
      },
      {
        name: 'Automation',
        icon: SmartToyTwoToneIcon,
        link: '/dashboards/automation',
        badge: 'Hot'
      },
      {
        name: 'Analytics',
        icon: AnalyticsTwoToneIcon,
        link: '/dashboards/analytics'
      },
      {
        name: 'Banking',
        icon: AccountBalanceTwoToneIcon,
        link: '/dashboards/banking',
      },
      {
        name: 'Commerce',
        icon: StoreTwoToneIcon,
        link: '/dashboards/commerce'
      },
      {
        name: 'Crypto',
        icon: AccountBalanceWalletTwoToneIcon,
        link: '/dashboards/crypto'
      },
      {
        name: 'Finance',
        icon: MonetizationOnTwoToneIcon,
        link: '/dashboards/finance'
      },
      {
        name: 'Fitness',
        icon: KitchenTwoToneIcon,
        link: '/dashboards/fitness'
      },
      {
        name: 'Healthcare',
        icon: HealthAndSafetyTwoToneIcon,
        link: '/dashboards/healthcare',
        items: [
          {
            name: 'Doctors Page',
            badge: 'Hot',
            link: '/dashboards/healthcare/doctor'
          },
          {
            name: 'Hospital Overview',
            link: '/dashboards/healthcare/hospital'
          }
        ]
      },
      {
        name: 'Helpdesk',
        icon: ContactSupportTwoToneIcon,
        link: '/dashboards/helpdesk'
      },
      {
        name: 'Learning',
        icon: LocalLibraryTwoToneIcon,
        link: 'learning'
      },
      {
        name: 'Monitoring',
        icon: DnsTwoToneIcon,
        link: 'monitoring'
      },
      {
        name: 'Tasks',
        icon: TaskAltTwoToneIcon,
        link: 'tasks'
      }
    ]
  },
];

export default menuItems;
