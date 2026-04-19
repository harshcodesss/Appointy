import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/axios';
import Card from '../../components/ui/Card';
import { TableSkeleton } from '../../components/ui/Skeleton';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers({ limit: 100 }).then(({ data }) => {
      if (data.success) setUsers(data.users);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Users</h1>
        <p className="text-muted text-sm">All registered patients on the platform.</p>
      </div>

      <Card>
        {loading ? <TableSkeleton rows={6} cols={4} /> : users.length === 0 ? (
          <p className="text-muted text-center py-12">No users registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-2 text-muted font-medium">User</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Phone</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-surface-100 hover:bg-surface-100/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover" /> : (
                            <span className="text-primary-500 font-bold text-sm">{u.name?.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted">{u.email}</td>
                    <td className="py-3 px-2 text-muted">{u.phone || '—'}</td>
                    <td className="py-3 px-2 text-muted">{new Date(u.createdAt).toLocaleDateString('en', { month:'short', day:'numeric', year:'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
