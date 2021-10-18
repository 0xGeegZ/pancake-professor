import { Container, Typography, Grid } from '@mui/material';
import type { ReactElement } from 'react';
import DocsLayout from "src/client/layouts/DocsLayout";
import Head from 'next/head';
import PageHeader from 'src/client/components/PageHeaderDocs';
import { Prism } from 'react-syntax-highlighter';
import a11yDark from 'react-syntax-highlighter/dist/cjs/styles/prism/a11y-dark';

function Routing() {
  const routingExample = `├── account
  │   ├── login-basic
  │   │   └── index.tsx
  │   ├── login-cover
  │   │   └── index.tsx
  │   ├── recover-password
  │   │   └── index.tsx
  │   ├── register-basic
  │   │   └── index.tsx
  │   ├── register-cover
  │   │   └── index.tsx
  │   └── register-wizard
  │       └── index.tsx
  ├── applications
  │   ├── file-manager
  │   │   └── index.tsx
  │   ├── jobs-platform
  │   │   └── index.tsx
  │   ├── messenger
  │   │   └── index.tsx
  │   └── projects-board
  │       └── index.tsx
  ├── dashboards
  │   ├── analytics
  │   │   └── index.tsx
  │   ├── automation
  │   │   └── index.tsx
  │   ├── banking
  │   │   └── index.tsx
  │   ├── commerce
  │   │   └── index.tsx
  │   ├── crypto
  │   │   └── index.tsx
  │   ├── finance
  │   │   └── index.tsx
  │   ├── fitness
  │   │   └── index.tsx
  │   ├── healthcare
  │   │   ├── doctor
  │   │   │   └── index.tsx
  │   │   └── hospital
  │   │       └── index.tsx
  │   ├── helpdesk
  │   │   └── index.tsx
  │   ├── learning
  │   │   └── index.tsx
  │   ├── monitoring
  │   │   └── index.tsx
  │   └── tasks
  │       └── index.tsx
  ├── docs
  │   ├── changelog
  │   │   └── index.tsx
  │   ├── contact-support
  │   │   └── index.tsx
  │   ├── dependencies
  │   │   └── index.tsx
  │   ├── installation
  │   │   └── index.tsx
  │   ├── internationalization
  │   │   └── index.tsx
  │   ├── routing
  │   │   └── index.tsx
  │   ├── rtl-layout
  │   │   └── index.tsx
  │   ├── server-requests
  │   │   └── index.tsx
  │   ├── themes-customization
  │   │   └── index.tsx
  │   └── index.tsx
  ├── management
  │   ├── commerce
  │   │   ├── products
  │   │   │   ├── create
  │   │   │   │   └── index.tsx
  │   │   │   ├── [productId].tsx
  │   │   │   └── index.tsx
  │   │   └── shop
  │   │       └── index.tsx
  │   ├── invoices
  │   │   ├── [invoiceId].tsx
  │   │   └── index.tsx
  │   ├── projects
  │   │   └── index.tsx
  │   └── users
  │       ├── [userId].tsx
  │       └── index.tsx
  ├── status
  │   ├── 404
  │   │   └── index.tsx
  │   ├── 500
  │   │   └── index.tsx
  │   ├── coming-soon
  │   │   └── index.tsx
  │   └── maintenance
  │       └── index.tsx
  ├── _app.tsx
  ├── _document.tsx
  ├── 404.tsx
  └── index.tsx`;
  const sidebarExample = `import type { ReactNode } from 'react';

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
      heading: 'Layout Blueprints',
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
      ]
    },
    {
      heading: 'Dashboards',
      items: [
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
          link: '/dashboards/learning'
        },
        {
          name: 'Monitoring',
          icon: DnsTwoToneIcon,
          link: '/dashboards/monitoring'
        },
        {
          name: 'Tasks',
          icon: TaskAltTwoToneIcon,
          link: '/dashboards/tasks'
        }
      ]
    },
    {
      heading: 'Management',
      items: [
        {
          name: 'Users',
          icon: AssignmentIndTwoToneIcon,
          link: '/management/users'
        },
        {
          name: 'Projects',
          icon: AccountTreeTwoToneIcon,
          link: '/management/projects'
        },
        {
          name: 'Commerce',
          icon: StorefrontTwoToneIcon,
          link: '/management/commerce',
          items: [
            {
              name: 'Shop',
              link: '/management/commerce/shop'
            },
            {
              name: 'Products List',
              link: '/management/commerce/products'
            },
            {
              name: 'Create Product',
              link: '/management/commerce/products/create'
            }
          ]
        },
        {
          name: 'Invoices',
          icon: ReceiptTwoToneIcon,
          link: '/management/invoices'
        },
      ]
    },
    {
      heading: 'Foundation',
      items: [
        {
          name: 'Overview',
          link: '/',
          icon: DesignServicesTwoToneIcon
        },
        {
          name: 'Documentation',
          icon: SupportTwoToneIcon,
          link: '/docs'
        }
      ]
    }
  ];
  
  export default menuItems;
  `;

  return (
    <>
      <Head>
        <title>Routing - Tokyo NextJS Admin Dashboard</title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PageHeader heading="Routing" subheading=""></PageHeader>
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>
              In Next.js, a page is a React Component exported from a .js, .jsx, .ts, or .tsx file in the pages directory. Each page is associated with a route based on its file name.
            </Typography>
            <Typography paragraph>
              Example: If you create <code>pages/about.js</code> that exports a React component like below, it will be accessible at <code>/about</code>.
            </Typography>
            <Typography paragraph>
              Any route like /post/1, /post/abc, etc. will be matched by <code>pages/post/[pid].js</code>. The matched path parameter will be sent as a query parameter to the page, and it will be merged with the other query parameters.
            </Typography>
            <Typography paragraph>
              The example below is a sample from the <code>/pages</code> folder.
            </Typography>
            <Prism
              showLineNumbers
              wrapLines
              language="javascript"
              style={a11yDark}
            >
              {routingExample}
            </Prism>
            <br />
            <Typography variant="h2" sx={{ mb: 2 }}>
              Sidebar Navigation
            </Typography>
            <Typography paragraph>
              To modify the current sidebar navigation, edit the following file{' '}
              <code>
                src\layouts\AccentHeaderLayout\Sidebar\SidebarMenu\items.ts
              </code>
              . It contains an items array used for building the sidebar menu
              tree. The 'link' parameter represents the page URL defined based on the {' '}
              <code>/pages</code> folder structure.
            </Typography>
            <Prism
              showLineNumbers
              wrapLines
              language="javascript"
              style={a11yDark}
            >
              {sidebarExample}
            </Prism>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Routing;

Routing.getLayout = function getLayout(page: ReactElement) {
  return (
    <DocsLayout>
      {page}
    </DocsLayout>
  )
}