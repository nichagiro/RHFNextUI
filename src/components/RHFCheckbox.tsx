import React from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { Checkbox, CheckboxProps } from "@nextui-org/react";

interface RHFCheckboxProps extends CheckboxProps {
  rules?: RegisterOptions;
  name: string;
}

const RHFCheckbox = ({ rules, name, ...props }: RHFCheckboxProps) => {
  const { control } = useFormContext<{ [key: string]: string }>();

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field, formState: { errors } }) => (
        <Checkbox
          {...field}
          {...props}
          isSelected={Boolean(field.value)}
          isInvalid={Boolean(errors[name])}
        >
          {props.children}
        </Checkbox>
      )}
    />
  )

}

export default RHFCheckbox


