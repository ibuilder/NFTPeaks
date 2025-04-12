// Constants
const API_KEY = 'YOUR_OPENSEA_API_KEY'; // Replace with your OpenSea API key
const API_BASE_URL = 'https://api.opensea.io/api/v2';
const DEFAULT_CHAIN = 'ethereum';

// DOM Elements
const nftContainer = document.getElementById('nft-container');
const collectionsContainer = document.getElementById('collections-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const filterBtn = document.getElementById('filter-btn');
const sortSelect = document.getElementById('sort-select');
const categorySelect = document.getElementById('category-select');
const blockchainSelect = document.getElementById('blockchain-select');

// Templates
const nftCardTemplate = document.getElementById('nft-card-template');
const collectionCardTemplate = document.getElementById('collection-card-template');

// State
let currentOffset = 0;
const limit = 6;
let isLoading = false;
let activeFilters = {
    sort: 'price_desc',
    category: 'all',
    chain: 'ethereum'
};

// Helper functions
function formatPrice(price, symbol = 'ETH') {
    if (!price) return 'N/A';
    return `${parseFloat(price).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol}`;
}

function getStatusBadge(nft) {
    if (nft.is_trending) return { class: 'badge-trending', text: 'Trending' };
    if (nft.is_new) return { class: 'badge-new', text: 'New' };
    if (nft.rarity_rank && nft.rarity_rank < 100) return { class: 'badge-rare', text: 'Rare' };
    return { class: '', text: '' };
}

function getChainBadge(chain) {
    switch (chain) {
        case 'ethereum': return 'badge-eth';
        case 'solana': return 'badge-sol';
        case 'polygon': return 'badge-poly';
        case 'binance-smart-chain': return 'badge-bsc';
        default: return 'badge-eth';
    }
}

function shortenAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function truncateText(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// API functions
async function fetchNFTs(offset = 0, limit = 6) {
    try {
        isLoading = true;
        updateLoadingUI(true);

        // In a real implementation, you would fetch from OpenSea API
        // Since we can't make actual API calls here, we'll simulate the response
        
        // Example API call that would be used with a real API key:
        // const response = await fetch(`${API_BASE_URL}/assets?order_by=price&order_direction=desc&offset=${offset}&limit=${limit}`, {
        //     headers: {
        //         'X-API-KEY': API_KEY,
        //         'Accept': 'application/json'
        //     }
        // });
        // const data = await response.json();
        
        // Instead, we'll use mock data based on research about high-value NFTs
        const mockNFTs = getMockNFTData(offset, limit);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return mockNFTs;
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        showError('Failed to load NFTs. Please try again later.');
        return { nfts: [] };
    } finally {
        isLoading = false;
        updateLoadingUI(false);
    }
}

async function fetchCollections() {
    try {
        // In a real implementation, you would fetch from OpenSea API
        // Since we can't make actual API calls here, we'll simulate the response
        
        // Example API call with a real API key:
        // const response = await fetch(`${API_BASE_URL}/collections?order_by=volume&order_direction=desc&limit=3`, {
        //     headers: {
        //         'X-API-KEY': API_KEY,
        //         'Accept': 'application/json'
        //     }
        // });
        // const data = await response.json();
        
        // Instead, we'll use mock data
        const mockCollections = getMockCollectionData();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return mockCollections;
    } catch (error) {
        console.error('Error fetching collections:', error);
        return { collections: [] };
    }
}

// UI functions
function renderNFTs(nfts) {
    if (currentOffset === 0) {
        nftContainer.innerHTML = '';
    }

    if (nfts.length === 0 && currentOffset === 0) {
        nftContainer.innerHTML = '<div class="col-12 text-center py-5"><p>No NFTs found matching your criteria.</p></div>';
        return;
    }

    nfts.forEach(nft => {
        const nftCard = nftCardTemplate.content.cloneNode(true);
        
        // Set NFT image
        const imgElement = nftCard.querySelector('.card-img-top');
        imgElement.src = nft.image_url || '/api/placeholder/400/320';
        imgElement.alt = nft.name;
        
        // Set badges
        const chainBadge = nftCard.querySelector('.badge-eth');
        chainBadge.className = `badge ${getChainBadge(nft.chain)}`;
        chainBadge.textContent = nft.chain.charAt(0).toUpperCase() + nft.chain.slice(1);
        
        const statusBadge = nftCard.querySelector('.badge-status');
        const status = getStatusBadge(nft);
        if (status.text) {
            statusBadge.classList.add(status.class);
            statusBadge.textContent = status.text;
        } else {
            statusBadge.style.display = 'none';
        }
        
        // Set NFT info
        nftCard.querySelector('.card-title').textContent = nft.name;
        nftCard.querySelector('.creator-img').src = nft.creator.image_url || '/api/placeholder/40/40';
        nftCard.querySelector('.creator-name').textContent = `Created by ${nft.creator.username || shortenAddress(nft.creator.address)}`;
        nftCard.querySelector('.card-text').textContent = truncateText(nft.description);
        
        // Set price
        const priceSymbol = nft.chain === 'ethereum' ? 'ETH' : 
                        nft.chain === 'solana' ? 'SOL' : 
                        nft.chain === 'polygon' ? 'MATIC' : 'BNB';
        nftCard.querySelector('.price-value').textContent = formatPrice(nft.price, priceSymbol);
        
        // Update icon based on chain
        const priceIcon = nftCard.querySelector('.price i');
        priceIcon.className = nft.chain === 'ethereum' ? 'fab fa-ethereum me-1' :
                           nft.chain === 'solana' ? 'fas fa-sun me-1' :
                           nft.chain === 'polygon' ? 'fas fa-gem me-1' : 'fas fa-coins me-1';
        
        nftContainer.appendChild(nftCard);
    });

    // Show/hide load more button
    loadMoreBtn.style.display = nfts.length < limit ? 'none' : 'inline-block';
}

function renderCollections(collections) {
    collectionsContainer.innerHTML = '';

    if (collections.length === 0) {
        collectionsContainer.innerHTML = '<div class="col-12 text-center py-5"><p>No collections found.</p></div>';
        return;
    }

    collections.forEach(collection => {
        const collectionCard = collectionCardTemplate.content.cloneNode(true);
        
        const imgElement = collectionCard.querySelector('.card-img-top');
        imgElement.src = collection.image_url || '/api/placeholder/400/240';
        imgElement.alt = collection.name;
        
        collectionCard.querySelector('.card-title').textContent = collection.name;
        collectionCard.querySelector('.card-text').textContent = truncateText(collection.description);
        
        collectionsContainer.appendChild(collectionCard);
    });
}

function updateLoadingUI(isLoading) {
    if (isLoading) {
        if (currentOffset === 0) {
            nftContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">Loading NFTs...</p>
                </div>
            `;
        }
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
    } else {
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = 'Load More';
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'col-12';
    errorDiv.innerHTML = `<div class="error-message">${message}</div>`;
    
    if (currentOffset === 0) {
        nftContainer.innerHTML = '';
        nftContainer.appendChild(errorDiv);
    } else {
        nftContainer.appendChild(errorDiv);
    }
}

// Mock data functions
function getMockNFTData(offset, limit) {
    const mockNFTs = [
        {
            id: '1',
            name: 'CryptoPunk #5822',
            image_url: '/api/placeholder/400/320',
            description: 'Ultra-rare alien CryptoPunk with bandana. One of only nine aliens in the entire collection.',
            price: '8000',
            chain: 'ethereum',
            is_trending: true,
            is_new: false,
            rarity_rank: 5,
            creator: {
                username: 'LarvaLabs',
                address: '0x123456789abcdef',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '2',
            name: 'Everydays: The First 5000 Days',
            image_url: '/api/placeholder/400/320',
            description: 'Historic NFT artwork by digital artist Beeple, sold at Christie\'s auction house.',
            price: '38525',
            chain: 'ethereum',
            is_trending: false,
            is_new: false,
            rarity_rank: 1,
            creator: {
                username: 'Beeple',
                address: '0xabcdef123456789',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '3',
            name: 'Clock',
            image_url: '/api/placeholder/400/320',
            description: 'Dynamic NFT showing a timer counting days Julian Assange has spent in prison.',
            price: '16953',
            chain: 'ethereum',
            is_trending: false,
            is_new: false,
            rarity_rank: 10,
            creator: {
                username: 'Pak & JulianAssange',
                address: '0x987654321fedcba',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '4',
            name: 'Human One',
            image_url: '/api/placeholder/400/320',
            description: 'Physical/digital hybrid artwork with dynamic NFT that changes over time.',
            price: '4582',
            chain: 'ethereum',
            is_trending: true,
            is_new: false,
            rarity_rank: 15,
            creator: {
                username: 'Beeple',
                address: '0xabcdef123456789',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '5',
            name: 'Right-click and Save As guy',
            image_url: '/api/placeholder/400/320',
            description: 'Iconic animated NFT by digital artist XCOPY, commenting on NFT ownership.',
            price: '1600',
            chain: 'ethereum',
            is_trending: false,
            is_new: false,
            rarity_rank: 25,
            creator: {
                username: 'XCOPY',
                address: '0x456789abcdef123',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '6',
            name: 'Bored Ape Yacht Club #8817',
            image_url: '/api/placeholder/400/320',
            description: 'Unique ape with rare golden fur and laser eyes from the prestigious BAYC collection.',
            price: '740',
            chain: 'ethereum',
            is_trending: true,
            is_new: false,
            rarity_rank: 35,
            creator: {
                username: 'YugaLabs',
                address: '0x789abcdef123456',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '7',
            name: 'Fidenza #313',
            image_url: '/api/placeholder/400/320',
            description: 'Generative art by Tyler Hobbs, part of the Art Blocks Curated collection.',
            price: '1200',
            chain: 'ethereum',
            is_trending: false,
            is_new: true,
            rarity_rank: 20,
            creator: {
                username: 'Tyler Hobbs',
                address: '0xdef123456789abc',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '8',
            name: 'DeGods #1337',
            image_url: '/api/placeholder/400/320',
            description: 'Elite NFT from the Solana ecosystem with unique traits and styling.',
            price: '350',
            chain: 'solana',
            is_trending: true,
            is_new: false,
            rarity_rank: 40,
            creator: {
                username: 'DeGodsDAO',
                address: 'SOLANA123456789ABCDEF',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '9',
            name: 'Moonbirds #2176',
            image_url: '/api/placeholder/400/320',
            description: 'Pixel art owl with rare traits, part of the Proof Collective ecosystem.',
            price: '80',
            chain: 'ethereum',
            is_trending: false,
            is_new: true,
            rarity_rank: 60,
            creator: {
                username: 'PROOF',
                address: '0x123456789abcdef987',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '10',
            name: 'Azuki #9605',
            image_url: '/api/placeholder/400/320',
            description: 'Anime-inspired avatar from the popular Azuki collection with unique traits.',
            price: '50',
            chain: 'ethereum',
            is_trending: true,
            is_new: false,
            rarity_rank: 80,
            creator: {
                username: 'Chiru Labs',
                address: '0xabcdef987654321',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '11',
            name: 'The Merge',
            image_url: '/api/placeholder/400/320',
            description: 'Record-breaking NFT artwork by anonymous artist Pak, sold in fractionalized units.',
            price: '91800',
            chain: 'ethereum',
            is_trending: false,
            is_new: false,
            rarity_rank: 3,
            creator: {
                username: 'Pak',
                address: '0x123789abcdef456',
                image_url: '/api/placeholder/40/40'
            }
        },
        {
            id: '12',
            name: 'CryptoPunk #7523',
            image_url: '/api/placeholder/400/320',
            description: 'Rare alien CryptoPunk with face mask, a unique token in the collection.',
            price: '11750',
            chain: 'ethereum',
            is_trending: false,
            is_new: false,
            rarity_rank: 7,
            creator: {
                username: 'LarvaLabs',
                address: '0x123456789abcdef',
                image_url: '/api/placeholder/40/40'
            }
        }
    ];

    // Apply filters
    let filteredNFTs = [...mockNFTs];
    
    // Apply category filter
    if (activeFilters.category !== 'all') {
        // In a real implementation, you would filter based on the category
        // For the mock data, we'll just simulate filtering
        filteredNFTs = filteredNFTs.filter((_, index) => index % 2 === 0);
    }
    
    // Apply chain filter
    if (activeFilters.chain !== 'all') {
        filteredNFTs = filteredNFTs.filter(nft => nft.chain === activeFilters.chain);
    }
    
    // Apply sorting
    switch (activeFilters.sort) {
        case 'price_desc':
            filteredNFTs.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'price_asc':
            filteredNFTs.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'recent':
            filteredNFTs.sort((a, b) => a.is_new ? -1 : b.is_new ? 1 : 0);
            break;
        case 'viewed':
            // For mock data, just use a random sort
            filteredNFTs.sort(() => Math.random() - 0.5);
            break;
    }
    
    // Paginate results
    return {
        nfts: filteredNFTs.slice(offset, offset + limit)
    };
}

function getMockCollectionData() {
    return {
        collections: [
            {
                id: '1',
                name: 'Bored Ape Yacht Club',
                image_url: '/api/placeholder/400/240',
                description: 'Collection of 10,000 unique Bored Ape NFTs living on the Ethereum blockchain.',
                floor_price: 70.5,
                total_volume: 857432
            },
            {
                id: '2',
                name: 'CryptoPunks',
                image_url: '/api/placeholder/400/240',
                description: 'One of the earliest NFT collections on Ethereum, featuring 10,000 unique 24x24 pixel art characters.',
                floor_price: 68.2,
                total_volume: 1254863
            },
            {
                id: '3',
                name: 'Azuki',
                image_url: '/api/placeholder/400/240',
                description: 'Collection of 10,000 anime-inspired avatars giving access to The Garden.',
                floor_price: 18.1,
                total_volume: 542190
            }
        ]
    };
}

// Event handlers
async function loadNFTs() {
    if (isLoading) return;
    
    try {
        const { nfts } = await fetchNFTs(currentOffset, limit);
        renderNFTs(nfts);
        currentOffset += nfts.length;
    } catch (error) {
        console.error('Error loading NFTs:', error);
        showError('Failed to load NFTs. Please try again later.');
    }
}

async function loadCollections() {
    try {
        const { collections } = await fetchCollections();
        renderCollections(collections);
    } catch (error) {
        console.error('Error loading collections:', error);
        collectionsContainer.innerHTML = '<div class="col-12 text-center py-5"><p>Failed to load collections. Please try again later.</p></div>';
    }
}

function handleFilterChange() {
    activeFilters = {
        sort: sortSelect.value,
        category: categorySelect.value,
        chain: blockchainSelect.value === 'all' ? 'all' : blockchainSelect.value
    };
    
    currentOffset = 0; // Reset pagination
    loadNFTs();
}

// Event listeners
loadMoreBtn.addEventListener('click', loadNFTs);
filterBtn.addEventListener('click', handleFilterChange);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadNFTs();
    loadCollections();
});

// Connect to OpenSea WebSocket for real-time updates (in a real implementation)
function connectWebsocket() {
    // In a real implementation, you would connect to OpenSea's Stream API
    // For now, we'll just log a message
    console.log('Connecting to OpenSea Stream API for real-time updates...');
}

// Placeholder for future WebSocket implementation
// connectWebsocket();