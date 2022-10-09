import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone'
import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import LocalLibraryTwoToneIcon from '@mui/icons-material/LocalLibraryTwoTone'
import PeopleIcon from '@mui/icons-material/People'
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone'
import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone'
import type { ReactNode } from 'react'

export interface MenuItem {
  link?: string
  icon?: ReactNode
  badge?: string
  items?: MenuItem[]
  name: string
}

export interface MenuItems {
  items: MenuItem[]
  heading: string
}

const menuItems: MenuItems[] = [
  {
    heading: 'Dashboards',
    items: [
      {
        name: 'Dashboard',
        icon: AnalyticsTwoToneIcon,
        link: '/app',
      },
      {
        name: 'Follow Best Players',
        icon: LocalLibraryTwoToneIcon,
        link: '/app/players',
      },
      {
        name: 'Live Analytics',
        // icon: AccountBalanceWalletTwoToneIcon,
        icon: LiveTvIcon,
        link: '/app/live',
      },
      {
        name: 'Auto Player',
        icon: SmartToyTwoToneIcon,
        link: '/app/autoplayer',
        badge: 'Soon',
      },
      {
        name: 'Create Strategie',
        icon: DashboardCustomizeTwoToneIcon,
        link: '/app/automation',
        badge: 'Soon',
      },
      //     {
      //       name: 'Banking',
      //       icon: AccountBalanceTwoToneIcon,
      //       link: '/dashboards/banking',
      //     },
      //     {
      //       name: 'Commerce',
      //       icon: StoreTwoToneIcon,
      //       link: '/dashboards/commerce'
      //     },
      //     {
      //       name: 'Crypto',
      //       icon: AccountBalanceWalletTwoToneIcon,
      //       link: '/dashboards/crypto'
      //     },
      //     {
      //       name: 'Finance',
      //       icon: MonetizationOnTwoToneIcon,
      //       link: '/dashboards/finance'
      //     },
      //     {
      //       name: 'Fitness',
      //       icon: KitchenTwoToneIcon,
      //       link: '/dashboards/fitness'
      //     },
      //     {
      //       name: 'Healthcare',
      //       icon: HealthAndSafetyTwoToneIcon,
      //       link: '/dashboards/healthcare',
      //       items: [
      //         {
      //           name: 'Doctors Page',
      //           badge: 'Hot',
      //           link: '/dashboards/healthcare/doctor'
      //         },
      //         {
      //           name: 'Hospital Overview',
      //           link: '/dashboards/healthcare/hospital'
      //         }
      //       ]
      //     },
      //     {
      //       name: 'Helpdesk',
      //       icon: ContactSupportTwoToneIcon,
      //       link: '/dashboards/helpdesk'
      //     },
      //     {
      //       name: 'Learning',
      //       icon: LocalLibraryTwoToneIcon,
      //       link: '/dashboards/learning'
      //     },
      //     {
      //       name: 'Monitoring',
      //       icon: DnsTwoToneIcon,
      //       link: '/dashboards/monitoring'
      //     },
      //     {
      //       name: 'Tasks',
      //       icon: TaskAltTwoToneIcon,
      //       link: '/dashboards/tasks'
      //     }
      //   ]
      // },
      // {
      //   heading: 'Applications',
      //   items: [
      //     {
      //       name: 'File Manager',
      //       icon: DocumentScannerTwoToneIcon,
      //       link: '/applications/file-manager'
      //     },
      //     {
      //       name: 'Jobs Platform',
      //       icon: WorkTwoToneIcon,
      //       link: '/applications/jobs-platform'
      //     },
      //     {
      //       name: 'Messenger',
      //       icon: QuestionAnswerTwoToneIcon,
      //       link: '/applications/messenger'
      //     },
      //     {
      //       name: 'Projects Board',
      //       icon: DashboardCustomizeTwoToneIcon,
      //       link: '/applications/projects-board'
      //     }
      //   ]
      // },
      // {
      //   heading: 'Management',
      //   items: [
      //     {
      //       name: 'Users',
      //       icon: AssignmentIndTwoToneIcon,
      //       link: '/management/users'
      //     },
      //     {
      //       name: 'Projects',
      //       icon: AccountTreeTwoToneIcon,
      //       link: '/management/projects'
      //     },
      //     {
      //       name: 'Commerce',
      //       icon: StorefrontTwoToneIcon,
      //       link: '/management/commerce',
      //       items: [
      //         {
      //           name: 'Shop',
      //           link: '/management/commerce/shop'
      //         },
      //         {
      //           name: 'Products List',
      //           link: '/management/commerce/products'
      //         },
      //         {
      //           name: 'Create Product',
      //           link: '/management/commerce/products/create'
      //         }
      //       ]
      //     },
      //     {
      //       name: 'Invoices',
      //       icon: ReceiptTwoToneIcon,
      //       link: '/management/invoices'
      //     },
    ],
  },
  // {
  //   heading: 'Extra Pages',
  //   items: [
  //     {
  //       name: 'Auth Pages',
  //       icon: VpnKeyTwoToneIcon,
  //       link: '/auth',
  //       items: [
  //         {
  //           name: 'Login',
  //           items: [
  //             {
  //               name: 'Basic',
  //               link: '/account/login-basic'
  //             },
  //             {
  //               name: 'Cover',
  //               link: '/account/login-cover'
  //             }
  //           ]
  //         },
  //         {
  //           name: 'Register',
  //           items: [
  //             {
  //               name: 'Basic',
  //               link: '/account/register-basic'
  //             },
  //             {
  //               name: 'Cover',
  //               link: '/account/register-cover'
  //             },
  //             {
  //               name: 'Wizard',
  //               link: '/account/register-wizard'
  //             }
  //           ]
  //         },
  //         {
  //           name: 'Recover Password',
  //           link: '/account/recover-password'
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Status',
  //       icon: ErrorTwoToneIcon,
  //       link: '/status',
  //       items: [
  //         {
  //           name: 'Error 404',
  //           link: '/status/404'
  //         },
  //         {
  //           name: 'Error 500',
  //           link: '/status/500'
  //         },
  //         {
  //           name: 'Maintenance',
  //           link: '/status/maintenance'
  //         },
  //         {
  //           name: 'Coming Soon',
  //           link: '/status/coming-soon'
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    heading: 'Admin',
    items: [
      {
        name: 'Users',
        icon: PeopleIcon,
        link: '/admin/users',
      },
      {
        name: 'Documentation',
        icon: SupportTwoToneIcon,
        link: '/admin/docs',
      },
    ],
  },
]

export default menuItems
