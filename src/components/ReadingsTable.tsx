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

import { IMeterReading } from "@/@types";
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
  ICreateReadingDto,
  useCreateMeterReadingMutation,
  useEditMeterReadingMutation,
  useGetMeterReadingsQuery,
} from "@/lib/redux/services/bills-mgmt.api.service";
import { IUser } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import { getErrorString } from "@/utils/error-utils";
import { formatDate } from "date-fns";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { AppAlert, AppAlertDialog, useAlertState } from "./Alert";
import Empty from "./Empty";
import { MeterReadingForm } from "./Forms/MeterReadingForm";
import RenderIf from "./RenderIf";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function MeterReadingsTable({}: {}) {
  const {
    data = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMeterReadingsQuery();
  const [editMeterReading, setEditMeterReading] =
    React.useState<IMeterReading | null>(null);
  const [createMeterReading, setCreateMeterReading] =
    React.useState<boolean>(false);

  const user = useSelector((state: RootState) => state.auth.user) as IUser;

  const columns: ColumnDef<IMeterReading>[] = React.useMemo(
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
        id: "occupant_name",
        accessorFn: (row) =>
          `${row.room?.current_occupant?.first_name} ${row?.room?.current_occupant?.last_name}`,
        header: "Occupant Name",
        cell: ({ row }) => (
          <div className="capitalize flex items-center space-x-2">
            <Avatar className="border border-amber-100">
              <AvatarImage
                src={
                  row?.original?.room?.current_occupant?.profile_photo ||
                  `https://robohash.org/${row.original?.room?.current_occupant?.email}`
                }
              />
              <AvatarFallback>
                {row?.original?.room?.current_occupant?.first_name?.[0] || ""}{" "}
                {row?.original?.room?.current_occupant?.last_name?.[0] ||
                  ""}{" "}
              </AvatarFallback>
            </Avatar>
            <span className="capitalize">
              {row.original.room?.current_occupant?.first_name}{" "}
              {row.original.room?.current_occupant?.last_name}
            </span>
          </div>
        ),
      },
      {
        id: "room",
        accessorFn: (row) => row.room.name,
        header: "Room",
        cell: ({ row }) => <div>{row.original.room?.name}</div>,
      },
      {
        accessorKey: "value",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Reading Value
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("value")}</div>
        ),
      },
      {
        accessorKey: "reading_date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Reading Date
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">
            {formatDate(row.original.reading_date, "PPP")}
          </div>
        ),
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

                <DropdownMenuItem
                  onClick={() => setEditMeterReading(row.original)}
                >
                  {user?.is_admin ? "Edit Reading" : "View Reading Info"}
                </DropdownMenuItem>
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
  const [editMeterReadingMutation, { isLoading: editingMeterReading }] =
    useEditMeterReadingMutation();
  const [createMeterReadingMutation, { isLoading: creatingMeterReading }] =
    useCreateMeterReadingMutation();

  const handleCreateMeterReading = async (values: ICreateReadingDto) => {
    try {
      await createMeterReadingMutation(values).unwrap();
      setCreateMeterReading(false);
      toast.success("Meter Reading Created Successfully");
    } catch (err) {
      toast.error(getErrorString(err));
    }
  };

  const handleEditUser = async (values: Partial<ICreateReadingDto>) => {
    try {
      if (!editMeterReading) return toast.error("Can't find Reading Id");

      await editMeterReadingMutation({
        id: editMeterReading._id,
        body: values,
      }).unwrap();
      setEditMeterReading(null);
      toast.success("Meter Reading Info editted Successfully");
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
    const fieldsToSearch = ["room", "reading_date", "value", "occupant_name"];
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
        <CardTitle>Meter Readings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4 space-x-2">
            <Input
              placeholder="Filter ..."
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
              <Button onClick={() => setCreateMeterReading(true)}>
                Add Readings
              </Button>
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

          <MeterReadingForm
            title="Meter Reading Info"
            description={user?.is_admin ? "View and Edit" : "View Reading Info"}
            isOpen={!!editMeterReading}
            onOpenChange={(value) => {
              if (!value) {
                setEditMeterReading(null);
              }
            }}
            initialValues={editMeterReading}
            onSubmit={(values) => handleEditUser(values)}
            disabled={!user.is_admin || editingMeterReading}
            hideAction={!user.is_admin}
            isLoading={editingMeterReading}
          />

          <RenderIf condition={user.is_admin}>
            <MeterReadingForm
              title="Create Meter Reading"
              description="Create A New Reading for a romm"
              isOpen={createMeterReading}
              onOpenChange={(value) => {
                setCreateMeterReading(value);
              }}
              onSubmit={(values) => handleCreateMeterReading(values)}
              disabled={creatingMeterReading}
              isLoading={creatingMeterReading}
            />
          </RenderIf>
        </div>
      </CardContent>
    </Card>
  );
}
