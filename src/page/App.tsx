// hooks
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";

// ui
import { DevTool } from "@hookform/devtools"
import { Button } from "@nextui-org/react";
import RHFInput from "../components/RHFInput ";
import RHFTime from "../components/RHFTime";
import RHFDate from "../components/RHFDate";
import RHFDualDate from "../components/RHFDualDate";
import DataTable from "../components/dataTable/DataTable";
import Panel from "../components/Panel";
import Layout from "../components/Layout";
import RHFSelect from "../components/RHFSelect";

// statics
import schema from "../static/schema";
import { columns } from "../static/columns";
import { fakerRows, fakerUsers } from "../static/faker";

// hooks and types
import { useEffect, useState } from "react";
import { IForm } from "../types/app";

// utils
import { CalendarDate, today, getLocalTimeZone, Time } from "@internationalized/date";


const App = () => {
  const [data, setData] = useState<IRows[]>([]);
  const [options, setOptions] = useState<{ key: string, label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const methods = useForm<IForm>({
    shouldFocusError: true,
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IForm> = async data => {
    console.log("🚀 ~ Event ~ data:", data)
  }

  useEffect(() => {
    const rows = fakerRows();
    const options = fakerUsers();

    setData(rows);

    setOptions([{
      key: "928",
      label: "Nicolas"
    }, {
      key: "10",
      label: "James"
    },
    ...options
    ])

    setTimeout(() => {
      setLoading(false);
      methods.setValue("input", "test auto lorem", { shouldValidate: true })
      // methods.setValue("select", "928,10", { shouldValidate: true })
      methods.setValue("date", new CalendarDate(1997, 9, 28))
      methods.setValue("date1", today(getLocalTimeZone()))
      methods.setValue("time", new Time(14, 28))
    }, 1000)
  }, [methods])

  return (
    <Layout title="REACT HOOK FORM + NEXTUI" color="primary">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Panel title="FORM WITHOUT SCHEMA">
            <div className="flex gap-5">
              <RHFInput
                name="inputR"
                label="RULES INPUT"
                color="primary"
                rules={{
                  maxLength: { message: "maximo 10 letras", value: 10 },
                  minLength: { message: "minimo 4 letras", value: 4 },
                  required: { message: "campo requerido", value: true },
                }}
              />
              <RHFInput
                name="inputR2"
                label="RULES INPUT NUMBER"
                color="primary"
                type="number"
                rules={{
                  max: { message: "maximo 10", value: 10 },
                  min: { message: "minimo 4", value: 4 },
                  required: { message: "campo requerido", value: true },
                }}
              />
            </div>
          </Panel>
          <Panel title="FORM WITH SCHEMA">
            <div className="grid grid-cols-3 gap-5">
              <RHFInput name="input" label="Input" placeholder="Write" variant="bordered" color="primary" />
              <RHFTime name="time" label="Time" color="primary" defaultValue={new Time(10, 10)} />
              <RHFDate name="dat3e" label="Dat3e" color="primary" />
              <RHFDate name="date" label="Date" color="success" rules={{ required: { value: true, message: "Campo Requerido" } }} />
              <RHFDualDate
                startDate={{
                  name: "date1",
                  label: "Fecha Inicial",
                  rules: { required: { value: true, message: "Campo Requerido" } }
                }}
                endDate={{
                  name: "date2",
                  label: "Fecha Final",
                  visibleMonths: 2,
                  rules: { required: { value: true, message: "Campo Requerido" } },
                  defaultValue: new CalendarDate(2000, 12, 24)
                }}
              />
              <RHFSelect
                name="select"
                label="Select"
                placeholder="Seleccione..."
                isLoading={loading}
                data={options}
                selectionMode="multiple"
                defaultOptions="928"
              />
            </div>
            <div className="my-8">
              <Button type="submit">Click</Button>
            </div>
          </Panel >
          <Panel title="Table Component" >
            <DataTable
              selectionMode="multiple"
              onSelect={row => console.log(row)}
              rows={data}
              loading={loading}
              columns={columns}
              renderRow={[{
                key: "view",
                render: () => <>view Component</>
              }, {
                key: "attendance",
                render: () => "attendanceString"
              }]}
            />
          </Panel>
        </form>
      </FormProvider>
      <DevTool control={methods.control} />
    </Layout >
  )
}

export default App