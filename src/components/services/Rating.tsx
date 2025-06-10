
import { useState } from 'react';
import { ArrowLeft, Star, Camera, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RatingProps {
  onBack: () => void;
  onComplete: () => void;
  technicianName: string;
  workshopName: string;
}

const Rating = ({ onBack, onComplete, technicianName, workshopName }: RatingProps) => {
  const [serviceRating, setServiceRating] = useState(0);
  const [technicianRating, setTechnicianRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const reviewTags = [
    'Tepat Waktu',
    'Ramah',
    'Profesional',
    'Hasil Memuaskan',
    'Harga Sesuai',
    'Komunikatif',
    'Bersih',
    'Cepat'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    // Here you would submit the rating data to your backend
    console.log({
      serviceRating,
      technicianRating,
      review,
      selectedTags,
      technicianName,
      workshopName
    });
    
    onComplete();
  };

  const renderStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className="p-1"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Beri Rating & Ulasan</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Service Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Layanan Selesai!</h2>
              <p className="text-muted-foreground">
                Terima kasih telah menggunakan layanan kami
              </p>
              <div className="flex flex-col items-center gap-1 mt-4">
                <p className="font-medium">{technicianName}</p>
                <p className="text-sm text-muted-foreground">{workshopName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Layanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Bagaimana layanan yang Anda terima?
              </p>
              {renderStars(serviceRating, setServiceRating)}
            </div>
          </CardContent>
        </Card>

        {/* Technician Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Teknisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Bagaimana pelayanan teknisi?
              </p>
              {renderStars(technicianRating, setTechnicianRating)}
            </div>
          </CardContent>
        </Card>

        {/* Review Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tag Ulasan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reviewTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Written Review */}
        <Card>
          <CardHeader>
            <CardTitle>Tulis Ulasan (Opsional)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full p-3 border border-border rounded-md min-h-[100px] resize-none"
              placeholder="Ceritakan pengalaman Anda..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Tambah Foto (Opsional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Tap untuk menambah foto hasil servis
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onComplete}
          >
            Lewati
          </Button>
          <Button
            className="flex-1 btn-primary"
            onClick={handleSubmit}
            disabled={serviceRating === 0 || technicianRating === 0}
          >
            Kirim Ulasan
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Rating;
