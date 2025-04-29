
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from './AuthProvider';
import { Notification } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  // Load initial notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      // Since TypeScript doesn't know about our notifications table yet,
      // we need to use a different approach to query it
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          match_id,
          message,
          type,
          created_at,
          matches:match_id(
            id,
            team1:team1_id(name),
            team2:team2_id(name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching notifications:', error);
      } else if (data) {
        setNotifications(data as unknown as Notification[]);
        setUnreadCount(data.length); // Simple implementation - all are unread initially
      }
    };

    fetchNotifications();
  }, [user]);
  
  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications' 
        }, 
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50
          setUnreadCount(prev => prev + 1);
          
          // Show toast for important notifications
          if (newNotification.type === 'wicket' || 
              newNotification.type === 'milestone' || 
              newNotification.type === 'match_end') {
            toast({
              title: `Match Update: ${newNotification.type.replace('_', ' ')}`,
              description: newNotification.message,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
  
  const markAllAsRead = () => {
    setUnreadCount(0);
  };
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
