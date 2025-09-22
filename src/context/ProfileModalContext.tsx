import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileModalContextType {
  isProfileModalVisible: boolean;
  showProfileModal: () => void;
  hideProfileModal: () => void;
}

const ProfileModalContext = createContext<ProfileModalContextType | undefined>(undefined);

export const useProfileModal = () => {
  const context = useContext(ProfileModalContext);
  if (!context) {
    throw new Error('useProfileModal must be used within a ProfileModalProvider');
  }
  return context;
};

interface ProfileModalProviderProps {
  children: ReactNode;
}

export const ProfileModalProvider: React.FC<ProfileModalProviderProps> = ({ children }) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const showProfileModal = () => setIsProfileModalVisible(true);
  const hideProfileModal = () => setIsProfileModalVisible(false);

  return (
    <ProfileModalContext.Provider
      value={{
        isProfileModalVisible,
        showProfileModal,
        hideProfileModal,
      }}
    >
      {children}
    </ProfileModalContext.Provider>
  );
};