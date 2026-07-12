"use client";

import { useUsers } from "@/services/users/users.queries";
import { useDeleteUser } from "@/services/users/users.mutations";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function UserList() {
  const { data: users, isPending, error } = useUsers();
  const deleteUser = useDeleteUser();

  if (isPending) return <Spinner className="py-12" />;
  if (error) return <p className="py-12 text-center text-danger">Failed to load users.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <Card key={user.id}>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-text-muted">{user.email}</p>
          <span className="mt-2 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
            {user.role}
          </span>
          <div className="mt-4">
            <Button
              variant="danger"
              className="text-xs"
              isLoading={deleteUser.isPending}
              onClick={() => deleteUser.mutate(user.id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
