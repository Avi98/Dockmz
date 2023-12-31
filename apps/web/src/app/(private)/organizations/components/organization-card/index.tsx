"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Avatar } from "../../../../../components/avatar";
import {
  Dropdown,
  DropdownItem,
} from "../../../../../components/dropdownMenu/DropdownMenu";
import { RandomOrgIllustrator } from "./RandomOrgIllustrator";

export const OrganizationCard = () => {
  const dropdownItemStyle =
    "m-2 flex gap-4 p-2 outline-none hover:bg-sky-700 active:bg-sky-700 focus:bg-sky-700 rounded";
  return (
    <div className="border-border max-h-[40rem] max-w-[20rem] cursor-pointer border transition-all hover:border-white">
      <div className="border-border flex flex-row items-center justify-between border-b">
        <div className="px-5 text-xl font-medium capitalize">clients</div>
        <Dropdown>
          <DropdownItem className={dropdownItemStyle} onClick={() => {}}>
            <Trash2 />
            delete organization
          </DropdownItem>
          <DropdownItem className={dropdownItemStyle} onClick={() => {}}>
            <Edit2 />
            update organization
          </DropdownItem>
        </Dropdown>
      </div>
      <div className="border-border border-b px-5 pt-5">
        <RandomOrgIllustrator orgIllId={2} />
      </div>
      <div className="flex flex-col gap-5 p-5">
        <div className="text-base font-thin">
          Project description for user agent ids. the Idss that are requesited
        </div>
        <div className="flex flex-row items-center justify-start gap-2">
          <Avatar size={"xs"} random fullName="n a" />
          <Avatar size={"xs"} random fullName="a b" />
          <Avatar size={"xs"} random fullName="a v" />
        </div>
      </div>
    </div>
  );
};
