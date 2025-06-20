import { UsersTable } from "@/components/UsersTable";
import { useGetUsersQuery } from "@/lib/redux/services/users.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/neighbours")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetUsersQuery();

  return (
    <div>
      {" "}
      <UsersTable
        data={data}
        isError={isError}
        error={error}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />{" "}
    </div>
  );
}
