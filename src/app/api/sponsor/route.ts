import { SponsorTxRequestBody } from "@/types/SponsorTx";
import { NextRequest, NextResponse } from "next/server";
import { enokiClient } from "../EnokiClient";

/*
 - Right now any txBlock whose moveCall targets are whitelisted in the Enoki Portal can be sponsored
 - In mainnet products, we will probably want to add constraints, such as:
  - require a JWT token if the user is signed in with Enoki
  - require a signed message if the user uses wallet-kit
  - require that the number of commands in the txBlock is exactly one, we can check this via `TransactionBlock.from(txBytes)`
  - require that the allowedAddresses only contain the sender's address (in case of an airdrop)
*/

export const POST = async (request: NextRequest) => {

  try {
    const { network, txBytes, sender, allowedAddresses, ...rest }: SponsorTxRequestBody =
      await request.json();

    console.log({ network, txBytes, sender, allowedAddresses, rest })

    const resp = await enokiClient
      .createSponsoredTransaction({
        network,
        transactionKindBytes: txBytes,
        sender,
        allowedAddresses,
      })

    return NextResponse.json(resp, {
      status: 200,
    });
  } catch (error) {
    console.log(error)
    const err = error as Error
    return NextResponse.json(
      {
        error: err?.message || "Could not create sponsored transaction block.",
      },
      {
        status: 500,
      }
    );
  }
};
