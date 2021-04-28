import { Builder, newBuilder } from "../src/merkle/merkle";
// The leaves (a, b, c, ... p) are hashed using a utf8 encoded string, and all hashes following are hashed
// using hex encoded strings. There should be enough data here to create your test cases.
const a = "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
const b = "3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d";
const c = "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6";
const d = "18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4";
const e = "3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea";
const f = "252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111";
const g = "cd0aa9856147b6c5b4ff2b7dfee5da20aa38253099ef1b4a64aced233c9afe29";
const h = "aaa9402664f1a41f40ebbc52c9993eb66aeb366602958fdfaa283b71e64db123";
const i = "de7d1b721a1e0632b7cf04edf5032c8ecffa9f9a08492152b926f1a5a7e765d7";
const j = "189f40034be7a199f1fa9891668ee3ab6049f82d38c68be70f596eab2e1857b7";
const k = "8254c329a92850f6d539dd376f4816ee2764517da5e0235514af433164480d7a";
const l = "acac86c0e609ca906f632b0e2dacccb2b77d22b0621f20ebece1a4835b93f6f0";
const m = "62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a";
const n = "1b16b1df538ba12dc3f97edbb85caa7050d46c148134290feba80f8236c83db9";
const o = "65c74c15a686187bb6bbf9958f494fc6b80068034a659a9ad44991b08c58f2d2";
const p = "148de9c5a7a44d19e56cd9ae1a554bf67847afb0c58f6e12fa29ac7ddfca9940";

const ab = "e5a01fee14e0ed5c48714f22180f25ad8365b53f9779f79dc4a3d7e93963f94a";
const cd = "bffe0b34dba16bc6fac17c08bac55d676cded5a4ade41fe2c9924a5dde8f3e5b";
const ef = "04fa33f8b4bd3db545fa04cdd51b462509f611797c7bfe5c944ee2bb3b2ed908";
const gh = "140257c1540113794d2ae3394879e586ca5caebca19663ff87417892cf36fd23";
const ij = "cf1970792b0aa5816da207cd936e21f594f4e9c68cb01ca97d843047e3107958";
const kl = "6c192582bc0f32bf1ba5833b200db8795b8fbe49228f9a73c09687a777dfca61";
const mn = "94ffc897da3f6a1098eb7b573721291eb9c58154e3fbd10e525c27baa0108bae";
const op = "91756679180e8130ee47a9cb4713261e4e3189d1aef40087dce9c393e38e84fd";

const mno = "7b0fbd42a983b6214192e1531e68881716c87c4672cd17799779b635e685a273";

const abcd = "14ede5e8e97ad9372327728f5099b95604a39593cac3bd38a343ad76205213e7";
const efgh = "8e2c530a100033894555cde1c7d4e36f7c6e553ee3914022ec7a13e1196baed2";
const ijkl = "9ed3e37faea35ec0ddf7bd4e7ea9e8e47ce83dfa84e13c8874646d83079c72aa";
const mnop = "bab7598e438c316f64a14876fb50be7177adf9eaaf257eabd60b84662dea09f8";

const abcdef =
    "1f7379539707bcaea00564168d1d4d626b09b73f8a2a365234c62d763f854da2";

const ijklmno =
    "6eeb6ef56df316c559cc627dd31358ce494fed3db575668ad93e4e4102d5025e";

const abcdefgh =
    "bd7c8a900be9b67ba7df5c78a652a8474aedd78adb5083e80e49d9479138a23f";
const ijklmnop =
    "5a2419accdde223b023d7bd53f4c58758207598b227c31e92c4120593c9e4ca3";

const abcdefghijklmno =
    "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d";

const abcdefghijklmnop =
    "2eb4698fb52b0cd41d51e50f1878c2c23fdba3be61c73da456a8c40aea13003c";

const message =
    "this is a message designed to be used as input to the builder's Writer() method";
