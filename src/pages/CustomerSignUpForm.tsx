import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Props {
    setRole: (role: null) => void;
}

const CustomerSignUpForm: React.FC<Props> = ({ setRole }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    verifyPassword: '',
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validatePassword = (password: string) => {
    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    const symbolCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    return letterCount >= 4 && numberCount >= 2 && symbolCount >= 1;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.verifyPassword) {
      toast({ title: "Error", description: "Password dan verifikasi password tidak cocok.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
        toast({ title: "Error", description: "Password harus memiliki minimal 4 huruf, 2 angka, dan 1 simbol.", variant: "destructive" });
        setLoading(false);
        return;
    }

    if (!formData.termsAccepted) {
        toast({ title: "Error", description: "Anda harus menyetujui Syarat & Ketentuan.", variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'customer',
            name: formData.name,
            username: formData.username,
            phone: formData.phone,
            terms_accepted: formData.termsAccepted,
          }
        }
      });

      if (error) {
        throw error;
      }

      // 1. Sign up sudah sukses
      // 2. Langsung login otomatis
      try {
        await login({ email: formData.email, password: formData.password });
        toast({
          title: "Pendaftaran Berhasil",
          description: "(Prototype) Data Anda langsung masuk ke database, tidak perlu verifikasi email.",
        });
        // Tidak perlu navigasi manual, Index.tsx akan render dashboard
      } catch (loginError: any) {
        toast({
          title: "Login Otomatis Gagal",
          description: loginError.message || "Gagal login setelah daftar. Coba login manual.",
          variant: "destructive",
        });
      }
      
    } catch (error: any) {
      toast({ title: "Error Pendaftaran", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Daftar sebagai Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          <p className="text-xs text-gray-500 mt-1">Minimal 4 huruf, 2 angka, 1 simbol.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Verifikasi Password</label>
          <input type="password" name="verifyPassword" value={formData.verifyPassword} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="flex items-center pt-2">
          <input id="terms" name="termsAccepted" type="checkbox" checked={formData.termsAccepted} onChange={handleChange} required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">Saya menyetujui Syarat & Ketentuan.</label>
        </div>
        <div className="flex pt-4 space-x-4">
            <button type="button" onClick={() => setRole(null)} disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                Batal
            </button>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerSignUpForm;
