import type { GetServerSideProps } from "next";
import { createPage } from "./types";
import { WooCommerceAPI } from "../api/wooCommerceAPI";
import { Box } from "@mui/material";

export type HomePageProps = {
  title: string;
  plans: any
};


function HomeComponent({ title, plans }: HomePageProps) {
  console.log({ plans });

  return <Box>{plans.map(plan => <>{plan.name}: ${plan.price}</>)}</Box>;
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
