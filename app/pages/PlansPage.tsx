import type { GetServerSideProps } from "next";
import { createPage } from "./types";
import { WooCommerceAPI } from "../api/wooCommerceAPI";
import { Box, Typography } from "@mui/material";
import { Page } from "../components/Page";

export type HomePageProps = {
  title: string;
  plans: any
};


function HomeComponent({ title, plans }: HomePageProps) {
  console.log({ plans });

  return <Page>{plans.map(plan => <Typography key={plan.name}>{plan.name}: ${plan.price}</Typography>)}</Page>;
}

export const indexPage = createPage({
  component: HomeComponent,
  getServerSideProps: async () => {
    const title = "MEYA SUBSCRIPTION";
    const plans = [
      {
        name: "Custom Plan",
        price: 100,
      },
      {
        name: "Curated Plan",
        price: 150,
      }
    ] // get from woocomerce await WooCommerceAPI.get("/plans");

    return {
      props: {
        title,
        plans,
      },
    };
  }
});
