<script lang="ts">
    import { Card } from '$lib/index.js';

    let { class: className, ...restOfProps }: Card.RootProps = $props();
</script>

<!-- Basic Card Example -->
<div class="mb-5">
    <h4 data-testid="test-header">Basic Card Example</h4>
    <Card.Root data-testid="root" class={className} {...restOfProps}>
        <Card.Img data-testid="img-top" position="top" src="https://via.placeholder.com/300x180" alt="Card image cap" />
        <Card.Header data-testid="header">Featured</Card.Header>
        <Card.Body data-testid="body">
            <Card.Title data-testid="title">Card Title</Card.Title>
            <Card.Subtitle data-testid="subtitle" class="mb-2 text-body-secondary">Card Subtitle</Card.Subtitle>
            <Card.Text data-testid="text">Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
            <Card.Link data-testid="link-1" href="#!">Card Link</Card.Link>
            <Card.Link data-testid="link-2" href="#!">Another Link</Card.Link>
        </Card.Body>
        <Card.Footer data-testid="footer">2 days ago</Card.Footer>
    </Card.Root>
</div>

<!-- Card with No Header -->
<div class="mb-5">
    <h4>Card Without Header</h4>
    <Card.Root data-testid="no-header-card">
        <Card.Body>
            <Card.Title>No Header Card</Card.Title>
            <Card.Text>This card has no header component.</Card.Text>
        </Card.Body>
    </Card.Root>
</div>

<!-- Card with Image Overlay -->
<div class="mb-5">
    <h4>Card with Image Overlay</h4>
    <Card.Root data-testid="overlay-card" class="text-white">
        <Card.Img data-testid="overlay-img" src="https://via.placeholder.com/300x180/000000" alt="Card with overlay" />
        <Card.ImgOverlay data-testid="img-overlay">
            <Card.Title data-testid="overlay-title">Image Overlay Title</Card.Title>
            <Card.Text>This text is overlaid on the image.</Card.Text>
        </Card.ImgOverlay>
    </Card.Root>
</div>

<!-- Card with Bottom Image -->
<div class="mb-5">
    <h4>Card with Bottom Image</h4>
    <Card.Root data-testid="bottom-img-card">
        <Card.Body>
            <Card.Title>Bottom Image Card</Card.Title>
            <Card.Text>This card has an image at the bottom.</Card.Text>
        </Card.Body>
        <Card.Img data-testid="img-bottom" position="bottom" src="https://via.placeholder.com/300x180" alt="Card image bottom" />
    </Card.Root>
</div>

<!-- Card with Default Image (no position) -->
<div class="mb-5">
    <h4>Card with Default Image (no position)</h4>
    <Card.Root data-testid="default-img-card">
        <Card.Img data-testid="img-default" src="https://via.placeholder.com/300x180" alt="Card with default image position" />
        <Card.Body>
            <Card.Title>Default Image Card</Card.Title>
            <Card.Text>This card has an image with no position specified.</Card.Text>
        </Card.Body>
    </Card.Root>
</div>

<!-- Card with Custom Title Level -->
<div class="mb-5">
    <h4>Card with Custom Heading Levels</h4>
    <Card.Root data-testid="custom-headings-card">
        <Card.Body>
            <Card.Title data-testid="h1-title" level={1}>H1 Title</Card.Title>
            <Card.Subtitle data-testid="h2-subtitle" level={2}>H2 Subtitle</Card.Subtitle>
            <Card.Text>This card demonstrates custom heading levels.</Card.Text>
        </Card.Body>
    </Card.Root>
</div>

<!-- Card Group Example -->
<div class="mb-5">
    <h4>Card Group</h4>
    <Card.Group data-testid="card-group">
        <Card.Root data-testid="group-card-1">
            <Card.Body>
                <Card.Title>Group Card 1</Card.Title>
                <Card.Text>This is the first card in a card group.</Card.Text>
            </Card.Body>
        </Card.Root>
        <Card.Root data-testid="group-card-2">
            <Card.Body>
                <Card.Title>Group Card 2</Card.Title>
                <Card.Text>This is the second card in a card group.</Card.Text>
            </Card.Body>
        </Card.Root>
        <Card.Root data-testid="group-card-3">
            <Card.Body>
                <Card.Title>Group Card 3</Card.Title>
                <Card.Text>This is the third card in a card group.</Card.Text>
            </Card.Body>
        </Card.Root>
    </Card.Group>
</div>
