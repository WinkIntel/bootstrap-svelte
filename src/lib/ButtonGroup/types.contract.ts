import type { ButtonGroupRootProps, ButtonToolbarRootProps } from './types.js';

const group = { 'aria-label': 'Actions' } satisfies ButtonGroupRootProps;
const toolbar = { 'aria-label': 'Formatting' } satisfies ButtonToolbarRootProps;

const invalidGroupRole: ButtonGroupRootProps = {
    // @ts-expect-error ButtonGroup owns its required group role.
    role: 'navigation'
};
const invalidToolbarRole: ButtonToolbarRootProps = {
    // @ts-expect-error ButtonToolbar owns its required toolbar role.
    role: 'navigation'
};

void group;
void toolbar;
void invalidGroupRole;
void invalidToolbarRole;
