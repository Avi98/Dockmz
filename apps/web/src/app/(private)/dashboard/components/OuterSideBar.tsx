"use client";
import { LogoResponsiveIcon } from "../../../../components/logo/responsive-logo";
import { useSideBar } from "../../../../components/provider/side-bar-provider";
import { CloseSideBar, NavBar, SideBar } from "../../../../components/sideBar";
import { ClipboardCheckIcon, Command, UserPlus2, Users } from "lucide-react";
import { privatePath } from "../../../../utils/paths";

export const OuterSideBar = () => {
  const { isOpen } = useSideBar();
  return (
    <SideBar>
      <NavBar.Header>
        <LogoResponsiveIcon hideName={!isOpen} />
      </NavBar.Header>
      <NavBar.List>
        <NavBar.LinkItem
          hideLabel={isOpen}
          href={privatePath.dashboard}
          icon={<Command />}
          label="All Projects"
        />
        <NavBar.LinkItem
          hideLabel={isOpen}
          href={privatePath.members}
          icon={<Users />}
          label="View members"
        />
        <NavBar.LinkItem
          hideLabel={isOpen}
          href={privatePath.addMembers}
          icon={<UserPlus2 />}
          label="Add new members"
        />
        <NavBar.LinkItem
          hideLabel={isOpen}
          href={privatePath.createProjects}
          icon={<ClipboardCheckIcon />}
          label="Create new project"
        />
      </NavBar.List>
      <NavBar.Footer>
        <CloseSideBar />
      </NavBar.Footer>
    </SideBar>
  );
};
