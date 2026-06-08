import { Context } from '$lib/common/index.js';
import type { Table } from './index.js';

export class TableBodyState {
    constructor(readonly props: Table.BodyProps) {}
}

export class TableDataState {
    constructor(readonly props: Table.DataProps) {}
}

export class TableFootState {
    constructor(readonly props: Table.FootProps) {}
}

export class TableHeadState {
    constructor(readonly props: Table.HeadProps) {}
}

export class TableHeaderState {
    constructor(readonly props: Table.HeaderProps) {}
}

export class TableRootState {
    constructor(readonly props: Table.RootProps) {}
}

export class TableRowState {
    constructor(readonly props: Table.RowProps) {}
}

const TableBodyContext: Context<TableBodyState> = new Context<TableBodyState>('table-body');
const TableDataContext: Context<TableDataState> = new Context<TableDataState>('table-data');
const TableFootContext: Context<TableFootState> = new Context<TableFootState>('table-foot');
const TableHeadContext: Context<TableHeadState> = new Context<TableHeadState>('table-head');
const TableHeaderContext: Context<TableHeaderState> = new Context<TableHeaderState>('table-header');
const TableRootContext: Context<TableRootState> = new Context<TableRootState>('table-root');
const TableRowContext: Context<TableRowState> = new Context<TableRowState>('table-row');

export const doesTableBodyContextExists = (): boolean => TableBodyContext.exists();
export const doesTableDataContextExists = (): boolean => TableDataContext.exists();
export const doesTableFootContextExists = (): boolean => TableFootContext.exists();
export const doesTableHeadContextExists = (): boolean => TableHeadContext.exists();
export const doesTableHeaderContextExists = (): boolean => TableHeaderContext.exists();
export const doesTableRootContextExists = (): boolean => TableRootContext.exists();
export const doesTableRowContextExists = (): boolean => TableRowContext.exists();

export function initTableBodyState(props: Table.BodyProps): TableBodyState {
    const state = new TableBodyState(props);
    TableBodyContext.set(state);
    return state;
}

export function initTableDataState(props: Table.DataProps): TableDataState {
    const state = new TableDataState(props);
    TableDataContext.set(state);
    return state;
}

export function initTableFootState(props: Table.FootProps): TableFootState {
    const state = new TableFootState(props);
    TableFootContext.set(state);
    return state;
}

export function initTableHeadState(props: Table.HeadProps): TableHeadState {
    const state = new TableHeadState(props);
    TableHeadContext.set(state);
    return state;
}

export function initTableHeaderState(props: Table.HeaderProps): TableHeaderState {
    const state = new TableHeaderState(props);
    TableHeaderContext.set(state);
    return state;
}

export function initTableRootState(props: Table.RootProps): TableRootState {
    const state = new TableRootState(props);
    TableRootContext.set(state);
    return state;
}

export function initTableRowState(props: Table.RowProps): TableRowState {
    const state = new TableRowState(props);
    TableRowContext.set(state);
    return state;
}
