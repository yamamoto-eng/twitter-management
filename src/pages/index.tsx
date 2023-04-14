import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

const Index = (props: any) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{props.test.name}</p>
      {process.env.NODE_ENV === "development" && <p>development</p>}
      {process.env.NODE_ENV === "production" && <p>production</p>}
      {process.env.NODE_ENV === "test" && <p>test</p>}
      <br />
      {process.env.NODE_ENV}
    </div>
  );
};

export default Index;

export async function getStaticProps(context: GetServerSidePropsContext) {
  const res = await fetch("https://main.d250u0sat172u3.amplifyapp.com/api/hello");
  const test = await res.json();

  return { props: { test } };
}
