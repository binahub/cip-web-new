import UserList from "@/components/users/UserList";

export const metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>
      <UserList />
    </div>
  );
}
