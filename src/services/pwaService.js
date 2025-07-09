class PWAService {
  constructor() {
    this.registration = null;
    this.subscription = null;
  }

  async isInstalled() {
    try {
      // Check if running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
      }
      
      // Check if launched from home screen
      if (window.navigator.standalone === true) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking installation status:', error);
      return false;
    }
  }

  async installApp(deferredPrompt) {
    try {
      if (!deferredPrompt) {
        throw new Error('No install prompt available');
      }

      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Installation failed:', error);
      return false;
    }
  }

  async getNotificationPermission() {
    try {
      if (!('Notification' in window)) {
        return 'not-supported';
      }
      
      return Notification.permission;
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return 'denied';
    }
  }

  async requestNotificationPermission() {
    try {
      if (!('Notification' in window)) {
        throw new Error('Notifications not supported');
      }
      
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  async sendNotification(title, options = {}) {
    try {
      if (!('Notification' in window)) {
        throw new Error('Notifications not supported');
      }
      
      if (Notification.permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }
      
      const notification = new Notification(title, {
        icon: 'https://drive.google.com/uc?export=view&id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D',
        badge: 'https://drive.google.com/uc?export=view&id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D',
        ...options
      });
      
      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  async subscribeToNotifications() {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications not supported');
      }
      
      this.registration = await navigator.serviceWorker.ready;
      
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BJ3wKnfN1QdWKNZXI9JmTYYnGUH4LfBNGlLJGZlIKmJiZmJjZmJkZmJlZmJmZmJnZmJoZmJpZmJqZmJrZmJsZmJtZmJu'
        )
      });
      
      this.subscription = subscription;
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return null;
    }
  }

  async unsubscribeFromNotifications() {
    try {
      if (!this.subscription) {
        return true;
      }
      
      await this.subscription.unsubscribe();
      this.subscription = null;
      
      return true;
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      return false;
    }
  }

  async updateApp() {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
      }
      
      const registration = await navigator.serviceWorker.ready;
      
      if (registration.waiting) {
        // Tell the waiting service worker to activate
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating app:', error);
      return false;
    }
  }

  async checkForUpdates() {
    try {
      if (!('serviceWorker' in navigator)) {
        return false;
      }
      
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      
      return registration.waiting !== null;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  }

  async shareContent(data) {
    try {
      if (navigator.share) {
        await navigator.share(data);
        return true;
      }
      
      // Fallback to clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.url || data.text);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error sharing content:', error);
      return false;
    }
  }

  async getStorageEstimate() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting storage estimate:', error);
      return null;
    }
  }

  // Helper methods
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }

  async sendSubscriptionToServer(subscription) {
    try {
      // In a real app, send subscription to your server
      console.log('Subscription to send to server:', subscription);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      return false;
    }
  }
}

export const pwaService = new PWAService();