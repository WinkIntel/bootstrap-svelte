import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, expect, it, vi } from 'vitest';
import Fixture from './initial-navbar-cancel-test.svelte';

afterEach(() => {
    cleanup();
    vi.useRealTimers();
});
it('cancels shown when onShow closes a panel mounted into an already expanded Navbar', async () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    const onShown = vi.fn();
    const { rerender } = render(Fixture, { onShow, onShown });
    await fireEvent.click(screen.getByTestId('expand-navbar'));
    await vi.advanceTimersByTimeAsync(400);
    await rerender({ mounted: true });
    await vi.advanceTimersByTimeAsync(400);
    expect(onShow).toHaveBeenCalledOnce();
    expect(onShown).not.toHaveBeenCalled();
    expect(screen.queryByTestId('conditional-panel')).not.toBeInTheDocument();
    expect(document.body).not.toHaveAttribute('data-scrollbar-lock-count');
});
