import { useCallback, useState } from "react";
import { Modal } from "../../../../../components/modal";
import { useMemberActionModal } from "./ModalProviders";
import { UserRoleEnum } from "../../../../../enums/memberRoleEnum";
import { castStringToMember as castStringToMemberRole } from "../../../../../utils";
import { Select } from "../../../../../components/select/Select";
import { Button } from "../../../../../components/button/Button";
import { role_options } from "../../../../../utils/roleOption";
import { useUpdateMemberRole } from "../../../../../../api/org";
import { toast } from "../../../../../components/toast/use-toast";

interface IMemberRoleChangeModal {
  memberId: string;
}

const getRole = (role: string) =>
  role_options.filter(({ value }) => role === value).at(0);

export const MemberRoleChangeModal = ({ memberId }: IMemberRoleChangeModal) => {
  const {
    isUpdateMemberModalOpen: isOpen,
    memberName,
    memberRole,
    toggleUpdateMemberModal,
  } = useMemberActionModal();
  const { mutate: saveMemberRole, isLoading } = useUpdateMemberRole({
    onSuccess: () => {
      toggleUpdateMemberModal();
      toast({
        desc: "Welcome back!",
        title: "Login Successful",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        desc: "Login failed",
        title: error?.message || "Something went wrong",
        variant: "error",
      });
    },
  });

  const [role, setRole] = useState<{ label: string; value: UserRoleEnum }>(
    getRole(memberRole) || {
      label: "Member",
      value: UserRoleEnum.MEMBER,
    }
  );

  const updateMemberRole = useCallback((value: string) => {
    if (!value) return;

    const memberRole = castStringToMemberRole(value);
    const role = memberRole ? getRole(memberRole) : null;
    if (role) setRole(role);
  }, []);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveMemberRole({ memberId: Number(memberId), role: role.value });
  };

  return (
    <Modal
      open={isOpen}
      title={`Update role`}
      closeModal={toggleUpdateMemberModal}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">Current role for {`${memberName}`}</div>
            <Select
              value={role}
              onChange={updateMemberRole}
              options={role_options}
              placeholder="User role"
            />
          </div>
          <div className="flex justify-end gap-3 py-5">
            <Button type="button" onClick={toggleUpdateMemberModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Update
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
