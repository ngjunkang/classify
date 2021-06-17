import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

const checkIsNotAuth = () => {
  const [{ fetching, data }] = useMeQuery();
  const router: NextRouter = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};

export default checkIsNotAuth;
