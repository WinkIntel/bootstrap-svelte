import type { ComponentProps } from 'svelte';
import type PlaceholderItem from '../placeholder-item.svelte';

type PlaceholderItemComponentProps = ComponentProps<typeof PlaceholderItem>;

const validPlaceholderItemProps: PlaceholderItemComponentProps = { colorVariant: 'primary', size: 'sm' };

const legacyPlaceholderItemProps: PlaceholderItemComponentProps = { isAnimated: true };

void validPlaceholderItemProps;
void legacyPlaceholderItemProps;
