import { Container, Grid, Typography } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { Prism } from 'react-syntax-highlighter'
import a11yDark from 'react-syntax-highlighter/dist/cjs/styles/prism/a11y-dark'
import PageHeader from 'src/client/components/PageHeaderDocs'
import DocsLayout from 'src/client/layouts/DocsLayout'

function Internationalization() {
  const intDir = `📦i18n
  ┣ 📂translations
  ┃ ┣ 📜ae.ts
  ┃ ┣ 📜de.ts
  ┃ ┣ 📜en.ts
  ┃ ┣ 📜es.ts
  ┃ ┣ 📜fr.ts
  ┃ ┗ 📜zh.ts
  ┗ 📜i18n.ts`

  const translateExample = `import { useTranslation } from 'react-i18next';

function Logo() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      {t('Text that will be translated here')}
    </>
  )};
    
export default Logo;`

  return (
    <>
      <Head>
        <title>Internationalization - Pancake Professor</title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PageHeader heading="Internationalization" subheading="" />
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>
              We know supporting multiple languages is important for a lot of projects. That's why we implemented all
              texts to support translations. We are using <code>react-i18next@8.9.0</code> to do exactly that.
            </Typography>
            <Typography paragraph>
              As an example, we translated all the sidebar texts for all languages and a few other common terms used
              through out the application.
            </Typography>
            <Typography paragraph>
              By default there are 6 languages supported, but you could add more by creating another .ts translation
              file and importing it in <code>src\i18n\i18n.ts</code>
            </Typography>
            <Prism showLineNumbers wrapLines language="javascript" style={a11yDark}>
              {intDir}
            </Prism>
            <br />
            <Typography variant="h2" sx={{ mb: 2 }}>
              Example Implementation
            </Typography>
            <Typography paragraph>Use the example below to implement a translated text:</Typography>
            <Prism showLineNumbers wrapLines language="javascript" style={a11yDark}>
              {translateExample}
            </Prism>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Internationalization

Internationalization.getLayout = function getLayout(page: ReactElement) {
  return <DocsLayout>{page}</DocsLayout>
}
