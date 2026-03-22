import { useEffect } from 'react';
import { QuickActions } from './components/QuickActions';
import { ActiveTimers } from './components/ActiveTimers';
import { Timeline } from './components/Timeline';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';
import { Heart } from 'lucide-react';

function App() {
  useEffect(() => {
    // Register Service Worker for PWA
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log("App ready to work offline");
      },
    });

    // Request notification permissions
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-gray-800 font-sans p-4 max-w-md mx-auto sm:p-6 sm:border-x sm:border-gray-100 sm:shadow-sm">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            Lacta Care
            <Heart className="text-pastel-red-dark" fill="currentColor" size={24} />
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Pencatatan simpel untuk ibu pejuang ASI</p>
        </div>
      </header>

      <main className="flex flex-col gap-8 pb-12">
        <section>
          <QuickActions />
        </section>

        <section>
          <ActiveTimers />
        </section>

        <section>
          <Timeline />
        </section>
      </main>
      
      {/* Spacer for mobile safe area */}
      <div className="h-8"></div>
    </div>
  );
}

export default App;
