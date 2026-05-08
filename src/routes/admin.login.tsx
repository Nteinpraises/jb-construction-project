import { createFileRoute, redirect } from "@tanstack/react-router";

// Old public login URL — redirect away to obscure the admin entry point
export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
