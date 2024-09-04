import yup from "../utils/yup";
import { dateMinMaxValidate, dualDateValidate, dualTimeValidate } from "../helpers/yup/dates";
import { TimeInputValue } from "@nextui-org/react";

const { endDateRule, startDateRule } = dualDateValidate({
  startDate: "date1",
  endDate: "date2",
  range: 2,
  type: "months",
  maxEndDate: "2024-09-03",
  minEndDate: "2024-09-01",
  maxStartDate: "2024-09-04",
  minStartDate: "2024-08-18"
});

const { endTimeRule, startTimeRule } = dualTimeValidate({
  endTime: "dualtime2",
  startTime: "dualtime1",
  range: 1,
  type: "hours",
})

const rangeValue = dateMinMaxValidate({
  maxDate: "2024-09-03",
  minDate: "2024-09-01"
})

const schema = yup
  .object({
    input: yup.string().required(),
    date: rangeValue.required(),
    time: yup.mixed<TimeInputValue>().required(),
    date1: startDateRule.required(),
    date2: endDateRule.required(),
    select: yup.string().required(),
    area: yup.string().required(),
    dualtime1: startTimeRule.required(),
    dualtime2: endTimeRule.required(),
    autocomplete: yup.string().required(),
  }).required();

export default schema

