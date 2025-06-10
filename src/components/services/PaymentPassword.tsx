
import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
  paymentMethod: string;
  amount: number;
}

const PaymentPassword = ({ onBack, onSuccess, paymentMethod, amount }: PaymentPasswordProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password wajib diisi');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate password verification
    setTimeout(() => {
      if (password === '123456') {
        onSuccess();
      } else {
        setError('Password salah. Silakan coba lagi.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Konfirmasi Pembayaran</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Masukkan Password {paymentMethod}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Anda akan membayar
              </p>
              <p className="text-2xl font-bold">
                Rp {amount.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-muted-foreground">
                menggunakan {paymentMethod}
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password {paymentMethod}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className={error ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Password untuk testing: 123456
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
              Batal
            </Button>
            <Button 
              type="submit" 
              className="flex-1 btn-primary"
              disabled={isProcessing || !password}
            >
              {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PaymentPassword;
