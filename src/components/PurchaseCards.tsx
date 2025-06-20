import React from "react";
import { IPurchase } from "@/@types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUpDown, Edit2Icon, EyeIcon, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { PurchaseForm } from "./Forms/PurchaseForm";
import { useSelector } from "react-redux";
import { IUser } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import {
  ICreatePurchaseDto,
  useCreatePurchaseMutation,
  useEditPurchaseMutation,
} from "@/lib/redux/services/bills-mgmt.api.service";
import { toast } from "sonner";
import { getErrorString } from "@/utils/error-utils";
import RenderIf from "./RenderIf";
import {
  formatCurrency,
  getRandomPastelColor,
  getRandomPastelGradient,
} from "@/lib/utils";

type Props = {
  purchases: IPurchase[];
  sort: "asc" | "desc";
  onSortChange: (sort: "asc" | "desc") => void;
};

export function PurchaseCards({ purchases, sort, onSortChange }: Props) {
  const [editPurchase, setEditPurchase] = React.useState<IPurchase | null>(
    null
  );
  const [createPurchase, setCreatePurchase] = React.useState<boolean>(false);
  const [editPurchaseMutation, { isLoading: editingPurchase }] =
    useEditPurchaseMutation();
  const [createPurchaseMutation, { isLoading: creatingPurchase }] =
    useCreatePurchaseMutation();

  const user = useSelector((state: RootState) => state.auth.user) as IUser;

  const handleCreatePurchaseRecord = async (values: ICreatePurchaseDto) => {
    try {
      await createPurchaseMutation(values).unwrap();
      setCreatePurchase(false);
      toast.success("Purchase Record Created Successfully");
    } catch (err) {
      toast.error(getErrorString(err));
    }
  };

  const handleEditPurchase = async (values: Partial<ICreatePurchaseDto>) => {
    try {
      if (!editPurchase) return toast.error("Can't find Purchase Record Id");

      await editPurchaseMutation({
        id: editPurchase._id,
        body: values,
      }).unwrap();
      setEditPurchase(null);
      toast.success("Purchase Record editted Successfully");
    } catch (err) {
      toast.error(getErrorString(err));
    }
  };

  const sorted = [...purchases].sort((a, b) =>
    sort === "asc"
      ? new Date(a.date_purchased).getTime() -
        new Date(b.date_purchased).getTime()
      : new Date(b.date_purchased).getTime() -
        new Date(a.date_purchased).getTime()
  );

  return (
    <div>
      <div className="flex items-center my-4 justify-between">
        <Button
          variant="ghost"
          onClick={() => onSortChange(sort === "asc" ? "desc" : "asc")}
        >
          Sort by Date Purchased <ArrowUpDown className="ml-2" />
        </Button>
        <RenderIf condition={user.is_admin}>
          <Button onClick={() => setCreatePurchase(true)}>
            Add New Purchase
          </Button>
        </RenderIf>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((purchase, idx) => (
          <Card
            key={idx}
            style={{
              borderTopWidth: "20px",
              borderTopColor: getRandomPastelColor(idx),
              borderStyle: "solid",
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {new Date(purchase.date_purchased).toLocaleDateString()}
                <Button
                  onClick={() => setEditPurchase(purchase)}
                  variant={"outline"}
                >
                  <EyeIcon />
                </Button>
              </CardTitle>
              <div className="text-muted-foreground font-semi-bold text-base">
                Amount: {formatCurrency(purchase.total_amount)} | Units:{" "}
                {formatCurrency(purchase.total_units, false)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-semibold mb-2">Room Contributions:</div>
              <ul className="space-y-1 divide-y divide-black">
                {purchase.contributions.map((c, i) => (
                  <li key={i} className="flex justify-between space-y-2">
                    <span>
                      {c.room.name}
                      {c.note ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{c.note}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                    </span>
                    <span>
                      {formatCurrency(c.amount)} (
                      {formatCurrency(c.units, false)} units)
                    </span>
                  </li>
                ))}
              </ul>
              {purchase.note && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Note: {purchase.note}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <PurchaseForm
        title="Purchase Info"
        description={user?.is_admin ? "View and Edit" : "Viewing Purchase Info"}
        isOpen={!!editPurchase}
        onOpenChange={(value) => {
          if (!value) {
            setEditPurchase(null);
          }
        }}
        initialValues={editPurchase}
        onSubmit={(values) => handleEditPurchase(values)}
        disabled={!user.is_admin || editingPurchase}
        hideAction={!user.is_admin}
        isLoading={editingPurchase}
      />

      <RenderIf condition={user.is_admin}>
        <PurchaseForm
          title="Create Purchase Record"
          description="Create A New Unit Purchase Record"
          isOpen={createPurchase}
          onOpenChange={(value) => {
            setCreatePurchase(value);
          }}
          onSubmit={(values) => handleCreatePurchaseRecord(values)}
          disabled={creatingPurchase}
          isLoading={creatingPurchase}
        />
      </RenderIf>
    </div>
  );
}
