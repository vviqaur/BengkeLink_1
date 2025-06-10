
import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkshops, Workshop } from '@/hooks/useWorkshops';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkshopListProps {
  onBack: () => void;
  onSelectWorkshop: (workshop: Workshop) => void;
}

const WorkshopList = ({ onBack, onSelectWorkshop }: WorkshopListProps) => {
  const { data: workshops, isLoading, error } = useWorkshops();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Pilih Bengkel</h1>
          </div>
        </header>
        <main className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading workshops</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
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
          <h1 className="text-xl font-bold">Pilih Bengkel</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-4">
          {workshops?.map((workshop) => (
            <Card key={workshop.id} className="card-interactive">
              <CardHeader className="pb-3">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <img 
                      src={workshop.image_url || '/placeholder.svg'} 
                      alt={workshop.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.textContent = workshop.name.charAt(0);
                      }}
                    />
                    <span className="text-lg font-bold text-muted-foreground hidden">
                      {workshop.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg leading-tight">{workshop.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{workshop.rating || 0}</span>
                            <span className="text-sm text-muted-foreground">({workshop.review_count || 0})</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {workshop.distance}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{workshop.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{workshop.technicians?.length || 0} teknisi</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">{workshop.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Layanan:</p>
                  <div className="flex flex-wrap gap-1">
                    {workshop.services?.slice(0, 4).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {(workshop.services?.length || 0) > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{(workshop.services?.length || 0) - 4} lainnya
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Teknisi Terbaik:</p>
                  <div className="space-y-1">
                    {workshop.technicians?.slice(0, 2).map((tech, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{tech.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{tech.rating || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full btn-primary"
                  onClick={() => onSelectWorkshop(workshop as Workshop)}
                >
                  Pilih Bengkel
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WorkshopList;
