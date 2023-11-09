export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];


export const SIMPLE_ACCOUNT_ABI = [
  // Read-Only Functions
  "function owner() view returns (address)",
  "function entryPoint() view returns (address)",

  // New Functions
  "function deposit(uint256 amount) public",
  "function withdrawAll() public",

  // Authenticated Functions
  "function execute(address dest, uint256 value, bytes calldata func) external",
  "function executeBatch(address[] calldata dest, bytes[] calldata func) external",
  "function initialize(address anOwner) public",

  // Events
  "event SimpleAccountInitialized(address indexed entryPoint, address indexed owner)"
];

export const IERC6551Registry_ABI = [
  // Events
  "event AccountCreated(address account, address indexed implementation, uint256 chainId, address indexed tokenContract, uint256 indexed tokenId, uint256 salt)",

  // Authenticated Functions
  "function createAccount(address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt, bytes calldata initData) external returns (address)",

  // Read-Only Functions
  "function account(address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt) external view returns (address)"
];

export const IERC6551ACCOUNT_ABI = [
  // Read-Only Functions
  "function token() view returns (uint256 chainId, address tokenContract, uint256 tokenId)",
  "function state() view returns (uint256)",
  "function owner() view returns (address)",
  "function getChainId() view returns (uint256)",
  "function isValidSigner(address signer, bytes calldata) view returns (bytes4)",
  "function isValidSignature(bytes32 hash, bytes memory signature) view returns (bytes4 magicValue)",
  "function supportsInterface(bytes4 interfaceId) pure returns (bool)",

  // Transaction Functions
  "function execute(address to, uint256 value, bytes calldata data, uint256 operation) payable returns (bytes memory result)",

  // Special Functions
  "fallback()"
];



