import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Import signup forms
import CustomerSignup from '../components/auth/CustomerSignup';
import TechnicianSignup from '../components/auth/TechnicianSignup';
import WorkshopSignup from '../components/auth/WorkshopSignup';

type RoleType = 'customer' | 'technician' | 'workshop' | null;

const SignUpPage = () => {
  const [role, setRole] = useState<RoleType>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    if (role) {
      setRole(null);
    } else {
      navigate('/');
    }
  };

  const renderForm = () => {
    switch (role) {
      case 'customer':
        return <CustomerSignup onBack={handleBack} />;
      case 'technician':
        return <TechnicianSignup onBack={handleBack} />;
      case 'workshop':
        return <WorkshopSignup onBack={handleBack} />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Daftar Sebagai</h2>
              <p className="text-muted-foreground mt-2">Pilih peran Anda untuk melanjutkan pendaftaran</p>
            </div>
            <div className="grid gap-4">
              <button
                onClick={() => setRole('customer')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
              >
                <div className="font-semibold">Customer</div>
                <div className="text-sm font-normal opacity-90">Pemilik kendaraan yang membutuhkan layanan</div>
              </button>
              
              <button
                onClick={() => setRole('technician')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-left"
              >
                <div className="font-semibold">Teknisi</div>
                <div className="text-sm font-normal opacity-90">Penyedia jasa perbaikan kendaraan</div>
              </button>
              
              <button
                onClick={() => setRole('workshop')}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors text-left"
              >
                <div className="font-semibold">Mitra Bengkel</div>
                <div className="text-sm font-normal opacity-90">Pemilik atau perwakilan bengkel</div>
              </button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-blue-600 hover:underline"
              >
                Masuk disini
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {role && (
            <button 
              onClick={handleBack}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali
            </button>
          )}
          <h1 className="text-2xl font-bold text-center mb-6">
            {role ? `Daftar sebagai ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Buat Akun Baru'}
          </h1>
          <div className="mt-6">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
