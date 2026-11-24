import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import ModalPlayground from './ModalPlayground.svelte';

test('the maintenance playground lets users select and render an XXL dialog', async () => {
    const { container } = render(ModalPlayground);
    const size = screen.getByLabelText('Size');
    expect(screen.getByRole('option', { name: 'Extra Extra Large' })).toHaveValue('xxl');
    expect(size).toHaveAccessibleDescription(/earlier 5\.3 versions use the default dialog width/i);

    await fireEvent.change(size, { target: { value: 'xxl' } });
    await fireEvent.click(screen.getByRole('button', { name: 'Open Modal' }));

    const modal = await screen.findByRole('dialog', { name: 'Modal Title' });
    expect(modal.querySelector('.modal-dialog')).toHaveClass('modal-xxl');
    await waitFor(() => expect(container.querySelector('pre')).toHaveTextContent('size="xxl"'));
});
