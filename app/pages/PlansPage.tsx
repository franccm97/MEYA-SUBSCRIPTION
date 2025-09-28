import type { GetServerSideProps } from "next";
import { createPage } from "./types";

export type HomePageProps = {
  title: string;
};

const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const title = "MEYA SUBSCRIPTION";

  return {
    props: {
      title,
    },
  };
};

function HomeComponent({ title }: HomePageProps) {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}

export const indexPage = createPage({
  component: HomeComponent,
  getServerSideProps,
});
