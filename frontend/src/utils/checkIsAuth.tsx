import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

const checkIsAuth = () => {
  const [{ fetching, data }] = useMeQuery();
  const router: NextRouter = useRouter();

  useEffect(() => {
    //check for authentication
    if (!fetching && data?.me) {
      let route: string;
      if (typeof router.query?.next === "string") {
        route = router.query.next;
      } else {
        route = "/";
      }
      router.replace(route);
    }
  }, [fetching, data, router]);
};

export default checkIsAuth;
