import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logout } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import { Link } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";

export function UserAvatarDropdown() {
  const dispatch = useDispatch();
  const {
    first_name = " ",
    last_name = " ",
    email = "",
    profile_photo,
  } = useSelector((state: RootState) => state.auth.user) || {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={profile_photo || `https://robohash.org/${email}`} />
          <AvatarFallback>
            {first_name?.[0]} {last_name[0]}{" "}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/app/settings">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => dispatch(logout())}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
