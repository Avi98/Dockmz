import { Avatar } from "../../../components/avatar";
import { SignOutButton } from "../../../components/signOutButton";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <header
        className={`bg-header/[0.6] border-border fixed right-0 z-10 flex w-full flex-row  justify-end border-b align-middle shadow-md`}
      >
        <div className="flex items-center gap-4 px-5 py-1.5">
          <SignOutButton />
          <Avatar fullName="Alex b" />
        </div>
      </header>
      <div className="relative top-12 h-full flex-1">{children}</div>
    </div>
  );
};

export default PrivateRoute;
