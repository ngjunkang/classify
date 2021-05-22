import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import CreateUrqlClient from "../utils/CreateUrqlClient";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import isServer from "../utils/isServer";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery();
  const [{ data: me }] = useMeQuery({
    pause: isServer(),
  });

  let posts = null;
  if (data) {
    posts = data.posts.map(({ title, content, id }) => {
      return <div key={id}>{title + ": " + content}</div>;
    });
  }

  return (
    <Layout variant="regular">
      <div>{`Welcome${
        me?.me ? ", " + me.me.username : ""
      }! Please follow for more updates! Feel free to test the login/register/reset password/forgot password functions`}</div>
      <br />
      {fetching ? "loading" : posts}
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: false })(Index);
