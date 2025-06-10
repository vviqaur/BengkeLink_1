
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, LoginCredentials } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface LoginFormData {
  emailOrUsername: string;
  partnershipNumber: string;
  password: string;
  confirmPassword: string;
}

const LoginForm = () => {
  const [role, setRole] = useState<UserRole>('customer');
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: '',
    partnershipNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const auth = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if ((!formData.emailOrUsername && role !== 'workshop') || !formData.password) {
      toast({
        title: "Error",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare credentials based on role
      const credentials: LoginCredentials = {
        email: role === 'workshop' ? undefined : formData.emailOrUsername,
        username: role === 'workshop' ? undefined : formData.emailOrUsername,
        partnershipNumber: role === 'workshop' ? formData.emailOrUsername : undefined,
        password: formData.password,
        role: role
      };
      
      console.log('Attempting login with credentials:', { ...credentials, password: '***' });
      
      // Call the auth login function
      const result = await auth.login(credentials);
      console.log('Login result:', result);
      
      if (result.success) {
        toast({
          title: "Berhasil masuk",
          description: "Mengarahkan ke dashboard...",
        });
        
        // Get the role from the login response
        const userRole = result.role || 'customer';
        console.log('User role after login:', userRole);
        
        // Wait for auth state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get the latest auth state
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Tidak ada sesi yang aktif');
        }
        
        console.log('Current session after login:', session);
        
        // Navigate based on user role
        let targetPath = '/';
        switch (userRole) {
          case 'workshop':
            targetPath = '/workshop/dashboard';
            break;
          case 'technician':
            targetPath = '/technician/dashboard';
            break;
          case 'customer':
          default:
            targetPath = '/dashboard';
        }
        
        console.log('Navigating to:', targetPath);
        // Use window.location.href to force a full page reload
        // This ensures all auth state is properly initialized
        window.location.href = targetPath;
      } else {
        // Handle specific error cases
        if ('error' in result) {
          if (result.error.includes('email_not_confirmed')) {
            toast({
              title: "Email Belum Dikonfirmasi",
              description: "Silakan periksa email Anda untuk tautan konfirmasi. Jika tidak menerima email, klik 'Lupa Password?' untuk mengirim ulang email konfirmasi.",
              variant: "destructive",
              action: (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Trigger password reset to resend confirmation
                    handleForgotPassword();
                  }}
                >
                  Kirim Ulang Konfirmasi
                </Button>
              )
            });
          } else {
            toast({
              title: "Gagal masuk",
              description: result.error,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Gagal masuk",
            description: 'Terjadi kesalahan yang tidak diketahui',
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, role, auth, toast, navigate]);

  const handleForgotPassword = async () => {
    if (!formData.emailOrUsername) {
      toast({
        title: "Error",
        description: "Masukkan email terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    // Simulate forgot password process
    toast({
      title: "Email terkirim",
      description: "Link reset password telah dikirim ke email Anda",
    });
    setShowForgotPassword(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'technician': return 'Teknisi';
      case 'workshop': return 'Mitra Bengkel';
    }
  };

  return (
    <Card className="w-full card-interactive">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Masuk ke BengkeLink</CardTitle>
        <p className="text-muted-foreground">Pilih peran dan masuk ke akun Anda</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="technician">Teknisi</SelectItem>
                <SelectItem value="workshop">Mitra Bengkel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role !== 'workshop' ? (
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">Email / Username</Label>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="Masukkan email atau username"
                value={formData.emailOrUsername}
                onChange={(e) => setFormData(prev => ({ ...prev, emailOrUsername: e.target.value }))}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="partnershipNumber">Nomor Keterangan Kemitraan BengkeLink</Label>
              <Input
                id="partnershipNumber"
                type="text"
                placeholder="Masukkan nomor kemitraan"
                value={formData.partnershipNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, partnershipNumber: e.target.value }))}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          {role !== 'workshop' && (
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-primary/80"
                onClick={() => setShowForgotPassword(true)}
              >
                Lupa password?
              </Button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : `Masuk sebagai ${getRoleLabel(role)}`}
          </Button>
        </form>

        {showForgotPassword && (
          <div className="mt-6 p-4 bg-orange-light rounded-lg">
            <h3 className="font-semibold mb-2">Reset Password</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Masukkan email Anda untuk menerima link reset password
            </p>
            <div className="flex gap-2">
              <Button onClick={handleForgotPassword} size="sm">
                Kirim Link
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowForgotPassword(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
