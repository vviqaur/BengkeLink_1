
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LoginForm from './auth/LoginForm';

type AuthMode = 'login' | 'selection';

const AuthWrapper = () => {
  const [mode, setMode] = useState<AuthMode>('selection');
  const navigate = useNavigate();

  const renderSelectionScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-light via-white to-orange-light/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-interactive">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 mb-6">
            <img 
              src="/lovable-uploads/18c3e59c-93d8-4fb1-b29d-ad8245a52f1b.png" 
              alt="BengkeLink Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">BengkeLink</CardTitle>
          <p className="text-muted-foreground mt-2">Platform Bengkel Digital Terpercaya</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full btn-primary text-lg py-6"
            onClick={() => setMode('login')}
          >
            Masuk ke Akun
          </Button>
          <Button 
            variant="outline" 
            className="w-full btn-secondary text-lg py-6"
            onClick={() => navigate('/signup')}
          >
            Daftar Akun Baru
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackButton = () => (
    <Button
      variant="ghost"
      className="mb-6 text-muted-foreground hover:text-foreground"
      onClick={() => setMode('selection')}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Kembali
    </Button>
  );

  if (mode === 'selection') {
    return renderSelectionScreen();
  }

  // This now only renders the login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light via-white to-orange-light/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderBackButton()}
        {mode === 'login' && <LoginForm />}
      </div>
    </div>
  );
};

export default AuthWrapper;
