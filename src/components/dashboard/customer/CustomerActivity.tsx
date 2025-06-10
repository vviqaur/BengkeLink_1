
import { useState } from 'react';
import { Calendar, MapPin, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const CustomerActivity = () => {
  const [activities] = useState([
    {
      id: '1',
      type: 'Servis Berkala',
      workshop: 'Bengkel Maju Jaya',
      technician: 'Ahmad Supardi',
      date: new Date('2024-01-15'),
      status: 'completed',
      rating: 5,
      cost: 150000,
      location: 'Jl. Sudirman No. 123'
    },
    {
      id: '2',
      type: 'Ganti Oli',
      workshop: 'Auto Service Center',
      technician: 'Budi Santoso',
      date: new Date('2024-01-10'),
      status: 'completed',
      rating: 4,
      cost: 75000,
      location: 'Jl. Gatot Subroto No. 45'
    },
    {
      id: '3',
      type: 'Tune Up',
      workshop: 'Bengkel Sejahtera',
      technician: 'Candra Wijaya',
      date: new Date('2024-01-08'),
      status: 'cancelled',
      cost: 0,
      location: 'Jl. Thamrin No. 67'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      case 'pending':
        return <Badge variant="secondary">Menunggu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const completedActivities = activities.filter(a => a.status === 'completed');
  const cancelledActivities = activities.filter(a => a.status === 'cancelled');

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Riwayat Aktivitas</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
          <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{activity.type}</CardTitle>
                    <CardDescription>{activity.workshop}</CardDescription>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(activity.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                </div>
                
                {activity.status === 'completed' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">Rating: {activity.rating}/5</span>
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {formatCurrency(activity.cost)}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedActivities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{activity.type}</CardTitle>
                    <CardDescription>{activity.workshop}</CardDescription>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(activity.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">Rating: {activity.rating}/5</span>
                </div>
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(activity.cost)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledActivities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{activity.type}</CardTitle>
                    <CardDescription>{activity.workshop}</CardDescription>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(activity.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerActivity;
