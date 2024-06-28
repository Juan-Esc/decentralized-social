async function main() {
    const UsernameNFT = await ethers.getContractFactory("UsernameNFT");

    // Start deployment, returning a promise that resolves to a contract object
    const username_contract = await UsernameNFT.deploy();
    console.log("Contract deployed to address:", username_contract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
