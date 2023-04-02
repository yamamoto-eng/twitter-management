import { GetServerSidePropsContext } from "next";

const Index = (props: any) => {
  return <>top {props.test}</>;
};

export default Index;

export async function getStaticProps(context: GetServerSidePropsContext) {
  return {
    props: { test: "test" },
  };
}
