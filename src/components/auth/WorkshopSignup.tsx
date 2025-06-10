
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface WorkshopSignupProps {
  onBack: () => void;
}

const WorkshopSignup = ({ onBack }: WorkshopSignupProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Page 1 - General Info
    workshopName: '',
    province: '',
    city: '',
    postalCode: '',
    detailAddress: '',
    email: '',
    operatingHours: '',
    
    // Page 2 - Services
    services: [] as string[],
    vehicleTypes: [] as string[],
    technicianCount: '',
    
    // Page 3 - Owner Info
    ownerName: '',
    idNumber: '',
    idPhoto: null as File | null,
    phone: '',
    
    // Page 4 - Business Info
    businessNumber: '',
    taxNumber: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    
    // Page 5 - Agreement
    termsAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { signup } = useAuth();
  const { toast } = useToast();

  const provinces = [
    'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
    'Yogyakarta', 'Bali', 'Sumatera Utara', 'Sumatera Barat', 'Riau'
  ];

  const cities = {
    'Banten': ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon'],
    'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur'],
  };

  const serviceOptions = [
    'Servis Ringan', 'Servis Berat', 'Ganti Oli', 'Spooring-Balancing', 
    'AC', 'Kelistrikan', 'Lainnya'
  ];

  const vehicleOptions = [
    'Semua Merek', 'Toyota', 'Honda', 'Suzuki', 'Mitsubishi', 'Nissan',
    'Daihatsu', 'Mazda', 'BMW', 'Mercedes-Benz', 'Audi'
  ];

  const operatingHoursOptions = [
    '08:00 - 17:00', '08:00 - 18:00', '09:00 - 17:00', '09:00 - 18:00',
    '07:00 - 19:00', '08:00 - 20:00', '24 Jam'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, idPhoto: file }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleVehicleToggle = (vehicle: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(vehicle)
        ? prev.vehicleTypes.filter(v => v !== vehicle)
        : [...prev.vehicleTypes, vehicle]
    }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Error",
        description: "Anda harus menyetujui syarat dan ketentuan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        role: 'workshop',
        name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: 'temp123', // Will be sent via email
        confirmPassword: 'temp123',
        termsAccepted: formData.termsAccepted,
        workshopName: formData.workshopName,
        province: formData.province,
        city: formData.city,
        postalCode: formData.postalCode,
        detailAddress: formData.detailAddress,
        operatingHours: formData.operatingHours,
        services: formData.services,
        vehicleTypes: formData.vehicleTypes,
        technicianCount: parseInt(formData.technicianCount),
        ownerName: formData.ownerName,
        businessNumber: formData.businessNumber,
        taxNumber: formData.taxNumber,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      });

      setIsSubmitted(true);
      toast({
        title: "Pengajuan berhasil dikirim",
        description: "Kami akan menginformasikan hasil verifikasi melalui email",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto card-interactive">
        <CardContent className="text-center py-8 space-y-6">
          <div className="animate-scale-in">
            <div className="w-16 h-16 bg-orange-light rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 text-orange-primary">✓</div>
            </div>
          </div>
          <h3 className="text-xl font-bold">Pengajuan Mitra BengkeLink Berhasil Diajukan</h3>
          <div className="bg-orange-light p-6 rounded-lg text-left space-y-4">
            <p className="text-sm text-foreground">
              Informasi terkait persetujuan pengajuan akan diinformasikan melalui email.
            </p>
            <p className="text-sm text-foreground">
              Akan dikirimkan <strong>Nomor Keterangan Kemitraan BengkeLink</strong> beserta 
              <strong> Password</strong> untuk log in ke akun usaha apabila pengajuan disetujui.
            </p>
            <p className="text-xs text-muted-foreground">
              *Proses verifikasi maksimal 3 hari kerja
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={onBack} variant="outline">
              Kembali ke Pendaftaran
            </Button>
            <Button onClick={() => window.location.href = '/'} className="btn-primary">
              Keluar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto card-interactive">
      <CardHeader>
        <Button
          variant="ghost"
          className="w-fit p-0 mb-4 text-muted-foreground hover:text-foreground"
          onClick={step === 1 ? onBack : prevStep}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <CardTitle className="text-2xl font-bold">Daftar sebagai Mitra Bengkel</CardTitle>
        <p className="text-muted-foreground">
          Langkah {step} dari 5 - {
            step === 1 ? 'Informasi Umum Bengkel' :
            step === 2 ? 'Informasi Layanan' :
            step === 3 ? 'Informasi Pemilik/Penanggung Jawab' :
            step === 4 ? 'Informasi Legalitas dan Keuangan' :
            'Persetujuan dan Verifikasi'
          }
        </p>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Step 1: General Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workshopName">Nama Bengkel *</Label>
              <Input
                id="workshopName"
                type="text"
                placeholder="Nama bengkel"
                value={formData.workshopName}
                onChange={(e) => setFormData(prev => ({ ...prev, workshopName: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Provinsi *</Label>
                <Select 
                  value={formData.province} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, province: value, city: '' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(province => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Select 
                  value={formData.city} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                  disabled={!formData.province}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kota" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.province && cities[formData.province as keyof typeof cities]?.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Kode Pos *</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="Kode pos"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailAddress">Alamat Detail *</Label>
              <Input
                id="detailAddress"
                type="text"
                placeholder="Alamat lengkap bengkel"
                value={formData.detailAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Bengkel *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@bengkel.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingHours">Jam Operasional *</Label>
              <Select 
                value={formData.operatingHours} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, operatingHours: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jam operasional" />
                </SelectTrigger>
                <SelectContent>
                  {operatingHoursOptions.map(hours => (
                    <SelectItem key={hours} value={hours}>{hours}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Jenis Layanan yang Tersedia *</Label>
              <div className="grid grid-cols-2 gap-2">
                {serviceOptions.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Jenis Kendaraan yang Dilayani *</Label>
              <div className="grid grid-cols-2 gap-2">
                {vehicleOptions.map(vehicle => (
                  <div key={vehicle} className="flex items-center space-x-2">
                    <Checkbox
                      id={vehicle}
                      checked={formData.vehicleTypes.includes(vehicle)}
                      onCheckedChange={() => handleVehicleToggle(vehicle)}
                    />
                    <Label htmlFor={vehicle} className="text-sm">{vehicle}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicianCount">Jumlah Teknisi *</Label>
              <Input
                id="technicianCount"
                type="number"
                placeholder="Jumlah teknisi"
                value={formData.technicianCount}
                onChange={(e) => setFormData(prev => ({ ...prev, technicianCount: e.target.value }))}
                required
              />
            </div>
          </div>
        )}

        {/* Step 3: Owner Information */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Nama Pemilik *</Label>
              <Input
                id="ownerName"
                type="text"
                placeholder="Nama lengkap pemilik"
                value={formData.ownerName}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">Nomor KTP *</Label>
              <Input
                id="idNumber"
                type="text"
                placeholder="16 digit nomor KTP"
                value={formData.idNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idPhoto">Foto/Scan KTP *</Label>
              <div className="flex items-center gap-4">
                <input
                  id="idPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('idPhoto')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload KTP
                </Button>
                {formData.idPhoto && (
                  <span className="text-sm text-muted-foreground">
                    {formData.idPhoto.name}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon Pemilik *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+62812345678"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>
        )}

        {/* Step 4: Business Information */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessNumber">Nomor Induk Berusaha *</Label>
              <Input
                id="businessNumber"
                type="text"
                placeholder="NIB"
                value={formData.businessNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, businessNumber: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">Nomor Pokok Wajib Pajak *</Label>
              <Input
                id="taxNumber"
                type="text"
                placeholder="NPWP"
                value={formData.taxNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, taxNumber: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Nama Bank *</Label>
              <Input
                id="bankName"
                type="text"
                placeholder="Nama bank"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Nomor Rekening *</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Nomor rekening"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Nama Pemilik Rekening *</Label>
              <Input
                id="accountName"
                type="text"
                placeholder="Nama sesuai rekening"
                value={formData.accountName}
                onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                required
              />
            </div>
          </div>
        )}

        {/* Step 5: Agreement */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Persetujuan dan Verifikasi</h3>
              
              <div className="bg-orange-light p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Syarat dan Ketentuan Kemitraan:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Bengkel harus memiliki legalitas usaha yang lengkap</li>
                  <li>Menyediakan teknisi bersertifikat minimal 2 orang</li>
                  <li>Memiliki peralatan dan fasilitas yang memadai</li>
                  <li>Bersedia mengikuti standar layanan BengkeLink</li>
                  <li>Komisi platform sebesar 10% dari setiap transaksi</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  Saya menyetujui <span className="text-primary font-semibold">syarat dan ketentuan kemitraan</span> *
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Sebelumnya
            </Button>
          )}
          
          <div className="ml-auto">
            {step < 5 ? (
              <Button onClick={nextStep} className="btn-primary">
                Selanjutnya
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="btn-primary"
                disabled={isLoading || !formData.termsAccepted}
              >
                {isLoading ? 'Memproses...' : 'Kirim Pengajuan'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopSignup;
