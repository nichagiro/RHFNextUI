/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Input, SortDescriptor, Selection, Pagination
} from "@nextui-org/react";
import TableSkeleton from "./TableSkeleton";

// hooks
import { ChangeEvent, HTMLAttributes, useCallback, useMemo, useState } from 'react';
import useDebounce from "../../helpers/hooks/useDebounce";

// uitls
import { isAfter, parse } from "@formkit/tempo";

// icons
import PlusIcon from "../../icons/PlusIcon";
import MinusIcon from "../../icons/MinusIcon";

// types
import { DataTableProps } from "./types";

const DataTable = ({
  rows, columns, showFilter = true, loading, keyRow = "id", defaultSelectedKeys = [],
  skeletonSize, selectionMode, inputSearch, showHandlePaginate = true, extraTopContent,
  onSelect, defaultPaginateNumber = 10, cellClass, ...props
}: DataTableProps) => {

  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(defaultPaginateNumber);
  const [page, setPage] = useState<number>(1);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(defaultSelectedKeys));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(props.sortDescriptor ?? {});

  const searchText = useDebounce(filterValue, 500);

  const hasSearchFilter = Boolean(searchText);

  const handleSelect = useCallback((row: Selection) => {
    setSelectedKeys(row);
    if (!onSelect || selectionMode === "none") return;

    let data: any[] = [];

    if (selectionMode === "single") {
      data = rows.find(item => item[keyRow] == [...row][0]);
    } else if (row === "all") {
      data = rows;
      setSelectedKeys(new Set(rows.map(item => item[keyRow]))); //for bug nextUI
    } else {
      data = rows.filter(item => [...row].includes(item[keyRow])); //multi
    }

    return onSelect(data);
  }, [onSelect, rows, selectionMode, keyRow])

  const filteredItems: any[] = useMemo(() => {
    let data = [...rows];

    if (hasSearchFilter) {
      data = data.filter((item) =>
        Object.values(item as string | number).some((value, index) => {
          const param = Object.keys(item)[index];

          if (!columns.map(col => col.key).includes(param)) {
            return false;
          }

          if (value === null || value === undefined || !value) {
            return false;
          }

          const data = value.toString().toLowerCase().includes(filterValue.toLowerCase())
          return data
        },
        )
      );
    }
    return data;
  }, [filterValue, hasSearchFilter, rows, columns]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let first = a[sortDescriptor.column as string | number];
      let second = b[sortDescriptor.column as string | number];

      const column = columns.find(item => item.key === sortDescriptor.column)

      if (column?.dateFormat) {
        try {
          const startDate = parse(first, column.dateFormat);
          const endDate = parse(second, column.dateFormat);
          const afterDate = isAfter(startDate, endDate);
          first = afterDate ? 1 : 0
          second = !afterDate ? 1 : 0

        } catch (error) {
          console.warn("date format is not correct", error)
        }

      }

      if (first === second) return 0;

      const cmp = first > second ? 1 : -1;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems, columns]);

  const dataRow = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end)
  }, [sortedItems, page, rowsPerPage])


  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value) as 5 | 10 | 15);
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback((item: any, columnKey: string) => {
    const data = columns.find(item => item.key === columnKey)!;

    // formatter row
    if (data.renderRow) {
      return (
        <>
          <div>
            {data.renderRow({
              value: item[columnKey],
              row: item
            })}
          </div>
          {
            item.subRows && item.subRows.length > 0 &&
            <div data-row-key={item[keyRow]} style={{ display: "none" }}>
              {item.subRows.map((sub: any, index: number) =>
                data.renderRow &&
                <div key={index}>
                  {data.renderRow({
                    value: sub[columnKey],
                    row: sub
                  })}
                </div>
              )}
            </div>
          }
        </>
      )
    }

    // handle show icon expand and collapse
    const onClick = () => {
      const subRows = document.querySelectorAll(`div[data-row-key="${item[keyRow]}"]`);
      subRows.forEach(element => {
        const div = element as HTMLAttributes<HTMLDivElement>
        if (!div || !div.style) return

        const value = div.style.display
        div.style.display = value === "none" ? "block" : "none";

        const expand = document.querySelector(`span[data-icon-expand-table="${item[keyRow]}"]`) as HTMLAttributes<HTMLDivElement>;
        const collapse = document.querySelector(`span[data-icon-collapse-table="${item[keyRow]}"]`) as HTMLAttributes<HTMLDivElement>;

        if (!expand || !expand.style || !collapse || !collapse.style) return

        expand.style.display = value !== "none" ? "block" : "none";
        collapse.style.display = value === "none" ? "block" : "none";
      })
    }

    return (
      <>
        <p title={item[columnKey] as string}>
          {
            item.subRows && item.subRows.length > 0 && columns[0].key === columnKey &&
            <>
              <Button
                isIconOnly
                type="button"
                onClick={onClick}
                size="sm"
                className="bg-transparent"
                style={{
                  marginLeft: "-11px",
                  marginTop: "-12px",
                  marginBottom: "-6px"
                }}>
                <span data-icon-expand-table={item[keyRow]} className="text-emerald-500">
                  <PlusIcon />
                </span>
                <span data-icon-collapse-table={item[keyRow]} style={{ display: "none" }} className="text-rose-500">
                  <MinusIcon />
                </span>
              </Button>
            </>
          }

          {item[columnKey]}
        </p>
        {
          item.subRows && item.subRows.length > 0 &&
          <div data-row-key={item[keyRow]} style={{ display: "none" }}>
            {item.subRows.map((value: any, index: number) => (
              <p
                title={value[columnKey]}
                key={index}
                className={columns[0].key === columnKey ? "ps-5" : ""}
              >
                {value[columnKey] as string}
              </p>
            ))}
          </div>
        }
      </>
    )
  }, [columns, keyRow]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {[...selectedKeys].length > 0 &&
            <>
              {`${[...selectedKeys].length} ${[...selectedKeys].length === 1
                ? "dato seleccionado"
                : "datos seleccionados"}`}
            </>
          }
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={setPage}
          color={props.color}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Atrás
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div >
    );
  }, [page, pages, onNextPage, onPreviousPage, selectedKeys, props.color]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 relative">
        <div className="flex justify-between gap-3 items-end">
          {
            showFilter &&
            <Input
              {...inputSearch}
              className={inputSearch?.className ?? "w-full sm:max-w-[44%]"}
              placeholder={inputSearch?.placeholder ?? "Buscar..."}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              isClearable
            />
          }
          {extraTopContent}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {rows.length} {rows.length === 1 ? "dato" : "datos"}
          </span>
          {
            showHandlePaginate &&
            <label className="flex items-center text-default-400 text-small">
              Filas por página:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
                defaultValue={rowsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          }
        </div>
      </div>
    );
  }, [
    filterValue, rows.length, onClear, onRowsPerPageChange, inputSearch,
    onSearchChange, rowsPerPage, showFilter, showHandlePaginate, extraTopContent
  ]);

  return (
    <>
      {loading ? <TableSkeleton columns={columns} size={skeletonSize} /> :
        <Table
          {...props}
          isHeaderSticky={true}
          aria-label={props["aria-label"] ?? "Tabla de resultados"}
          bottomContent={rows.length > 0 ? bottomContent : undefined}
          bottomContentPlacement="outside"
          topContentPlacement="outside"
          topContent={rows.length > 0 ? topContent : undefined}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelect}
          selectionMode={selectionMode}
        >
          <TableHeader columns={columns}>
            {column => <TableColumn  {...column} children={undefined} key={column.key} />}
          </TableHeader>
          <TableBody emptyContent="No hay datos." items={dataRow}>
            {
              item =>
                <TableRow key={item[keyRow]}>
                  {
                    (columnKey) =>
                      <TableCell className={cellClass}>
                        {renderCell(item, columnKey as string)}
                      </TableCell>
                  }
                </TableRow>
            }
          </TableBody>
        </Table>}
    </>
  )
};

export default DataTable;




