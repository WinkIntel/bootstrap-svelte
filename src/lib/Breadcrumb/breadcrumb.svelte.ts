import { Context } from '$lib/common/index.js';
import type { Breadcrumb } from './index.js';

export class BreadcrumbRootState {
    #activeBreadcrumbItemId: string = $state('');

    constructor(readonly props: Breadcrumb.RootProps) {
        this.isBreadcrumbItemActive = this.isBreadcrumbItemActive.bind(this);
        this.setBreadcrumbItemActive = this.setBreadcrumbItemActive.bind(this);
    }

    isBreadcrumbItemActive(itemId: string): boolean {
        return this.#activeBreadcrumbItemId === itemId;
    }

    setBreadcrumbItemActive(itemId: string): void {
        this.#activeBreadcrumbItemId = itemId;
    }
}

export class BreadcrumbItemState {
    isActive = $derived.by(() => this.root.isBreadcrumbItemActive(this.props.id || ''));

    constructor(
        readonly props: Breadcrumb.ItemProps,
        readonly root: BreadcrumbRootState
    ) {
        if (this.props.isActive) {
            this.root.setBreadcrumbItemActive(this.props.id || '');
        }
    }
}

const BreadcrumbRootContext = new Context<BreadcrumbRootState>('breadcrumb-root');
const BreadcrumbItemContext = new Context<BreadcrumbItemState>('breadcrumb-item');

export function initBreadcrumbRootState(props: Breadcrumb.RootProps): BreadcrumbRootState {
    const rootState = new BreadcrumbRootState(props);
    return BreadcrumbRootContext.set(rootState);
}

export function initBreadcrumbItemState(props: Breadcrumb.ItemProps): BreadcrumbItemState {
    if (!BreadcrumbRootContext.exists()) {
        throw new Error('BreadcrumbRootContext is not set. Please initialize it first.');
    }
    const rootState = BreadcrumbRootContext.get();
    return BreadcrumbItemContext.set(new BreadcrumbItemState(props, rootState));
}
