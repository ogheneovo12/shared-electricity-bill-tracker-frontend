import { UserProfileForm } from "@/components/Forms/UserProfileForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserProfileQuery } from "@/lib/redux/services/auth.api.service";
import { useEditUserProfileMutation } from "@/lib/redux/services/users.service";
import { IUser } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import { getErrorString } from "@/utils/error-utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "@tanstack/react-router";
import {
  createFileRoute,
  stripSearchParams,
  useSearch,
} from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const Route = createFileRoute("/app/_app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const search = useSearch({ strict: false }) as { open: string };
  const [showProfileEditForm, setShowProfileEditForm] = useState(false);
  const { isLoading } = useGetUserProfileQuery();
  const [editProfile, { isLoading: editingProfile }] =
    useEditUserProfileMutation();

  const user = useSelector((state: RootState) => state.auth.user) as IUser;

  const handleEditProfile = async (values: Partial<IUser>) => {
    try {
      const { email, ...rest } = values;
      await editProfile(rest).unwrap();
      setShowProfileEditForm(false);
      toast.success("Profile Updated Successfully");
    } catch (err) {
      toast.error(getErrorString(err));
    }
  };

  useEffect(() => {
    if (search.open === "yes") {
      setShowProfileEditForm(true);
      router.navigate({
        search: undefined,
        replace: true,
      });
    }
  }, [search.open]);
  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" flex items-center space-x-2">
            <Avatar className="border border-amber-100 size-[100px]">
              <AvatarImage
                src={
                  user?.profile_photo || `https://robohash.org/${user.email}`
                }
              />
              <AvatarFallback>
                {user?.first_name?.[0] || ""} {user?.last_name?.[0] || ""}{" "}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="body-text font-semibold capitalize">
                {user.first_name} {user.last_name}{" "}
                {user.display_name && <small>@{user.display_name}</small>}
              </p>
            </div>
          </div>
          <Button
            disabled={isLoading}
            className="mt-4"
            onClick={() => setShowProfileEditForm(true)}
          >
            {isLoading ? "Feching Profile" : "Edit Profile"}
          </Button>
        </CardContent>
      </Card>
      <UserProfileForm
        isOpen={showProfileEditForm}
        title="Edit Profile"
        description="Update Your Profile Info"
        disable_email
        initialValues={user}
        isLoading={editingProfile}
        onOpenChange={(val) => setShowProfileEditForm(val)}
        onSubmit={handleEditProfile}
        disable_title
        disabled={isLoading}
      />
    </Fragment>
  );
}
