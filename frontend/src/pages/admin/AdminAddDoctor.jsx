import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SPECIALIZATIONS = [
  'General Physician','Gynecologist','Dermatologist','Pediatrician','Neurologist',
  'Gastroenterologist','Cardiologist','Orthopedic','ENT Specialist','Urologist',
  'Psychiatrist','Oncologist','Ophthalmologist','Dentist',
];

export default function AdminAddDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', specialization:'', degree:'', experience:'', about:'', fees:'', address:{ line1:'', city:'', state:'' }});
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v);
      });
      if (image) fd.append('image', image);
      const { data } = await adminAPI.addDoctor(fd);
      if (data.success) navigate('/admin/doctors');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-extrabold text-dark mb-1">Add Doctor</h1>
      <p className="text-muted text-sm mb-6">Register a new doctor to the platform.</p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 rounded-xl bg-red-50 text-accent-500 text-sm font-medium">{error}</div>}

          {/* Image */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {image ? <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" /> : (
                <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </div>
            <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} /><span className="text-sm font-medium text-primary-500">Upload photo</span></label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark/80">Specialization</label>
              <select value={form.specialization} onChange={(e) => handleChange('specialization', e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
                <option value="">Select</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Degree" value={form.degree} onChange={(e) => handleChange('degree', e.target.value)} required placeholder="MBBS, MD" />
            <Input label="Experience (years)" type="number" value={form.experience} onChange={(e) => handleChange('experience', e.target.value)} required />
            <Input label="Fees (₹)" type="number" value={form.fees} onChange={(e) => handleChange('fees', e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark/80">About</label>
            <textarea value={form.about} onChange={(e) => handleChange('about', e.target.value)} required rows={3} placeholder="Brief description about the doctor..." className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none" />
          </div>

          <Button type="submit" loading={saving} className="w-full" size="lg">Add Doctor</Button>
        </form>
      </Card>
    </div>
  );
}
