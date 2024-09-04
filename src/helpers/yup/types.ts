import { DateValue, TimeInputValue } from "@nextui-org/react";
import yup from "../../utils/yup";

export type TypeRangeDateValue = "days" | "months" | "years";
export type TypeRangeTimeValue = "hours" | "minutes";

export interface DualDateValidateProps {
  startDate: string;
  endDate: string;
  type?: TypeRangeDateValue;
  range?: number;
  maxStartDate?: string;
  minStartDate?: string;
  maxEndDate?: string;
  minEndDate?: string;
}

export interface DualTimeValidateProps {
  startTime: string;
  endTime: string;
  range?: number;
  type?: TypeRangeTimeValue;
}

export interface DateMinMaxValueProps {
  minDate: string;
  maxDate: string;
}

export interface TestDateRangeProps {
  value: DateValue | undefined;
  date: string;
  type: "min" | "max"
}

export interface TestDualDateProps {
  value: DateValue | TimeInputValue | undefined;
  context: yup.TestContext
  name: string;
  type: "min" | "max";
}

export interface TestDualDateRangeProps extends TestDualDateProps {
  range: number;
  rangeDate: TypeRangeDateValue | TypeRangeTimeValue | undefined
}
