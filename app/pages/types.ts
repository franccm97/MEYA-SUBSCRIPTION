import type { GetServerSideProps, GetServerSidePropsResult } from "next";
import type { ComponentType } from "react";

export type PageComponent<Props> = ComponentType<Props>;

export type PageDefinition<Props> = {
  component: PageComponent<Props>;
  getServerSideProps: GetServerSideProps<Props>;
};

export function createPage<Props>(
  definition: PageDefinition<Props>
): PageDefinition<Props> {
  return definition;
}

export type InferPageProps<Page extends PageDefinition<any>> = Page extends PageDefinition<
  infer Props
>
  ? Props
  : never;

export type InferGetServerSidePropsResult<Page extends PageDefinition<any>> = GetServerSidePropsResult<
  InferPageProps<Page>
>;
