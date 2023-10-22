import { SelectGroup, SelectInput, SelectItem } from "./SelectInput";

interface ISelectDropdownBox {
  onChange(value: string): void;
  value: string;
  options: { label: string; value: string }[];
}

export const SelectDropdownBox = (props: ISelectDropdownBox) => {
  return (
    <SelectInput
      label="Select member role"
      onChange={props.onChange}
      value={props.value}
    >
      <SelectGroup>
        {props.options.map(({ label, value }) => (
          <SelectItem value={value}>{label}</SelectItem>
        ))}
      </SelectGroup>
    </SelectInput>
  );
};
