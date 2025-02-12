// copy this into index.ts


export const bundle1 = [
    // send the compromised wallet some eth
    {
      transaction: tx({
        to: compromisedWallet.address,
        value: 20n * ETHER / 1000n,
      }),
      signer: fundingWallet
    },
  
    // transfer hugo0.eth
    {
      transaction: tx({
        to: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
        gasLimit: 98944,
        data: '0x42842e0e000000000000000000000000d3222f01b4154528cec2807d99385d0fa4473a31000000000000000000000000ecd6511e257e77a4d03f86dc3c76eb8150116c3eeef1cc67e7116f8a42178fbe98801043e71b215a6e1c7247523d813d3bc2aa1f'
      }),
      signer: compromisedWallet
    },
  
    // transfer peanutprotocol.eth
    {
      transaction: tx({
        to: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
        gasLimit: 98944,
        data: '0x42842e0e000000000000000000000000d3222f01b4154528cec2807d99385d0fa4473a31000000000000000000000000ecd6511e257e77a4d03f86dc3c76eb8150116c3e034d3ee55ea8a643d81ceebd9a7719a705f23389aff763d22183b3ed7e728041'
      }),
      signer: compromisedWallet
    },
  
  
    // transfer ppeanut.eth
    {
      transaction: tx({
        to: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
        gasLimit: 98944,
        data: '0x42842e0e000000000000000000000000d3222f01b4154528cec2807d99385d0fa4473a31000000000000000000000000ecd6511e257e77a4d03f86dc3c76eb8150116c3efcdd231d16bef403e8401730480662ef1895a3d37f97144389ee9333ff36803d'
      }),
      signer: compromisedWallet
    },
  
    // miner bribe
    {
      transaction: tx({
        to: '0x8512a66D249E3B51000b772047C8545Ad010f27c',
        value: ETHER / 10000n,
      }),
      signer: fundingWallet
    },
  ]
  
  
  
  export const bundle2 = [
    // send the compromised wallet some eth
    {
      transaction: tx({
        to: compromisedWallet.address,
        value: GWEI * BigInt(40663 + 40903 + 43597 + 186169 + 165139 + 144208 + 146265) * BigInt(MAX_FEE)
      }),
      signer: fundingWallet
    },
  
    // set fastcash central banker
    {
      transaction: tx({
        to: '0xca5228d1fe52d22db85e02ca305cddd9e573d752',
        data: '0x2adc7da300000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a4',
        gasLimit: 40663,
      }),
      signer: compromisedWallet
    },
  
    // transfer discount fastcash ownership
  
    {
      transaction: tx({
        to: '0x31004aDCEc5371F102e7fbA3c2485548324787Fe',
        data: '0xf2fde38b00000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a4',
        gasLimit: 40903
      }),
      signer: compromisedWallet
    },
  
    // transfer IOU ownership
  
    {
      transaction: tx({
        to: '0x13178AB07A88f065EFe6D06089a6e6AB55AE8a15',
        data: '0xf2fde38b00000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a4',
        gasLimit: 43597
      }),
      signer: compromisedWallet
    },
  
  
    // transfer deafbeef First First
    {
      transaction: tx({
        to: '0xc9Cb0FEe73f060Db66D2693D92d75c825B1afdbF',
        data: '0x42842e0e0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a40000000000000000000000000000000000000000000000000000000000000eb0',
        gasLimit: 186169,
  
      }),
      signer: compromisedWallet
    },
  
  
    // transfer steviep cryptovoxels name
    {
      transaction: tx({
        to: '0x4243a8413A77Eb559c6f8eAFfA63F46019056d08',
        data: '0x42842e0e0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a400000000000000000000000000000000000000000000000000000000000020a8',
        gasLimit: 165139
      }),
      signer: compromisedWallet
    },
  
  
    // transfer Jay Pegs automart
    {
      transaction: tx({
        to: '0xF210D5d9DCF958803C286A6f8E278e4aC78e136E',
        data: '0x42842e0e0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a400000000000000000000000000000000000000000000000000000000000011a5',
        gasLimit: 144208
      }),
      signer: compromisedWallet
    },
  
    // transfer Enchiridion prototype
    {
      transaction: tx({
        to: '0x2a680Bb87962a4bF00A9638e0f43AE0bb7164528',
        data: '0x42842e0e0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a40000000000000000000000000000000000000000000000000000000000000013',
        gasLimit: 146265
      }),
      signer: compromisedWallet
    },
  
  
    // bribe miner
    {
      transaction: tx({
        to: '0x8512a66D249E3B51000b772047C8545Ad010f27c',
        value: ETHER / 10000n,
      }),
      signer: fundingWallet
    },
  
  ]
  
  
  
  export const bundle3 = [
    // send the compromised wallet some eth
    {
      transaction: tx({
        to: compromisedWallet.address,
        value: GWEI * BigInt(89190+85345+85327) * BigInt(MAX_FEE)
      }),
      signer: fundingWallet
    },
  
    // Buddha Matt
    {
      transaction: tx({
        gasLimit: 89190,
        data: '0xf242432a0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        to: '0x28959Cf125ccB051E70711D0924a62FB28EAF186'
      }),
      signer: compromisedWallet
    },
  
  
    // chicken
    {
      transaction: tx({
        gasLimit: 85345,
        data: '0xf242432a0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a40000000000000000000000000000000000000000000000000000000000016da2000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        to: '0xd07dc4262BCDbf85190C01c996b4C06a461d2430'
      }),
      signer: compromisedWallet
    },
  
  
    // tomorrow people
    {
      transaction: tx({
        gasLimit: 85327,
        data: '0xf242432a0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a40000000000000000000000000000000000000000000000000000000000002730000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        to: '0x8f2256063036495F5a362a57757acFcBe72E44B9'
      }),
      signer: compromisedWallet
    },
  
    // bribe miner
    {
      transaction: tx({
        to: '0x8512a66D249E3B51000b772047C8545Ad010f27c',
        value: ETHER / 10000n,
      }),
      signer: fundingWallet
    },
  
  ]
  
  
  export const bundle4 = [
    // send the compromised wallet some eth
    {
      transaction: tx({
        to: compromisedWallet.address,
        value: GWEI * BigInt(77533+85327+85327+85327+85327) * BigInt(MAX_FEE)
      }),
      signer: fundingWallet
    },
  
    // Botto
    {
      transaction: tx({
        gasLimit: 77533,
        data: '0xa9059cbb00000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a40000000000000000000000000000000000000000000000669ea6fe74c6740000',
        to: '0x9DFAD1b7102D46b1b197b90095B5c4E9f5845BBA'
      }),
      signer: compromisedWallet
    },
  
  
    // bearer bond 13
    {
      transaction: tx({
        gasLimit: 85327,
        data: '0xf242432a0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a4775d7bf7b3a135f6f72d88fc520ccbde2be0a8f8000000000000260000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        to: '0x495f947276749Ce646f68AC8c248420045cb7b5e'
      }),
      signer: compromisedWallet
    },
  
    // bearer bond 23
    {
      transaction: tx({
        gasLimit: 85327,
        data: '0xf242432a0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a4775d7bf7b3a135f6f72d88fc520ccbde2be0a8f8000000000000300000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        to: '0x495f947276749Ce646f68AC8c248420045cb7b5e'
      }),
      signer: compromisedWallet
    },
  
    // cubeverse 391
    {
      transaction: tx({
        gasLimit: 85327,
        data: '0xf242432a0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a41a008d20550a5cdaa31392895eb92b5e150fe10a000000000001880000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        to: '0x495f947276749Ce646f68AC8c248420045cb7b5e'
      }),
      signer: compromisedWallet
    },
  
    // cubeverse 2495
    {
      transaction: tx({
        gasLimit: 85327,
        data: '0xf242432a0000000000000000000000007c23c1b7e544e3e805ba675c811e287fc9d7194900000000000000000000000047144372eb383466d18fc91db9cd0396aa6c87a41a008d20550a5cdaa31392895eb92b5e150fe10a000000000009c70000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        to: '0x495f947276749Ce646f68AC8c248420045cb7b5e'
      }),
      signer: compromisedWallet
    },
  
  
  
  
    // bribe miner
    {
      transaction: tx({
        to: '0x8512a66D249E3B51000b772047C8545Ad010f27c',
        value: ETHER / 100000n,
      }),
      signer: fundingWallet
    },
  
  ]
  
  
  
  
  export const bundle5 = [
    {
      transaction: tx({
        to: compromisedWallet.address,
        value:
          GWEI * BigInt(129725) * BigInt(MAX_FEE),
      }),
      signer: fundingWallet,
    },
    // Claim $ENS
  
    {
      transaction: tx({
        to: "",
        gasLimit: 129725,
        data: "",
      }),
      signer: compromisedWallet,
    },
  
  
  
  
    // bribe
    {
      transaction: tx({
        to: '0x8512a66D249E3B51000b772047C8545Ad010f27c',
        value: ETHER / 100000n,
      }),
      signer: fundingWallet
    },
  ];