"use client"

import React, { useEffect, useState } from "react";
import { useGetUserProfile } from "@/hooks/useUser";
import { UserAvatarProps } from "@/types/components";
import { colors } from "@/constants/global";
import Image from "next/image";

const UserAvatar: React.FC<UserAvatarProps> = ({ firstName, lastName, id }) => {
  const { data: profileImage } = useGetUserProfile(id);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profileImage && profileImage instanceof Blob) {
      const url = URL.createObjectURL(profileImage);
      setProfileImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profileImage]);

  const index = (firstName.length + lastName.length) % colors.length;
  const bgColor = colors[index];

  return (
    <div className="flex-shrink-0 w-9 h-9">
      {profileImageUrl ? (
        <Image
          width={36}
          height={36}
          src={profileImageUrl}
          alt="User Avatar"
          className="border border-border rounded-full"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/avatar.png"
        />
      ) : (
        <div className={`${bgColor} w-[35px] h-[35px] flex items-center justify-center border border-border rounded-full font-medium text-white`}>
          {firstName[0]}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;