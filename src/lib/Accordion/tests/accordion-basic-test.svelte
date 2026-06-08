<script lang="ts">
    import { Accordion } from '$lib/index.js';

    let { isMultiple = false, isFlush = false, ...restOfProps }: Accordion.RootProps = $props();
</script>

<Accordion.Root data-testid="root" {isMultiple} {isFlush} {...restOfProps}>
    <Accordion.Item data-testid="item-1" isExpanded={true}>
        <Accordion.Header data-testid="header-1">
            <Accordion.Button data-testid="button-1">Accordion Item #1</Accordion.Button>
        </Accordion.Header>
        <Accordion.Collapse data-testid="collapse-1">
            <Accordion.Body data-testid="body-1">
                <strong>This is the first item's accordion body.</strong> It is expanded by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS
                transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about
                any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </Accordion.Body>
        </Accordion.Collapse>
    </Accordion.Item>
    <Accordion.Item data-testid="item-2">
        <Accordion.Header data-testid="header-2">
            <Accordion.Button data-testid="button-2">Accordion Item #2</Accordion.Button>
        </Accordion.Header>
        <Accordion.Collapse data-testid="collapse-2">
            <Accordion.Body data-testid="body-2">
                <strong>This is the second item's accordion body.</strong> It is collapsed by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS
                transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about
                any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </Accordion.Body>
        </Accordion.Collapse>
    </Accordion.Item>
    <Accordion.Item data-testid="item-3">
        <Accordion.Header data-testid="header-3">
            <Accordion.Button data-testid="button-3">Accordion Item #3</Accordion.Button>
        </Accordion.Header>
        <Accordion.Collapse data-testid="collapse-3">
            <Accordion.Body data-testid="body-3">
                <strong>This is the third item's accordion body.</strong> It is collapsed by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS
                transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about
                any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </Accordion.Body>
        </Accordion.Collapse>
    </Accordion.Item>
</Accordion.Root>
