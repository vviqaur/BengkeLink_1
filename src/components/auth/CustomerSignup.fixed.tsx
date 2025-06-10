import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, User, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/storage';

interface CustomerSignupProps {
  onBack: () => void;
}

const CustomerSignup = ({ onBack }: CustomerSignupProps) => {
  const [formData, setFormData] = useState({
    profilePhoto: null as File | null,
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form');

  const { signup } = useAuth();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeProfilePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Format file tidak didukung",
        description: "Hanya file JPG, JPEG, atau PNG yang diizinkan",
        variant: "destructive",
      });
      return;
    }

    // Validasi ukuran file (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Ukuran file terlalu besar",
        description: "Maksimal ukuran file 2MB",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({ ...prev, profilePhoto: file }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nama lengkap harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.username.trim()) {
      toast({
        title: "Username harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast({
        title: "Username tidak valid",
        description: "Hanya boleh berisi huruf, angka, dan underscore (_)",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email) {
      toast({
        title: "Email harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Format email tidak valid",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone) {
      toast({
        title: "Nomor telepon harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!/^[0-9+\-\s()]*$/.test(formData.phone)) {
      toast({
        title: "Format nomor telepon tidak valid",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password) {
      toast({
        title: "Password harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password terlalu pendek",
        description: "Minimal 8 karakter",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Konfirmasi password tidak cocok",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.termsAccepted) {
      toast({
        title: "Anda harus menyetujui syarat dan ketentuan",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let profilePictureUrl = '';
      
      // Upload foto profil jika ada
      if (formData.profilePhoto) {
        profilePictureUrl = await uploadFile(
          `profile_photos/${Date.now()}_${formData.profilePhoto.name}`,
          formData.profilePhoto
        );
      }

      // Daftar pengguna
      await signup({
        role: 'customer',
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: true,
        // profile_picture akan dihandle oleh trigger di database
      });

      setStep('verification');
    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        title: "Gagal mendaftar",
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render form based on step
  if (step === 'verification') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verifikasi Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Periksa Email Anda</h3>
            <p className="text-muted-foreground">Kami telah mengirimkan tautan verifikasi ke:</p>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onBack}
            >
              Kembali ke Beranda
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            (Dalam prototype ini, verifikasi akan dilakukan otomatis)
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="mt-6 text-2xl font-bold">Pendaftaran Berhasil!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Selamat datang di BengkeLink, {formData.name.split(' ')[0]}! 🎉
            </p>
            <p className="text-muted-foreground">
              Akun Anda telah berhasil dibuat dan siap digunakan.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-left space-y-2">
            <div className="flex items-start">
              <svg 
                className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-sm text-blue-800">
                Kami telah mengirimkan email verifikasi ke <span className="font-medium">{formData.email}</span>. 
                Silakan periksa kotak masuk Anda dan ikuti tautan verifikasi untuk mengaktifkan akun.
              </p>
            </div>
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={() => window.location.href = '/dashboard'}
            size="lg"
          >
            Lanjutkan ke Dashboard
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Tidak menerima email?{' '}
            <button 
              className="text-blue-600 hover:underline font-medium"
              onClick={() => {
                // TODO: Implement resend verification email
                toast({
                  title: "Email verifikasi telah dikirim ulang",
                  description: "Silakan periksa kotak masuk email Anda",
                });
              }}
            >
              Kirim ulang email verifikasi
            </button>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 -ml-2 mr-1"
            type="button"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
          <CardTitle className="text-xl font-bold">Daftar Akun Customer</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Buat akun untuk mulai menggunakan layanan BengkeLink
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Photo Upload */}
          <div className="space-y-3">
            <Label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
              Foto Profil <span className="text-muted-foreground">(Opsional)</span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {formData.profilePhoto ? (
                    <>
                      <img 
                        src={URL.createObjectURL(formData.profilePhoto)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProfilePhoto();
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  id="profilePhoto"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">Format: JPG, JPEG, atau PNG (maks. 2MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">No. Telepon *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+62812345678"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 4 huruf, 2 angka, 1 karakter khusus"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Konfirmasi password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                Saya menyetujui <span className="text-primary">syarat dan ketentuan</span> *
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading || !formData.termsAccepted}
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerSignup;
