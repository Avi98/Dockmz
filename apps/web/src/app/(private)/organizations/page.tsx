import { Avatar } from "../../../components/avatar";
import { OrganizationAddCard } from "./components/organization-add-card";
import { OrganizationList } from "./components/organization-list";

const Organizations = () => {
  return (
    <div className="px-20 py-10">
      <div className="flex flex-row items-center gap-3 text-center">
        <Avatar fullName="Alex B" className="rounded-md" />
        <h3 className="text-2xl">Welcome to your organization</h3>
      </div>
      <div className="flex flex-wrap gap-10 py-10">
        <OrganizationAddCard />
        <OrganizationList />
      </div>
    </div>
  );
};

export default Organizations;