const messageHashed =
    "2eedeb6c4d47f67831ffb0df5726f37d4137351bb39a88275cd5c1b7e0f024a4";

const abcdefghijklmnop_messageHashed =
    "d5d55c1dba8af00399a878abc75c21d328caa1815cb7fbaa5ad106e6eb9c0fea";

describe("Test Builder", () => {
    it("Should build correct root hash (even leaves)", () => {
        let builder = newBuilder("sha-256");
        builder.add("a", Buffer.from("a"));
        builder.add("b", Buffer.from("b"));
        builder.add("c", Buffer.from("c"));
        builder.add("d", Buffer.from("d"));
        builder.add("e", Buffer.from("e"));
        builder.add("f", Buffer.from("f"));
        builder.add("g", Buffer.from("g"));
        builder.add("h", Buffer.from("h"));

        builder.addBatch([
            { key: "i", value: Buffer.from("i") },
            { key: "j", value: Buffer.from("j") },
            { key: "k", value: Buffer.from("k") },
            { key: "l", value: Buffer.from("l") },
            { key: "m", value: Buffer.from("m") },
            { key: "n", value: Buffer.from("n") },
            { key: "o", value: Buffer.from("o") },
            { key: "p", value: Buffer.from("p") },
        ]);

        let tree = builder.build();

        let l4 = ["a:"+a, "b:"+b,"c:"+c,"d:"+d,"e:"+e,"f:"+f,"g:"+g,"h:"+h,"i:"+i,"j:"+j,"k:"+k,"l:"+l,"m:"+m,"n:"+n,"o:"+o,"p:"+p];
        let l3 = [ab, cd, ef, gh, ij, kl, mn, op]
        let l2 = [abcd, efgh, ijkl, mnop]
        let l1 = [abcdefgh, ijklmnop]
        let l0 = [abcdefghijklmnop]

        expect(tree.getLevel(0)).toEqual(l0);
        expect(tree.getLevel(1)).toEqual(l1);
        expect(tree.getLevel(2)).toEqual(l2);
        expect(tree.getLevel(3)).toEqual(l3);
        expect(tree.getLevel(4)).toEqual(l4);
    });

    it("Should build correct root hash (odd leaves)", () => {
        let builder = newBuilder("sha-256");
        builder.add("a", Buffer.from("a"));
        builder.add("b", Buffer.from("b"));
        builder.add("c", Buffer.from("c"));
        builder.add("d", Buffer.from("d"));
        builder.add("e", Buffer.from("e"));
        builder.add("f", Buffer.from("f"));
        builder.add("g", Buffer.from("g"));
        builder.add("h", Buffer.from("h"));

        builder.addBatch([
            { key: "i", value: Buffer.from("i") },
            { key: "j", value: Buffer.from("j") },
            { key: "k", value: Buffer.from("k") },
            { key: "l", value: Buffer.from("l") },
            { key: "m", value: Buffer.from("m") },
            { key: "n", value: Buffer.from("n") },
            { key: "o", value: Buffer.from("o") },
        ]);

        let tree = builder.build();

        let l4 = ["a:"+a, "b:"+b,"c:"+c,"d:"+d,"e:"+e,"f:"+f,"g:"+g,"h:"+h,"i:"+i,"j:"+j,"k:"+k,"l:"+l,"m:"+m,"n:"+n,"o:"+o];
        let l3 = [ab, cd, ef, gh, ij, kl, mn, o]
        let l2 = [abcd, efgh, ijkl, mno]
        let l1 = [abcdefgh, ijklmno]
        let l0 = [abcdefghijklmno]

        expect(tree.getLevel(0)).toEqual(l0);
        expect(tree.getLevel(1)).toEqual(l1);
        expect(tree.getLevel(2)).toEqual(l2);
        expect(tree.getLevel(3)).toEqual(l3);
        expect(tree.getLevel(4)).toEqual(l4);
    });
});
