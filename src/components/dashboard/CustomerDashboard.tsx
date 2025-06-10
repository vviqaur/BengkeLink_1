
import { useState } from 'react';
import { Bell, User, Home, Activity, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import CustomerHome from './customer/CustomerHome';
import CustomerActivity from './customer/CustomerActivity';
import CustomerNotifications from './customer/CustomerNotifications';
import CustomerMessages from './customer/CustomerMessages';
import CustomerProfile from './customer/CustomerProfile';

type CustomerTab = 'home' | 'activity' | 'notifications' | 'messages' | 'profile';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');
  const [notificationCount] = useState(3);
  const [messageCount] = useState(2);
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <CustomerHome />;
      case 'activity':
        return <CustomerActivity />;
      case 'notifications':
        return <CustomerNotifications />;
      case 'messages':
        return <CustomerMessages />;
      case 'profile':
        return <CustomerProfile />;
      default:
        return <CustomerHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
            <div>
              <h1 className="text-lg font-bold">Selamat Datang!</h1>
              <p className="text-sm text-muted-foreground">{user?.name}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('profile')}
            className="rounded-full"
          >
            {user?.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="flex items-center justify-around py-2">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>

          <Button
            variant={activeTab === 'activity' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('activity')}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Activity className="w-5 h-5" />
            <span className="text-xs">Activity</span>
          </Button>

          <Button
            variant={activeTab === 'notifications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notifications')}
            className="flex flex-col items-center gap-1 h-auto py-2 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs">Notifikasi</span>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>

          <Button
            variant={activeTab === 'messages' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('messages')}
            className="flex flex-col items-center gap-1 h-auto py-2 relative"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Message</span>
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {messageCount}
              </span>
            )}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default CustomerDashboard;
