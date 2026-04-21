interface RecentUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function RecentUsersTable({ users }: { users: RecentUser[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="border-b">
        <tr className="text-left text-gray-500">
          <th className="pb-2">Name</th>
          <th className="pb-2">Email</th>
          <th className="pb-2">Role</th>
          <th className="pb-2">Joined</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-b last:border-0">
            <td className="py-2">{u.fullName}</td>
            <td className="py-2">{u.email}</td>
            <td className="py-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{u.role}</span>
            </td>
            <td className="py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}