import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchCurrentUser } from "../features/auth/authThunks";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return children;
}

export default AuthInitializer;
