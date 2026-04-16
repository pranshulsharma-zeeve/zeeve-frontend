const PROTOCOL_MAPPING: { [protocolId: string]: { icon: string; name: string } } = {
  "0621b2c9-65d5-4dbd-8634-417bd3e35a6f": {
    icon: "starknet-icon.svg",
    name: "Starknet",
  },
  "07cddf07-96ed-432c-98f9-f326323c40e3": {
    icon: "persistence-icon.svg",
    name: "Persistence",
  },
  "0815555f-2eb5-43fe-aefb-e12c723fad40": {
    icon: "avalanche-icon.svg",
    name: "Avalanche",
  },
  "0a9c850e-ce14-4920-9493-bccdbec36868": {
    icon: "arbitrum-icon.svg",
    name: "Arbitrum",
  },
  "151b4ca9-3c27-4571-a4eb-46cbfcb448c9": {
    icon: "fantom-icon.svg",
    name: "Fantom",
  },
  "17cb42aa-21cb-4c07-9ad4-516407925044": {
    icon: "fuse-icon.svg",
    name: "Fuse",
  },
  "efc9baf5-16f6-494d-b571-dc9ace315f2a": {
    icon: "etherlink-icon.svg",
    name: "Etherlink",
  },
  "22d1905c-ecbd-42f2-8b95-b63c968934a9": {
    icon: "cosmos-icon.svg",
    name: "Cosmos",
  },
  "24d0e809-4ca3-4ad3-b596-49a16e093750": {
    icon: "ton-icon.svg",
    name: "TON",
  },
  "26f0b384-97da-47b8-a677-7e4fca0af225": {
    icon: "arbitrum-icon.svg",
    name: "Arbitrum",
  },
  "289dc47c-071e-495b-89ca-134ebf84d248": {
    icon: "xdc-icon.svg",
    name: "XDC",
  },
  "2a39e9b9-2d74-4a78-a5e7-64683b0c7cee": {
    icon: "okc-icon.svg",
    name: "OKC",
  },
  "2cedbd6f-49bc-4c00-9b89-d1ae93455e6e": {
    icon: "polygon-icon.svg",
    name: "Polygon",
  },
  "9e45d03f-830a-441f-aba5-62731d384d22": {
    icon: "near-icon.svg",
    name: "Near",
  },
  "320a430c-e3db-4ed1-a2dc-00608c83fe4f": {
    icon: "celo-icon.svg",
    name: "Celo",
  },
  "3ac2bb3c-9571-4bd2-b316-73c0a4cdfdec": {
    icon: "polygon-edge-icon.svg",
    name: "Polygon Edge",
  },
  "3b7f26c6-13b7-42c6-8daf-8f87ec01fbc3": {
    icon: "cronos-icon.svg",
    name: "Cronos",
  },
  "3faf2a67-8954-4338-92bb-9a9b57b4bafa": {
    icon: "fabric-icon.svg",
    name: "Fabric",
  },
  "3fceacb0-524f-48b5-9ac1-8ddd0d20a8e0": {
    icon: "aurora-icon.svg",
    name: "Aurora",
  },
  "44beeb5e-162c-414c-a1bc-ebacfe8cd83e": {
    icon: "polygon-cdk-chain-icon.svg",
    name: "Polygon CDK Chain",
  },
  "47c378de-b83b-4fd0-aff1-296047007d29": {
    icon: "nervos-icon.svg",
    name: "Nervos",
  },
  "48bfc0e0-91ff-4db3-834d-25c51bd3d75a": {
    icon: "shardeum-icon.svg",
    name: "Shardeum",
  },
  "4e09d74a-38e8-4353-b9a0-30cee9ddef11": {
    icon: "aptos-icon.svg",
    name: "Aptos",
  },
  "50f8fd69-dc7f-4788-b4ab-10dec0591de9": {
    icon: "harmony-icon.svg",
    name: "Harmony",
  },
  "60b0b934-a067-410e-a60f-c2a2c73b9b49": {
    icon: "coreum-icon.svg",
    name: "Coreum",
  },
  "6d15e262-24a7-11ed-861d-0242ac120002": {
    icon: "polkadot-icon.svg",
    name: "Polkadot",
  },
  "72e6d0f2-2e7a-11ed-a261-0242ac120002": {
    icon: "dcomm-icon.svg",
    name: "Dcomm",
  },
  "75ecf7be-6dcc-4791-ab9e-773b8fb3b04f": {
    icon: "avalanche-icon.svg",
    name: "Avalanche",
  },
  "83bd619f-2e4f-4a20-b0ae-dd2f125eaeb0": {
    icon: "stacks-icon.svg",
    name: "Stacks",
  },
  "943f2168-022c-43e3-92b1-32afa90f3ccc": {
    icon: "hyperledger-besu-icon.svg",
    name: "Hyperledger Besu",
  },
  "971e87b2-ebdd-4292-9c6c-e84a64099a71": {
    icon: "optimism-icon.svg",
    name: "Optimism",
  },
  "9743c74b-aec8-49dc-b08b-b94fe7b375a7": {
    icon: "kusama-icon.svg",
    name: "Kusama",
  },
  "9778e372-8eec-483f-80a3-091d9b9cfd57": {
    icon: "zksync-era-icon.svg",
    name: "zkSync Era",
  },
  "9c1f95b6-b037-42a3-bb76-2f8946b52835": {
    icon: "zkevm-icon.svg",
    name: "zkEVM",
  },
  "9e8054b4-c8c5-49c4-bf65-19f6e04e3cf0": {
    icon: "bitcoin-icon.svg",
    name: "Bitcoin",
  },
  "a11bd530-7ffd-4cc4-8186-ec96aad57387": {
    icon: "acala-icon.svg",
    name: "Acala",
  },
  "a334040a-134c-4c20-88c3-def05aa0e309": {
    icon: "corda-icon.svg",
    name: "Corda",
  },
  "a8840b17-cbb5-42d2-a206-2d12a866a110": {
    icon: "provenance-blockchain-icon.svg",
    name: "Provenance Blockchain",
  },
  "a8e91979-4d2c-42b5-8cd3-da0fa365a93c": {
    icon: "corda-icon.svg",
    name: "Corda",
  },
  "aa55cdb8-020d-4ee5-a887-78dae6b5afbf": {
    icon: "hedera-icon.svg",
    name: "Hedera",
  },
  "aea5c7b0-455f-4480-9055-285b42d89226": {
    icon: "gnosis-chain-icon.svg",
    name: "Gnosis Chain",
  },
  "b2f82bc4-8828-461d-b332-6010a963e116": {
    icon: "parachains-icon.svg",
    name: "Parachains",
  },
  "bd8abd00-69ce-4412-81a5-64201ac2e81c": {
    icon: "energy-web-icon.svg",
    name: "Energy Web",
  },
  "c307ba40-be7e-11ec-9d64-0242ac120002": {
    icon: "tron-icon.svg",
    name: "Tron",
  },
  "c3f4f899-bfd6-4a17-b063-a83d403bca22": {
    icon: "ethereum-icon.svg",
    name: "Ethereum",
  },
  "c83b7f20-aa0a-11ec-b4bc-dff17d3c1f22": {
    icon: "binance-icon.svg",
    name: "Binance",
  },
  "ca2ba54a-c6f4-4daa-8d74-1a552d44f9f8": {
    icon: "phaeton-icon.svg",
    name: "Phaeton",
  },
  "d006853d-a30d-4e52-8c9c-cbac1106209b": {
    icon: "algorand-icon.svg",
    name: "Algorand",
  },
  "ebae7624-94e2-4a11-ab2d-caadd4f8922f": {
    icon: "flow-icon.svg",
    name: "Flow",
  },
  "dabf400c-ac0a-408b-8847-dca92f81494d": {
    icon: "tezos-icon.svg",
    name: "Tezos",
  },
  "dec160b8-740b-4e8a-a392-b563b238f7e2": {
    icon: "moonbean-icon.svg",
    name: "Moonbeam",
  },
  "dee140d6-368d-4fb0-96f5-8e3d66a95142": {
    icon: "cardano-icon.svg",
    name: "Cardano",
  },
  "dfe990fd-c746-408a-ae76-adbc58bfe0a9": {
    icon: "telos-icon.svg",
    name: "Telos",
  },
  "e89ccb3b-8c5b-4102-a108-5121b3b41fb9": {
    icon: "klaytn-icon.svg",
    name: "Klaytn",
  },
  "e9711998-0742-44e3-afb0-4817db3ede39": {
    icon: "lisk-icon.svg",
    name: "Lisk",
  },
  "fa1b05f9-4013-4342-904b-60b3d00c0854": {
    icon: "solana-icon.svg",
    name: "Solana",
  },
  "b6087e1a-46b8-48f3-8e4b-6884ece8b25c": {
    icon: "shido-icon.svg",
    name: "Shido",
  },
  "79d057a5-2cbc-40cd-9725-27c06af21cf9": {
    icon: "subsquid-icon.svg",
    name: "Subsquid",
  },
  "8d656804-588e-4866-a8a7-d1fea6291555": {
    icon: "base-blockchain-icon.svg",
    name: "Base Blockchain",
  },
  "be8b9a7b-537f-4729-ba66-0f3b1093535d": {
    icon: "cross-fi-icon.svg",
    name: "CrossFi",
  },
  "a7a25c9e-c2cd-4f0c-a4af-777b818b4b16": {
    icon: "beam-icon.svg",
    name: "Beam L1",
  },
  "78226cde-f273-4800-9322-7b8b8df2ba1b": {
    icon: "babylon-icon.png",
    name: "Babylon",
  },
  "a64ec70a-738c-454b-9e29-92159ae7c016": {
    icon: "injective-icon.svg",
    name: "Injective",
  },
  "14f1d471-ccd0-4460-b663-80dc8cd4027c": {
    icon: "nillion-icon.svg",
    name: "Nillion",
  },
  "2ba1cc86-eadf-4e35-b0f0-b0817602c6ed": {
    icon: "skale-icon.svg",
    name: "Skale",
  },
  "a4e739b9-0e74-40a5-875f-180004d64748": {
    icon: "theta-icon.svg",
    name: "Theta",
  },
};

