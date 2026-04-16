import React from "react";
import type { AxiosError } from "axios";
import { Button, Heading } from "@zeeve-platform/ui";
import type { SettingsNotificationPreferenceKey, SettingsUserProfile } from "../hooks/useSettings";
import ProfileDetailsCard from "./ProfileDetailsCard";
import ProfileSecurityCard from "./ProfileSecurityCard";
import ZeeveLoader from "@/components/shared/ZeeveLoader";

interface ProfileState {
  data?: SettingsUserProfile;
  isLoading: boolean;
  error?: AxiosError | null;
  refresh?: () => Promise<unknown> | void;
}

interface ProfileTabContentProps {
  profile: ProfileState;
  onOpenPasswordModal: () => void;
  onDeleteAccount: () => void;
  notifications: {
    preferences: Record<SettingsNotificationPreferenceKey, boolean>;
    onToggle: (key: SettingsNotificationPreferenceKey) => void;
    onReset: () => void;
  };
  onSaveNotifications: () => void;
  isDeleteDisabled: boolean;
}

const ProfileTabContent = ({
  profile,
  onOpenPasswordModal,
  onDeleteAccount,
  notifications,
  onSaveNotifications,
  isDeleteDisabled,
}: ProfileTabContentProps) => {
  // TODO: Re-enable notification preferences UI when design and backend are ready.
  const notificationProps = { notifications, onSaveNotifications };
  void notificationProps;
  if (profile.isLoading) {
    return (
      <section className="rounded-[28px] border border-[#E2E5F5] bg-white p-12 text-center shadow-[0_18px_36px_rgba(15,23,42,0.15)]">
        <ZeeveLoader className="mx-auto" label="Loading your profile details..." />
      </section>
    );
  }

  if (profile.error) {
    const errorPayload = profile.error.response?.data as { message?: string } | undefined;
    const errorMessage = errorPayload?.message ?? profile.error.message ?? "Please refresh the page and try again.";

    return (
      <section className="space-y-4 rounded-[28px] border border-[#FECACA] bg-[#FEF2F2] p-8 text-sm text-[#B91C1C] shadow-[0_18px_36px_rgba(248,113,113,0.16)]">
        <Heading as="h3" className="text-lg font-semibold text-[#B91C1C]">
          Unable to load your profile
        </Heading>
        <p>{errorMessage}</p>
        <Button
          onClick={() => profile.refresh?.()}
          className="w-max rounded-lg border border-white bg-white px-4 py-2 text-sm font-semibold text-[#B91C1C] shadow-[0_8px_20px_rgba(248,113,113,0.25)] transition hover:bg-[#FEE2E2]"
        >
          Retry
        </Button>
      </section>
    );
  }

  if (!profile.data) {
    return null;
  }

  return (
    <section className="space-y-5">
      <ProfileDetailsCard profile={profile.data} />
      <ProfileSecurityCard
        isGoogleConnected={profile.data.is_google_connected}
        authProvider={profile.data.provider}
        onSetNewPassword={onOpenPasswordModal}
        onDeleteAccount={onDeleteAccount}
        isDeleteDisabled={isDeleteDisabled}
      />
      {/* Will use this later
      <NotificationSettings
        id="notification-preferences"
        preferences={_notifications.preferences}
        onToggle={_notifications.onToggle}
      /> */}

      {/* <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-[#E2E5F5] bg-white px-5 py-6 sm:flex-row sm:justify-end">
        <Button
          className="rounded-xl bg-gradient-to-r from-[#4C1D95] via-[#6C37FF] to-[#7B61FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(123,97,255,0.35)] transition hover:shadow-[0_20px_44px_rgba(123,97,255,0.45)]"
          onClick={_onSaveNotifications}
        >
          Save Changes
        </Button>
        <Button
          variant="outline"
          colorScheme="purple"
          className="rounded-xl border-[#7B61FF] px-6 py-3 text-sm font-semibold text-[#4C1D95] transition hover:bg-[#EDE9FE]"
          onClick={_notifications.onReset}
        >
          Cancel
        </Button>
      </div> */}
    </section>
  );
};

export default ProfileTabContent;
