import type { ReactNode } from 'react';

import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import KitchenTwoToneIcon from '@mui/icons-material/KitchenTwoTone';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';

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
        name: 'Analytics',
        icon: AnalyticsTwoToneIcon,
        link: '/dashboards/analytics',
      },
      {
        name: 'Finance',
        icon: MonetizationOnTwoToneIcon,
        link: '/dashboards/finance',
      },
      {
        name: 'Fitness',
        icon: KitchenTwoToneIcon,
        link: '/dashboards/fitness',
      },
      {
        name: 'Healthcare',
        icon: HealthAndSafetyTwoToneIcon,
        link: '/dashboards/healthcare',
        items: [
          {
            name: 'Doctors Page',
            badge: 'Hot',
            link: '/dashboards/healthcare/doctor',
          },
          {
            name: 'Hospital Overview',
            link: '/dashboards/healthcare/hospital',
          },
        ],
      },
      {
        name: 'Banking',
        icon: AccountBalanceTwoToneIcon,
        link: '/dashboards/banking',
      },
      {
        name: 'Learning',
        icon: SchoolTwoToneIcon,
        link: '/dashboards/learning',
      },
      {
        name: '',
        icon: MenuTwoToneIcon,
        link: '',
        items: [
          {
            name: 'Monitoring',
            link: '/dashboards/monitoring',
          },
          {
            name: 'Tasks',
            link: '/dashboards/tasks',
          },
          {
            name: 'Commerce',
            link: '/dashboards/commerce',
          },
          {
            name: 'Crypto',
            link: '/dashboards/crypto',
          },
        ],
      },
      {
        name: '',
        icon: BackupTableTwoToneIcon,
        link: '',
        items: [
          {
            name: 'Accent header',
            link: '/dashboards/analytics',
          },
          {
            name: 'Accent sidebar',
            link: '/dashboards/banking',
          },
          {
            name: 'Boxed sidebar',
            link: '/dashboards/monitoring',
          },
          {
            name: 'Collapsed sidebar',
            link: '/dashboards/helpdesk',
          },
          {
            name: 'Bottom navigation',
            link: '/dashboards/automation',
          },
          {
            name: 'Top navigation',
            link: '/dashboards/finance',
          },
        ],
      },
    ],
  },
];

export default menuItems;
