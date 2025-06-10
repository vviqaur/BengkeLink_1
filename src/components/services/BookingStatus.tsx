
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Phone, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingStatusProps {
  onBack: () => void;
  onPayment: () => void;
  serviceType: 'call' | 'book';
  onCall?: (phoneNumber: string) => void;
  onChat?: () => void;
}

type BookingStep = 'searching' | 'confirmed' | 'on_way' | 'arrived' | 'in_progress' | 'completed';

const BookingStatus = ({ onBack, onPayment, serviceType, onCall, onChat }: BookingStatusProps) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('searching');
  const [estimatedTime, setEstimatedTime] = useState(15);

  const technician = {
    name: 'Ahmad Supardi',
    rating: 4.8,
    phone: '+62 812-3456-7890',
    licensePlate: 'B 1234 ABC'
  };

  const steps: Array<{ id: BookingStep; title: string; description: string }> = [
    { id: 'searching', title: 'Mencari Teknisi', description: 'Sedang mencari teknisi terbaik untuk Anda' },
    { id: 'confirmed', title: 'Teknisi Ditemukan', description: 'Teknisi akan segera menuju lokasi Anda' },
    { id: 'on_way', title: 'Dalam Perjalanan', description: 'Teknisi sedang menuju lokasi Anda' },
    { id: 'arrived', title: 'Teknisi Tiba', description: 'Teknisi telah tiba di lokasi' },
    { id: 'in_progress', title: 'Sedang Dikerjakan', description: 'Layanan sedang dikerjakan' },
    { id: 'completed', title: 'Selesai', description: 'Layanan telah selesai' }
  ];

  // Simulate status progression
  useEffect(() => {
    const stepOrder: BookingStep[] = ['searching', 'confirmed', 'on_way', 'arrived', 'in_progress', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(stepOrder[currentIndex + 1]);
        if (stepOrder[currentIndex + 1] === 'on_way') {
          setEstimatedTime(15);
        } else if (stepOrder[currentIndex + 1] === 'in_progress') {
          setEstimatedTime(45);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const getCurrentStepInfo = () => {
    return steps.find(step => step.id === currentStep) || steps[0];
  };

  const getStepStatus = (stepId: BookingStep) => {
    const stepOrder: BookingStep[] = ['searching', 'confirmed', 'on_way', 'arrived', 'in_progress', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const handleCall = () => {
    if (onCall) {
      onCall(technician.phone);
    } else {
      window.open(`tel:${technician.phone}`, '_self');
    }
  };

  const handleChat = () => {
    if (onChat) {
      onChat();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Status Pemesanan</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Current Status */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{getCurrentStepInfo().title}</h2>
                <p className="text-muted-foreground">{getCurrentStepInfo().description}</p>
                {(currentStep === 'on_way' || currentStep === 'in_progress') && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Estimasi: {estimatedTime} menit</span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getStepStatus(step.id) === 'completed' ? 'bg-green-500 text-white' :
                    getStepStatus(step.id) === 'active' ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {getStepStatus(step.id) === 'completed' ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      getStepStatus(step.id) === 'active' ? 'text-primary' : ''
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {getStepStatus(step.id) === 'active' && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technician Info */}
        {currentStep !== 'searching' && (
          <Card>
            <CardHeader>
              <CardTitle>Teknisi Anda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {technician.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{technician.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{technician.rating}</span>
                    </div>
                    {currentStep === 'on_way' && (
                      <p className="text-xs text-muted-foreground">{technician.licensePlate}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCall}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleChat}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {currentStep === 'completed' && (
          <div className="space-y-3">
            <Button className="w-full btn-primary" onClick={onPayment}>
              Go to Detail Payment
            </Button>
            <Button variant="outline" className="w-full" onClick={handleChat}>
              Chat Teknisi
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingStatus;
