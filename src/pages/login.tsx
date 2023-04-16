import { NextPage } from "next";

const Login: NextPage = () => {
  return (
    <div>
      {/* TODO: APIで呼び出したい */}
      <form action="/api/login" method="post">
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
