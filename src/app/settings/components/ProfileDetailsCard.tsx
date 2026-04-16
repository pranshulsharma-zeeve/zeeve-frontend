import React, { useMemo, useState } from "react";
import { Card, Tooltip, tx, useToast } from "@zeeve-platform/ui";
import { IconUserCircle } from "@zeeve-platform/icons/user/outline";
import { IconEdit1 } from "@zeeve-platform/icons/document/outline";
import Image from "next/image";
import axios from "axios";
import type { SettingsUserProfile } from "../hooks/useSettings";
import usePlatformService from "@/services/platform/use-platform-service";
import HTTP_STATUS from "@/constants/http";
import { unexpectedError } from "@/constants/error";

type ProfileFieldKey = "first_name" | "last_name" | "email" | "phone_number" | "country";

const FIELD_CONFIG: Array<{ label: string; accessor: ProfileFieldKey }> = [
  { label: "First Name", accessor: "first_name" },
  { label: "Last Name", accessor: "last_name" },
  { label: "Email ID", accessor: "email" },
  // { label: "Phone Number", accessor: "phone_number" },
  // { label: "Country", accessor: "country" },
];

const getFieldValue = (profile: SettingsUserProfile | undefined, accessor: ProfileFieldKey) => {
  if (!profile) {
    return null;
  }

  const value = profile[accessor];
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
};

interface ProfileDetailsCardProps {
  profile?: SettingsUserProfile;
  className?: string;
}

const ProfileDetailsCard = ({ profile, className }: ProfileDetailsCardProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const { request, url } = usePlatformService().dashboard.uploadImage();
  const detailFields = useMemo(
    () =>
      FIELD_CONFIG.map((field) => ({
        ...field,
        value: getFieldValue(profile, field.accessor),
      })),
    [profile],
  );

  const uploadImage = (file: File | undefined) => {
    try {
      setIsUploading(true);
      if (!file) {
        setIsUploading(false);
        return;
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      const maxSize = 1 * 1024 * 1024; // 1 MB
      console.log("File Type:", file.type);

      if (!allowedTypes.includes(file.type)) {
        toast("Only PNG, JPG and JPEG files are allowed.", {
          status: "error",
        });
        setIsUploading(false);
        return;
      }

      if (file.size > maxSize) {
        toast("Image size must be less than 1 MB.", {
          status: "error",
        });
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const full = reader.result as string;
        const base64Image = full.split(",")[1];

        const payload = { image: base64Image };

        const response = await request(url, payload);
        if (response?.status === HTTP_STATUS.OK && response?.data.success) {
          toast("Image uploaded successfully.", {
            status: "success",
          });
          setTimeout(() => window.location.reload(), 2000);
        }
      };

      reader.onerror = () => console.error("FileReader error");

      reader.readAsDataURL(file);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Failed to upload image", {
          status: "error",
          message: unexpectedError,
        });
      } else {
        toast("Failed to upload image", {
          status: "error",
          message: unexpectedError,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card
      className={tx(
        "rounded-[28px] border border-[#E6E9F8] bg-white p-7 shadow-[0_20px_46px_rgba(25,32,58,0.15)]",
        className,
      )}
    >
      <header className="mb-2 flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-slate-900">My Details</h3>
        <p className="text-sm text-slate-500">
          Review your account information. Contact support if you need to update primary contact details.
        </p>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative">
          {profile?.image_url ? (
            <Image
              src={profile.image_url}
              alt="User Profile Image"
              width={28}
              height={28}
              className="size-28 rounded-full border border-slate-300 object-cover"
              unoptimized
            />
          ) : (
            <IconUserCircle className="size-28 text-[#A0A0A0]" />
          )}
          {/* Upload Image Button */}
          <Tooltip text="Upload Image" className="ml-1 bg-brand-gray">
            <label className={`absolute bottom-0 cursor-pointer ${profile?.image_url ? "-right-2" : "-right-0"}`}>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e.target.files?.[0])}
                disabled={isUploading}
              />

              <div className="rounded-full bg-brand-primary p-1 text-xs text-white shadow">
                <IconEdit1 />
              </div>
            </label>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {detailFields.map((field) => (
          <div key={field.label} className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{field.label}</span>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              {field.value ?? "Not set"}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileDetailsCard;
