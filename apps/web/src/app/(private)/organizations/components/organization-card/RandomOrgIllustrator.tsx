import { illustratorComponent } from "./utils";

export const RandomOrgIllustrator = (props: { orgIllId: number }) =>
  illustratorComponent.at(props.orgIllId)!();
