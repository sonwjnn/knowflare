import { useSession } from "@hono/auth-js/react";

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};
