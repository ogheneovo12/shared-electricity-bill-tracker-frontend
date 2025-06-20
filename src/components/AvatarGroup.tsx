import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarGroupProps {
  avatars: { src?: string; name?: string }[];
  maxDisplay?: number;
}

export const AvatarGroup = ({ avatars, maxDisplay = 3 }: AvatarGroupProps) => {
  const displayAvatars = avatars.slice(0, maxDisplay);
  const extraCount = avatars.length - maxDisplay;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {displayAvatars.map((avatar, idx) => (
          <Avatar
            key={idx}
            className="border-2 border-white dark:border-black w-9 h-9 text-xs"
          >
            {avatar.src && <AvatarImage src={avatar.src} alt={avatar.name} />}
            <AvatarFallback>
              {avatar.name?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        ))}

        {extraCount > 0 && (
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-white dark:border-black">
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
};
