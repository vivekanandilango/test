import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { TextField } from '@mui/material';

export const columns = [
    {
        Header: 'ISIN',
        accessor: 'isin',
        filter: 'text',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Symbol',
        accessor: 'symbol',
        filter: 'text',
        Cell: ({ row }) => {
            if (row.original.hasOwnProperty('bse_scrip')) {
                return <div style={{ textAlign: "center" }}>{row.original.bse_scrip}</div>;
            }
            return <div style={{ textAlign: "center" }}>{row.values.symbol}</div>;
        }
    },
    {
        Header: 'Coupon',
        accessor: 'coupon',
        filter: 'numeric',
        Cell: ({ value }) => {
            return <div style={{ textAlign: "center" }}>{`${(value * 100).toFixed(2)}%`}</div>;
        }
    },
    {
        Header: 'Yield',
        accessor: 'ytm',
        filter: 'numeric',
        Cell: ({ value }) => {
            return <div style={{ textAlign: "center" }}>{`${(value).toFixed(2)}%`}</div>;
        }
    },
    {
        Header: 'Face value',
        accessor: 'face_value',
        filter: 'numeric',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Dirty price',
        accessor: 'dirty_price',
        filter: 'numeric',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Clean price',
        accessor: 'clean_price',
        filter: 'numeric',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Payment frequency',
        accessor: 'payment_frequency',
        filter: 'numeric',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Time to maturity',
        accessor: 'time_to_maturity',
        filter: 'numeric',
        Cell: ({ row }) => {
            const otherDate = new Date(row.values.maturity_date);
            const today = new Date();
            const diffTime = Math.abs(otherDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return <div style={{ textAlign: "center" }}>{diffDays}</div>;
        }
    },
    {
        Header: 'Issue date',
        accessor: 'issue_date',
        filter: 'date',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Maturity date',
        accessor: 'maturity_date',
        filter: 'date',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Last interest payment date',
        accessor: 'last_interest_payment_date',
        filter: 'date',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
    {
        Header: 'Next interest payment date',
        accessor: 'next_interest_payment_date',
        filter: 'date',
        Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
    },
];


// Table component
const DataTable = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({ columns, data }, useGlobalFilter, useSortBy);

    return (
        <>
            <TextField
                id="search"
                label="Search"
                variant="outlined"
                value={state.globalFilter || ''}
                onChange={e => setGlobalFilter(e.target.value || undefined)}
                size="small"
                sx={{ m: '0.75rem' }}
            />
            <table {...getTableProps()} width="100%" style={{ "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }}>
                <thead >
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} >
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} >
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} style={{ "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default DataTable;