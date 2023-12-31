import { Plus } from "lucide-react";
import { Button } from "../../../../../components/button/Button";

export const OrganizationAddCard = () => {
  return (
    <div className="border-border grid max-h-[40rem] max-w-[20rem] cursor-pointer place-items-center justify-around border p-5 transition-all hover:border-white">
      <Button variant={"rounded"} size={"none"}>
        <Plus size={54} />
      </Button>
      <div className="mb-10 grid max-h-2 items-center gap-2 self-start text-center">
        <div className="text-lg font-semibold">New board</div>
        <div className="text-sm font-thin">
          Create a organization, where you can add members and view live PR
        </div>
      </div>
    </div>
  );
};
