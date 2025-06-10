
import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Banknote, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PaymentPassword from './PaymentPassword';

interface PaymentProps {
  onBack: () => void;
  onNext: () => void;
  totalAmount: number;
  serviceData?: any;
}

type PaymentMethod = 'cash' | 'qris' | 'ovo' | 'gopay' | 'dana' | 'credit_card';

const Payment = ({ onBack, onNext, totalAmount, serviceData }: PaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const paymentMethods = [
    {
      id: 'cash' as PaymentMethod,
      name: 'Bayar Tunai',
      description: 'Bayar langsung ke teknisi',
      icon: Banknote,
      available: true,
      needsPassword: false
    },
    {
      id: 'qris' as PaymentMethod,
      name: 'QRIS',
      description: 'Scan QR untuk bayar',
      icon: Smartphone,
      available: true,
      needsPassword: false
    },
    {
      id: 'ovo' as PaymentMethod,
      name: 'OVO',
      description: 'Bayar dengan OVO',
      icon: Wallet,
      available: true,
      needsPassword: true
    },
    {
      id: 'gopay' as PaymentMethod,
      name: 'GoPay',
      description: 'Bayar dengan GoPay',
      icon: Wallet,
      available: true,
      needsPassword: true
    },
    {
      id: 'dana' as PaymentMethod,
      name: 'DANA',
      description: 'Bayar dengan DANA',
      icon: Wallet,
      available: true,
      needsPassword: true
    },
    {
      id: 'credit_card' as PaymentMethod,
      name: 'Kartu Kredit',
      description: 'Visa, Mastercard, dll',
      icon: CreditCard,
      available: false,
      needsPassword: false
    }
  ];

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  const handlePayment = async () => {
    if (!selectedMethod || !selectedMethodData) return;

    if (selectedMethodData.needsPassword) {
      setShowPasswordForm(true);
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing for cash and QRIS
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Auto navigate after success
      setTimeout(() => {
        onNext();
      }, 2000);
    }, 3000);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordForm(false);
    setIsProcessing(true);

    // Simulate payment processing after password verification
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Auto navigate after success
      setTimeout(() => {
        onNext();
      }, 2000);
    }, 2000);
  };

  if (showPasswordForm && selectedMethodData) {
    return (
      <PaymentPassword
        onBack={() => setShowPasswordForm(false)}
        onSuccess={handlePasswordSuccess}
        paymentMethod={selectedMethodData.name}
        amount={totalAmount}
      />
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Pembayaran Berhasil</h1>
          </div>
        </header>

        <main className="p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
                <p className="text-muted-foreground">
                  Pembayaran sebesar Rp {totalAmount.toLocaleString('id-ID')} telah berhasil diproses
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-sm">
                  {selectedMethodData?.name}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  ID Transaksi: TXN{Date.now()}
                </p>
              </div>
              {/* Simple animation */}
              <div className="w-16 h-1 bg-primary rounded-full mx-auto animate-pulse"></div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Memproses Pembayaran</h1>
          </div>
        </header>

        <main className="p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <h2 className="text-xl font-bold mb-2">Memproses Pembayaran</h2>
                <p className="text-muted-foreground">
                  Mohon tunggu, pembayaran Anda sedang diproses...
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Pembayaran</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Pembayaran</span>
              <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Pilih Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : method.available
                    ? 'border-border hover:border-primary/50'
                    : 'border-border bg-muted/50 cursor-not-allowed'
                }`}
                onClick={() => method.available && setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <method.icon className={`w-6 h-6 ${
                    method.available ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-medium ${
                      method.available ? '' : 'text-muted-foreground'
                    }`}>
                      {method.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                  {!method.available && (
                    <Badge variant="secondary" className="text-xs">
                      Segera Hadir
                    </Badge>
                  )}
                  {selectedMethod === method.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* QRIS Section */}
        {selectedMethod === 'qris' && (
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">QR Code akan muncul di sini</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Scan QR code dengan aplikasi pembayaran Anda
              </p>
            </CardContent>
          </Card>
        )}

        {/* E-Wallet Input */}
        {(selectedMethod === 'ovo' || selectedMethod === 'gopay' || selectedMethod === 'dana') && (
          <Card>
            <CardHeader>
              <CardTitle>Nomor {selectedMethodData?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="mt-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Pastikan nomor telepon terdaftar di {selectedMethodData?.name}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <Button
          className="w-full btn-primary"
          disabled={!selectedMethod}
          onClick={handlePayment}
        >
          {selectedMethod === 'cash' ? 'Konfirmasi Pembayaran Tunai' : 'Bayar Sekarang'}
        </Button>
      </main>
    </div>
  );
};

export default Payment;
