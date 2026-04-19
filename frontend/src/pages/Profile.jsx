import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { userAPI } from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    address: {
      line1: user?.address?.line1 || '',
      line2: user?.address?.line2 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
    },
  });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('gender', form.gender);
      formData.append('dob', form.dob);
      formData.append('address', JSON.stringify(form.address));
      if (image) formData.append('image', image);

      const { data } = await userAPI.updateProfile(formData);
      if (data.success) {
        setUser(prev => ({ ...prev, ...data.user }));
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-padding py-10 animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-2">My <span className="gradient-text">Profile</span></h1>
      <p className="text-muted mb-8">Manage your personal information.</p>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 overflow-hidden flex-shrink-0">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              ) : user?.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center gradient-bg text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
              <span className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">Change photo</span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            <Input label="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark/80">Gender</label>
              <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input label="Date of Birth" type="date" value={form.dob} onChange={(e) => handleChange('dob', e.target.value)} />
          </div>

          <div className="border-t border-surface-200 pt-6">
            <h3 className="font-semibold mb-4">Address</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Address Line 1" value={form.address.line1} onChange={(e) => handleAddressChange('line1', e.target.value)} />
              <Input label="Address Line 2" value={form.address.line2} onChange={(e) => handleAddressChange('line2', e.target.value)} />
              <Input label="City" value={form.address.city} onChange={(e) => handleAddressChange('city', e.target.value)} />
              <Input label="State" value={form.address.state} onChange={(e) => handleAddressChange('state', e.target.value)} />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm font-medium animate-scale-in ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-accent-500'}`}>
              {message}
            </div>
          )}

          <Button type="submit" loading={saving} size="lg" className="w-full">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
