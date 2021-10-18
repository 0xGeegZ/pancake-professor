import { useState, useEffect, useCallback } from 'react';
import axios from 'src/client/utils/axios';
import type { ReactElement } from 'react';
import AccentHeaderLayout from "src/client/layouts/AccentHeaderLayout";

import Head from 'next/head';
import PageHeader from 'src/client/components/Management/Commerce/Products/PageHeader';
import Footer from 'src/client/components/Footer';
import PageTitleWrapper from 'src/client/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import useRefMounted from 'src/client/hooks/useRefMounted';
import type { Product } from 'src/client/models/product';

import Results from 'src/client/components/Management/Commerce/Products/Results';

function ManagementProducts() {
  const isMountedRef = useRefMounted();
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get<{ products: Product[] }>(
        '/api/products'
      );

      if (isMountedRef.current) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <>
      <Head>
        <title>Products - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results products={products} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementProducts;

ManagementProducts.getLayout = function getLayout(page: ReactElement) {
  return (
      <AccentHeaderLayout>
          {page}
      </AccentHeaderLayout>
  )
}