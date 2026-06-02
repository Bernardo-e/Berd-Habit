import { useState, useRef } from 'react';
import { 
  User, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  Database,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage({ 
  username, 
  setUsername, 
  onPopulateMockData, 
  onClearAllData,
  checkInsCount,
  habitsCount,
  plantXP = 0,
  onNurturePlant
}) {
  const [profileName, setProfileName] = useState(username);
  const [profileSaved, setProfileSaved] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profileName.trim()) {
      setUsername(profileName.trim());
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }
  };

  // --- Export Data Utility ---
  const handleExportData = () => {
    try {
      const dataStr = localStorage.getItem('berd_habits');
      const checkInStr = localStorage.getItem('berd_checkins');
      
      const backupObj = {
        habits: dataStr ? JSON.parse(dataStr) : [],
        checkIns: checkInStr ? JSON.parse(checkInStr) : [],
        username: username,
        exportedAt: new Date().toISOString()
      };

      const dataBlob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `berd-habit-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export backup: " + err.message);
    }
  };

  // --- Import Data Utility ---
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        
        // Basic schema validations
        if (!json.habits || !Array.isArray(json.habits) || !json.checkIns || !Array.isArray(json.checkIns)) {
          setImportError('Invalid file schema. Backup must contain "habits" and "checkIns" arrays.');
          setImportSuccess('');
          return;
        }

        // Apply backup values directly to LocalStorage and trigger reload
        localStorage.setItem('berd_habits', JSON.stringify(json.habits));
        localStorage.setItem('berd_checkins', JSON.stringify(json.checkIns));
        if (json.username) {
          localStorage.setItem('berd_username', json.username);
        }

        setImportSuccess('Data imported successfully! Reloading...');
        setImportError('');
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (err) {
        setImportError('Failed to parse JSON backup file: ' + err.message);
        setImportSuccess('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-3xl mx-auto">
      {/* Header section */}
      <div>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text-primary">
          App Settings
        </h2>
        <p className="text-brand-text-secondary font-medium text-sm mt-1">
          Manage your profile, theme preferences, and local storage database.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        
        {/* User Profile Card */}
        <div className="p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm">
          <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2 text-brand-text-primary">
            <User size={18} className="text-brand-accent" />
            User Profile
          </h3>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-text-secondary tracking-wider">
                DISPLAY NAME
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Habit Builder"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="max-w-md w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg font-semibold focus:outline-none focus:border-brand-accent focus:bg-brand-surface transition duration-150 text-sm text-brand-text-primary"
                  maxLength={25}
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-brand-accent hover:bg-brand-accent-hover text-white shadow-md active:scale-98 transition duration-150 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {profileSaved ? <Check size={14} /> : null}
                  {profileSaved ? 'Saved!' : 'Save Name'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Local Storage Database Card */}
        <div className="p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold flex items-center gap-2 text-brand-text-primary">
              <Database size={18} className="text-brand-accent" />
              Sovereign Botanical Storage
            </h3>
            
            <div className="flex gap-2.5 text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-3 py-1.5 rounded-full border border-brand-accent/20">
              <span>{habitsCount} Habits</span>
              <span>•</span>
              <span>{checkInsCount} Logs</span>
              <span>•</span>
              <span>{plantXP} XP</span>
            </div>
          </div>

          <p className="text-xs text-brand-text-secondary font-medium leading-relaxed">
            Your habits, histories, and stats exist solely inside your browser's Local Storage. Export a JSON backup to transfer it between devices, populate organic mock data to instantly see visual insights, or nurture your sprout step-by-step.
          </p>

          {/* Import Alerts */}
          {importError && (
            <div className="p-3.5 bg-rose-955/20 text-rose-455 text-xs rounded-xl flex items-center gap-2 font-medium border border-rose-500/10">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{importError}</span>
            </div>
          )}
          {importSuccess && (
            <div className="p-3.5 bg-brand-accent/10 text-brand-accent text-xs rounded-xl flex items-center gap-2 font-medium border border-brand-accent/20">
              <Check size={14} className="shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {/* Operations row */}
          <div className="flex flex-wrap gap-3">
            {/* Nurture Sprout */}
            <button
              onClick={() => {
                onNurturePlant();
                alert("Nurtured! 10 mock check-in logs added, increasing plant growth by +100 XP.");
              }}
              className="py-3 px-4 rounded-xl border border-emerald-500/25 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center gap-2 cursor-pointer transition duration-150"
            >
              <RefreshCw size={14} className="text-emerald-400" />
              Nurture Sprout (+100 XP)
            </button>

            {/* Populate Mock History */}
            <button
              onClick={() => {
                if (window.confirm("Overwrite history with a gorgeous 90-day mockup to see organic charts instantly? This will wipe your current completions.")) {
                  onPopulateMockData();
                  alert("Mock database populated successfully! Enjoy your visual analytics.");
                }
              }}
              className="py-3 px-4 rounded-xl border border-brand-accent/25 hover:border-brand-accent bg-brand-accent/5 hover:bg-brand-accent/10 text-brand-accent font-bold text-xs flex items-center gap-2 cursor-pointer transition duration-150"
            >
              <RefreshCw size={14} />
              Populate Sample History
            </button>

            {/* Export backup */}
            <button
              onClick={handleExportData}
              className="py-3 px-4 rounded-xl border border-brand-border hover:border-brand-text-secondary/40 bg-brand-bg hover:bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary font-bold text-xs flex items-center gap-2 cursor-pointer transition duration-150"
            >
              <Download size={14} />
              Export Backup (.json)
            </button>

            {/* Import backup */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportFile} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={handleImportClick}
              className="py-3 px-4 rounded-xl border border-brand-border hover:border-brand-text-secondary/40 bg-brand-bg hover:bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary font-bold text-xs flex items-center gap-2 cursor-pointer transition duration-150"
            >
              <Upload size={14} />
              Import Backup (.json)
            </button>
          </div>
        </div>

        {/* Factory Reset Caution Card */}
        <div className="p-6 rounded-3xl border border-rose-500/25 bg-rose-955/5 shadow-sm space-y-4">
          <h3 className="font-heading text-base font-bold text-rose-450 flex items-center gap-2">
            <AlertTriangle size={18} />
            Danger Zone
          </h3>
          
          <p className="text-xs text-brand-text-secondary font-medium leading-relaxed">
            Performing a factory reset will permanently erase all habits, streaks, and check-in history from your local browser. This action is irreversible.
          </p>

          <button
            onClick={() => {
              if (window.confirm("ARE YOU ABSOLUTELY SURE? This will permanently wipe all local habit logs, streaks, and settings from your browser. There is no undo.")) {
                onClearAllData();
                alert("Database successfully purged. Reloading workspace.");
                window.location.reload();
              }
            }}
            className="py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition duration-150 shadow-md hover:shadow-lg active:scale-98"
          >
            <Trash2 size={14} />
            Purge Local Database
          </button>
        </div>
      </div>
    </div>
  );
}
