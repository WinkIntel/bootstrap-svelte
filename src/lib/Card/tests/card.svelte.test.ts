import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CardBasicTest from './card-basic-test.svelte';

describe('Card Component', () => {
    it('should render basic card with all sub-components', async () => {
        render(CardBasicTest);

        // Check if all card components are rendered
        expect(screen.getByTestId('root')).toHaveClass('card');
        expect(screen.getByTestId('header')).toHaveClass('card-header');
        expect(screen.getByTestId('body')).toHaveClass('card-body');
        expect(screen.getByTestId('title')).toHaveClass('card-title');
        expect(screen.getByTestId('subtitle')).toHaveClass('card-subtitle');
        expect(screen.getByTestId('text')).toHaveClass('card-text');
        expect(screen.getByTestId('link-1')).toHaveClass('card-link');
        expect(screen.getByTestId('link-2')).toHaveClass('card-link');
        expect(screen.getByTestId('img-top')).toHaveClass('card-img-top');
        expect(screen.getByTestId('footer')).toHaveClass('card-footer');
    });

    it('should render card without header', () => {
        render(CardBasicTest);

        const card = screen.getByTestId('no-header-card');
        expect(card).toHaveClass('card');
        expect(card.querySelector('.card-header')).toBeNull();
        expect(card.querySelector('.card-body')).not.toBeNull();
    });

    it('should render card with image overlay', () => {
        render(CardBasicTest);

        const card = screen.getByTestId('overlay-card');
        expect(card).toHaveClass('card');
        expect(card).toHaveClass('text-white');

        const imgOverlay = screen.getByTestId('img-overlay');
        expect(imgOverlay).toHaveClass('card-img-overlay');

        const img = screen.getByTestId('overlay-img');
        expect(img).toHaveClass('card-img');
        expect(img).not.toHaveClass('card-img-top');
        expect(img).not.toHaveClass('card-img-bottom');

        const title = screen.getByTestId('overlay-title');
        expect(title).toHaveClass('card-title');
    });

    it('should render card with bottom image', () => {
        render(CardBasicTest);

        const card = screen.getByTestId('bottom-img-card');
        expect(card).toHaveClass('card');

        const img = screen.getByTestId('img-bottom');
        expect(img).toHaveClass('card-img-bottom');
    });

    it('should render card with default image position (no position prop)', () => {
        render(CardBasicTest);

        const card = screen.getByTestId('default-img-card');
        expect(card).toHaveClass('card');

        const img = screen.getByTestId('img-default');
        expect(img).toHaveClass('card-img');
        expect(img).not.toHaveClass('card-img-top');
        expect(img).not.toHaveClass('card-img-bottom');
    });

    it('should respect custom heading levels', () => {
        render(CardBasicTest);

        const h1Title = screen.getByTestId('h1-title');
        expect(h1Title.tagName).toBe('H1');
        expect(h1Title).toHaveClass('card-title');

        const h2Subtitle = screen.getByTestId('h2-subtitle');
        expect(h2Subtitle.tagName).toBe('H2');
        expect(h2Subtitle).toHaveClass('card-subtitle');
    });

    it('should render card groups correctly', () => {
        render(CardBasicTest);

        const cardGroup = screen.getByTestId('card-group');
        expect(cardGroup).toHaveClass('card-group');

        // Check that the group contains three cards
        const groupCards = [screen.getByTestId('group-card-1'), screen.getByTestId('group-card-2'), screen.getByTestId('group-card-3')];

        groupCards.forEach((card) => {
            expect(card).toHaveClass('card');
            expect(cardGroup.contains(card)).toBe(true);
        });
    });

    it('should pass custom CSS classes to Card.Root', () => {
        render(CardBasicTest, { props: { class: 'custom-card-class' } });

        const card = screen.getByTestId('root');
        expect(card).toHaveClass('card');
        expect(card).toHaveClass('custom-card-class');
    });
});
