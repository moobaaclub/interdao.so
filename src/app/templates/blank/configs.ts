import { utils } from '@project-serum/anchor'
import { TemplateIdl } from '../index'

export enum BlankIds {
  // Accounts
  source = 'source',
  destination = 'destination',
  authority = 'authority',
  // Prams
  code = 'code',
  lamports = 'lamports',
  // Context
}

export const BlankIdl: TemplateIdl = {
  name: 'blank',
  accounts: [
    {
      name: BlankIds.source,
      isMut: true,
      isSigner: false,
      isMaster: false,
    },
    {
      name: BlankIds.destination,
      isMut: true,
      isSigner: false,
      isMaster: false,
    },
    {
      name: BlankIds.authority,
      isMut: true,
      isSigner: true,
      isMaster: true,
    },
  ],
  args: [
    { name: BlankIds.code, type: 'u8' },
    {
      name: BlankIds.lamports,
      type: 'u64',
    },
  ],
  programId: utils.token.TOKEN_PROGRAM_ID.toBase58(),
}
