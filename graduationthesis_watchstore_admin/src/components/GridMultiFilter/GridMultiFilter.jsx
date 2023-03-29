import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

var dateFilterParams = {
    filters: [
        {
            filter: 'agDateColumnFilter',
            filterParams: {
                comparator: (filterDate, cellValue) => {
                    if (cellValue == null) return -1;
                    return getDate(cellValue).getTime() - filterDate.getTime();
                },
            },
        },
        {
            filter: 'agSetColumnFilter',
            filterParams: {
                comparator: (a, b) => {
                    return getDate(a).getTime() - getDate(b).getTime();
                },
            },
        },
    ],
};

const getDate = (value) => {
    var dateParts = value.split('/');
    return new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
};

const GridMultiFilter = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();
    const columnDefs = [
        { field: 'athlete', filter: 'agTextColumnFilter' },
        {
            field: 'gold',
            filter: 'agNumberColumnFilter',
            filterParams: {
                filters: [
                    {
                        filter: 'agNumberColumnFilter',
                    },
                    {
                        filter: 'agSetColumnFilter',
                    },
                ],
            },
        },
        {
            field: 'date',
            filter: 'agNumberColumnFilter',
            filterParams: dateFilterParams,
        },
        {
            field: 'action',
            cellRenderer: () => {
                return <button>edit</button>;
            },
        },
    ];
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 200,
            resizable: true,
            floatingFilter: true,
            // menuTabs: ['filterMenuTab'],
        };
    }, []);

    const onGridReady = useCallback((params) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data) => setRowData(data));
    }, []);

    const resetState = useCallback(() => {
        gridRef.current.api.setFilterModel(null);
        console.log('Filter state reset');
    }, []);
    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);
    const gridRef = useRef();

    return (
        <div style={containerStyle}>
            <button onClick={resetState}>clear filter</button>
            <button onClick={onBtnExport}>Download CSV export file</button>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    pagination={true}
                    paginationAutoPageSize={true}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default GridMultiFilter;
