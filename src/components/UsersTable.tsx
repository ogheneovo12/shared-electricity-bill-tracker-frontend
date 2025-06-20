"use client";

import {
  ColumnDef,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateUserMutation,
  useEditUserMutation,
  useToggleAdminRoleMutation,
} from "@/lib/redux/services/users.service";
import { IUser } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import { getErrorString } from "@/utils/error-utils";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { AppAlert, AppAlertDialog, useAlertState } from "./Alert";
import Empty from "./Empty";
import { UserProfileForm } from "./Forms/UserProfileForm";
import RenderIf from "./RenderIf";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function UsersTable({
  data,
  isLoading,
  error,
  isError,
  isSuccess,
}: {
  data: IUser[];
  isLoading?: boolean;
  error?: unknown;
  isError?: boolean;
  isSuccess?: boolean;
}) {
  const { closeAlert, openAlert, alertState } = useAlertState();
  const [editUser, setEditUser] = React.useState<IUser | null>(null);
  const [createUser, setCreateUser] = React.useState<boolean>(false);
  const [toggleAdmin] = useToggleAdminRoleMutation();
  const user = useSelector((state: RootState) => state.auth.user) as IUser;

  const handleToggleAdmin = async (id: string) => {
    try {
      await toggleAdmin(id).unwrap();
      closeAlert();
    } catch (err) {
      toast.success(getErrorString(err));
    }
  };

  const columns: ColumnDef<IUser>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "first_name",
        header: "Fullname",
        cell: ({ row }) => (
          <div className="capitalize flex items-center space-x-2">
            <Avatar className="border border-amber-100">
              <AvatarImage
                src={
                  row?.original?.profile_photo ||
                  `https://robohash.org/${row.original.email}`
                }
              />
              <AvatarFallback>
                {row?.original.first_name?.[0] || ""}{" "}
                {row?.original?.last_name?.[0] || ""}{" "}
              </AvatarFallback>
            </Avatar>
            <span className="capitalize">
              {row.original.first_name} {row.original.last_name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "Current Room",
        cell: ({ row }) => <div>{row.original.currentRoom?.name}</div>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => setEditUser(row.original)}>
                  {user?.is_admin ? "Edit Member Details" : "View Member Info"}
                </DropdownMenuItem>
                <RenderIf condition={user?.is_admin}>
                  <DropdownMenuItem
                    onClick={() =>
                      openAlert({
                        title: row.original.is_admin
                          ? "Remove From Admin"
                          : "Make Admin",
                        description: row.original.is_admin
                          ? "This User will no longer have admin access"
                          : "This user will now have full admin priviledges",
                        onAccept: () => handleToggleAdmin(row.original._id),
                      })
                    }
                  >
                    {row.original.is_admin ? "Remove From Admin" : "Make Admin"}
                  </DropdownMenuItem>
                </RenderIf>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [editUserMutation, { isLoading: editingUser }] = useEditUserMutation();
  const [createUserMutation, { isLoading: creatingUser }] =
    useCreateUserMutation();

  const handleCreateUser = async (values: Partial<IUser>) => {
    try {
      await createUserMutation(values).unwrap();
      setCreateUser(false);
      toast.success("Member Created Successfully");
    } catch (err) {
      toast.error(getErrorString(err));
    }
  };

  const handleEditUser = async (values: Partial<IUser>) => {
    try {
      if (!editUser) return toast.error("Can't find user Id");
      const { email, ...rest } = values;
      await editUserMutation({ id: editUser._id, payload: rest }).unwrap();
      setEditUser(null);
      toast.success("Member Info editted Successfully");
    } catch (err) {
      toast.error(getErrorString(err));
    }
  };
  const customGlobalFilter = <TData,>(
    row: Row<TData>,
    _columnId: string,
    filterValue: string
  ): boolean => {
    const search = filterValue.toLowerCase();
    const fieldsToSearch = [
      "email",
      "first_name",
      "last_name",
      "track",
      "title",
    ];
    return fieldsToSearch.some((field) => {
      const value = row.getValue(field);
      return String(value).toLowerCase().includes(search);
    });
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    globalFilterFn: customGlobalFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  const errorString: any = React.useMemo(
    () => (isError ? getErrorString(error) : ""),
    [error, isError]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4 space-x-2">
            <Input
              placeholder="Filter email, name, track, title..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <RenderIf condition={user?.is_admin}>
              <Button onClick={() => setCreateUser(true)}>Create User</Button>
            </RenderIf>
          </div>
          <div className="rounded-md border">
            <RenderIf condition={!!isError}>
              <AppAlert description={errorString} />
            </RenderIf>
            <RenderIf condition={!!isLoading}>
              <div className="text-center">
                <p>Fetching users...</p>
              </div>
            </RenderIf>
            <RenderIf condition={!!isSuccess && !data.length}>
              <Empty message="No users at the moment" />
            </RenderIf>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>

          <UserProfileForm
            title="User Info"
            description={user?.is_admin ? "View and Edit" : "View User Info"}
            isOpen={!!editUser}
            onOpenChange={(value) => {
              if (!value) {
                setEditUser(null);
              }
            }}
            initialValues={editUser}
            onSubmit={(values) => handleEditUser(values)}
            disabled={!user.is_admin || editingUser}
            hideAction={!user.is_admin}
            isLoading={editingUser}
          />

          <RenderIf condition={user.is_admin}>
            <UserProfileForm
              title="Create User"
              description="Create User and save"
              isOpen={createUser}
              onOpenChange={(value) => {
                setCreateUser(value);
              }}
              onSubmit={(values) => handleCreateUser(values)}
              disabled={creatingUser}
              isLoading={creatingUser}
            />
            <AppAlertDialog
              isOpen={alertState.isOpen}
              title={alertState.title}
              description={alertState.description}
              onAccept={alertState.onAccept}
              onCancel={closeAlert}
            />
          </RenderIf>
        </div>
      </CardContent>
    </Card>
  );
}
