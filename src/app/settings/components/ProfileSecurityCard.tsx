import React from "react";
import { Button, Card, Tooltip, tx } from "@zeeve-platform/ui";

interface ProfileSecurityCardProps {
  isGoogleConnected?: boolean | null;
  authProvider?: string | null;
  onSetNewPassword: () => void;
  onDeleteAccount?: () => void;
  isDeleteDisabled?: boolean;
  className?: string;
}

const ProfileSecurityCard = ({
  isGoogleConnected,
  authProvider,
  onSetNewPassword,
  onDeleteAccount,
  isDeleteDisabled = false,
  className,
}: ProfileSecurityCardProps) => {
  const provider = authProvider?.toLowerCase() ?? "";
  const canChangePassword = !provider || provider === "email";
  const providerLabel = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : "your SSO";
  const disableChangePasswordCopy = `Passwords are managed through ${providerLabel}. Contact support if you need help updating your credentials.`;
  const isSocialLogin = Boolean(isGoogleConnected) || (!canChangePassword && provider !== "");
  return (
    <Card
      className={tx(
        "rounded-[28px] border border-[#E2E8FF] bg-gradient-to-r from-[#F6F9FF] via-[#F3EEFF] to-[#E6FAFF] p-5 shadow-[0_20px_46px_rgba(25,32,58,0.18)] sm:p-7",
        className,
      )}
    >
      <h3 className="mb-2 text-lg font-semibold text-slate-900">Security</h3>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex w-full min-w-0 flex-col rounded-2xl border border-[#E3E6F8] bg-[#F8FAFF] p-4 shadow-[0_12px_26px_rgba(79,70,229,0.08)]">
          <p className="text-sm font-medium text-[#4B5563]">
            {canChangePassword ? "Change your password through the button below." : disableChangePasswordCopy}
          </p>
          {canChangePassword ? (
            <Button
              variant="outline"
              className="mt-3 w-full rounded-xl border border-[#CBD5F5] bg-[#F3F5FF] px-6 py-3 text-sm font-semibold text-brand-primary shadow-[0_6px_20px_rgba(15,23,42,0.08)] transition hover:border-brand-primary/70 hover:bg-[#E8EBFF] sm:w-max"
              onClick={onSetNewPassword}
            >
              Change Password
            </Button>
          ) : (
            <Tooltip text={disableChangePasswordCopy} placement="top">
              <span className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="mt-3 w-full cursor-not-allowed rounded-xl border border-[#CBD5F5] bg-[#F3F5FF] px-6 py-3 text-sm font-semibold text-brand-primary opacity-60 sm:w-max"
                  onClick={onSetNewPassword}
                  isDisabled
                >
                  Change Password
                </Button>
              </span>
            </Tooltip>
          )}
        </div>
        <div className="flex w-full min-w-0 flex-col rounded-2xl border border-[#FECACA] bg-[#FFF5F5] p-4 shadow-[0_12px_26px_rgba(248,113,113,0.15)]">
          <p className="text-sm font-medium text-[#B91C1C]">
            {isSocialLogin
              ? `Submit a deletion request and our support team will guide you through the ${providerLabel} verification.`
              : "Submit an account deletion request and our support team will help you complete the process."}
          </p>
          {isDeleteDisabled ? (
            <Tooltip text="Cancel all active subscriptions before requesting for account deletion." placement="top">
              <span className="inline-flex w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="mt-3 w-full rounded-xl border-[#F87171] text-xs text-[#B91C1C] transition hover:bg-[#FEE2E2] disabled:cursor-not-allowed disabled:opacity-60 sm:w-max md:text-base"
                  onClick={onDeleteAccount}
                  isDisabled
                >
                  Submit account deletion request
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              className="mt-3 w-full rounded-xl border-[#F87171] text-[#B91C1C] transition hover:bg-[#FEE2E2] disabled:cursor-not-allowed disabled:opacity-60 sm:w-max"
              onClick={onDeleteAccount}
            >
              Submit deletion request
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileSecurityCard;
