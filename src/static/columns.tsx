import React from "react";
import { ColumnsTableProps } from "../components/dataTable/types";

export const columns: ColumnsTableProps[] = [{
  key: "service",
  title: "Servicio/Área",
  allowsSorting: true,
  export: true,
  className: "text-danger",
}, {
  key: "topic",
  title: "Tema",
  allowsSorting: true,
  export: true,
  className: "text-danger",
}, {
  key: "date",
  title: "Fecha",
  allowsSorting: true,
  export: true,
  className: "text-danger",
  dateFormat: "DD/MM/YYYY",
}, {
  key: "hour",
  title: "Hora",
  allowsSorting: false,
  className: "text-danger",
  allowsResizing: true,
}, {
  key: "status",
  title: "Estado",
  allowsSorting: true,
  export: true,
  className: "text-danger",
}, {
  key: "fake",
  title: "Render",
  className: "text-danger",
  renderRow: ({ row }) => {
    const { status } = row as IRows
    return (
      <p className={`text-white ${status === "Activo" ? "bg-success" : "bg-danger"} w-16 rounded text-center my-0.5 p-0`}>
        {status}
      </p>
    )
  }
}]

