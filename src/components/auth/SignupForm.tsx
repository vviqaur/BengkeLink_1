
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types/auth';
import CustomerSignup from './CustomerSignup';
import TechnicianSignup from './TechnicianSignup';
import WorkshopSignup from './WorkshopSignup';

const SignupForm = () => {
  const [role, setRole] = useState<UserRole | ''>('');

  if (!role) {
    return (
      <Card className="w-full card-interactive">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Daftar di BengkeLink</CardTitle>
          <p className="text-muted-foreground">Pilih peran Anda untuk memulai</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih Peran</label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran Anda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer - Pengguna layanan bengkel</SelectItem>
                  <SelectItem value="technician">Teknisi - Teknisi bengkel mitra</SelectItem>
                  <SelectItem value="workshop">Mitra Bengkel - Pemilik bengkel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderSignupComponent = () => {
    switch (role) {
      case 'customer':
        return <CustomerSignup onBack={() => setRole('')} />;
      case 'technician':
        return <TechnicianSignup onBack={() => setRole('')} />;
      case 'workshop':
        return <WorkshopSignup onBack={() => setRole('')} />;
      default:
        return null;
    }
  };

  return renderSignupComponent();
};

export default SignupForm;
