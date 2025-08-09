import React, { useState } from 'react';
import type { Profile, UserDetails } from '@/types.ts';
import ProfileForm from '../IdeaInputForm.tsx';
import PlusCircleIcon from '@/components/icons/PlusCircleIcon.tsx';
import LoadingSpinner from '@/components/LoadingSpinner.tsx';
import TrashCanIcon from '@/components/icons/TrashCanIcon.tsx';

interface ProfileSelectionScreenProps {
  profiles: Profile[];
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, details: UserDetails) => Promise<void>;
  onDeleteProfile: (id: string) => void;
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ profiles, onSelectProfile, onCreateProfile, onDeleteProfile }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);


    const handleCreate = async (name: string, details: UserDetails) => {
        setIsLoading(true);
        await onCreateProfile(name, details);
        setIsLoading(false);
        setIsCreating(false);
    }
    
    const confirmDelete = (e: React.MouseEvent, profile: Profile) => {
        e.stopPropagation(); // Prevent profile selection when clicking delete
        setProfileToDelete(profile);
    };

    const executeDelete = () => {
        if (profileToDelete) {
            onDeleteProfile(profileToDelete.id);
            setProfileToDelete(null);
        }
    };

    return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">Select a Profile</h2>
      {profiles.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {profiles.map(profile => (
            <div key={profile.id} onClick={() => onSelectProfile(profile.id)} className="group relative flex flex-col items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-fuchsia-500 cursor-pointer transition-all duration-300">
              <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600" />
              <span className="text-lg font-semibold text-center text-gray-200">{profile.name}</span>
               <button 
                onClick={(e) => confirmDelete(e, profile)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-700/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-900/50 hover:text-red-400 transition-all"
                aria-label={`Delete profile ${profile.name}`}
              >
                  <TrashCanIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
           <button type="button" onClick={() => setIsCreating(true)} className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 hover:border-rose-500 hover:text-rose-500 text-gray-400 cursor-pointer transition-all duration-300">
             <PlusCircleIcon className="w-12 h-12" />
             <span className="text-lg font-semibold">Add New</span>
           </button>
        </div>
      ) : (
        <div className="text-center py-10 px-4 max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-300">Welcome to WellnessCraft!</h3>
          <p className="mt-2 text-gray-400">It looks like you don't have any profiles yet. Create one to get started.</p>
          <button type="button" onClick={() => setIsCreating(true)} className="mt-6 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700">
            Create First Profile
          </button>
        </div>
      )}
      
      {isCreating && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
            {isLoading ? <LoadingSpinner /> : <ProfileForm onGeneratePlan={handleCreate} isLoading={isLoading} onClose={() => setIsCreating(false)} />}
        </div>
      )}

      {profileToDelete && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-700 p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">Confirm Deletion</h3>
                  <p className="text-gray-400 mb-6">
                      Are you sure you want to delete the profile for <span className="font-bold text-white">{profileToDelete.name}</span>? This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                      <button onClick={() => setProfileToDelete(null)} className="w-full text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors bg-gray-600 hover:bg-gray-500">
                          Cancel
                      </button>
                      <button onClick={executeDelete} className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all bg-red-600 hover:bg-red-700">
                          Delete
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProfileSelectionScreen;