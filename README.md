# NFTPeaks - High-Value NFT Marketplace

NFTPeaks is a modern, responsive web application that showcases the highest-valued NFTs from various blockchains. This project integrates with the OpenSea API to display real-time NFT data.

![NFTPeaks Screenshot](screenshot.png)

## Features

- **Top Value NFT Display**: Showcases the world's most expensive NFTs
- **OpenSea API Integration**: Pulls real NFT data from the largest NFT marketplace
- **Multi-Chain Support**: View NFTs from Ethereum, Solana, Polygon, and Binance Smart Chain
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Dynamic Content Loading**: Paginated results with "Load More" functionality
- **Filtering & Sorting**: Filter by category, blockchain, and sort by various criteria
- **Trending Collections**: View popular NFT collections with highest trading volume

## Technologies Used

- HTML5
- CSS3 (Custom styling with CSS variables)
- JavaScript (ES6+)
- Bootstrap 5.3
- Font Awesome 6.4
- OpenSea API v2

## Project Structure

```
nftpeaks/
├── index.html          # Main HTML structure
├── styles.css          # Custom CSS styling
├── app.js              # JavaScript functionality and API integration
└── README.md           # Project documentation
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ibuilder/nftpeaks.git
   cd nftpeaks
   ```

2. Open `app.js` and replace `YOUR_OPENSEA_API_KEY` with your actual OpenSea API key:
   ```javascript
   const API_KEY = 'YOUR_OPENSEA_API_KEY';
   ```

3. Serve the files using your preferred local development server.
   For example, using Python's built-in HTTP server:
   ```bash
   python -m http.server
   ```

4. Navigate to `http://localhost:8000` in your web browser.

## Getting an OpenSea API Key

To use the OpenSea API, you need to request an API key:

1. Visit [OpenSea Developer Platform](https://docs.opensea.io/)
2. Navigate to the API Keys documentation
3. Follow the instructions to request an API key
4. Once approved, replace the placeholder in `app.js` with your actual key

## API Implementation Details

The application uses the OpenSea API V2 endpoints:

- `/api/v2/chain/{chain}/contract/{address}/nfts/{identifier}` - Get metadata for a specific NFT
- `/api/v2/collections` - Browse NFT collections
- Other endpoints for filtering and sorting NFTs

For development purposes, mock data is provided to simulate API responses when an API key is not available.

## Customization

### Adding Additional Chains

To add support for more blockchains, update the following:

1. Add new options to the blockchain dropdown in `index.html`
2. Add CSS styling for new blockchain badges in `styles.css`
3. Update the `getChainBadge` function in `app.js`

### Modifying Theme

The color scheme can be easily modified by changing the custom properties in `styles.css`:

```css
:root {
  --primary-color: #6a4dff;
  --background-color: #0f0f1e;
  --card-background: #1a1a2e;
  /* Add more custom colors as needed */
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenSea API](https://docs.opensea.io/) for providing NFT data
- [Bootstrap](https://getbootstrap.com/) for the responsive framework
- [Font Awesome](https://fontawesome.com/) for icons

---

## Disclaimer

This project is for educational purposes only. NFTPeaks is not affiliated with OpenSea or any NFT creators. All NFT images and data are property of their respective owners.