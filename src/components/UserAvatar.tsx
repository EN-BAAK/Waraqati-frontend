"use client"

import React, { useEffect, useState } from "react";
import { useGetUserProfileImage } from "@/hooks/useUser";
import { UserAvatarProps } from "@/types/components";
import { colors } from "@/constants/global";
import Image from "next/image";
import { useOnScreen } from "@/hooks/useHelpers";
import { Skeleton } from "./ui/skeleton";

const UserAvatar: React.FC<UserAvatarProps> = ({ firstName, lastName, id, width = 35, height = 35 }) => {
  const { isVisible, ref } = useOnScreen()
  const { data: profileImage, isPending } = useGetUserProfileImage(id, isVisible);
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
    <div className="flex-shrink-0" ref={ref}>
      {isPending ? <Skeleton style={{ width, height }} className="rounded-full" />
        : profileImageUrl ? (
          <Image
            width={width}
            height={height}
            src={profileImageUrl}
            alt="User Avatar"
            style={{ width, height }}
            className={`border border-border rounded-full`}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/avatar.png"
          />
        ) : (
          <div
            className={`${bgColor} flex items-center justify-center border border-border rounded-full font-medium text-white`}
            style={{ width, height, fontSize: width / 2.5 }}
          >
            {firstName[0]}
          </div>)
      }
    </div>
  );
};

export default UserAvatar;