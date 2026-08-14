import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";

import Input from "../components/common/Input";

import { loginSchema } from "../validators/auth.validator";

import { login } from "../features/auth/authThunks";

import {
  selectLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../features/auth/authSelectors";

function LoginPage() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loading = useSelector(selectLoading);

  const error = useSelector(selectAuthError);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));

    if (login.fulfilled.match(result)) {
      toast.success("Login Successful");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Inventory System</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password}
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
