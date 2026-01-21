async function loadPosts() {
    try {
        const response = await fetch('data/posts.json');
        const posts = await response.json();
        const postsContainer = document.getElementById('posts-section');

        // Sort posts by ID in descending order (newest first)
        posts.sort((a, b) => b.id - a.id);

        posts.forEach(post => {
            const postCard = createPostCard(post);
            postsContainer.appendChild(postCard);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    let blocksHTML = '';
    if (post.blocks && post.blocks.length > 0) {
        blocksHTML = post.blocks.map(block => renderBlock(block)).join('');
    }

    // Apply layout-specific classes if needed
    // At the moment this isn't used but it's a placeholder for future layout options, I might delete it later if I decide to not use it after all.
    const layoutClass = post.layout ? `layout-${post.layout}` : '';

    // Use custom profile image or default
    // For the future I plan to add more profile images with different Mii emotions to choose from.
    const profileImage = post.profileImage || 'images/profile/mii_profile.png';

    card.innerHTML = `
        <div class="card-body ${layoutClass}">
            <div class="d-flex align-items-center mb-3">
                <img src="${profileImage}" alt="Profile"
                    class="rounded me-3 flex-shrink-0"
                    style="width: 50px; height: 50px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${post.author}</h6>
                    <p class="small mb-0">Playing: <span class="fw-semibold">${post.game}</span></p>
                </div>
                <div class="text-end text-muted small">
                    ${post.date}
                </div>
            </div>
            <hr class="my-3">
            <h4 class="card-title fw-bold">${post.title}</h4>
            ${blocksHTML}
        </div>
    `;

    return card;
}

function renderBlock(block) {
    switch (block.type) {
        case 'text':
            return `<p class="card-text">${block.content}</p>`;

        case 'heading':
            const level = block.level || 5;
            return `<h${level} class="card-text fw-bold">${block.content}</h${level}>`;

        case 'image':
            const caption = block.caption ? `<p class="card-text">${block.caption}</p>` : '';
            return `
                <img src="${block.src}" class="img-fluid rounded mb-3" alt="${block.alt || ''}">
                ${caption}
            `;

        case 'video':
            return `
                <video class="img-fluid rounded mb-3" controls ${block.poster ? `poster="${block.poster}"` : ''}>
                    <source src="${block.src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;

        case 'gif':
            return `
            <div class="text-center">
                <img src="${block.src}" class="img-fluid rounded mb-3" alt="${block.alt || 'GIF'}">
            </div>
            `;

        case 'image-grid':
            const cols = block.columns || 3;
            const gridImages = block.images.map(img => `
                <div class="col">
                    <img src="${img.src}" class="img-fluid rounded" alt="${img.alt || ''}">
                </div>
            `).join('');
            return `
                <div class="row row-cols-1 row-cols-md-${cols} g-3 mb-3">
                    ${gridImages}
                </div>
            `;

        default:
            return '';
    }
}

document.addEventListener('DOMContentLoaded', loadPosts);