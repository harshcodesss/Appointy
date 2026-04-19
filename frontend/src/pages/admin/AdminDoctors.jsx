import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI, adminAPI } from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await doctorAPI.getAll({ limit: 100 });
      if (data.success) setDoctors(data.doctors);
    } catch { /* handled */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const toggleAvailability = async (docId) => {
    try {
      await adminAPI.changeAvailability(docId);
      setDoctors(prev => prev.map(d => d._id === docId ? { ...d, available: !d.available } : d));
    } catch { /* handled */ }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteDoctor(deleteId);
      setDoctors(prev => prev.filter(d => d._id !== deleteId));
      setDeleteId(null);
    } catch { /* handled */ }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Doctors</h1>
          <p className="text-muted text-sm">Manage all registered doctors.</p>
        </div>
        <Link to="/admin/add-doctor"><Button>+ Add Doctor</Button></Link>
      </div>

      <Card>
        {loading ? <TableSkeleton rows={5} cols={5} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-2 text-muted font-medium">Doctor</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Specialization</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Fees</th>
                  <th className="text-left py-3 px-2 text-muted font-medium">Status</th>
                  <th className="text-right py-3 px-2 text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id} className="border-b border-surface-100 hover:bg-surface-100/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 overflow-hidden flex-shrink-0">
                          {doc.image ? <img src={doc.image} alt="" className="w-full h-full object-cover" /> : (
                            <div className="w-full h-full flex items-center justify-center text-primary-500 font-bold">{doc.name?.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark">{doc.name}</p>
                          <p className="text-xs text-muted">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted">{doc.specialization || doc.speciality}</td>
                    <td className="py-3 px-2 font-medium">₹{doc.fees}</td>
                    <td className="py-3 px-2">
                      <button onClick={() => toggleAvailability(doc._id)}>
                        <Badge variant={doc.available ? 'success' : 'danger'}>
                          {doc.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(doc._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Doctor">
        <p className="text-muted text-sm mb-6">This will permanently delete the doctor and cancel all their pending appointments.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