const EXTERNAL_ROUTES = {
  COGITUS: "https://platform.cogitus.io/home",
  PERFUSE: "https://www.perfuse.io/",
};

const OPENTELEMETRY_ENABLED_NETWORK_IDS = [
  "27d7e416-ea5f-4f21-8b11-571511b33a05",
  "50d10215-51d6-4cbe-b6cb-911d1426ef4f",
  "eb95e851-1180-466d-ae9a-2597eb1c2c22", // production network IDs for clients
  "abd5d34e-b12f-4705-9edc-a6b47e897ae5",
  "ed936fbc-93d7-4f32-a999-940b3bf0b9db",
  "f8f0d7d4-3c7a-43ac-ab4a-03986cdc2101",
  "f84072d6-45b0-4a9a-a569-6c843522ef0e",
  "3a393320-5fe7-4179-9635-924962755304",
  "5dc16a30-730e-4d62-86b2-49b13891a2ee",
  "0e78875c-4cfb-45f3-ba7e-ebca05bc5a30",
  "30b67b4a-ac8b-4260-9757-765235099b82",
  "f3e6fe5c-2456-4867-8ce8-61db4e8fa5b0",
  "4865ba8f-0f21-4e67-b3f6-5ec98e51953b",
  "eacbed54-af27-4782-a8e8-ba80d6a1f002",
  "1f6cc329-3963-4bbb-b121-e16ac2c74b8b",
  "cb694b71-65b5-4d13-ae38-5943fadb908b",
  "3f153e01-48ed-4c59-912a-5231fe7a72d4",
  "955a34f2-04be-4be0-b678-52dbb292875d",
  "78044339-6338-48dc-bcea-10d8a0fe1100",
  "7dc488dd-2f20-4d23-b7ed-b246b6f8efe6",
  "fac0609f-f348-4503-b4d3-bb837791a1ec",
  "b203c0f8-1c11-43f5-bb9e-4aa3629718b8",
  "96cd8c12-5405-4158-af03-70f3cf9335be",
  "f49d8cf6-dd15-4411-970d-52bd8af0bf8f",
  "643bc41a-f8db-4a3f-a9c6-f4b3386dc6b2",
  "dfb4e530-8cfe-443f-9a86-15b0c8414ba5",
  "a68c4ba4-6028-40b3-8109-8301e56a0b30",
  "1118875c-4cfb-45f3-ba7e-ebca05bc5a30",
  "7a458bb1-e0d6-45e9-8ba2-9562fea18315",
];

const OPTIMISTICLABS_EMAILS = ["hello@optimisticlabsltd.com", "lyord@yopmail.com", "zeeve_dev@yopmail.com"];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF6F61",
  "#888584",
  "#02a921",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#05fbef4e",
  "#77d0fc",
  "#f1fc15",
];

export { PROTOCOL_MAPPING, EXTERNAL_ROUTES, OPENTELEMETRY_ENABLED_NETWORK_IDS, OPTIMISTICLABS_EMAILS, COLORS };
