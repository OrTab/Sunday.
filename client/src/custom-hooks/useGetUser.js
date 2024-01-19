import { useCallback, useEffect, useState } from "react";
import { userService } from "../services/userService";

export const useGetUser = (userId) => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    const user = await userService.getUserById(userId);
    setUser(user);
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return user;
};
