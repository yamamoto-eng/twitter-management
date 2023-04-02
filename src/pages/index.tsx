import { GetServerSidePropsContext } from "next";

const Index = (props: any) => {
  return <>top {props.test}</>;
};

export default Index;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: { test: ctx.resolvedUrl },
  };
};
