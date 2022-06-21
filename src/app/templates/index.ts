import { RulesData, RulesName } from './core/rule'
import { SplTransferIdl } from './spl-transfer/configs'
import { SplApproveIdl } from './spl-approve/configs'
import { BlankIdl } from './blank/configs'

// Config
export enum TemplateNames {
  'SplTransfer' = 'spl-transfer',
  'SplApprove' = 'spl-approve',
  'BlankTemplate' = 'blank',
}
export const Templates: Record<TemplateNames, TemplateIdl> = {
  [TemplateNames.SplTransfer]: SplTransferIdl,
  [TemplateNames.SplApprove]: SplApproveIdl,
  [TemplateNames.BlankTemplate]: BlankIdl,
}
// Component Type
export type PropsCreateComponent = {
  daoAddress: string
}
// System type
export type TemplateIdl = {
  name: string
  accounts: (TemplateAccount | TemplateAccountWithRule)[]
  args: (TemplateArg | TemplateArgWithRule)[]
  programId: string
}

export type TemplateAccount = {
  name: string
  isMut: boolean
  isSigner: boolean
  isMaster: boolean
}
export type TemplateAccountWithRule = TemplateAccount & {
  rule: {
    name: RulesName
    configs: RulesData[TemplateAccountWithRule['rule']['name']]
  }
}
export const isTemplateAccountWithRule = (
  idlAccount: TemplateAccount | TemplateAccountWithRule,
): idlAccount is TemplateAccountWithRule => {
  // @ts-ignore
  return idlAccount.rule !== undefined
}

export type TemplateArg = {
  name: string
  type: 'u8' | 'u64'
}
export type TemplateArgWithRule = TemplateArg & {
  rule: {
    name: RulesName
    configs: RulesData[TemplateAccountWithRule['rule']['name']]
  }
}
export const isTemplateArgWithRule = (
  idlArg: TemplateArg | TemplateArgWithRule,
): idlArg is TemplateArgWithRule => {
  // @ts-ignore
  return idlArg.rule !== undefined
}
